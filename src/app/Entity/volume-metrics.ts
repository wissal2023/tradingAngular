export interface VolumeMetrics {
    averageVolume: number;
    volumeVolatility: number;
    volumeTrend: number;
    volumeSpikeDates: Date[];
    volumeMomentum: number;
    priceVolumeCorrelation: number;
    volumeDistribution: { [key: string]: number }; 
  }
