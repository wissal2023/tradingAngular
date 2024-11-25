// challenge.model.ts
export class Challenge {
    id?: number;
    startDate?: Date;
    endDate?: Date;
    minimumTradingDays?: number;
    leverage?: string;
    profitTarget?: string;
    maxLoss?: string;
    maxDailyLoss?: string;
    payoutExpress?: string;
    profitBooster?: string;
    tradeTheNews?: string;
    weekendTrading?: string;
    eaEnabled?: string;
    refundableFees?: string;
    category?: Category;
  }
  export enum Category {
    CRYPTOCURRENCY = 'CRYPTOCURRENCY',
    INTANGIBLES = 'INTANGIBLES',
    OBLIGATIONS = 'OBLIGATIONS'
  }
  
  