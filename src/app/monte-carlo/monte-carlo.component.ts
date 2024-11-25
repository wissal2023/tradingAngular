import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdvancedBacktestingService } from '../Services/advanced-backtesting.service';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { catchError, throwError } from 'rxjs';
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
  equityCurve: Map<Date, number> | { [key: string]: number };
}
@Component({
  selector: 'app-monte-carlo',
  templateUrl: './monte-carlo.component.html',
  styleUrls: ['./monte-carlo.component.css']
})
export class MonteCarloComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @ViewChild('equityChart') equityChart?: BaseChartDirective;
  
  monteCarloForm!: FormGroup;
  loading = false;
  error: string | null = null;
  results: BacktestMetrics[] | null = null;
  availableStrategies = ['MovingAverage', 'MeanReversion'];
  selectedSimulation: number | null = null;
  
  simulationStats: {
    meanReturn: number;
    medianReturn: number;
    stdDev: number;
    bestCase: number;
    worstCase: number;
    confidenceInterval: { lower: number; upper: number };
  } | null = null;

  // Distribution chart configuration
  distributionChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };

  distributionChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Return Distribution'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Return (%)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Frequency'
        }
      }
    }
  };

  distributionChartType: ChartType = 'bar';

  // Equity curve chart configuration
  equityChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };

  equityChartOptions: ChartOptions = {
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
      y: {
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
      x: {
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

  equityChartType: ChartType = 'line';

  constructor(
    private fb: FormBuilder,
    private backtestingService: AdvancedBacktestingService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.monteCarloForm = this.fb.group({
      symbol: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      strategy: ['MovingAverage', [Validators.required]],
      simulations: [1000, [Validators.required, Validators.min(100), Validators.max(10000)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.monteCarloForm.invalid) return;

    const { symbol, startDate, endDate, strategy, simulations } = this.monteCarloForm.value;
    this.loading = true;
    this.error = null;
    
    this.backtestingService.monteCarloSimulation(
      symbol.toUpperCase(),
      new Date(startDate),
      new Date(endDate),
      strategy,
      simulations
    ).pipe(
      catchError(error => {
        this.handleError(error);
        return throwError(() => error);
      })
    ).subscribe({
      next: (results) => {
        this.results = results;
        this.calculateStats();
        this.updateDistributionChart();
        this.loading = false;
        if (results.length > 0) {
          this.showSimulation(0); // Show first simulation by default
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  showSimulation(index: number): void {
    if (!this.results || index >= this.results.length) return;
    
    this.selectedSimulation = index;
    this.updateEquityChart(this.results[index]);
  }

  getTradesForSimulation(index: number): Trade[] {
    if (!this.results || index >= this.results.length) return [];
    return this.results[index].trades || [];
  }

  getTradeStats(index: number): { total: number, buys: number, sells: number, avgPrice: number } {
    const trades = this.getTradesForSimulation(index);
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

  private updateEquityChart(simulation: BacktestMetrics): void {
    if (!simulation.equityCurve) return;

    let equityData: [Date | string, number][];

    // Handle both Map and plain object
    if (simulation.equityCurve instanceof Map) {
      equityData = Array.from(simulation.equityCurve.entries());
    } else {
      // Handle plain object
      equityData = Object.entries(simulation.equityCurve).map(([date, value]) => [
        new Date(date),
        value
      ]);
    }

    // Sort by date
    equityData.sort((a, b) => {
      const dateA = a[0] instanceof Date ? a[0] : new Date(a[0]);
      const dateB = b[0] instanceof Date ? b[0] : new Date(b[0]);
      return dateA.getTime() - dateB.getTime();
    });

    // Format dates and ensure values are numbers
    const dates = equityData.map(entry => {
      const date = entry[0] instanceof Date ? entry[0] : new Date(entry[0]);
      return date.toLocaleDateString();
    });
    
    const values = equityData.map(entry => Number(entry[1]));

    // Update chart data
    this.equityChartData = {
      datasets: [{
        data: values,
        label: 'Equity Curve',
        fill: false,
        tension: 0.4,
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        pointRadius: 2,
        borderWidth: 2
      }],
      labels: dates
    };

    // Force chart update
    if (this.equityChart) {
      this.equityChart.update();
    }
  }


  private calculateStats(): void {
    if (!this.results || this.results.length === 0) return;

    const returns = this.results.map(r => r.totalReturn).sort((a, b) => a - b);
    const mean = returns.reduce((a, b) => a + b) / returns.length;
    const median = returns[Math.floor(returns.length / 2)];
    const variance = returns.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    const confidenceLevel = 1.96;
    const marginOfError = confidenceLevel * (stdDev / Math.sqrt(returns.length));

    this.simulationStats = {
      meanReturn: mean,
      medianReturn: median,
      stdDev: stdDev,
      bestCase: returns[returns.length - 1],
      worstCase: returns[0],
      confidenceInterval: {
        lower: mean - marginOfError,
        upper: mean + marginOfError
      }
    };
  }

  private updateDistributionChart(): void {
    if (!this.results) return;
    
    const returns = this.results.map(r => r.totalReturn);
    const min = Math.floor(Math.min(...returns));
    const max = Math.ceil(Math.max(...returns));
    const binSize = (max - min) / 20;
    const histogram = new Array(20).fill(0);
    
    returns.forEach(r => {
      const binIndex = Math.min(Math.floor((r - min) / binSize), 19);
      histogram[binIndex]++;
    });

    const labels = histogram.map((_, i) => 
      `${(min + i * binSize).toFixed(1)}% to ${(min + (i + 1) * binSize).toFixed(1)}%`
    );

    this.distributionChartData = {
      datasets: [{
        data: histogram,
        label: 'Return Distribution',
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1
      }],
      labels: labels
    };

    if (this.chart) {
      this.chart.update();
    }
  }

  private handleError(error: any): void {
    console.error('Monte Carlo Simulation Error:', error);
    this.error = error.message || 'An error occurred during simulation';
  }

  getFormErrorMessage(controlName: string): string {
    const control = this.monteCarloForm.get(controlName);
    if (!control) return '';
    
    if (control.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control.hasError('min')) {
      return `Minimum value is ${control.errors?.['min'].min}`;
    }
    if (control.hasError('max')) {
      return `Maximum value is ${control.errors?.['max'].max}`;
    }
    if (control.hasError('pattern')) {
      return 'Invalid format';
    }
    return '';
  }
}
  