import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intra-day',
  templateUrl: './intra-day.component.html',
  styleUrls: ['./intra-day.component.css']
})
export class IntraDayComponent implements OnInit {

  stockData: any;
  symbol: string = 'MSFT';  
  interval: string= '5min';
  constructor() {}

  ngOnInit(): void {
    
  }
}