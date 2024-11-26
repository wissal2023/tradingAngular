import { Component } from '@angular/core';
import { ChallengeService } from 'src/app/Services/ChallengeService'; // Assurez-vous que le chemin est correct
import { Challenge } from 'src/app/Entity/Challenge';
import { Category } from 'src/app/Entity/Challenge';

@Component({
  selector: 'app-create-challenge',
  templateUrl: './create-challenge.component.html',
  styleUrls: ['./create-challenge.component.css']
})
export class CreateChallengeComponent {
  constructor(private challengeService: ChallengeService) {}
  newChallenge: Challenge = {} as Challenge;
  challenges: Challenge[] = [];
  categoryEnum = Object.values(Category);
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

}
