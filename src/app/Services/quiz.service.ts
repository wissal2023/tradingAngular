import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Quiz } from '../Entity/quiz';
import { QuizResponse } from '../Entity/quiz-response';
import { QuizSummary } from '../Entity/quiz-summary';
import { User } from '../Entity/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:8089/home/api/quiz';
  private currentUser: User | null = null;
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Subscribe to AuthService's user updates

  }
  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
  getAvailableQuizzes(userId: number): Observable<Quiz[]> {
    if (!this.currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }
    return this.http.get<Quiz[]>(`${this.apiUrl}/user/${this.currentUser.id}`);
  }

  submitAnswer(quizId: number, userId: number, answer: string): Observable<QuizResponse> {
    if (!this.currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }
    return this.http.post<QuizResponse>(`${this.apiUrl}/${quizId}/submit?userId=${this.currentUser.id}`, { answer });
  }

  getQuizSummary(userId: number): Observable<QuizSummary> {
    if (!this.currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }
    return this.http.get<QuizSummary>(`${this.apiUrl}/user/${this.currentUser.id}/summary`);
  }
}
