import { OptimizationResult } from "./optimization-result";
import { ParameterSet } from "./parameter-set";
import { RiskMetrics } from "./risk-metrics";
export interface OptimizationOutcome {
    parameters: ParameterSet;      
    result: OptimizationResult;    
    score: number;                 
    riskMetrics: RiskMetrics;      
  }