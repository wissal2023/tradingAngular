import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialDataServiceService {

  //private apiUrl = 'http://localhost:8094/api/stock-data';
  private apiUrl = 'http://localhost:8094/api/bonds';


  constructor(private http: HttpClient) { }

  getStockData(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }

  getBonds(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
