import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntradayService {

  private apiUrl = 'http://localhost:8080/api/stocks';
//http://localhost:8090/home/
  constructor(private http: HttpClient) { }

  getStockData(symbol: string, interval: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?symbol=${symbol}&interval=${interval}`);
  }
}
