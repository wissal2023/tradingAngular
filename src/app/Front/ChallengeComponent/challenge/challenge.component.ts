// challenge.component.ts
import { Component, OnInit } from '@angular/core';
import { ChallengeService } from 'src/app/Services/ChallengeService'; // Assurez-vous que le chemin est correct
import { Challenge } from 'src/app/Entity/Challenge';
import { TraderService } from 'src/app/Services/TraderService';
import { Category } from 'src/app/Entity/Challenge';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.css']
})
export class ChallengeComponent implements OnInit {
 
  newChallenge: Challenge = {} as Challenge;
  categoryEnum = Object.values(Category);
  challenges: any[] = []; 

  constructor(private challengeService: ChallengeService, private traderService: TraderService,private router: Router) {this.calculateRefundableFees();}
  navigateToDashboard() {
    this.router.navigate(['/dash']); // Remplacez '/dashboard' par votre route réelle
  }
  ngOnInit(): void {
    this.loadChallenges();
  }
  accountSize: number = 100000; // Example account size
 
  refundableFees: number= 0;
  

 
  getStatusClass(status: string): string {
    return status === 'Available' ? 'text-success' : 'text-danger';
}

getStatusIcon(status: string): string {
    return status === 'Available' ? '✔' : '✘';
}

  calculateRefundableFees() {
    const percentage = 0.006; // 0.6% as a decimal
    this.refundableFees = this.accountSize * percentage;
  }

  // Charger les challenges
  loadChallenges(): void {
    this.challengeService.getChallenges().subscribe(
      (data) => {
        this.challenges = data;
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération des challenges', error);
      }
   );
  }

  // Créer un challenge
  createChallenge(): void {
    this.challengeService.createChallenge(this.newChallenge).subscribe(
      (data) => {
        this.challenges.push(data);
        this.newChallenge = {} as Challenge; // Réinitialiser le formulaire
      },
      (error) => {
        console.error('Erreur lors de la création du challenge', error);
      }
    );
  }

  // Supprimer un challenge
  deleteChallenge(id: number): void {
    const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer ce challenge ?');
    if (confirmDelete) {
      this.challengeService.deleteChallenge(id).subscribe(
        () => {
          // Créez un nouveau tableau sans le challenge supprimé
          this.challenges = this.challenges.filter(c => c.id !== id);
        },
        (error) => {
          console.error('Erreur lors de la suppression du challenge', error);
        }
      );
    }
  }
  
  

  // Mettre à jour un challenge
  updateChallenge(challenge: Challenge): void {
    this.challengeService.updateChallenge(challenge.id!, challenge).subscribe(
      (data) => {
        const index = this.challenges.findIndex(c => c.id === data.id);
        if (index !== -1) {
          this.challenges[index] = data;
        }
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du challenge', error);
      }
    );
  }
  participate(challengeId: number, category: string) {
    console.log('Navigating with challengeId:', challengeId, 'and category:', category);
    this.router.navigate(['/Transactions/:challengeId'], { queryParams: { challengeId, category } });
  }
  
  
  

}

