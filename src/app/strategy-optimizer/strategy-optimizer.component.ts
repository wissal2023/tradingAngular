import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OptimizationResponse } from '../Entity/optimization-response';
import { OptimizationService } from '../Services/optimization.service';
import { RiskLevel } from '../Entity/risk-level';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { StockPreviewService } from '../Services/stock-preview.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-strategy-optimizer',
  templateUrl: './strategy-optimizer.component.html',
  styleUrls: ['./strategy-optimizer.component.css']
})
export class StrategyOptimizerComponent implements OnInit {
  
  optimizationForm!: FormGroup;
  isLoading = false;
  availableStrategies = ['SMA', 'RSI'];
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private optimizationService: OptimizationService,
    private stockPreviewService: StockPreviewService,
    private router: Router
  ) {
  

}
  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const defaultPreferences = this.optimizationService.createDefaultPreferences();
    
    this.optimizationForm = this.fb.group({
      symbol: ['', [Validators.required, Validators.pattern(/^[A-Z]{1,5}$/)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      strategyType: ['SMA', Validators.required],
      preferences: this.fb.group({
        volatilityThreshold: [defaultPreferences.volatilityThreshold, [Validators.required, Validators.min(0), Validators.max(1)]],
        maxDrawdownThreshold: [defaultPreferences.maxDrawdownThreshold, [Validators.required, Validators.min(0), Validators.max(1)]],
        minSharpeRatio: [defaultPreferences.minSharpeRatio, [Validators.required, Validators.min(0)]],
        riskFreeRate: [defaultPreferences.riskFreeRate, [Validators.required, Validators.min(0), Validators.max(1)]],
        adaptToMarketConditions: [defaultPreferences.adaptToMarketConditions],
        metricWeights: this.fb.group({
          return: [defaultPreferences.metricWeights['return'], [Validators.required, Validators.min(0), Validators.max(1)]],
          sharpe: [defaultPreferences.metricWeights['sharpe'], [Validators.required, Validators.min(0), Validators.max(1)]],
          maxDrawdown: [defaultPreferences.metricWeights['maxDrawdown'], [Validators.required, Validators.min(0), Validators.max(1)]],
          volatility: [defaultPreferences.metricWeights['volatility'], [Validators.required, Validators.min(0), Validators.max(1)]],
          sortino: [defaultPreferences.metricWeights['sortino'], [Validators.required, Validators.min(0), Validators.max(1)]]
        })
      })
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.optimizationForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched || this.submitted);
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.optimizationForm.invalid) {
      return;
    }
  
    this.isLoading = true;
    const formValue = this.optimizationForm.value;
    
    const request = this.optimizationService.createOptimizationRequest(
      formValue.symbol,
      new Date(formValue.startDate),
      new Date(formValue.endDate),
      formValue.strategyType,
      formValue.preferences
    );
  
    this.optimizationService.optimizeStrategy(request).subscribe({
      next: (response: OptimizationResponse) => {
        this.isLoading = false;
        // Navigate to results component with the optimization data
        this.router.navigate(['/strategy-results'], { 
          state: { optimizationResult: response }
        });
      },
      error: (error) => {
        console.error('Optimization failed:', error.message || 'Unknown error');
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.submitted = false;
    this.initForm();
  }
}
