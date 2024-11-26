import { Component, OnInit } from '@angular/core';
import { QuizResponse } from '../Entity/quiz-response';
import { Quiz } from '../Entity/quiz';
import { QuizService } from '../Services/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quiz?: Quiz;
  selectedAnswer: string = '';
  quizResponse?: QuizResponse;
  submitted = false;
  error: string | null = null;
  userId: number | null = null;

  constructor(
    private quizService: QuizService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Get the current user ID from AuthService
    this.authService.currentUser.subscribe(user => {
      this.userId = user ? user.id : null;
    });
  }

  ngOnInit() {
    const quizId = this.route.snapshot.params['id'];
    
    // Ensure user is authenticated before loading quiz
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadQuiz(Number(quizId));
  }

  loadQuiz(quizId: number) {
    if (!this.userId) return;

    this.quizService.getAvailableQuizzes(this.userId).subscribe({
      next: (quizzes) => {
        this.quiz = quizzes.find(q => q.id === quizId);
        if (!this.quiz) {
          this.router.navigate(['/quizzes']);
        }
      },
      error: (error) => {
        this.handleError(error);
        this.router.navigate(['/quizzes']);
      }
    });
  }

  submitAnswer() {
    if (!this.quiz || !this.selectedAnswer || !this.userId) return;

    this.quizService.submitAnswer(this.quiz.id, this.userId, this.selectedAnswer).subscribe({
      next: (response) => {
        this.quizResponse = response;
        this.submitted = true;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }
  private handleError(error: any): void {
    console.error('Quiz error:', error);
    
    if (error?.error?.error) {
      this.error = error.error.error;
    } else if (error?.message) {
      if (error.message === 'Unauthorized - Please log in again') {
        this.authService.logout();
        this.router.navigate(['/login']);
        return;
      }
      this.error = error.message;
    } else {
      this.error = 'An unexpected error occurred. Please try again.';
    }
  }
}
