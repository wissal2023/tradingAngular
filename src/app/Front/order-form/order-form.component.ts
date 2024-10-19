import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderType, PlacingOrder, Status, TradeType, TransacType } from 'src/app/Entity/placing-order';
import { PlacingOrderService } from 'src/app/Services/placing-order.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  tradeTypes = Object.values(TradeType);  // Enum to array for dropdown
  orderTypes = Object.values(OrderType);
  transacTypes = Object.values(TransacType);
  
  constructor(
    private fb: FormBuilder,
    private placingOrderService: PlacingOrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the form controls with validators as necessary
    this.orderForm = this.fb.group({
      tradeType: ['', Validators.required],
      symbol: ['', Validators.required],
      transacType: ['', Validators.required],
      qty: [1, [Validators.required, Validators.min(1)]],
      orderType: ['', Validators.required],
      duration: [1, [Validators.required, Validators.min(1)]],
      param: ['$', Validators.required],
      price: [0, Validators.required],
      notes: [''],
    });
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const placingOrder: PlacingOrder = this.orderForm.value;

      // Optional: Add other fields manually if needed
      placingOrder.date = new Date(); // Adding current date
      placingOrder.status = Status.PENDING; // Default status

      this.placingOrderService.addPlacingOrder(placingOrder).subscribe(
        (response) => {
          console.log('Order placed successfully', response);
          this.router.navigate(['/orders']); // Redirect after submission
        },
        (error) => {
          console.error('Error placing order', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
}