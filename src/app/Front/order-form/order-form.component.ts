import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderType, PlacingOrder, Status, TradeType, TransacType } from 'src/app/Entity/placing-order';
import { PlacingOrderService } from 'src/app/Services/placing-order.service';
import { StockQuoteService } from 'src/app/Services/stock-quote-service.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  tradeTypes = Object.values(TradeType); 
  orderTypes = Object.values(OrderType);
  transacTypes = Object.values(TransacType);

  stockData: any;
  symbol: string = '';
  searchResults: any[] = [];
  searchTerm: string = '';
  apiKey: string = 'GB675A5CC0KN3LWL';

  isTradeTypeSelected: boolean = false;
  isTransacTypeSelected: boolean = false;
  isOrderTypeSelected: boolean = false;
  filteredSymbols: string[] = [];

  constructor(private fb: FormBuilder,
              private placingOrderService: PlacingOrderService,
              private router: Router,
              private stockQuoteService: StockQuoteService) {}

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      tradeType: ['', Validators.required],
      transacType: ['', Validators.required],
      orderType: ['', Validators.required],
      qty: [null, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(0)]],
      duration: [null, [Validators.required, Validators.min(1)]],
      param: [''],
      notes: [''],
      status: ['PENDING', Validators.required],
      date: [new Date(), Validators.required],
      symbol: ['', Validators.required],
      // additional attributes
      faceValue: [null],       // Bonds
      couponRate: [null],      // Bonds
      maturityDate: [null],    // Bonds
      strikePrice: [null],     // Options
      expirationDate: [null],  // Options
      contractSize: [null],    // Commodities
      expiryDate: [null],      // Commodities
      nav: [null],             // Mutual Funds, ETFs
      stopLoss: [null],
      takeProfit: [null],
      leverage: [null]
    });
  }

  onTradeTypeChange() {
    const selectedTradeType = this.orderForm.get('tradeType')?.value;
    this.isTradeTypeSelected = !!selectedTradeType;
    this.filteredSymbols = [];
    this.resetDynamicFields(selectedTradeType);
  }

  onTransacTypeChange() {
    const selectedTransacType = this.orderForm.get('transacType')?.value;
    this.isTransacTypeSelected = !!selectedTransacType;
  }

  onOrderTypeChange() {
    const selectedOrderType = this.orderForm.get('orderType')?.value;
    this.isOrderTypeSelected = !!selectedOrderType;
  }

  private resetDynamicFields(tradeType: string) {
    switch (tradeType) {
      case 'STOCKS':
        this.orderForm.patchValue({
          faceValue: null,
          couponRate: null,
          maturityDate: null,
          strikePrice: null,
          expirationDate: null,
          contractSize: null,
          expiryDate: null,
          nav: null
        });
        break;

      case 'BONDS':
        this.orderForm.patchValue({
          faceValue: null,       
          couponRate: null,      
          maturityDate: null,
          strikePrice: null,
          expirationDate: null,
          contractSize: null,
          expiryDate: null,
          nav: null
        });
        break;

      case 'OPTIONS':
        this.orderForm.patchValue({
          faceValue: null,
          couponRate: null,
          maturityDate: null,
          strikePrice: null,
          expirationDate: null,
          contractSize: null,
          expiryDate: null,
          nav: null
        });
        break;
    }
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const placingOrder: PlacingOrder = this.orderForm.value;

      this.placingOrderService.addPlacingOrder(placingOrder).subscribe(
        (response) => {
          console.log('Order placed successfully', response);
          this.router.navigate(['/portfolio']); 
        },
        (error) => {
          console.error('Error placing order', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  // Search symbol in order form
  searchSymbol() {
    this.symbol = this.orderForm.get('symbol')?.value; // Get the value of 'symbol' from the form control
    this.stockQuote(); 
  }  

  stockQuote() {
    if (this.symbol) {
      this.stockQuoteService.getStockQuote(this.symbol, this.apiKey).subscribe(
        (data: any) => {
          console.log('API Response:', data); // Log the API response
          this.stockData = data['Global Quote'];
        },
        (error) => {
          console.error('Error fetching stock data', error);
        }
      );
    } else {
      console.error('Symbol is not set.');
    }
  }
}
