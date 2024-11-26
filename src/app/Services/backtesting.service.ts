import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { User } from '../Entity/user';
import { BacktestFormData } from '../Entity/backtest-form-data';
import { BacktestResult } from '../Entity/backtest-result';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BacktestingService {

  private apiUrl = 'http://localhost:8089/home/api';
  private currentUser: User | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Subscribe to AuthService's user updates
    //this.authService.currentUser.subscribe(
     // user => this.currentUser = user
    //);
  }

  // Authentication methods
  register(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, { username, password })
      .pipe(
        tap(user => {
          this.setCurrentUser(user);
        //  this.authService.login(username, password).subscribe();
        })
      );
  }



  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Backtest methods
  runBacktest(backtestRequest: BacktestFormData): Observable<BacktestResult> {
    if (!this.currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }
    return this.http.post<BacktestResult>(
      `${this.apiUrl}/backtest?userId=${this.currentUser.id}`, 
      backtestRequest,
      { withCredentials: true }
    );
  }

  getUserBacktests(): Observable<any[]> {
    if (!this.currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }
    return this.http.get<any[]>(
      `${this.apiUrl}/user/${this.currentUser.id}/backtests`,
      { withCredentials: true }
    );
  }

  getBacktestResult(backtestId: number): Observable<BacktestResult> {
    if (!this.currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }
    return this.http.get<BacktestResult>(
      `${this.apiUrl}/backtest/${backtestId}?userId=${this.currentUser.id}`,
      { withCredentials: true }
    );
  }

  deleteBacktest(backtestId: number): Observable<any> {
    if (!this.currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }
    return this.http.delete(
      `${this.apiUrl}/backtest/${backtestId}?userId=${this.currentUser.id}`,
      { withCredentials: true }
    );
  }

  getAvailableStrategies(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.apiUrl}/strategies`,
      { withCredentials: true }
    );
  }

  getStockPreviewData(symbol: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/stock-preview/${symbol.toUpperCase()}`,
      { withCredentials: true }
    ).pipe(
      catchError(error => {
        console.error('Stock preview error:', error);
        return throwError(() => new Error('Failed to fetch stock data'));
      })
    );
  }
  getBacktestResults(userId: number): Observable<BacktestResult> {
    return this.http.get<BacktestResult>(
      `${this.apiUrl}/users/${userId}/backtest`,
      { 
        withCredentials: true,
        responseType: 'json'
      }
    ).pipe(
      tap(response => {
        // Log the raw response for debugging
        console.log('Raw backtest response:', response);
      }),
      map(response => {
        // Ensure the response matches the BacktestResult interface
        if (!this.isValidBacktestResult(response)) {
          throw new Error('Invalid backtest result format');
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  private isValidBacktestResult(result: any): result is BacktestResult {
    return (
      result &&
      typeof result.initialCapital === 'number' &&
      typeof result.finalCapital === 'number' &&
      typeof result.totalReturn === 'number' &&
      Array.isArray(result.trades) &&
      result.trades.every((trade: any) =>
        typeof trade.date === 'string' &&
        typeof trade.action === 'string' &&
        typeof trade.shares === 'number' &&
        typeof trade.price === 'number'
      )
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 404:
          errorMessage = 'Service not found. Please check server configuration.';
          break;
        case 401:
          errorMessage = 'Invalid credentials. Please try again.';
          break;
        case 200: // For JSON parsing errors
          errorMessage = 'Invalid response format from server';
          console.error('Raw response:', error.error);
          break;
        default:
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    console.error('Error details:', error);
    return throwError(() => new Error(errorMessage));
  }
}