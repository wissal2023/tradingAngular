import { Component, OnInit } from '@angular/core';
import { TraderService } from 'src/app/Services/TraderService';
import { Challenge } from 'src/app/Entity/Challenge'; // Votre modèle Challenge

@Component({
  selector: 'app-challenge-list',
  templateUrl: './trader.component.html',
  styleUrls: ['./trader.component.css']
})
export class TraderComponent implements OnInit {
  challenges: Challenge[] = [];
  accountSize: number = 0;
  // ID de l'utilisateur actuel

  constructor(private participationService: TraderService) { }

  ngOnInit(): void {
    this.loadChallenges();
  // Remplacez par votre logique d'authentification
  }

  loadChallenges(): void {
    // Chargez les challenges ici, selon votre logique
  }

  participate(challengeId: number): void {
    this.participationService.participate(challengeId).subscribe({
      next: (response) => {
        console.log('Participation réussie:', response);
        // Vous pouvez également mettre à jour l'interface utilisateur si nécessaire
      },
      error: (err) => {
        console.error('Erreur lors de la participation:', err);
      }
    });
  }
}

