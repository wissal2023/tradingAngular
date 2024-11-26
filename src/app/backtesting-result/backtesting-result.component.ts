import { Component, Input, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { BacktestResult } from '../Entity/backtest-result';

Chart.register(...registerables);

interface TradeData {
  data: {
    date: string;
    action: string;
    shares: number;
    price: number;
    value?: number;
  };
}

@Component({
  selector: 'app-backtesting-result',
  templateUrl: './backtesting-result.component.html',
  styleUrls: ['./backtesting-result.component.css']
})
export class BacktestingResultComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() result!: BacktestResult;
  private chart: Chart | null = null;
  private destroy$ = new Subject<void>();

  dataSource: NbTreeGridDataSource<TradeData>;
  columns: string[] = ['date', 'action', 'shares', 'price', 'value'];
  loading = false;
  error: string | null = null;

  constructor(
    private elementRef: ElementRef,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<TradeData>,
    private router: Router,
    private authService: AuthService,
  ) {
    this.dataSource = this.dataSourceBuilder.create([]);
    
    // Get result from router state
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.result = (navigation.extras.state as any).result;
    }
  }

  ngOnInit() {
   /* if (!this.authService.currentUserValue) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.result) {
      this.updateTradeHistory();
    }*/
  }

  ngAfterViewInit() {
    // Ensure we have result data before creating the chart
    if (this.result) {
      setTimeout(() => {
        this.updateChartData();
      });
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateChartData(): void {
    const canvas = this.elementRef.nativeElement.querySelector('#portfolioChart');
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context');
      return;
    }

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    // Prepare data for the chart
    const labels: string[] = [];
    const data: number[] = [];

    // Add initial capital as first point
    if (this.result.trades && this.result.trades.length > 0) {
      labels.push(this.result.trades[0].date);
      data.push(this.result.initialCapital);

      let currentValue = this.result.initialCapital;
      
      // Calculate portfolio value after each trade
      this.result.trades.forEach(trade => {
        if (trade.action.toUpperCase() === 'BUY') {
          currentValue -= trade.shares * trade.price;
        } else if (trade.action.toUpperCase() === 'SELL') {
          currentValue += trade.shares * trade.price;
        }
        labels.push(trade.date);
        data.push(currentValue);
      });
    }

    // Create new chart
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Portfolio Value',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Portfolio Value ($)'
            },
            beginAtZero: false
          }
        }
      }
    });
  }

  private updateTradeHistory(): void {
    if (this.result && this.result.trades) {
      const data = this.result.trades.map(trade => ({
        data: {
          date: trade.date,
          action: trade.action.toUpperCase(),
          shares: trade.shares,
          price: trade.price,
          value: trade.shares * trade.price
        }
      }));
      
      this.dataSource = this.dataSourceBuilder.create(data);
    }
  }

  public isResultValid(): boolean {
    return !!(
      this.result && 
      this.result.initialCapital && 
      this.result.finalCapital && 
      this.result.totalReturn &&
      this.result.trades &&
      this.result.trades.length > 0
    );
  }
}