import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../Entity/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://localhost:8094/home/transaction';
  constructor(private http: HttpClient) {}
  getAllTransactions(): Observable<Transaction[]> {

    return this.http.get<Transaction[]>(`${this.baseUrl}/Get-all-transactions`);
  }
  getTransaction(transactionId: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/Get-transaction/${transactionId}`);
  }
  // Get transactions by portfolio ID
  getTransactionsByPortfolioId(portfolioId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/Get-transactions-by-portfolio/${portfolioId}`);
  }
  
  
 
}