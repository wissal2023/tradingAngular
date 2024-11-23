import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit{
  @Input() orderDetails: any;
  @Output() submitOrder = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}
  
  onTradeClick(): void {
    this.submitOrder.emit(this.orderDetails);
  }

}
