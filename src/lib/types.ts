export interface UserProfile {
  userId: string;
  monthlyIncome: number;
  avgTransactionAmount: number;
  avgMonthlySpend: number;
  weeklyTransactionFrequency: number;
  usualLocations: string[];
  typicalSpendingRange: { min: number; max: number };
  mostFrequentLocation: string;
  normalSpendingHours: string;
  incomeVsSpendRatio: number;
}

export type RiskLevel = "SAFE" | "WARNING" | "HIGH_RISK";
export type TransactionStatus = "Pending" | "Confirmed Legit" | "Fraud";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  location: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: TransactionStatus;
}

export interface AnalysisResult {
  transactionId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  ruleScore: number;
  mlScore: number;
  behavioralScore: number;
  reasons: string[];
  action: "ALLOW" | "CONFIRMATION_REQUIRED" | "BLOCK";
}

export interface RiskTrendPoint {
  date: string;
  score: number;
}

// --- Dataset-driven types ---

export interface HistoricalTransaction {
  transactionId: string;
  userId: string;
  amount: number;
  timestamp: string;
  location: string;
  category: string;
}

export interface DatasetUser {
  userId: string;
  monthlyIncome: number;
  avgTransactionAmount: number;
  avgMonthlySpend: number;
  avgWeeklyFrequency: number;
  usualLocations: string[];
  transactionHistory: HistoricalTransaction[];
}

export interface DeviationMetrics {
  amountDeviation: number;
  monthlySpendRatio: number;
  locationFlag: boolean;
  frequencySpike: boolean;
}

export interface ScoringResult extends AnalysisResult {
  metrics: DeviationMetrics;
}

export interface LiveTransaction extends Transaction {
  userId: string;
  metrics?: DeviationMetrics;
}
