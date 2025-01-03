import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Policy } from '../Entity/Policy';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  private apiUrl = 'http://localhost:8094/home/policies';

  constructor(private http: HttpClient) { }

  getPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.apiUrl}/`);
  }

  deletePolicy(id: number): Observable<String> {
    return this.http.delete<String>(`${this.apiUrl}/${id}`);
  }

  updatePolicy(id: number, policy: Policy): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, policy);
  }

  addPolicy(policy: Policy): Observable<Policy> {
    return this.http.post<Policy>(`${this.apiUrl}/`, policy);
  }

  getPolicy(id:number) : Observable<Policy> {
    return this.http.get<Policy>(`${this.apiUrl}/${id}`);
  }

  getMostPurchased(): Observable<Policy> {
    return this.http.get<Policy>(`${this.apiUrl}/most-purchased`);
  }

  getBestValue(): Observable<Policy> {
    return this.http.get<Policy>(`${this.apiUrl}/best-value`);
  }
}
