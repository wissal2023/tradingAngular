import { RiskMetrics } from "./risk-metrics";
import { StockData } from "./stock-data";
export interface RiskAnalyzer {
    stockData: StockData[];
    annualRiskFreeRate: number;
    calculateRiskMetrics(): RiskMetrics;
    calculateVolatility(): number;
    calculateValueAtRisk(): number;
    calculateMaxDrawdown(): number;
    calculateBeta(): number;
    calculateSharpeRatio(): number;
    calculateSortinoRatio(): number;
    calculateCVaR(): number;
    calculateCalmarRatio(): number;
    calculateDailyReturns(): number[];
}
