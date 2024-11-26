import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdvancedBacktestingService } from '../Services/advanced-backtesting.service';
import { catchError, throwError } from 'rxjs';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
export interface Trade {
  date: Date;
  action: string;
  shares: number;
  price: number;
}
export interface BacktestMetrics {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  trades: Trade[];
  equityCurve: Map<Date, number>;
}
@Component({
  selector: 'app-stress-test',
  templateUrl: './stress-test.component.html',
  styleUrls: ['./stress-test.component.css']
})
export class StressTestComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  
  stressTestForm!: FormGroup;
  loading = false;
  error: string | null = null;
  results: BacktestMetrics | null = null;
  availableStrategies = ['MovingAverage', 'MeanReversion'];
  showTrades = false;

  // Chart configuration
  lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };

  lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Equity Curve'
      }
    },
    scales: {
      ['y']: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Equity Value ($)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          callback: function(value) {
            return value.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            });
          }
        }
      },
      ['x']: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  lineChartType: ChartType = 'line';

  constructor(
    private fb: FormBuilder,
    private backtestingService: AdvancedBacktestingService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.stressTestForm = this.fb.group({
      symbol: ['', [Validators.required, Validators.minLength(1)]],
      strategy: ['MovingAverage', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
  }

  private validateDates(startDate: Date, endDate: Date): boolean {
    if (endDate <= startDate) {
      this.error = 'End date must be after start date';
      return false;
    }
    return true;
  }

  onSubmit(): void {
    if (this.stressTestForm.invalid) {
      this.error = 'Please fill in all required fields';
      return;
    }

    const { symbol, startDate, endDate, strategy } = this.stressTestForm.value;
    
    if (!this.validateDates(new Date(startDate), new Date(endDate))) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.backtestingService.stressTest(
      symbol.toUpperCase(),
      new Date(startDate),
      new Date(endDate),
      strategy
    ).pipe(
      catchError(error => {
        console.error('Stress test error:', error);
        return throwError(() => new Error(
          error.error?.message || 
          'Failed to perform stress test. Please try with different parameters.'
        ));
      })
    ).subscribe({
      next: (results) => {
        this.results = results;
        this.loading = false;
        this.updateChartData();
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  private updateChartData(): void {
    if (!this.results?.equityCurve) {
      return;
    }

    const equityData = Array.from(this.results.equityCurve.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

    const dates = equityData.map(entry => new Date(entry[0]).toLocaleDateString());
    const values = equityData.map(entry => entry[1]);

    this.lineChartData = {
      datasets: [
        {
          data: values,
          label: 'Equity Curve',
          fill: false,
          tension: 0.4,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          pointRadius: 2,
          borderWidth: 2
        }
      ],
      labels: dates
    };

    if (this.chart) {
      this.chart.update();
    }
  }

  getTradeStats(): { total: number, buys: number, sells: number, avgPrice: number } {
    if (!this.results?.trades) {
      return { total: 0, buys: 0, sells: 0, avgPrice: 0 };
    }

    const trades = this.results.trades;
    const buys = trades.filter(t => t.action === 'BUY').length;
    const sells = trades.filter(t => t.action === 'SELL').length;
    const avgPrice = trades.reduce((sum, t) => sum + t.price, 0) / (trades.length || 1);

    return {
      total: trades.length,
      buys,
      sells,
      avgPrice
    };
  }

  toggleTrades(): void {
    this.showTrades = !this.showTrades;
  }
}