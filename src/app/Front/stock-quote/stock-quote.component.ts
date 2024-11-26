import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart } from 'chart.js';
import { StockQuoteService } from 'src/app/Services/stock-quote-service.service';


@Component({
  selector: 'app-stock-quote',
  templateUrl: './stock-quote.component.html',
  styleUrls: ['./stock-quote.component.css']
})
export class StockQuoteComponent  implements OnInit {
  searchSymbolTerm: string = '';
  stockData: any; // Holds stock summary data
  chartData: any[] = []; // Holds chart data for time series
  isassetsTypeSelected: boolean = false;
  constructor(private stockQuoteService: StockQuoteService) {}
  ngOnInit(): void {}
  searchSymbol(): void {
    if (this.searchSymbolTerm) {
      this.stockQuote(); // Fetch stock summary
      this.getStockTimeSeries(); // Fetch chart data
    } else {
      console.error('Search symbol term is not set.');
    }
  }
  stockQuote() {
      if (this.searchSymbolTerm) {
          this.stockQuoteService.getStockQuote(this.searchSymbolTerm, this.stockQuoteService.apiKey).subscribe(
              (data: any) => {
                  console.log('API Response:', data);
                  this.stockData = data['Global Quote'];                                
              },
              (error) => {
                  console.error('Error fetching stock data', error);
              }
          );
      } else {
          console.error('Symbol is not set.');
      }
  }
  getStockTimeSeries() {
    if (this.searchSymbolTerm) {
      this.stockQuoteService.getDailyTimeSeries(this.searchSymbolTerm, this.stockQuoteService.apiKey).subscribe(
        (data: any) => {
          const timeSeries = data['Time Series (Daily)'];
          if (timeSeries) {
            this.chartData = this.transformDataForChart(timeSeries);
          } else {
            console.error('No time series data available');
          }
        },
        (error) => {
          console.error('Error fetching time series data', error);
        }
      );
    } else {
      console.error('Symbol is not set.');
    }
  }
  transformDataForChart(timeSeries: any): any[] {
    return Object.keys(timeSeries).map(date => {
      const dailyData = timeSeries[date];
      return {
        x: new Date(date),
        y: [
          parseFloat(dailyData['1. open']),
          parseFloat(dailyData['2. high']),
          parseFloat(dailyData['3. low']),
          parseFloat(dailyData['4. close'])
        ]
      };
    }).reverse(); // Reverse to get chronological order
  }  
  
}