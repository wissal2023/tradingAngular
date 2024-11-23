import { Component, OnInit } from '@angular/core';
import { StockQuoteService } from 'src/app/Services/stock-quote-service.service';

@Component({
  selector: 'app-financial-news',
  templateUrl: './financial-news.component.html',
  styleUrls: ['./financial-news.component.css']
})
export class FinancialNewsComponent implements OnInit {
  financialNews: any[] = [];
  ticker: string = 'AAPL.US';  
  errorMessage: string = '';

  constructor(private stockQuoteService: StockQuoteService) {}

  ngOnInit(): void {
    this.getFinancialNews(this.ticker);
  }

 // Fetch financial news for the given ticker
 getFinancialNews(ticker: string): void {
  this.stockQuoteService.getFinancialNews(ticker).subscribe(
    (response) => {
      this.financialNews = response;
      this.errorMessage = ''; // Reset error message
    },
    (error) => {
      this.errorMessage = 'Error fetching financial news.';
      console.error(error);
    }
  );
}

searchTicker(): void {
  if (this.ticker.trim()) {
    this.getFinancialNews(this.ticker);
  }
}






}