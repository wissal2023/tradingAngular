import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface BacktestResult {
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  trades: Array<{
    date: string;
    action: string;
    shares: number;
    price: number;
  }>;
  performanceData?: Array<{
    date: string;
    portfolioValue: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8089/home/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { username, password }, { 
      withCredentials: true 
    }).pipe(
      map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(this.handleError)
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    return this.http.post(`${this.apiUrl}/logout`, {}, { 
      withCredentials: true 
    }).pipe(catchError(this.handleError));
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