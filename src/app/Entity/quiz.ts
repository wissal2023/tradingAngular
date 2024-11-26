export interface Quiz {
    id: number;
    question: string;
    options: string[];
    category: string;
    pointsValue: number;
    completed: boolean;
    completedAt?: Date;
  }