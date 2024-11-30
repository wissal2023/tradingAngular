import { Component, OnInit } from '@angular/core';
import { StockQuoteService } from 'src/app/Services/stock-quote-service.service';

@Component({
  selector: 'app-option-quote',
  templateUrl: './option-quote.component.html',
  styleUrls: ['./option-quote.component.css']
})
export class OptionQuoteComponent implements OnInit {
  historicalOptions: any[] = [];
  symbol: string = ''; 
  date: string = ''; 
  constructor(private stockQuoteService: StockQuoteService) {}
  ngOnInit(): void {
    // Optionally, you can automatically fetch data after the component is initialized
    if (this.symbol) {
      this.fetchHistoricalOptions();
    }
  }
  onSymbolChange(): void {
    // Optionally, start fetching data as the user types or after a button click
    if (this.symbol) {
      this.fetchHistoricalOptions();
    }
  }
  fetchHistoricalOptions(): void {
    if (this.symbol.trim()) {  // Ensure symbol is not empty
      this.stockQuoteService.getHistoricalOptions(this.symbol, this.date).subscribe(
        response => {
          console.log('Historical Options:', response);
          this.historicalOptions = response.data || [];  // Store the options data in the component's state
        },
        error => {
          console.error('Error fetching historical options:', error);
          this.historicalOptions = [];  // Clear data on error
        }
      );
    }
  }
}