import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlacingOrder } from '../Entity/placing-order';

@Injectable({
  providedIn: 'root'
})
export class PlacingOrderService {

  private baseUrl = 'http://localhost:8089/placingOrder';

  constructor(private http: HttpClient) {}

  // Get all placing orders
  getAllPlacingOrders(): Observable<PlacingOrder[]> {
    return this.http.get<PlacingOrder[]>(`${this.baseUrl}/Get-all-placingOrders`);
  }

  // Get a placing order by ID
  getPlacingOrder(placingOrderId: number): Observable<PlacingOrder> {
    return this.http.get<PlacingOrder>(`${this.baseUrl}/Get-placingOrder/${placingOrderId}`);
  }

  // Add a placing order
  addPlacingOrder(order: PlacingOrder): Observable<PlacingOrder> {
    return this.http.post<PlacingOrder>(`${this.baseUrl}/Add-PlacingOrder`, order);
  }

  // Modify a placing order
  modifyPlacingOrder(order: PlacingOrder): Observable<PlacingOrder> {
    return this.http.put<PlacingOrder>(`${this.baseUrl}/modify-placingOrder`, order);
  }

  // Remove a placing order by ID
  removePlacingOrder(placingOrderId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-placingOrder/${placingOrderId}`);
  }
}
