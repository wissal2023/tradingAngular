import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trader } from 'src/app/Entity/Trader';

@Injectable({
  providedIn: 'root'
})
export class TraderService {
  private apiUrl = 'http://localhost:8080/api/challenge-participation'; // Remplacez par votre URL API

  constructor(private http: HttpClient) { }

  participate(challengeId: number): Observable<Trader> {
    const participation = {
      
      challenge: { id: challengeId },
      participationDate: new Date(),
      active: true
    };
    return this.http.post<Trader>(this.apiUrl, participation);
  }
}
