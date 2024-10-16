import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../Entity/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private baseUrl = 'http://localhost:8089/transaction'; // Base URL for the API

  constructor(private http: HttpClient) {}

  // Get all transactions
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/Get-all-transactions`);
  }

  // Get a transaction by ID
  getTransaction(transactionId: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/Get-transaction/${transactionId}`);
  }

  // Add a transaction
  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/Add-Transaction`, transaction);
  }

  // Modify a transaction
  modifyTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}/modify-transaction`, transaction);
  }

  // Remove a transaction by ID
  removeTransaction(transactionId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-transaction/${transactionId}`);
  }
}