import { FeedbackResponse } from "./feedback-response";
import { OptimizationResult } from "./optimization-result";
import { RollingMetrics } from "./rolling-metrics";
import { StreakAnalysis } from "./streak-analysis";
export interface OptimizationResponse {
    parameters: { [key: string]: any };       
    performanceMetrics: { [key: string]: number };
    marketConditions: { [key: string]: number };   
    optimizationResult: OptimizationResult;
    feedback: FeedbackResponse;
    rollingMetrics: RollingMetrics;
    streakAnalysis: StreakAnalysis;
    indicators?: { [key: string]: number };
  }
