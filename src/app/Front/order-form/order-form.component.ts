import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderType, PlacingOrder, Status, ActionType, AssetsType } from 'src/app/Entity/placing-order';
import { PlacingOrderService } from 'src/app/Services/placing-order.service';
import { StockQuoteService } from 'src/app/Services/stock-quote-service.service';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { ModalComponent } from '../modal/modal.component';



@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  assetsType = Object.values(AssetsType); 
  orderTypes = Object.values(OrderType);
  actionType = Object.values(ActionType);

  searchSymbolTerm: string = ''; 
  searchResults: any[] = [];
  searchTerm: string = '';
  isassetsTypeSelected: boolean = false;
  isactionTypeSelected: boolean = false;
  isOrderTypeSelected: boolean = false;
  filteredSymbols: string[] = [];
  orderDetails = {};

  portfolioId!: number;  
  totalPrice: number = 0;
  stockData: any; // Holds stock summary data
  stockPrice!:number;
  chartData: any[] = [];

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
              private placingOrderService: PlacingOrderService,
              private router: Router,
              private stockQuoteService: StockQuoteService) {}
ngOnInit(): void { 
    this.portfolioId = +this.route.snapshot.paramMap.get('portfolioId')!; 
    console.log('Portfolio ID:', this.portfolioId);
    this.orderForm = this.fb.group({
      assetsType: ['', Validators.required],
      actionType: ['', Validators.required],
      orderType: ['', Validators.required],
      qty: [null, [Validators.required, Validators.min(1)]],
      price: [null],
      duration: [null, [Validators.required]],
      param: [''],
      notes: [''],
      status: ['PENDING'],
      date: [new Date()],
      symbol: ['', Validators.required],
      faceValue: [null],       
      couponRate: [null],      
      maturityDate: [null],    
      strikePrice: [null],    
      expirationDate: [null], 
      contractSize: [null],   
      expiryDate: [null],      
      nav: [null],             
      stopLoss: [null],
      takeProfit: [null],
      margin: [null]
    });
  }
onPreview(): void {
  if (this.orderForm.valid) {
    this.orderDetails = this.orderForm.value;
    console.log('Order Preview:', this.orderDetails);
  } else {
    console.error('Form is invalid');
  }
}
onSubmit(orderDetails: any): void {
  console.log('Final order submission:', orderDetails);
  if (this.orderForm.valid) {
    const placingOrder: PlacingOrder = {
      ...this.orderForm.value,
      totalPrice: this.totalPrice
    };  
    this.placingOrderService.addOrder(this.portfolioId, placingOrder).subscribe(
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
logInvalidControls() {
  Object.keys(this.orderForm.controls).forEach(key => {
    const control = this.orderForm.get(key);
    if (control && control.invalid) {
      const errors = control.errors;
      console.error(`Field: ${key} is invalid`, errors);
    }
  });
}
onassetsTypeChange() {
  const selectedassetsType = this.orderForm.get('assetsType')?.value;
  this.isassetsTypeSelected = !!selectedassetsType;
  this.filteredSymbols = [];
  this.resetDynamicFields(selectedassetsType);
  if (selectedassetsType === 'Option') {
    this.orderForm.get('strikePrice')?.setValidators([Validators.required]);
    this.orderForm.get('expirationDate')?.setValidators([Validators.required]);
  } else {
    this.orderForm.get('strikePrice')?.clearValidators();
    this.orderForm.get('expirationDate')?.clearValidators();
  }
  this.orderForm.get('strikePrice')?.updateValueAndValidity();
  this.orderForm.get('expirationDate')?.updateValueAndValidity();
}
onactionTypeChange() {
  const selectedactionType = this.orderForm.get('actionType')?.value;
  this.isactionTypeSelected = !!selectedactionType;
}
onOrderTypeChange() {
  const selectedOrderType = this.orderForm.get('orderType')?.value;
  this.isOrderTypeSelected = !!selectedOrderType;
}
private resetDynamicFields(assetsType: string) {
  const fieldsToReset = {
    strikePrice: null,
    expirationDate: null,
    faceValue: null,
    couponRate: null,
    maturityDate: null,
    contractSize: null,
    nav: null
  };
  this.orderForm.patchValue(fieldsToReset);
  // If the assetsType is Option, enable certain fields
  if (assetsType === 'Option') {
    this.orderForm.get('strikePrice')?.setValidators([Validators.required]);
    this.orderForm.get('expirationDate')?.setValidators([Validators.required]);
  } else {
    this.orderForm.get('strikePrice')?.clearValidators();
    this.orderForm.get('expirationDate')?.clearValidators();
  }
  // Always update validity after changing validators
  this.orderForm.get('strikePrice')?.updateValueAndValidity();
  this.orderForm.get('expirationDate')?.updateValueAndValidity();
}
  //get assetsType() { return this.orderForm.get('assetsType')!.value; }
  //get actionType() { return this.orderForm.get('actionType')!.value; }
  get orderType() { return this.orderForm.get('orderType')!.value; }
  get symbol(): string { return this.orderForm.get('symbol')!.value || ''; }
  get qty() { return this.orderForm.get('qty')!.value; }
  get price() { return this.orderForm.get('price')?.value; }
  get duration() { return this.orderForm.get('duration')?.value; }
  get param() { return this.orderForm.get('param')?.value; }
  get notes() { return this.orderForm.get('notes')?.value; }
  get status() { return this.orderForm.get('status')!.value; }
  get date() { return this.orderForm.get('date')!.value; }
  get faceValue() { return this.orderForm.get('faceValue')?.value; }
  get couponRate() { return this.orderForm.get('couponRate')?.value; }
  get maturityDate() { return this.orderForm.get('maturityDate')?.value; }
  get strikePrice() { return this.orderForm.get('strikePrice')?.value; }
  get expirationDate() { return this.orderForm.get('expirationDate')?.value; }
  get contractSize() { return this.orderForm.get('contractSize')?.value; }
  get expiryDate() { return this.orderForm.get('expiryDate')?.value; }
  get nav() { return this.orderForm.get('nav')?.value; }
  get stopLoss() { return this.orderForm.get('stopLoss')?.value; }
  get takeProfit() { return this.orderForm.get('takeProfit')?.value; }
  get margin() { return this.orderForm.get('margin')?.value; }

// Search symbol  and show chart 
searchSymbol() {
  this.searchSymbolTerm = this.orderForm.get('symbol')?.value;
  if (this.searchSymbolTerm) {
    this.stockQuote();
    this.getStockTimeSeries(); // Fetch data for the chart
  }
}
stockQuote() {
    if (this.searchSymbolTerm) {
        this.stockQuoteService.getStockQuote(this.searchSymbolTerm, this.stockQuoteService.apiKey).subscribe(
            (data: any) => {
                console.log('API Response:', data);
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
getStockTimeSeries() {
  if (this.searchSymbolTerm) {
    this.stockQuoteService.getDailyTimeSeries(this.searchSymbolTerm, this.stockQuoteService.apiKey).subscribe(
      (data: any) => {
        const timeSeries = data['Time Series (Daily)'];
        if (timeSeries) {
          this.chartData = this.transformDataForChart(timeSeries);
        } else {
          console.error('No time series data available');
        }
      },
      (error) => {
        console.error('Error fetching time series data', error);
      }
    );
  } else {
    console.error('Symbol is not set.');
  }
}
transformDataForChart(timeSeries: any): any[] {
  return Object.keys(timeSeries).map(date => {
    const dailyData = timeSeries[date];
    return {
      x: new Date(date),
      y: [
        parseFloat(dailyData['1. open']),
        parseFloat(dailyData['2. high']),
        parseFloat(dailyData['3. low']),
        parseFloat(dailyData['4. close'])
      ]
    };
  }).reverse(); // Reverse to get chronological order
}
}