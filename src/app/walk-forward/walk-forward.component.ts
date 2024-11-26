import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdvancedBacktestingService } from '../Services/advanced-backtesting.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
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
  equityCurve: Map<string, number> | Record<string, number>;
}
@Component({
  selector: 'app-walk-forward',
  templateUrl: './walk-forward.component.html',
  styleUrls: ['./walk-forward.component.css']
})
export class WalkForwardComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  walkForwardForm!: FormGroup;
  loading = false;
  error: string | null = null;
  results: BacktestMetrics | null = null;
  availableStrategies = ['MovingAverage', 'MeanReversion'];

  lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };

  lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Equity Curve' }
    },
    scales: {
      ['y']: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Equity Value ($)',
          font: { size: 14, weight: 'bold' }
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
          font: { size: 14, weight: 'bold' }
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
    this.walkForwardForm = this.fb.group({
      symbol: ['', [Validators.required]],
      strategy: ['MovingAverage', [Validators.required]],
      windows: [10, [Validators.required, Validators.min(2)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.walkForwardForm.invalid) return;

    const { symbol, startDate, endDate, strategy, windows } = this.walkForwardForm.value;
    this.loading = true;
    this.error = null;

    this.backtestingService.walkForwardOptimization(
      symbol,
      new Date(startDate),
      new Date(endDate),
      strategy,
      windows
    ).subscribe({
      next: (results) => {
        this.results = results;
        this.loading = false;
        this.updateChart();
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }


  private updateChart(): void {
    if (!this.results?.equityCurve) return;

    let equityData: [string, number][];

    // Handle both Map and plain object formats
    if (this.results.equityCurve instanceof Map) {
      equityData = Array.from(this.results.equityCurve as Map<string, number>);
    } else {
      // Handle plain object format
      equityData = Object.entries(this.results.equityCurve as Record<string, number>);
    }

    // Sort the data by date
    equityData.sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

    const dates = equityData.map(entry => new Date(entry[0]).toLocaleDateString());
    const values = equityData.map(entry => Number(entry[1]));

    this.lineChartData = {
      datasets: [{
        data: values,
        label: 'Equity Curve',
        fill: false,
        tension: 0.4,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        pointRadius: 2,
        borderWidth: 2
      }],
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
}