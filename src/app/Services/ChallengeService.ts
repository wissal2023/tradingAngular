// challenge.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Challenge } from 'src/app/Entity/Challenge';  // Assurez-vous que le modèle Challenge est bien importé

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  private apiUrl = 'http://localhost:8089/home/api/challenges'; // L'URL de votre API Spring

  constructor(private http: HttpClient) {}

  // Récupérer la liste des challenges
  getChallenges(): Observable<Challenge[]> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
    return this.http.get<Challenge[]>(`${this.apiUrl}/list`, { headers })
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la récupération des challenges:', error);
          return throwError(error);
        })
      );
  }

  // Créer un challenge
  createChallenge(challenge: Challenge): Observable<Challenge> {
    return this.http.post<Challenge>(`${this.apiUrl}/create`, challenge,{
        headers: { 'Accept': '*/*' }
      });
  }

  // Supprimer un challenge
  deleteChallenge(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // Mettre à jour un challenge
  updateChallenge(id: number, challenge: Challenge): Observable<Challenge> {
    return this.http.put<Challenge>(`${this.apiUrl}/update/${id}`, challenge);
  }
}
