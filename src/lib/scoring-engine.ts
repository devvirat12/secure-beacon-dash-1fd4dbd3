import { DatasetUser, ScoringResult, RiskLevel, DeviationMetrics, UpiIdInfo } from "./types";

const trustedDomains = ["razorpay", "paytm", "phonepe", "gpay", "bhim", "sbi", "hdfc", "icici", "axis"];

function classifyLinkRisk(link?: string): "trusted" | "unknown" | "new" | "none" {
  if (!link) return "none";
  const lower = link.toLowerCase();
  if (trustedDomains.some((d) => lower.includes(d))) return "trusted";
  if (lower.includes("bit.ly") || lower.includes("tinyurl") || lower.includes("shorturl")) return "new";
  return "unknown";
}

/**
 * Compute behavioral deviation metrics for a transaction against a user's profile.
 */
export function computeDeviations(
  amount: number,
  city: string,
  upiId: string,
  upiInfo: UpiIdInfo,
  user: DatasetUser,
  recentTxnCountLastHour: number = 0,
  paymentLink?: string,
  timestamp?: string
): DeviationMetrics {
  const amountDeviation = user.avgTransactionAmount > 0 ? amount / user.avgTransactionAmount : 0;
  const monthlySpendRatio = user.avgMonthlySpend > 0 ? (user.avgMonthlySpend + amount) / user.avgMonthlySpend : 0;

  const locationFlag = !user.usualCities.some(
    (c) => city.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(city.toLowerCase())
  );

  const avgDailyFrequency = user.avgWeeklyFrequency / 7;
  const frequencySpike = recentTxnCountLastHour > avgDailyFrequency;

  const isFirstTimeBeneficiary = !user.usualUpiIds.some(
    (id) => id.toLowerCase() === upiId.toLowerCase()
  );

  const upiAgeDays = upiInfo.ageDays;
  const upiAgeFlag = upiAgeDays < 30;

  const isPaymentLink = !!paymentLink;
  const linkRisk = classifyLinkRisk(paymentLink);

  // Night transaction check (2AM - 5AM IST)
  let isNightTransaction = false;
  if (timestamp) {
    const hour = new Date(timestamp).getUTCHours();
    const istHour = (hour + 5) % 24; // Rough IST offset
    isNightTransaction = istHour >= 2 && istHour < 5;
  }

  return {
    amountDeviation,
    monthlySpendRatio,
    locationFlag,
    frequencySpike,
    isFirstTimeBeneficiary,
    upiAgeDays,
    upiAgeFlag,
    isPaymentLink,
    linkRisk,
    isNightTransaction,
  };
}

/**
 * Rule-based scoring for Indian UPI context.
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
    reasons.push(`Transaction ${metrics.amountDeviation.toFixed(1)}x higher than user average (₹${user.avgTransactionAmount.toLocaleString("en-IN")})`);
  }

  // Rule 2: City anomaly
  if (metrics.locationFlag) {
    ruleScore += 20;
    reasons.push(`City not in user's usual locations (${user.usualCities.join(", ")})`);
  }

  // Rule 3: Amount > 60% monthly salary
  if (amount > user.monthlySalary * 0.6) {
    const pct = Math.round((amount / user.monthlySalary) * 100);
    ruleScore += 25;
    reasons.push(`Amount equals ${pct}% of monthly salary (₹${user.monthlySalary.toLocaleString("en-IN")})`);
  }

  // Rule 4: Frequency spike
  if (metrics.frequencySpike) {
    ruleScore += 15;
    reasons.push("Frequency spike: unusual number of UPI transfers in the last hour");
  }

  // Rule 5: Night transaction (2AM–5AM IST)
  if (metrics.isNightTransaction) {
    ruleScore += 15;
    reasons.push("Transaction initiated between 2AM–5AM IST (unusual hours)");
  }

  return { ruleScore: Math.min(ruleScore, 100), reasons };
}

/**
 * ML anomaly scoring with UPI-specific features.
 */
export function computeMLScore(metrics: DeviationMetrics): { mlScore: number; mlReasons: string[] } {
  const mlReasons: string[] = [];

  const amountComponent = Math.min(metrics.amountDeviation * 12, 30);
  const locationComponent = metrics.locationFlag ? 10 : 0;
  const firstBeneficiaryComponent = metrics.isFirstTimeBeneficiary ? 25 : 0;
  const upiAgeComponent = metrics.upiAgeDays < 7 ? 25 : metrics.upiAgeDays < 30 ? 15 : 0;
  const paymentLinkComponent = metrics.isPaymentLink ? 20 : 0;

  if (metrics.isFirstTimeBeneficiary) mlReasons.push("First-time transfer to this UPI beneficiary");
  if (metrics.upiAgeDays < 7) mlReasons.push(`UPI ID created only ${metrics.upiAgeDays} days ago (potential mule account)`);
  else if (metrics.upiAgeDays < 30) mlReasons.push(`UPI ID is ${metrics.upiAgeDays} days old (recently created)`);
  if (metrics.isPaymentLink) {
    const riskLabel = metrics.linkRisk === "new" ? "suspicious shortened" : metrics.linkRisk === "unknown" ? "unknown domain" : "payment";
    mlReasons.push(`Payment initiated via ${riskLabel} link`);
  }

  const mlScore = Math.round(Math.min(amountComponent + locationComponent + firstBeneficiaryComponent + upiAgeComponent + paymentLinkComponent, 100));
  return { mlScore, mlReasons };
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
 * Full scoring pipeline for Indian UPI transactions.
 */
export function scoreTransaction(
  transactionId: string,
  amount: number,
  city: string,
  upiId: string,
  upiInfo: UpiIdInfo,
  user: DatasetUser,
  recentTxnCountLastHour: number = 0,
  paymentLink?: string,
  timestamp?: string
): ScoringResult {
  const metrics = computeDeviations(amount, city, upiId, upiInfo, user, recentTxnCountLastHour, paymentLink, timestamp);
  const { ruleScore, reasons } = computeRuleScore(amount, user, metrics);
  const { mlScore, mlReasons } = computeMLScore(metrics);
  const finalScore = computeFinalScore(ruleScore, mlScore);
  const riskLevel = getRiskLevel(finalScore);

  const allReasons = [...reasons, ...mlReasons];
  if (allReasons.length === 0) {
    allReasons.push("Transaction matches user's typical UPI spending pattern");
  }

  return {
    transactionId,
    riskScore: finalScore,
    riskLevel,
    ruleScore,
    mlScore,
    behavioralScore: Math.round((ruleScore + mlScore) / 2),
    reasons: allReasons,
    action: finalScore >= 50 ? "CONFIRMATION_REQUIRED" : "ALLOW",
    metrics,
  };
}
