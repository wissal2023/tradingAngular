export interface PredictionResponse {
    symbol: string;
    predictionDate: string;  // Use string for date serialization
    targetDate: string;      // Use string for date serialization
    priceGoingUp: boolean;
    direction: string;
    technicalIndicators: Map<string, number>;
    confidenceScore: number;
  }