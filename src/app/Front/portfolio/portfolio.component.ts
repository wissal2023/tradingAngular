import { Component, OnInit } from '@angular/core';
import { Portfolio } from 'src/app/Entity/portfolio';
import { MarketStatusService } from 'src/app/Services/market-status.service';
import { PortfolioService } from 'src/app/Services/portfolio.service';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit{

  marketStatus: any;
  portfolios: Portfolio[] = [];


  constructor(private marketStatusService: MarketStatusService,   
              private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.fetchPortfolios();
    this.fetchMarketStatus();
  }
  fetchPortfolios() {
    this.portfolioService.getAllPortfolios().subscribe((data: Portfolio[]) => {
      this.portfolios = data;
      console.log(this.portfolios); 
    });
  }
  fetchMarketStatus() {
    this.marketStatusService.getMarketStatus().subscribe(
      (data) => {
        this.marketStatus = data;
        console.log(this.marketStatus); 
      },
      (error) => {
        console.error('Error fetching market status:', error);
      }
    );
  }
}
