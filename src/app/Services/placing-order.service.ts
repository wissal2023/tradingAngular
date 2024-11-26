import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PlacingOrder } from '../Entity/placing-order';

@Injectable({
  providedIn: 'root'
})
export class PlacingOrderService {
  private baseUrl = 'http://localhost:8094/home/placingOrder';
  constructor(private http: HttpClient) {}
  removePlacingOrder(placingOrderId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-placingOrder/${placingOrderId}`);
  }
  
  changeStatus(orderId: number, newStatus: string): Observable<PlacingOrder> {
    const url = `${this.baseUrl}/change-status/${orderId}?newStatus=${newStatus}`;
    console.log('Requesting URL:', url); // Log the request URL

    return this.http.put<PlacingOrder>(url, {}).pipe(
      tap((response: any) => console.log('Status change response:', response)), // Log the response
      catchError((error) => {
        console.error('Error changing status:', error); // Handle error
        throw error;
      })
    );
  }
  
  getPlacingOrdersByPortfolio(portfolioId: number): Observable<PlacingOrder[]> {
    const url = `${this.baseUrl}/Get-placingOrdersByPortfolio/${portfolioId}`;
    console.log('Requesting URL:', url); // Log the request URL
    return this.http.get<PlacingOrder[]>(url).pipe(
        tap((response: any) => console.log('API Response:', response)) // Log the response
    );
}
  addOrder(portfolioId: number, placingOrder: PlacingOrder): Observable<PlacingOrder> {
    const url = `${this.baseUrl}/${portfolioId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<PlacingOrder>(url, placingOrder, { headers }); // Send the POST request
  }

  getAllPlacingOrders(): Observable<PlacingOrder[]> {
    return this.http.get<PlacingOrder[]>(`${this.baseUrl}/Get-all-placingOrders`);
  }

  getPlacingOrder(placingOrderId: number): Observable<PlacingOrder[]> {
    return this.http.get<PlacingOrder[]>(`${this.baseUrl}/Get-placingOrder/${placingOrderId}`);
  }
  modifyPlacingOrder(order: PlacingOrder): Observable<PlacingOrder> {
    return this.http.put<PlacingOrder>(`${this.baseUrl}/modify-placingOrder`, order);
  }
  

  

 
  // Method to fetch orders by portfolio ID
  /*getPlacingOrdersByPortfolio(portfolioId: number): Observable<PlacingOrder[]> {
    const url = `${this.baseUrl}/placingOrder/Get-placingOrdersByPortfolio/${portfolioId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<PlacingOrder[]>(url, { headers });
  }
  */
  
  
  

  
}
