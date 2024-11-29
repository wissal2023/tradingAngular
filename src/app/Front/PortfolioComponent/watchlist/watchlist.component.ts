import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  watchlist: any[] = [];  // Store the user's watchlist

  ngOnInit(): void {
    // Initialize the watchlist with data (could be fetched from an API)
    this.watchlist = [
      { name: 'Apple Inc.', symbol: 'AAPL', price: 150 },
      { name: 'Microsoft Corp.', symbol: 'MSFT', price: 280 }
    ];
  }

  addToWatchlist(): void {
    // Logic to add a stock to the watchlist
    const newStock = { name: 'Tesla Inc.', symbol: 'TSLA', price: 720 };
    this.watchlist.push(newStock);
  }

  removeFromWatchlist(stock: any): void {
    // Logic to remove a stock from the watchlist
    this.watchlist = this.watchlist.filter(item => item.symbol !== stock.symbol);
  }
}
