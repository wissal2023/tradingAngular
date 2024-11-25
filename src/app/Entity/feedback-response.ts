import { RiskAssessment } from "./risk-assessment";

export interface FeedbackResponse {
    overallAssessment: string;
    recommendations: string[];
    metricAnalysis: { [key: string]: string };
    riskAssessment: RiskAssessment;
  }
