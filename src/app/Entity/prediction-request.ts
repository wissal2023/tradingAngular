export interface PredictionRequest {
    symbol: string;
    startDate: string;
    endDate: string;
    predictionTimeframe: number;
    timeframeUnit: 'DAYS' | 'WEEKS' | 'MONTHS';
  }