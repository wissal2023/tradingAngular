export interface StreakAnalysis {
    maxWinStreak: number;
    maxLossStreak: number;
    avgWinStreak: number;
    avgLossStreak: number;
    currentStreak: number;
    streakDistribution: number[];
  }
