import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlacingOrder } from 'src/app/Entity/placing-order';
import { Portfolio } from 'src/app/Entity/portfolio';
import { PlacingOrderService } from 'src/app/Services/placing-order.service';
import { PortfolioService } from 'src/app/Services/portfolio.service';
import { StockQuoteService } from 'src/app/Services/stock-quote-service.service';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit{
  //marketStatus: any;
  portfolios: Portfolio[] = [];
  orders: PlacingOrder[] = [];
  searchResults: any[] = [];
  searchTerm: string = '';
  
  marketStatus: any[] = [];
  currentIndex: number = 0;
  
  portfolioId!:number;

  constructor(private stockQuoteService: StockQuoteService,   
              private portfolioService: PortfolioService) {}

  ngOnInit() {    

    this.fetchPortfolios();
    this.getMarketStatus();
    //this.fetchMarketStatus();

  }
  getMarketStatus(): void {
    this.stockQuoteService.getMarketStatus(this.stockQuoteService.apiKey).subscribe((response: any) => {
      if (response && response.markets) {
        this.marketStatus = response.markets;
      }
    }, (error) => {
      console.error('Error fetching market status:', error);
    });
  }

  fetchPortfolios() {
    this.portfolioService.getAllPortfolios().subscribe((data: Portfolio[]) => {
      this.portfolios = data;
      console.log(this.portfolios); 
    });
  }
// search if Market Open/ closed
search() {
  if (this.searchTerm) {
    this.stockQuoteService.searchStockSymbols(this.searchTerm,  this.stockQuoteService.apiKey).subscribe(
      (data: any) => {
        this.searchResults = data.bestMatches; 
      },
      (error) => {
        console.error('Error fetching stock data', error);
      }
    );
  }
}


nextSlide(): void {
  this.currentIndex = (this.currentIndex + 1) % this.marketStatus.length;
  this.updateCarouselPosition();
}
prevSlide(): void {
  this.currentIndex = (this.currentIndex - 1 + this.marketStatus.length) % this.marketStatus.length;
  this.updateCarouselPosition();
}
updateCarouselPosition(): void {
  const track = document.querySelector('.carousel-track') as HTMLElement;
  const offset = -this.currentIndex * 250; // Assuming each card is 250px wide
  track.style.transform = `translateX(${offset}px)`;
}
  
}
