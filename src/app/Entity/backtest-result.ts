export interface BacktestResult {
    initialCapital: number;
    finalCapital: number;
    totalReturn: number;
    winRate: number;
    maxDrawdown: number;
    totalTrades: number;
    userId: number;
    trades: Array<{
      date: string;
      action: string;
      shares: number;
      price: number;
    }>;
    performanceData?: Array<{
      date: string;
      portfolioValue: number;
    }>;
  }
