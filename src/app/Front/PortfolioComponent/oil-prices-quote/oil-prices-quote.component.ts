import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { StockQuoteService } from 'src/app/Services/stock-quote-service.service';

@Component({
  selector: 'app-oil-prices-quote',
  templateUrl: './oil-prices-quote.component.html',
  styleUrls: ['./oil-prices-quote.component.css']
})
export class OilPricesQuoteComponent implements OnInit {
  oilPrices: any[] = [];
  lastPrice: { date: string; value: number } | null = null;
  interval: string = 'monthly';
  errorMessage: string = '';
  public barChartData: ChartData = { datasets: [] };
  public barChartLabels: string[] = [];
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  constructor(private stockQuoteService: StockQuoteService) {}
  ngOnInit(): void {
    //this.fetchBrentCrudePrices();
  }
  fetchBrentCrudePrices(): void {
    this.stockQuoteService.getBrentCrudePrices(this.interval).subscribe(
      (response: any) => {
        this.oilPrices = (response.data || []).sort(
          (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ); // Sort by ascending date
        this.errorMessage = '';
        if (this.oilPrices.length > 0) {
          // Update lastPrice with the most recent data
          this.lastPrice = this.oilPrices[this.oilPrices.length - 1];
        }
        // Prepare chart data
        this.barChartLabels = this.oilPrices.map(price => price.date);
        this.barChartData = {
          datasets: [
            {
              data: this.oilPrices.map(price => price.value),
              label: 'Brent Crude Oil Price',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        };
      },
      (error) => {
        this.errorMessage = 'Failed to fetch oil prices data.';
        this.lastPrice = null;
      }
    );
  }
  onIntervalChange(newInterval: string): void {
    this.interval = newInterval;
    this.fetchBrentCrudePrices();
  }
}
