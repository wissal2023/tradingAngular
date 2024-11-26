import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdvancedBacktestingService } from '../Services/advanced-backtesting.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Chart, ChartConfiguration, ChartOptions, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
Chart.register(...registerables);
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

export interface MultiStrategyResult {
  strategyResults: Map<string, BacktestMetrics>;
  bestStrategy: string;
}
@Component({
  selector: 'app-compare-strategies', 
  templateUrl: './compare-strategies.component.html',
  styleUrls: ['./compare-strategies.component.css']
})
export class CompareStrategiesComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  compareForm!: FormGroup;
  loading = false;
  error: string | null = null;
  results: MultiStrategyResult | null = null;
  availableStrategies = ['MovingAverage', 'MeanReversion'];
  selectedStrategyForTrades: string | null = null;
  selectedStrategyForEquity: string | null = null;
  constructor(
    private fb: FormBuilder,
    private backtestingService: AdvancedBacktestingService
  ) {
    this.initForm();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  private validateInput(formValue: any): void {
    if (!formValue.symbol || !formValue.startDate || !formValue.endDate || !formValue.selectedStrategies?.length) {
      throw new Error('Invalid input parameters');
    }
    
    const startDate = new Date(formValue.startDate);
    const endDate = new Date(formValue.endDate);
    
    if (endDate <= startDate) {
      throw new Error('End date must be after start date');
    }
    
    if (!formValue.selectedStrategies.every((s: string) => this.availableStrategies.includes(s))) {
      throw new Error('Invalid strategy selected');
    }
  }

  private initForm(): void {
    this.compareForm = this.fb.group({
      symbol: ['', [Validators.required, Validators.minLength(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      selectedStrategies: [[], [Validators.required, Validators.minLength(1)]]
    });
  }
  onSubmit(): void {
    if (this.compareForm.invalid) {
      this.error = 'Please fill in all required fields';
      return;
    }

    const formValue = this.compareForm.value;
    
    try {
      this.validateInput(formValue);
      
      this.loading = true;
      this.error = null;

      const startDate = new Date(formValue.startDate);
      const endDate = new Date(formValue.endDate);

      this.backtestingService.compareStrategies(
        formValue.symbol,
        startDate,
        endDate,
        formValue.selectedStrategies
      ).pipe(
        catchError(error => {
          console.error('Backtesting error:', error);
          return throwError(() => new Error(
            error.error?.message || 
            error.message || 
            'An error occurred during backtesting'
          ));
        })
      ).subscribe({
        next: (results) => {
          console.log('Raw results received:', results);
          this.results = results;
          this.loading = false;
          
          // If there's a selected strategy, update its chart
          if (this.selectedStrategyForEquity) {
            this.prepareChartData(this.selectedStrategyForEquity);
          }
        },
        error: (error) => {
          console.error('Component error handler:', error);
          this.error = error.message;
          this.loading = false;
        }
      });
    } catch (error: any) {
      this.error = error.message;
      console.error('Validation error:', error);
    }
  }



  getStrategyEntries(): Array<[string, BacktestMetrics]> {
    if (!this.results?.strategyResults) return [];
    return Array.from(this.results.strategyResults.entries());
  }


  getTradesForStrategy(strategy: string): Trade[] {
    if (!this.results?.strategyResults) return [];
    const metrics = this.results.strategyResults.get(strategy);
    return metrics?.trades || [];
  }

  getStrategyTradeStats(strategy: string): { total: number, buys: number, sells: number, avgPrice: number } {
    const trades = this.getTradesForStrategy(strategy);
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
  getEquityCurveData(strategy: string): Array<{date: string, value: number}> {
    if (!this.results?.strategyResults) return [];
    const metrics = this.results.strategyResults.get(strategy);
    if (!metrics?.equityCurve) return [];
    
    return Array.from(metrics.equityCurve.entries()).map(([date, value]) => ({
      date: new Date(date).toLocaleDateString(),
      value: value
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getEquityMetrics(strategy: string): {
    initialValue: number;
    finalValue: number;
    peakValue: number;
    totalGain: number;
    gainPercentage: number;
  } {
    const data = this.getEquityCurveData(strategy);
    if (data.length === 0) return {
      initialValue: 0,
      finalValue: 0,
      peakValue: 0,
      totalGain: 0,
      gainPercentage: 0
    };

    const initialValue = data[0].value;
    const finalValue = data[data.length - 1].value;
    const peakValue = Math.max(...data.map(d => d.value));
    const totalGain = finalValue - initialValue;
    const gainPercentage = (totalGain / initialValue) * 100;

    return {
      initialValue,
      finalValue,
      peakValue,
      totalGain,
      gainPercentage
    };
  }

  showEquityCurveForStrategy(strategy: string): void {
    this.selectedStrategyForEquity = strategy;
  }

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
        min: undefined,
        max: undefined,
        title: {
          display: true,
          text: 'Equity Value ($)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        beginAtZero: false,
        grace: '5%',
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
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 2
      }
    }
  };


  lineChartType: ChartType = 'line';

  prepareChartData(strategy: string): void {
    if (!this.results?.strategyResults) {
      console.log('No results available');
      return;
    }
    
    const metrics = this.results.strategyResults.get(strategy);
    if (!metrics?.equityCurve) {
      console.log('No equity curve data available for', strategy);
      return;
    }
  
    // Convert and sort the equity curve data
    const equityData = Array.from(metrics.equityCurve.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
  
    if (equityData.length === 0) {
      console.log('No equity data points available');
      return;
    }
  
    const dates = equityData.map(entry => new Date(entry[0]).toLocaleDateString());
    const values = equityData.map(entry => Number(entry[1]));
  
    // Calculate min and max for scaling
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
  
    this.lineChartData = {
      datasets: [
        {
          data: values,
          label: `${strategy} Equity Curve`,
          fill: false,
          tension: 0.4,
          borderColor: strategy === 'MovingAverage' ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)',
          backgroundColor: strategy === 'MovingAverage' ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)',
          pointRadius: 2,
          borderWidth: 2
        }
      ],
      labels: dates
    };
  
    // Type-safe way to update min and max using bracket notation
    if (this.lineChartOptions.scales?.['y']) {
      const yScale = this.lineChartOptions.scales['y'];
      yScale.min = min - padding;
      yScale.max = max + padding;
    }
  
    // Force chart update
    if (this.chart) {
      this.chart.update();
    }
  }
  showEquityCurve(strategy: string): void {
    console.log('Showing equity curve for:', strategy);
    this.selectedStrategyForEquity = strategy;
    this.prepareChartData(strategy);
  }

  // Update the existing method to also prepare chart data
  showTradesForStrategy(strategy: string): void {
    this.selectedStrategyForTrades = strategy;
    this.prepareChartData(strategy);
  }

}
