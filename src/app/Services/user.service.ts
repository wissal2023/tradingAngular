import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../Entity/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8090/home/user'; 

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/Get-all-users`);
  }
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/Get-user/${userId}`);
  }
  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/addAndAssignPortfolio`, user);
  }
 
  modifyUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/modify-user`, user);
  }

  // Remove a user
  removeUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-user/${userId}`);
  }
}
