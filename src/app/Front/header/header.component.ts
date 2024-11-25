import { Component, Input, OnInit } from '@angular/core';
import { StockQuoteService } from 'src/app/Services/stock-quote-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  {

  @Input() portfolioId!: number; 
  marketStatus: any[] = [];

  constructor(private stockQuoteService: StockQuoteService) {}

  ngOnInit(): void {
    //this.getMarketStatus();
  }

  getMarketStatus(): void {
    this.stockQuoteService.getMarketStatus(this.stockQuoteService.apiKey).subscribe((response: any) => {
      if (response && response.markets) {
        this.marketStatus = response.markets;
      }
    }, (error) => {"see the heaser component ts"
      console.error('Error fetching market status:', error);
    });
  }
}