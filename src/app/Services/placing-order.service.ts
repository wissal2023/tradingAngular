import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlacingOrder } from '../Entity/placing-order';

@Injectable({
  providedIn: 'root'
})
export class PlacingOrderService {
  private baseUrl = 'http://localhost:8090/home/placingOrder';
  constructor(private http: HttpClient) {}
  addPlacingOrder(order: PlacingOrder): Observable<PlacingOrder> {
    return this.http.post<PlacingOrder>(`${this.baseUrl}/Add-Order`, order);
  }
  getAllPlacingOrders(): Observable<PlacingOrder[]> {
    return this.http.get<PlacingOrder[]>(`${this.baseUrl}/Get-all-placingOrders`);
  }
  getPlacingOrder(placingOrderId: number): Observable<PlacingOrder> {
    return this.http.get<PlacingOrder>(`${this.baseUrl}/Get-placingOrder/${placingOrderId}`);
  }
  modifyPlacingOrder(order: PlacingOrder): Observable<PlacingOrder> {
    return this.http.put<PlacingOrder>(`${this.baseUrl}/modify-placingOrder`, order);
  }
  removePlacingOrder(placingOrderId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-placingOrder/${placingOrderId}`);
  }
}
