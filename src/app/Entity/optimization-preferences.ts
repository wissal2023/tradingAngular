export interface OptimizationPreferences {
    volatilityThreshold: number;
    maxDrawdownThreshold: number;
    minSharpeRatio: number;
    riskFreeRate: number;
    adaptToMarketConditions: boolean;
    metricWeights: {
      [key: string]: number;
    };
  }