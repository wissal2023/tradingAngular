import { Injectable } from '@angular/core';
import { OptimizationPreferences } from '../Entity/optimization-preferences';
import { OptimizationRequest } from '../Entity/optimization-request';
import { catchError, Observable, throwError , tap} from 'rxjs';
import { OptimizationResponse } from '../Entity/optimization-response';
import { BacktestingService } from './backtesting.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OptimizationService {
  private apiUrl = 'http://localhost:8089/home/api/optimization';
  
  constructor(
    private http: HttpClient,
    private backtestingService: BacktestingService
  ) {}

  optimizeStrategy(request: OptimizationRequest): Observable<OptimizationResponse> {
    const currentUser = this.backtestingService.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.post<OptimizationResponse>(
      `${this.apiUrl}/optimize?userId=${currentUser.id}`,
      request
    ).pipe(
      tap(response => {
        console.log('Optimization completed:', response);
      }),
      catchError(error => {
        console.error('Optimization error:', error);
        return throwError(() => new Error(
          error.error?.message || 'Failed to optimize strategy'
        ));
      })
    );
  }

  // Helper method to create default optimization preferences
  createDefaultPreferences(): OptimizationPreferences {
    return {
      volatilityThreshold: 0.3,
      maxDrawdownThreshold: 0.2,
      minSharpeRatio: 1.0,
      riskFreeRate: 0.02,
      adaptToMarketConditions: true,
      metricWeights: {
        return: 0.3,
        sharpe: 0.2,
        maxDrawdown: 0.2,
        volatility: 0.15,
        sortino: 0.15
      }
    };
  }

  // Helper method to create an optimization request
  createOptimizationRequest(
    symbol: string,
    startDate: Date,
    endDate: Date,
    strategyType: string,
    preferences?: OptimizationPreferences
  ): OptimizationRequest {
    return {
      symbol,
      startDate,
      endDate,
      strategyType,
      preferences: preferences || this.createDefaultPreferences()
    };
  }
}
