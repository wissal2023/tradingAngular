import { Component } from '@angular/core';
import { BacktestingService } from './Services/backtesting.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'trading';
  backtestResult: any;
  constructor(private backtestingService: BacktestingService) {}

  onBacktestSubmitted(backtestRequest: any) {
    this.backtestingService.runBacktest(backtestRequest).subscribe(
      result => {
        this.backtestResult = result;
      },
      error => {
        console.error('Error running backtest:', error);
        // Handle error (e.g., show an error message to the user)
      }
    );
  }
}
