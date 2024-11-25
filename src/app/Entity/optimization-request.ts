import { OptimizationPreferences } from "./optimization-preferences";

export interface OptimizationRequest {
    symbol: string;
    startDate: Date;
    endDate: Date;
    strategyType: string;
    preferences: OptimizationPreferences;
  }