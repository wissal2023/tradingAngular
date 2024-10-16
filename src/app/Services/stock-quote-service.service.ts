import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockQuoteService {
  private apiUrl = 'http://localhost:8090/home/api/quote/get';

  constructor(private http: HttpClient) {}

  getStockQuote(symbol: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${symbol}`, {
      headers: { 'Accept': '*/*' }
    });
  }
}
