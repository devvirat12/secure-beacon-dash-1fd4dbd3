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
