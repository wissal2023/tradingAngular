import { Component, OnInit } from '@angular/core';
import { Quiz } from 'src/app/Entity/quiz';
import { QuizService } from 'src/app/Services/quiz.service';
@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements OnInit {
  quizzes: Quiz[] = [];
  userId = 1; // Get this from your auth service

  constructor(private quizService: QuizService) {}

  ngOnInit() {
    this.loadQuizzes();
  }

  loadQuizzes() {
    this.quizService.getAvailableQuizzes(this.userId).subscribe({
      next: (quizzes) => {
        this.quizzes = quizzes;
      },
      error: (error) => {
        console.error('Error loading quizzes:', error);
      }
    });
  }
}