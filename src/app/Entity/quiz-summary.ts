export interface QuizSummary {
    totalQuizzesTaken: number;
    totalPointsEarned: number;
    correctAnswers: number;
    incorrectAnswers: number;
    accuracy: number;
    pointsByCategory: { [key: string]: number };
  }
