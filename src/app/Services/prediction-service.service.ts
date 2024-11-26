import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PredictionRequest } from '../Entity/prediction-request';
import { Observable } from 'rxjs';
import { PredictionResponse } from '../Entity/prediction-response';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
 
  private apiUrl = 'http://localhost:8089/home/api/predictions';
  constructor(private http: HttpClient) {}

  predictPrice(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/direction`, request);
  }

  // Helper method to format date to ISO format
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
}
