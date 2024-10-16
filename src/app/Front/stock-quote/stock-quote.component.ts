import { Component } from '@angular/core';
import { StockQuoteService } from 'src/app/Services/stock-quote-service.service';

@Component({
  selector: 'app-stock-quote',
  templateUrl: './stock-quote.component.html',
})
export class StockQuoteComponent {
  symbol: string = '';
  quote: any = null;

  constructor(private stockQuoteService: StockQuoteService) {}

  getQuote() {
    this.stockQuoteService.getStockQuote(this.symbol).subscribe(
      data => {
        console.log('Raw API response:', JSON.stringify(data, null, 2)); // Log the entire API response
        
        // Check if Global Quote exists and has properties
        if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
          this.quote = data['Global Quote'];
          console.log('Extracted quote:', JSON.stringify(this.quote, null, 2)); // Log the extracted quote
        } else {
          console.error('Global Quote is empty or not found in response');
          this.quote = null; // Ensure quote is reset if empty
        }
      },
      error => {
        console.error('Error fetching stock quote:', error);
        this.quote = null; // Reset quote on error
      }
    );
  }
}
