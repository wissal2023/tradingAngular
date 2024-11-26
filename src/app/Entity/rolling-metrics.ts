export interface RollingMetrics {
    dates: Date[];                
    returns: number[];
    volatilities: number[];
    sharpeRatios: number[];
    drawdowns: number[];
    efficiencyRatios: { [key: string]: number };  
  }
