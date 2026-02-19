export interface UserProfile {
  userId: string;
  name: string;
  monthlySalary: number;
  avgTransactionAmount: number;
  avgMonthlySpend: number;
  weeklyTransactionFrequency: number;
  usualCities: string[];
  typicalSpendingRange: { min: number; max: number };
  mostFrequentCity: string;
  normalSpendingHours: string;
  incomeVsSpendRatio: number;
}

export type RiskLevel = "SAFE" | "WARNING" | "HIGH_RISK";
export type TransactionStatus = "Pending" | "Analyzed" | "Confirmed Legit" | "Fraud";

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
  confidenceScore?: number;
}

export interface RiskTrendPoint {
  date: string;
  score: number;
}

// --- Indian UPI Dataset Types ---

export interface UpiIdInfo {
  upiId: string;
  creationDate: string;
  ageDays: number;
}

export interface HistoricalTransaction {
  transactionId: string;
  userId: string;
  amount: number;
  timestamp: string;
  city: string;
  upiId: string;
  category: string;
  paymentLink?: string;
}

export interface DatasetUser {
  userId: string;
  name: string;
  monthlySalary: number;
  avgTransactionAmount: number;
  avgMonthlySpend: number;
  avgWeeklyFrequency: number;
  usualCities: string[];
  usualUpiIds: string[];
  transactionHistory: HistoricalTransaction[];
  // Enhanced features
  accountAgeDays: number;
  deviceFingerprints: string[];
  historicalFraudCount: number;
  profileType: "salaried" | "business" | "student" | "high_spender" | "low_spender";
}

export interface DeviationMetrics {
  amountDeviation: number;
  monthlySpendRatio: number;
  locationFlag: boolean;
  frequencySpike: boolean;
  isFirstTimeBeneficiary: boolean;
  upiAgeDays: number;
  upiAgeFlag: boolean;
  isPaymentLink: boolean;
  linkRisk: "trusted" | "unknown" | "new" | "none";
  isNightTransaction: boolean;
  // Enhanced features
  deviceChangeFlag: boolean;
  rapidSmallTransactionsFlag: boolean;
  geoVelocityFlag: boolean;
  beneficiaryRiskScore: number;
  accountAgeDays: number;
  transactionTimeRisk: number;
  historicalFraudExposureFlag: boolean;
  salaryRatio: number;
  // New features
  behavioralDriftScore: number;
  linkRiskScore: number;
  linkDeepInspection?: LinkDeepInspection;
  previousCity?: string;
  previousTimestamp?: string;
}

export interface LinkDeepInspection {
  domain: string;
  isShortened: boolean;
  hasSuspiciousKeywords: boolean;
  lookalikeSimilarity: number;
  lookalikeDomain?: string;
  domainAgeSimDays: number;
  linkRiskScore: number;
}

export interface ScoringResult extends AnalysisResult {
  metrics: DeviationMetrics;
  // Enhanced ML breakdown
  anomalyScore: number;
  fraudProbability: number;
  confidenceScore: number;
}

export interface LiveTransaction extends Transaction {
  userId: string;
  upiId?: string;
  paymentLink?: string;
  metrics?: DeviationMetrics;
}
