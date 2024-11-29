import { Component, Input, OnInit } from '@angular/core';
import { PlacingOrder, Status } from 'src/app/Entity/placing-order';
import { PlacingOrderService } from 'src/app/Services/placing-order.service';

@Component({
  selector: 'app-listorder',
  templateUrl: './listorder.component.html',
  styleUrls: ['./listorder.component.css']
})
export class ListorderComponent implements OnInit {
  @Input() portfolioId!: number; // Receive portfolioId from parent component
  placingOrder: PlacingOrder[] = [];
  filteredOrders: PlacingOrder[] = []; // To store filtered orders
  errorMessage: string = '';
  selectedStatus: string = ''; // Track selected filter status

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
        this.filteredOrders = data; // Initialize filtered orders
      },
      (error) => {
        console.error('Error fetching placingOrder', error);
      }
    );
  }

  // Method to filter orders based on status
  filterOrdersByStatus(status: string): void {
    if (status) {
      this.filteredOrders = this.placingOrder.filter(order => order.status === status);
    } else {
      this.filteredOrders = [...this.placingOrder]; // Show all orders if no filter
    }
  }

  onCancel(orderId: number): void {
    const newStatus = 'CANCELLED';  // Set the desired status here
    console.log('Attempting to change status for order with ID:', orderId);
    // Show confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to cancel this order?');

    if (isConfirmed) {
      // Proceed with status change if confirmed
      this.ordersService.changeStatus(orderId, newStatus).subscribe(
        (updatedOrder) => {
          console.log(`Order status updated to ${newStatus} successfully.`, updatedOrder);

          // Find the order in the placingOrder array and update its status
          const index = this.placingOrder.findIndex(order => order.id === orderId);
          if (index !== -1) {
            // Update the status of the specific order in the array
            this.placingOrder[index].status = updatedOrder.status;
          }

          // Filter the orders again to reflect the changes
          this.filterOrdersByStatus(this.selectedStatus); // Re-filter after status change
        },
        (error) => {
          console.error('Error changing status:', error);
          this.errorMessage = 'Error changing order status: ' + error.message;
        }
      );
    } else {
      // User canceled the action
      console.log('Status change canceled by the user.');
    }
  }
}

