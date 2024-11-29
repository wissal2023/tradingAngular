import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdvancedBacktestingService } from 'src/app/Services/advanced-backtesting.service';
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
  selector: 'app-advanced-backtesting',
  templateUrl: './advanced-backtesting.component.html',
  styleUrls: ['./advanced-backtesting.component.css']
})
export class AdvancedBacktestingComponent implements OnInit {
  backtestForm!: FormGroup;
  loading = false;
  error: string | null = null;
  multiStrategyResults: MultiStrategyResult | null = null;
  walkForwardResults: BacktestMetrics | null = null;
  monteCarloResults: BacktestMetrics[] | null = null;
  stressTestResults: BacktestMetrics | null = null;

  availableStrategies = ['MovingAverage', 'MeanReversion'];

  constructor(
    private fb: FormBuilder,
    private backtestingService: AdvancedBacktestingService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {}

  private initializeForm(): void {
    this.backtestForm = this.fb.group({
      symbol: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      strategy: ['MovingAverage', [Validators.required]],
      windows: [10, [Validators.required, Validators.min(2)]],
      simulations: [1000, [Validators.required, Validators.min(100)]],
      selectedStrategies: [[], [Validators.required]]
    });
  }

  onCompareStrategies(): void {
    if (this.backtestForm.invalid) return;

    const { symbol, startDate, endDate, selectedStrategies } = this.backtestForm.value;
    this.loading = true;
    this.error = null;

    this.backtestingService.compareStrategies(
      symbol,
      new Date(startDate),
      new Date(endDate),
      selectedStrategies
    ).subscribe({
      next: (results) => {
        this.multiStrategyResults = results;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  onWalkForwardOptimization(): void {
    if (this.backtestForm.invalid) return;

    const { symbol, startDate, endDate, strategy, windows } = this.backtestForm.value;
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
        this.walkForwardResults = results;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  onMonteCarloSimulation(): void {
    if (this.backtestForm.invalid) return;

    const { symbol, startDate, endDate, strategy, simulations } = this.backtestForm.value;
    this.loading = true;
    this.error = null;

    this.backtestingService.monteCarloSimulation(
      symbol,
      new Date(startDate),
      new Date(endDate),
      strategy,
      simulations
    ).subscribe({
      next: (results) => {
        this.monteCarloResults = results;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  onStressTest(): void {
    if (this.backtestForm.invalid) return;

    const { symbol, startDate, endDate, strategy } = this.backtestForm.value;
    this.loading = true;
    this.error = null;

    this.backtestingService.stressTest(
      symbol,
      new Date(startDate),
      new Date(endDate),
      strategy
    ).subscribe({
      next: (results) => {
        this.stressTestResults = results;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

}

