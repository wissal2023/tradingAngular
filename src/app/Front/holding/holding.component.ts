import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Holding } from 'src/app/Entity/holding';
import { HoldingService } from 'src/app/Services/holding.service';

@Component({
  selector: 'app-holding',
  templateUrl: './holding.component.html',
  styleUrls: ['./holding.component.css']
})
export class HoldingComponent implements OnInit {
  holdings: Holding[] = [];
  portfolioId!: number;

  constructor(private holdingService: HoldingService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.portfolioId = +params['portfolioId']; // Retrieve portfolioId from the URL
      this.getHoldings();
    });
  }

  getHoldings(): void {
    if (this.portfolioId) {
      this.holdingService.getHoldingsByPortfolioId(this.portfolioId).subscribe(
        (data: Holding[]) => {
          this.holdings = data;
        },
        (error) => {
          console.error('Error fetching holdings', error);
        }
      );
    } else {
      this.holdingService.getAllHoldings().subscribe(
        (data: Holding[]) => {
          this.holdings = data;
        },
        (error) => {
          console.error('Error fetching holdings', error);
        }
      );
    }
  }

  buyHolding(id: number): void {
    console.log(`Buying holding with ID: ${id}`);
  }

  sellHolding(id: number): void {
    console.log(`Selling holding with ID: ${id}`);
  }

}