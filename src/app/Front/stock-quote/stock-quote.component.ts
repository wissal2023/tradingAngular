import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart } from 'chart.js';
import { StockQuoteService } from 'src/app/Services/stock-quote-service.service';


@Component({
  selector: 'app-stock-quote',
  templateUrl: './stock-quote.component.html',
  styleUrls: ['./stock-quote.component.css']
})
export class StockQuoteComponent  implements OnInit {
  @Input() symbol!: string ; // Set a default symbol or pass it dynamically
  latestData: any;
  error: string | null = null;
  lastRefreshed: string | null = null;

  constructor(private stockQuoteService: StockQuoteService) {}

  ngOnInit(): void {
    this.fetchDailyTimeSeries();
  }

  fetchDailyTimeSeries(): void {
    if (!this.symbol) return;  
    this.stockQuoteService.getDailyTimeSeries(this.symbol, this.stockQuoteService.apiKey).subscribe(
      data => {
        console.log('Daily Time Series Response:', data);
        const timeSeries = data['Time Series (Daily)'];
        if (timeSeries) {
          const dates = Object.keys(timeSeries).slice(0, 10).reverse();
          const closingPrices = dates.map(date => parseFloat(timeSeries[date]['4. close']));
          //this.createChart(dates, closingPrices);
        } else {
          console.error('No time series data found in response');
          alert('Daily API limit reached. Please try again later.');
        }
      },
      error => {
        console.error('Error fetching daily time series', error);
        alert('An error occurred while fetching data. Please try again later.');
      }
    );
  }


}