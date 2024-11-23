import { Component, OnInit } from '@angular/core';
import { StockQuoteService } from 'src/app/Services/stock-quote-service.service';

@Component({
  selector: 'app-oil-prices-quote',
  templateUrl: './oil-prices-quote.component.html',
  styleUrls: ['./oil-prices-quote.component.css']
})
export class OilPricesQuoteComponent implements OnInit {
  oilPrices: any[] = [];
  errorMessage: string = '';
  interval: string = 'monthly';

  chartData: any[] = [];  // Data for the chart
  chartLabels: string[] = [];  // Labels (dates) for the chart

  constructor(private stockQuoteService: StockQuoteService) {}

  ngOnInit(): void {
    this.fetchBrentCrudePrices();
  }

  fetchBrentCrudePrices(): void {
    this.stockQuoteService.getBrentCrudePrices(this.interval).subscribe(
      (response: any) => {
        this.oilPrices = response.data || [];
        this.errorMessage = '';

        // Prepare data for the chart
        this.chartLabels = this.oilPrices.map((price: any) => price.date);
        this.chartData = [
          {
            data: this.oilPrices.map((price: any) => price.value),
            label: 'Brent Crude Oil Price',
            borderColor: '#FF5733',
            fill: false,
          }
        ];
      },
      (error) => {
        console.error('Error fetching oil prices:', error);
        this.oilPrices = [];
        this.errorMessage = 'Failed to fetch oil prices data.';
      }
    );
  }

  onIntervalChange(newInterval: string): void {
    this.interval = newInterval;
    this.fetchBrentCrudePrices();
  }
}
