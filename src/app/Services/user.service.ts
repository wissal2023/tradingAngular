import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../Entity/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/user';  // Your Spring Boot API base URL

  constructor(private http: HttpClient) { }

  // Fetch all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/Get-all-users`);
  }

  // Fetch a single user by ID
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/Get-user/${userId}`);
  }

  // Add a user and assign a portfolio
  addUserAndAssignPortfolio(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/add-user-and-assign-portfolio`, user);
  }

  // Modify a user
  modifyUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/modify-user`, user);
  }

  // Remove a user
  removeUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-user/${userId}`);
  }
}
