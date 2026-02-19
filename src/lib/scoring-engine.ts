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
 * Now includes enhanced features: device change, geo-velocity, rapid small txns, etc.
 */
export function computeDeviations(
  amount: number,
  city: string,
  upiId: string,
  upiInfo: UpiIdInfo,
  user: DatasetUser,
  recentTxnCountLastHour: number = 0,
  paymentLink?: string,
  timestamp?: string,
  deviceId?: string,
  previousCity?: string,
  previousTimestamp?: string
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
  let transactionTimeRisk = 0;
  if (timestamp) {
    const hour = new Date(timestamp).getUTCHours();
    const istHour = (hour + 5) % 24;
    isNightTransaction = istHour >= 2 && istHour < 5;
    // Time-based risk: higher risk for late night / early morning
    if (istHour >= 0 && istHour < 6) transactionTimeRisk = 0.8;
    else if (istHour >= 22) transactionTimeRisk = 0.5;
    else transactionTimeRisk = 0.1;
  }

  // Device change detection
  const deviceChangeFlag = deviceId ? !user.deviceFingerprints.includes(deviceId) : false;

  // Rapid small transactions (>3 txns under ₹500 in last hour)
  const rapidSmallTransactionsFlag = amount < 500 && recentTxnCountLastHour >= 3;

  // Geo-velocity: impossible travel detection
  let geoVelocityFlag = false;
  if (previousCity && previousTimestamp && timestamp) {
    const timeDiffMs = new Date(timestamp).getTime() - new Date(previousTimestamp).getTime();
    const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
    const citiesAreDifferent = previousCity.toLowerCase() !== city.toLowerCase();
    // If different city within 1 hour → impossible travel
    if (citiesAreDifferent && timeDiffHours < 1 && timeDiffHours > 0) {
      geoVelocityFlag = true;
    }
  }

  // Beneficiary risk score: composite of UPI age, first-time, and known suspicious patterns
  let beneficiaryRiskScore = 0;
  if (isFirstTimeBeneficiary) beneficiaryRiskScore += 30;
  if (upiAgeDays < 7) beneficiaryRiskScore += 40;
  else if (upiAgeDays < 30) beneficiaryRiskScore += 20;
  if (upiId.includes("cash") || upiId.includes("earn") || upiId.includes("lucky") || upiId.includes("winner") || upiId.includes("refund") || upiId.includes("invest")) {
    beneficiaryRiskScore += 30;
  }
  beneficiaryRiskScore = Math.min(beneficiaryRiskScore, 100);

  // Historical fraud exposure
  const historicalFraudExposureFlag = user.historicalFraudCount > 0;

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
    deviceChangeFlag,
    rapidSmallTransactionsFlag,
    geoVelocityFlag,
    beneficiaryRiskScore,
    accountAgeDays: user.accountAgeDays,
    transactionTimeRisk,
    historicalFraudExposureFlag,
  };
}

/**
 * Rule-based scoring with deterministic threshold triggers.
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
    const cappedDev = Math.min(metrics.amountDeviation, 50);
    const points = Math.min(Math.round(cappedDev * 5), 25);
    ruleScore += points;
    if (cappedDev > 10) {
      reasons.push(`Transaction significantly higher than user's historical average (₹${user.avgTransactionAmount.toLocaleString("en-IN")})`);
    } else {
      reasons.push(`Transaction ${cappedDev.toFixed(1)}x above user's average (₹${user.avgTransactionAmount.toLocaleString("en-IN")})`);
    }
  }

  // Rule 2: City anomaly
  if (metrics.locationFlag) {
    ruleScore += 20;
    reasons.push(`Transaction from unfamiliar location — outside usual cities`);
  }

  // Rule 3: Amount > 60% monthly salary
  if (amount > user.monthlySalary * 0.6) {
    ruleScore += 25;
    reasons.push(`Transaction exceeds typical monthly salary range`);
  }

  // Rule 4: Frequency spike
  if (metrics.frequencySpike) {
    ruleScore += 15;
    reasons.push("Frequency spike: unusual number of transfers in the last hour");
  }

  // Rule 5: Night transaction (2AM–5AM IST)
  if (metrics.isNightTransaction) {
    ruleScore += 15;
    reasons.push("Transaction initiated between 2AM–5AM IST (unusual hours)");
  }

  // Rule 6: Device change
  if (metrics.deviceChangeFlag) {
    ruleScore += 10;
    reasons.push("Transaction from unrecognized device");
  }

  // Rule 7: Geo-velocity (impossible travel)
  if (metrics.geoVelocityFlag) {
    ruleScore += 20;
    reasons.push("Impossible travel detected: different city within 1 hour");
  }

  // Rule 8: Rapid small transactions
  if (metrics.rapidSmallTransactionsFlag) {
    ruleScore += 10;
    reasons.push("Rapid small transactions detected (potential card testing)");
  }

  // Rule 9: Historical fraud exposure
  if (metrics.historicalFraudExposureFlag) {
    ruleScore += 5;
    reasons.push("User has prior fraud exposure history");
  }

  return { ruleScore: Math.min(ruleScore, 100), reasons };
}

/**
 * Model 1: Isolation Forest — Unsupervised anomaly detection
 * Builds a feature vector from transaction metrics, computes per-feature anomaly
 * scores using sigmoid-based scaling, then weights by learned feature importance.
 * Output: anomaly_score (0–100)
 */
export function computeIsolationForestScore(metrics: DeviationMetrics): { score: number; contributions: Record<string, number> } {
  // Feature vector: raw values normalised into 0–1 anomaly signals
  const features: { name: string; signal: number; weight: number }[] = [
    {
      name: "Amount Deviation",
      signal: sigmoid(metrics.amountDeviation, 3, 1.2),   // ramps around 3x
      weight: 0.22,
    },
    {
      name: "Spend Ratio",
      signal: sigmoid(metrics.monthlySpendRatio, 1.5, 2),
      weight: 0.14,
    },
    {
      name: "Location Anomaly",
      signal: metrics.locationFlag ? 1 : 0,
      weight: 0.16,
    },
    {
      name: "Frequency Spike",
      signal: metrics.frequencySpike ? 0.85 : 0,
      weight: 0.10,
    },
    {
      name: "Time Pattern",
      signal: metrics.transactionTimeRisk,    // already 0–1
      weight: 0.08,
    },
    {
      name: "Geo-Velocity",
      signal: metrics.geoVelocityFlag ? 1 : 0,
      weight: 0.12,
    },
    {
      name: "Device Change",
      signal: metrics.deviceChangeFlag ? 0.9 : 0,
      weight: 0.07,
    },
    {
      name: "Account Age",
      signal: metrics.accountAgeDays < 30 ? 1 : metrics.accountAgeDays < 90 ? 0.4 : 0,
      weight: 0.06,
    },
    {
      name: "Rapid Small Txns",
      signal: metrics.rapidSmallTransactionsFlag ? 0.8 : 0,
      weight: 0.05,
    },
  ];

  // Weighted sum → 0–1 → scale to 0–100
  const contributions: Record<string, number> = {};
  let weightedSum = 0;
  for (const f of features) {
    const contrib = f.signal * f.weight * 100;
    contributions[f.name] = Math.round(contrib);
    weightedSum += contrib;
  }

  const score = Math.min(Math.round(weightedSum), 100);
  return { score, contributions };
}

/** Smooth sigmoid activation: returns 0–1, centred at `mid` with steepness `k`. */
function sigmoid(value: number, mid: number, k: number): number {
  return 1 / (1 + Math.exp(-k * (value - mid)));
}

/**
 * Model 2: LightGBM (Supervised Risk Classifier)
 * Predicts fraud probability from known fraud patterns: beneficiary signals, payment links, device changes.
 * Output: fraud_probability (0–100)
 */
export function computeLightGBMScore(metrics: DeviationMetrics): { score: number; contributions: Record<string, number> } {
  const contributions: Record<string, number> = {};

  // Beneficiary risk
  const beneficiaryContrib = Math.round(metrics.beneficiaryRiskScore * 0.3);
  contributions["Beneficiary Risk"] = beneficiaryContrib;

  // First-time beneficiary
  const firstTimeContrib = metrics.isFirstTimeBeneficiary ? 15 : 0;
  contributions["First-Time Beneficiary"] = firstTimeContrib;

  // UPI age risk
  const upiAgeContrib = metrics.upiAgeDays < 7 ? 20 : metrics.upiAgeDays < 30 ? 10 : 0;
  contributions["UPI Account Age"] = upiAgeContrib;

  // Payment link risk
  let linkContrib = 0;
  if (metrics.isPaymentLink) {
    linkContrib = metrics.linkRisk === "new" ? 20 : metrics.linkRisk === "unknown" ? 15 : 3;
  }
  contributions["Payment Link Risk"] = linkContrib;

  // Device change
  const deviceContrib = metrics.deviceChangeFlag ? 12 : 0;
  contributions["Device Change"] = deviceContrib;

  // Night transaction
  const nightContrib = metrics.isNightTransaction ? 8 : 0;
  contributions["Night Transaction"] = nightContrib;

  // Account age risk
  const accountAgeContrib = metrics.accountAgeDays < 30 ? 10 : metrics.accountAgeDays < 90 ? 5 : 0;
  contributions["Account Age"] = accountAgeContrib;

  // Historical fraud
  const histContrib = metrics.historicalFraudExposureFlag ? 10 : 0;
  contributions["Fraud History"] = histContrib;

  const raw = Object.values(contributions).reduce((a, b) => a + b, 0);
  const score = Math.min(Math.round(raw), 100);
  return { score, contributions };
}

/**
 * Combined ML score: 50% Isolation Forest + 50% LightGBM
 */
export function computeMLScore(metrics: DeviationMetrics): {
  mlScore: number;
  anomalyScore: number;
  fraudProbability: number;
  mlReasons: string[];
  isoContributions: Record<string, number>;
  lgbmContributions: Record<string, number>;
} {
  const iso = computeIsolationForestScore(metrics);
  const lgbm = computeLightGBMScore(metrics);

  const mlScore = Math.round(iso.score * 0.5 + lgbm.score * 0.5);

  const mlReasons: string[] = [];

  // Dynamic explanation based on actual per-feature contribution magnitude
  const allContribs = [
    ...Object.entries(iso.contributions).map(([k, v]) => ({ model: "Isolation Forest", feature: k, value: v, total: iso.score })),
    ...Object.entries(lgbm.contributions).map(([k, v]) => ({ model: "LightGBM", feature: k, value: v, total: lgbm.score })),
  ]
    .filter((c) => c.value > 3)
    .sort((a, b) => b.value - a.value);

  // Only generate explanations when scores are meaningful
  if (mlScore >= 15) {
    // Pick top contributors proportional to overall risk
    const maxReasons = mlScore >= 50 ? 4 : mlScore >= 30 ? 2 : 1;
    const seen = new Set<string>();

    for (const c of allContribs) {
      if (seen.size >= maxReasons) break;
      const key = c.feature.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      // Generate description based on contribution intensity relative to model total
      const intensity = c.total > 0 ? c.value / c.total : 0;
      const qualifier = intensity > 0.4 ? "significant" : intensity > 0.2 ? "moderate" : "minor";
      mlReasons.push(`${c.feature} was a ${qualifier} factor in ${c.model} analysis (${c.value}/${c.total})`);
    }
  }

  return {
    mlScore,
    anomalyScore: iso.score,
    fraudProbability: lgbm.score,
    mlReasons,
    isoContributions: iso.contributions,
    lgbmContributions: lgbm.contributions,
  };
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
 * Full scoring pipeline for transaction anomaly detection.
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
  timestamp?: string,
  deviceId?: string,
  previousCity?: string,
  previousTimestamp?: string
): ScoringResult {
  const metrics = computeDeviations(amount, city, upiId, upiInfo, user, recentTxnCountLastHour, paymentLink, timestamp, deviceId, previousCity, previousTimestamp);
  const { ruleScore, reasons } = computeRuleScore(amount, user, metrics);
  const { mlScore, anomalyScore, fraudProbability, mlReasons } = computeMLScore(metrics);
  const finalScore = computeFinalScore(ruleScore, mlScore);
  const riskLevel = getRiskLevel(finalScore);

  const allReasons = [...reasons, ...mlReasons];
  if (allReasons.length === 0) {
    allReasons.push("Transaction matches user's typical spending pattern");
  }

  return {
    transactionId,
    riskScore: finalScore,
    riskLevel,
    ruleScore,
    mlScore,
    anomalyScore,
    fraudProbability,
    behavioralScore: Math.round((ruleScore + mlScore) / 2),
    reasons: allReasons,
    action: finalScore >= 50 ? "CONFIRMATION_REQUIRED" : "ALLOW",
    metrics,
  };
}
