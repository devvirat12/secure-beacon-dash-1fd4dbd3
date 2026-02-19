import { DatasetUser, ScoringResult, RiskLevel } from "./types";

export interface DeviationMetrics {
  amountDeviation: number;
  monthlySpendRatio: number;
  locationFlag: boolean;
  frequencySpike: boolean;
}

/**
 * Compute behavioral deviation metrics for a transaction against a user's profile.
 */
export function computeDeviations(
  amount: number,
  location: string,
  user: DatasetUser,
  recentTxnCountLastHour: number = 0
): DeviationMetrics {
  const amountDeviation = user.avgTransactionAmount > 0 ? amount / user.avgTransactionAmount : 0;

  // Estimate current month spend as avgMonthlySpend + this transaction
  const monthlySpendRatio = user.avgMonthlySpend > 0 ? (user.avgMonthlySpend + amount) / user.avgMonthlySpend : 0;

  const locationFlag = !user.usualLocations.some(
    (loc) => location.toLowerCase().includes(loc.toLowerCase()) || loc.toLowerCase().includes(location.toLowerCase())
  );

  const avgDailyFrequency = user.avgWeeklyFrequency / 7;
  const frequencySpike = recentTxnCountLastHour > avgDailyFrequency;

  return { amountDeviation, monthlySpendRatio, locationFlag, frequencySpike };
}

/**
 * Rule-based scoring: each rule adds 0–25 points, max 100.
 */
export function computeRuleScore(
  amount: number,
  user: DatasetUser,
  metrics: DeviationMetrics
): { ruleScore: number; reasons: string[] } {
  let ruleScore = 0;
  const reasons: string[] = [];

  // Rule 1: Amount deviation > 3x
  if (metrics.amountDeviation > 3) {
    const points = Math.min(Math.round(metrics.amountDeviation * 5), 25);
    ruleScore += points;
    reasons.push(`Transaction ${metrics.amountDeviation.toFixed(1)}x higher than user average ($${user.avgTransactionAmount})`);
  }

  // Rule 2: Location anomaly
  if (metrics.locationFlag) {
    ruleScore += 25;
    reasons.push(`Location not in user's usual locations (${user.usualLocations.join(", ")})`);
  }

  // Rule 3: Amount > 50% monthly income
  if (amount > user.monthlyIncome * 0.5) {
    const pct = Math.round((amount / user.monthlyIncome) * 100);
    ruleScore += 25;
    reasons.push(`Amount equals ${pct}% of monthly income ($${user.monthlyIncome.toLocaleString()})`);
  }

  // Rule 4: Frequency spike
  if (metrics.frequencySpike) {
    ruleScore += 15;
    reasons.push("Frequency spike: unusual number of transactions in the last hour");
  }

  return { ruleScore: Math.min(ruleScore, 100), reasons };
}

/**
 * Simulated ML anomaly scoring using weighted deviations.
 * ml_score = min(amount_deviation * 12, 30) + (location_flag ? 20 : 0) + min(monthly_spend_ratio * 10, 25)
 */
export function computeMLScore(metrics: DeviationMetrics): number {
  const amountComponent = Math.min(metrics.amountDeviation * 12, 30);
  const locationComponent = metrics.locationFlag ? 20 : 0;
  const spendComponent = Math.min(metrics.monthlySpendRatio * 10, 25);
  return Math.round(Math.min(amountComponent + locationComponent + spendComponent, 100));
}

/**
 * Final risk score = (rule_score × 0.6) + (ml_score × 0.4)
 */
export function computeFinalScore(ruleScore: number, mlScore: number): number {
  return Math.round(ruleScore * 0.6 + mlScore * 0.4);
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return "HIGH_RISK";
  if (score >= 50) return "WARNING";
  return "SAFE";
}

/**
 * Full scoring pipeline: takes a transaction + user profile, returns complete result.
 */
export function scoreTransaction(
  transactionId: string,
  amount: number,
  location: string,
  user: DatasetUser,
  recentTxnCountLastHour: number = 0
): ScoringResult {
  const metrics = computeDeviations(amount, location, user, recentTxnCountLastHour);
  const { ruleScore, reasons } = computeRuleScore(amount, user, metrics);
  const mlScore = computeMLScore(metrics);
  const finalScore = computeFinalScore(ruleScore, mlScore);
  const riskLevel = getRiskLevel(finalScore);

  if (reasons.length === 0) {
    reasons.push("Transaction matches user's typical spending pattern");
  }

  if (mlScore > 30) {
    reasons.push(`ML anomaly score elevated (${mlScore}/100)`);
  }

  return {
    transactionId,
    riskScore: finalScore,
    riskLevel,
    ruleScore,
    mlScore,
    behavioralScore: Math.round((ruleScore + mlScore) / 2),
    reasons,
    action: finalScore >= 50 ? "CONFIRMATION_REQUIRED" : "ALLOW",
    metrics,
  };
}
