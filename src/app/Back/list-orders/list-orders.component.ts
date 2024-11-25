import { Component, OnInit } from '@angular/core';
import { PlacingOrder } from 'src/app/Entity/placing-order';
import { PlacingOrderService } from 'src/app/Services/placing-order.service';
import { Status } from 'src/app/Entity/placing-order';
import { Transaction } from 'src/app/Entity/transaction';
import { TransactionService } from 'src/app/Services/transaction.service';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.css']
})

export class ListOrdersComponent implements OnInit {
  orders: PlacingOrder[] = [];
  selectedOrder: PlacingOrder | null = null; 
  statusOptions = Object.values(Status); 

  constructor(private orderService: PlacingOrderService, 
              private transactionService: TransactionService) { }   

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllPlacingOrders().subscribe(
      (data: PlacingOrder[]) => {
        this.orders = data;
      },
      (error) => {
        console.error('Failed to load orders', error);
      }
    );
  }

  onStatusClick(order: PlacingOrder): void {
    this.selectedOrder = { ...order };
  }
  closeModal(): void {
    this.selectedOrder = null;
  }

  confirmStatusChange(): void {
    if (this.selectedOrder) {
      this.orderService.modifyPlacingOrder(this.selectedOrder).subscribe(
        (updatedOrder: PlacingOrder) => {
          console.log('Order status updated successfully');
          this.loadOrders(); 
          this.closeModal(); 
        },
        (error) => {
          console.error('Failed to update order', error);
        }
      );
    }
  }

  deleteOrder(id: number): void {
    this.orderService.removePlacingOrder(id).subscribe(
      () => {
        console.log('Order deleted successfully');
        this.loadOrders();
      },
      (error) => {
        console.error('Failed to delete order', error);
      }
    );
  }

  /*
  addTransaction(placingOrderId: number, transaction: Transaction): void {
    this.transactionService.addTransaction(placingOrderId, transaction).subscribe(
      (createdTransaction: Transaction) => {
        console.log('Transaction added successfully:', createdTransaction);
      },
      (error) => {
        console.error('Failed to add transaction', error);
      }
    );
  }
    */
}
