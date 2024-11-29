import { Component, OnInit } from '@angular/core';
import { QuizSummary } from '../../../Entity/quiz-summary';
import { QuizService } from '../../../Services/quiz.service';

@Component({
  selector: 'app-quiz-summary',
  templateUrl: './quiz-summary.component.html',
  styleUrls: ['./quiz-summary.component.css']
})
export class QuizSummaryComponent implements OnInit {
  summary?: QuizSummary;
  userId = 1; // Get this from your auth service

  constructor(private quizService: QuizService) {}

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.quizService.getQuizSummary(this.userId).subscribe({
      next: (summary) => {
        this.summary = summary;
      },
      error: (error) => {
        console.error('Error loading summary:', error);
      }
    });
  }
}


