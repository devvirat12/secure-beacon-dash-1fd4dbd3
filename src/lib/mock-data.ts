import { UserProfile, Transaction, RiskTrendPoint, AnalysisResult } from "./types";

export const mockUser: UserProfile = {
  userId: "IND-001",
  name: "Priya Sharma",
  monthlySalary: 75000,
  avgTransactionAmount: 1200,
  avgMonthlySpend: 45000,
  weeklyTransactionFrequency: 14,
  usualCities: ["Chennai", "Bangalore", "Coimbatore"],
  typicalSpendingRange: { min: 200, max: 5000 },
  mostFrequentCity: "Chennai",
  normalSpendingHours: "9 AM – 9 PM IST",
  incomeVsSpendRatio: 0.60,
};

export const mockTransactions: Transaction[] = [
  { id: "txn-001", date: "2026-02-19T10:30:00Z", amount: 850, location: "Chennai", riskScore: 12, riskLevel: "SAFE", status: "Confirmed Legit" },
  { id: "txn-002", date: "2026-02-18T14:15:00Z", amount: 2499, location: "Bangalore", riskScore: 18, riskLevel: "SAFE", status: "Confirmed Legit" },
  { id: "txn-003", date: "2026-02-17T09:45:00Z", amount: 1500, location: "Chennai", riskScore: 22, riskLevel: "SAFE", status: "Confirmed Legit" },
  { id: "txn-004", date: "2026-02-16T22:30:00Z", amount: 8500, location: "Delhi", riskScore: 58, riskLevel: "WARNING", status: "Pending" },
  { id: "txn-005", date: "2026-02-15T03:10:00Z", amount: 45000, location: "Imphal", riskScore: 87, riskLevel: "HIGH_RISK", status: "Pending" },
];

export const mockRiskTrend: RiskTrendPoint[] = [
  { date: "Feb 13", score: 15 },
  { date: "Feb 14", score: 12 },
  { date: "Feb 15", score: 87 },
  { date: "Feb 16", score: 58 },
  { date: "Feb 17", score: 22 },
  { date: "Feb 18", score: 18 },
  { date: "Feb 19", score: 12 },
];

export function generateDemoAnalysis(amount: number, location: string): AnalysisResult {
  const isHighRisk = amount > 10000 || !mockUser.usualCities.some(l => location.toLowerCase().includes(l.toLowerCase()));
  const isWarning = amount > 5000 || !mockUser.usualCities.some(l => location.toLowerCase().includes(l.toLowerCase()));

  const riskScore = isHighRisk ? 75 + Math.floor(Math.random() * 20) : isWarning ? 50 + Math.floor(Math.random() * 18) : 10 + Math.floor(Math.random() * 25);

  const reasons: string[] = [];
  if (amount > mockUser.avgTransactionAmount * 3) reasons.push(`Transaction ${Math.round(amount / mockUser.avgTransactionAmount)}x higher than your average`);
  if (!mockUser.usualCities.some(l => location.toLowerCase().includes(l.toLowerCase()))) reasons.push("City not seen in your UPI transaction history");
  if (amount > mockUser.monthlySalary * 0.5) reasons.push(`Amount equals ${Math.round((amount / mockUser.monthlySalary) * 100)}% of your monthly salary`);
  if (reasons.length === 0) reasons.push("Transaction matches your typical UPI spending pattern");

  const riskLevel = riskScore >= 70 ? "HIGH_RISK" : riskScore >= 50 ? "WARNING" : "SAFE";

  return {
    transactionId: `txn-${Date.now()}`,
    riskScore,
    riskLevel,
    ruleScore: Math.min(100, riskScore + Math.floor(Math.random() * 15)),
    mlScore: Math.max(0, riskScore - Math.floor(Math.random() * 10)),
    behavioralScore: riskScore + Math.floor(Math.random() * 10 - 5),
    reasons,
    action: riskScore >= 60 ? "CONFIRMATION_REQUIRED" : "ALLOW",
  };
}
