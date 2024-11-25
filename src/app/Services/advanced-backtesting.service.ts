import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
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
@Injectable({
  providedIn: 'root'
})
export class AdvancedBacktestingService {
  private apiUrl = 'http://localhost:8089/home/api/advanced-backtest';
  private readonly maxRetries = 2;
  private readonly retryDelay = 1000;
  constructor(private http: HttpClient) {}

  compareStrategies(
    symbol: string,
    startDate: Date,
    endDate: Date,
    strategies: string[]
  ): Observable<MultiStrategyResult> {
    const params = new HttpParams()
      .set('symbol', symbol)
      .set('startDate', startDate.toISOString().split('T')[0])
      .set('endDate', endDate.toISOString().split('T')[0]);

    return this.http.post<any>(
      `${this.apiUrl}/compare-strategies`,
      strategies,
      { params }
    ).pipe(
      map(response => {
        // Convert the plain objects to Maps
        const strategyResults = new Map<string, BacktestMetrics>();
        
        Object.entries(response.strategyResults).forEach(([strategy, metrics]: [string, any]) => {
          // Convert equityCurve object to Map
          const equityCurve = new Map<string, number>();
          if (metrics.equityCurve) {
            Object.entries(metrics.equityCurve).forEach(([date, value]: [string, any]) => {
              equityCurve.set(date, value);
            });
          }
          
          strategyResults.set(strategy, {
            ...metrics,
            equityCurve: equityCurve
          });
        });

        return {
          bestStrategy: response.bestStrategy,
          strategyResults: strategyResults
        };
      }),
      tap(response => console.log('Converted response:', response)),
      catchError(this.handleErrors)
    );
  }

  walkForwardOptimization(
    symbol: string,
    startDate: Date,
    endDate: Date,
    strategy: string,
    windows: number
  ): Observable<any> {
    // Validate input parameters
    if (!symbol || !startDate || !endDate || !strategy || windows <= 0) {
      return throwError(() => new Error('Invalid input parameters'));
    }

    if (startDate >= endDate) {
      return throwError(() => new Error('Start date must be before end date'));
    }

    const params = new HttpParams()
      .set('symbol', symbol.toUpperCase())
      .set('startDate', startDate.toISOString().split('T')[0])
      .set('endDate', endDate.toISOString().split('T')[0])
      .set('strategy', strategy)
      .set('windows', windows.toString());

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    return this.http.post(
      `${this.apiUrl}/walk-forward-optimization`,
      null,
      { params, headers }
    ).pipe(
      tap(response => console.log('Walk Forward Optimization response:', response)),
      retry({
        count: this.maxRetries,
        delay: (error, retryCount) => {
          console.log(`Retry attempt ${retryCount} for Walk Forward Optimization`);
          return timer(1000 * Math.pow(2, retryCount)); // Exponential backoff
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Walk Forward Optimization error:', error);
        return throwError(() => 
          new Error(`Walk Forward Optimization failed: ${error.message || 'Unknown error'}`)
        );
      })
    );
  }

  private validateInputs(
    symbol: string,
    startDate: Date,
    endDate: Date,
    strategy: string,
    windows: number
  ): boolean {
    if (!symbol || !startDate || !endDate || !strategy || !windows) {
      console.error('Missing required parameters:', { symbol, startDate, endDate, strategy, windows });
      return false;
    }

    if (startDate >= endDate) {
      console.error('Start date must be before end date');
      return false;
    }

    if (windows < 2) {
      console.error('Windows must be at least 2');
      return false;
    }

    return true;
  }
  private formatDate(date: Date): string {
    try {
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Date formatting error:', error);
      throw new Error('Invalid date format');
    }
  }

  private logRequestDetails(endpoint: string, params: HttpParams): void {
    console.group(`API Request - ${endpoint}`);
    console.log('URL:', `${this.apiUrl}/${endpoint}`);
    console.log('Parameters:', this.paramsToObject(params));
    console.groupEnd();
  }

  private logResponse(endpoint: string, response: any): void {
    console.group(`API Response - ${endpoint}`);
    console.log('Response data:', response);
    console.groupEnd();
  }

  private paramsToObject(params: HttpParams): Record<string, string> {
    const result: Record<string, string> = {};
    params.keys().forEach(key => {
      result[key] = params.get(key) || '';
    });
    return result;
  }
  private handleError(error: HttpErrorResponse, operation = 'operation') {
    console.error(`${operation} failed:`, error);

    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
      console.error('Client-side error:', error.error.message);
    } else {
      // Server-side error
      errorMessage = this.getServerErrorMessage(error);
      console.error('Server-side error:', {
        status: error.status,
        statusText: error.statusText,
        message: error.error?.message,
        url: error.url
      });
    }

    // Additional debugging information
    console.group('Detailed Error Information');
    console.log('Error Status:', error.status);
    console.log('Status Text:', error.statusText);
    console.log('Error URL:', error.url);
    console.log('Error Headers:', error.headers);
    console.log('Error Type:', error.error instanceof ErrorEvent ? 'Client-side' : 'Server-side');
    console.groupEnd();

    return throwError(() => new Error(errorMessage));
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400:
        return `Bad Request: ${error.error?.message || 'Invalid request parameters'}`;
      case 401:
        return 'Unauthorized: Please log in again';
      case 403:
        return 'Forbidden: You don\'t have permission to access this resource';
      case 404:
        return 'Not Found: The requested resource was not found';
      case 500:
        return `Server Error: ${error.error?.message || 'Internal server error occurred'}`;
      default:
        return `Server Error ${error.status}: ${error.error?.message || 'An unknown error occurred'}`;
    }
  }
  monteCarloSimulation(
    symbol: string,
    startDate: Date,
    endDate: Date,
    strategy: string,
    simulations: number
  ): Observable<BacktestMetrics[]> {
    // Input validation
    if (!this.validateSimulationInputs(symbol, startDate, endDate, strategy, simulations)) {
      return throwError(() => new Error('Invalid input parameters'));
    }

    const params = new HttpParams()
      .set('symbol', symbol.toUpperCase())
      .set('startDate', this.formatDate(startDate))
      .set('endDate', this.formatDate(endDate))
      .set('strategy', strategy)
      .set('simulations', simulations.toString());

    // Log request details for debugging
    this.logRequestDetail('monte-carlo-simulation', params);

    return this.http.post<BacktestMetrics[]>(
      `${this.apiUrl}/monte-carlo-simulation`,
      null,
      { 
        params,
        headers: new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json'),
      }
    ).pipe(
      retry({
        count: this.maxRetries,
        delay: (error, retryCount) => {
          if (error.status === 500) {
            console.log(`Retrying Monte Carlo simulation (${retryCount}/${this.maxRetries})`);
            return timer(this.retryDelay * Math.pow(2, retryCount - 1));
          }
          return throwError(() => error);
        },
      }),
      tap(response => this.logResponses('monte-carlo-simulation', response)),
      catchError(error => this.handleMonteCarloError(error))
    );
  }

  private validateSimulationInputs(
    symbol: string,
    startDate: Date,
    endDate: Date,
    strategy: string,
    simulations: number
  ): boolean {
    if (!symbol || !startDate || !endDate || !strategy || !simulations) {
      console.error('Missing required parameters');
      return false;
    }

    if (startDate >= endDate) {
      console.error('Start date must be before end date');
      return false;
    }

    if (simulations < 100 || simulations > 10000) {
      console.error('Simulations must be between 100 and 10000');
      return false;
    }

    if (!/^[A-Za-z]+$/.test(symbol)) {
      console.error('Invalid symbol format');
      return false;
    }

    return true;
  }


  private handleMonteCarloError(error: HttpErrorResponse): Observable<never> {
    console.error('Monte Carlo Simulation Error:', {
      status: error.status,
      message: error.message,
      url: error.url,
      timestamp: new Date().toISOString()
    });

    let errorMessage: string;

    switch (error.status) {
      case 400:
        errorMessage = 'Invalid simulation parameters. Please check your inputs.';
        break;
      case 401:
        errorMessage = 'Authentication required. Please log in again.';
        break;
      case 403:
        errorMessage = 'You don\'t have permission to run this simulation.';
        break;
      case 404:
        errorMessage = 'The simulation endpoint was not found.';
        break;
      case 429:
        errorMessage = 'Too many simulation requests. Please try again later.';
        break;
      case 500:
        errorMessage = 'The server encountered an error while processing the simulation. This might be due to:';
        errorMessage += '\n- Invalid date range';
        errorMessage += '\n- Insufficient market data';
        errorMessage += '\n- Server resource constraints';
        errorMessage += '\nPlease try with different parameters or contact support if the issue persists.';
        break;
      default:
        errorMessage = `An unexpected error occurred: ${error.message || 'Unknown error'}`;
    }

    return throwError(() => new Error(errorMessage));
  }

  private logRequestDetail(endpoint: string, params: HttpParams): void {
    console.group(`Monte Carlo Simulation Request - ${new Date().toISOString()}`);
    console.log('Endpoint:', endpoint);
    console.log('Parameters:', this.paramsToObject(params));
    console.groupEnd();
  }

  private logResponses(endpoint: string, response: any): void {
    console.group(`Monte Carlo Simulation Response - ${new Date().toISOString()}`);
    console.log('Data:', response);
    console.groupEnd();
  }

  private paramsToObjectS(params: HttpParams): Record<string, string> {
    const result: Record<string, string> = {};
    params.keys().forEach(key => {
      result[key] = params.get(key) || '';
    });
    return result;
  }
  stressTest(
    symbol: string,
    startDate: Date,
    endDate: Date,
    strategy: string
  ): Observable<BacktestMetrics> {
    // Validate input parameters
    if (!this.validateInputs(symbol, startDate, endDate, strategy, 2)) {
      return throwError(() => new Error('Invalid input parameters'));
    }

    const params = new HttpParams()
      .set('symbol', symbol.toUpperCase())
      .set('startDate', startDate.toISOString().split('T')[0])  // Format as YYYY-MM-DD
      .set('endDate', endDate.toISOString().split('T')[0])      // Format as YYYY-MM-DD
      .set('strategy', strategy);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    // Log request details for debugging
    this.logRequestDetails('stress-test', params);

    return this.http.post<any>(
      `${this.apiUrl}/stress-test`,
      null,
      { params, headers }
    ).pipe(
      map(response => {
        // Convert equityCurve object to Map
        const equityCurve = new Map<string, number>();
        if (response.equityCurve) {
          Object.entries(response.equityCurve).forEach(([date, value]: [string, any]) => {
            equityCurve.set(date, value);
          });
        }
        
        return {
          ...response,
          equityCurve: equityCurve
        };
      }),
      tap(response => this.logResponse('stress-test', response)),
      retry({
        count: this.maxRetries,
        delay: (error, retryCount) => {
          console.log(`Retry attempt ${retryCount} for Stress Test`);
          return timer(this.retryDelay * Math.pow(2, retryCount - 1)); // Exponential backoff
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Stress Test error:', error);
        return throwError(() => {
          const errorMessage = this.getServerErrorMessage(error);
          return new Error(`Stress Test failed: ${errorMessage}`);
        });
      })
    );
  }


  private handleErrors(error: HttpErrorResponse) {
    console.error('API Error Details:', error);
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.statusText}`;
      if (error.error?.message) {
        errorMessage += ` - ${error.error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
