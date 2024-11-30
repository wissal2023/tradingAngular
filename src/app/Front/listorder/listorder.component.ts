import { Component, Input, OnInit } from '@angular/core';
import { PlacingOrder } from 'src/app/Entity/placing-order';
import { PlacingOrderService } from 'src/app/Services/placing-order.service';

@Component({
  selector: 'app-listorder',
  templateUrl: './listorder.component.html',
  styleUrls: ['./listorder.component.css']
})
export class ListorderComponent implements OnInit{
  @Input() portfolioId!: number; // Receive portfolioId from parent component
  placingOrder: PlacingOrder[] = [];
  errorMessage: string = '';

  constructor(private ordersService: PlacingOrderService) {}

  ngOnInit(): void {
    if (this.portfolioId) {
      this.getPlacingOrdersByPortfolio(this.portfolioId);
    } else {
      console.error('Portfolio ID is not defined');
    }    
  }
  getPlacingOrdersByPortfolio(portfolioId: number): void {
    this.ordersService.getPlacingOrdersByPortfolio(portfolioId).subscribe(
      (data: PlacingOrder[]) => {
        console.log('Fetched orders:', data); // Debug
        this.placingOrder = data;
      },
      (error) => {
        console.error('Error fetching placingOrder', error);
      }
    );
  }
  


}
