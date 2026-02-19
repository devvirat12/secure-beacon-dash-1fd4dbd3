import { DatasetUser, ScoringResult, RiskLevel, DeviationMetrics, UpiIdInfo, LinkDeepInspection } from "./types";

const trustedDomains = ["razorpay", "paytm", "phonepe", "gpay", "bhim", "sbi", "hdfc", "icici", "axis"];

function classifyLinkRisk(link?: string): "trusted" | "unknown" | "new" | "none" {
  if (!link) return "none";
  const lower = link.toLowerCase();
  if (trustedDomains.some((d) => lower.includes(d))) return "trusted";
  if (lower.includes("bit.ly") || lower.includes("tinyurl") || lower.includes("shorturl")) return "new";
  return "unknown";
}

// --- Payment Link Deep Inspection ---

const suspiciousKeywords = ["win", "free", "cash", "earn", "lucky", "refund", "prize", "offer", "claim", "lottery", "invest", "recharge", "cashback"];

const legitimateDomains = ["razorpay.com", "paytm.com", "phonepe.com", "gpay.com", "bhim.com", "sbi.co.in", "hdfcbank.com", "icicibank.com", "axisbank.com", "amazon.in", "flipkart.com", "swiggy.com", "zomato.com"];

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }
  return matrix[b.length][a.length];
}

export function deepInspectLink(link?: string): LinkDeepInspection | undefined {
  if (!link) return undefined;
  const lower = link.toLowerCase().trim();
  const domainMatch = lower.replace(/https?:\/\//, "").split("/")[0].split("?")[0];
  const domain = domainMatch || lower;

  const isShortened = ["bit.ly", "tinyurl", "shorturl"].some((s) => domain.includes(s));
  const hasSuspiciousKeywords = suspiciousKeywords.some((kw) => lower.includes(kw));

  // Lookalike domain detection via levenshtein
  let lookalikeSimilarity = 0;
  let lookalikeDomain: string | undefined;
  for (const legit of legitimateDomains) {
    const dist = levenshteinDistance(domain, legit);
    const maxLen = Math.max(domain.length, legit.length);
    const similarity = 1 - dist / maxLen;
    if (similarity > lookalikeSimilarity && similarity < 1) {
      lookalikeSimilarity = similarity;
      lookalikeDomain = legit;
    }
  }
  lookalikeSimilarity = Math.round(lookalikeSimilarity * 100) / 100;

  // Domain age simulation based on domain characteristics
  let domainAgeSimDays = 365;
  if (isShortened) domainAgeSimDays = 5;
  else if (trustedDomains.some((d) => domain.includes(d))) domainAgeSimDays = 2000;
  else if (hasSuspiciousKeywords) domainAgeSimDays = 15;
  else domainAgeSimDays = 90;

  // Compute linkRiskScore (0-30)
  let linkRiskScore = 0;
  if (isShortened) linkRiskScore += 10;
  if (hasSuspiciousKeywords) linkRiskScore += 8;
  if (lookalikeSimilarity > 0.7 && lookalikeSimilarity < 1) linkRiskScore += 7;
  if (domainAgeSimDays < 30) linkRiskScore += 5;
  linkRiskScore = Math.min(linkRiskScore, 30);

  return { domain, isShortened, hasSuspiciousKeywords, lookalikeSimilarity, lookalikeDomain, domainAgeSimDays, linkRiskScore };
}

// --- Behavioral Drift Detection ---

export function computeBehavioralDrift(user: DatasetUser): number {
  const history = user.transactionHistory;
  if (history.length < 5) return 0;

  const now = new Date("2026-02-19T12:00:00Z").getTime();
  const d14 = now - 14 * 24 * 60 * 60 * 1000;
  const d90 = now - 90 * 24 * 60 * 60 * 1000;

  const recent14 = history.filter((t) => new Date(t.timestamp).getTime() >= d14);
  const baseline90 = history.filter((t) => {
    const ts = new Date(t.timestamp).getTime();
    return ts >= d90 && ts < d14;
  });

  if (recent14.length < 2 || baseline90.length < 3) return 0;

  const avg14 = recent14.reduce((s, t) => s + t.amount, 0) / recent14.length;
  const avg90 = baseline90.reduce((s, t) => s + t.amount, 0) / baseline90.length;

  if (avg90 === 0) return 0;
  const driftPct = Math.abs(avg14 - avg90) / avg90;
  return Math.round(driftPct * 100);
}

// --- Adaptive Risk Thresholds ---

function computeUserStdDev(user: DatasetUser): number {
  const amounts = user.transactionHistory.map((t) => t.amount);
  if (amounts.length < 3) return 0;
  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const variance = amounts.reduce((s, v) => s + (v - mean) ** 2, 0) / amounts.length;
  return Math.sqrt(variance);
}

export function getAdaptiveRiskLevel(score: number, user: DatasetUser): RiskLevel {
  const stdDev = computeUserStdDev(user);
  const cv = user.avgTransactionAmount > 0 ? stdDev / user.avgTransactionAmount : 0;

  // High volatility users get raised thresholds; low volatility get lowered
  let highThreshold = 70;
  let warnThreshold = 50;

  if (cv > 0.8) {
    // High volatility — raise thresholds (harder to trigger)
    highThreshold = 78;
    warnThreshold = 58;
  } else if (cv < 0.3) {
    // Low volatility — lower thresholds (easier to trigger)
    highThreshold = 62;
    warnThreshold = 42;
  }

  if (score >= highThreshold) return "HIGH_RISK";
  if (score >= warnThreshold) return "WARNING";
  return "SAFE";
}

// --- Risk Confidence Score ---

export function computeConfidenceScore(ruleScore: number, mlScore: number): number {
  const agreement = 100 - Math.abs(ruleScore - mlScore);
  const signalStrength = (ruleScore + mlScore) / 2;

  // High agreement + strong signals = high confidence
  // Low agreement or weak signals = low confidence
  if (signalStrength < 10) return Math.round(agreement * 0.3); // Weak signals → lower confidence
  if (agreement > 80) return Math.min(Math.round(60 + signalStrength * 0.4), 100);
  if (agreement > 50) return Math.min(Math.round(40 + signalStrength * 0.3), 90);
  return Math.min(Math.round(20 + signalStrength * 0.2), 70);
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

  // Deep link inspection
  const linkDeepInspection = deepInspectLink(paymentLink);
  const linkRiskScore = linkDeepInspection?.linkRiskScore ?? 0;

  // Night transaction check (2AM - 5AM IST)
  let isNightTransaction = false;
  let transactionTimeRisk = 0;
  if (timestamp) {
    const hour = new Date(timestamp).getUTCHours();
    const istHour = (hour + 5) % 24;
    isNightTransaction = istHour >= 2 && istHour < 5;
    if (istHour >= 0 && istHour < 6) transactionTimeRisk = 0.8;
    else if (istHour >= 22) transactionTimeRisk = 0.5;
    else transactionTimeRisk = 0.1;
  }

  const deviceChangeFlag = deviceId ? !user.deviceFingerprints.includes(deviceId) : false;
  const rapidSmallTransactionsFlag = amount < 500 && recentTxnCountLastHour >= 3;

  // Geo-velocity: impossible travel detection
  let geoVelocityFlag = false;
  if (previousCity && previousTimestamp && timestamp) {
    const timeDiffMs = new Date(timestamp).getTime() - new Date(previousTimestamp).getTime();
    const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
    const citiesAreDifferent = previousCity.toLowerCase() !== city.toLowerCase();
    if (citiesAreDifferent && timeDiffHours < 1 && timeDiffHours > 0) {
      geoVelocityFlag = true;
    }
  }

  // Beneficiary risk score
  let beneficiaryRiskScore = 0;
  if (isFirstTimeBeneficiary) beneficiaryRiskScore += 30;
  if (upiAgeDays < 7) beneficiaryRiskScore += 40;
  else if (upiAgeDays < 30) beneficiaryRiskScore += 20;
  if (upiId.includes("cash") || upiId.includes("earn") || upiId.includes("lucky") || upiId.includes("winner") || upiId.includes("refund") || upiId.includes("invest")) {
    beneficiaryRiskScore += 30;
  }
  beneficiaryRiskScore = Math.min(beneficiaryRiskScore, 100);

  const historicalFraudExposureFlag = user.historicalFraudCount > 0;

  const salaryRatio = user.monthlySalary > 0 ? amount / user.monthlySalary : 0;

  // Behavioral drift
  const behavioralDriftScore = computeBehavioralDrift(user);

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
    salaryRatio,
    behavioralDriftScore,
    linkRiskScore,
    linkDeepInspection,
    previousCity,
    previousTimestamp,
  };
}

/**
 * Rule-based scoring — proportional scaling, no premature clamping.
 */
export function computeRuleScore(
  amount: number,
  user: DatasetUser,
  metrics: DeviationMetrics
): { ruleScore: number; reasons: string[] } {
  let ruleScore = 0;
  const reasons: string[] = [];

  // Rule 1: Amount deviation
  if (metrics.amountDeviation > 2) {
    const dev = metrics.amountDeviation;
    let points: number;
    if (dev <= 10) {
      points = Math.round(5 + (dev - 2) * (20 / 8));
    } else {
      points = Math.round(25 + Math.min((dev - 10) / 10, 1.5) * 10);
    }
    ruleScore += points;
    if (dev > 10) {
      reasons.push(`Transaction ${Math.round(dev)}x above user's average (₹${user.avgTransactionAmount.toLocaleString("en-IN")}) — extreme deviation`);
    } else {
      reasons.push(`Transaction ${dev.toFixed(1)}x above user's average (₹${user.avgTransactionAmount.toLocaleString("en-IN")})`);
    }
  }

  // Rule 2: City anomaly
  if (metrics.locationFlag) {
    ruleScore += 20;
    reasons.push("Transaction from unfamiliar location — outside usual cities");
  }

  // Rule 3: Salary ratio
  const salaryRatio = metrics.salaryRatio ?? (user.monthlySalary > 0 ? amount / user.monthlySalary : 0);
  if (salaryRatio > 0.6) {
    let points: number;
    if (salaryRatio > 2) points = 35;
    else if (salaryRatio > 1) points = 30;
    else points = 20;
    ruleScore += points;
    if (salaryRatio > 1) {
      reasons.push(`Transaction exceeds monthly salary (${Math.round(salaryRatio * 100)}% of ₹${user.monthlySalary.toLocaleString("en-IN")})`);
    } else {
      reasons.push(`Transaction is ${Math.round(salaryRatio * 100)}% of monthly salary`);
    }
  }

  // Rule 4: Frequency spike
  if (metrics.frequencySpike) {
    ruleScore += 15;
    reasons.push("Frequency spike: unusual number of transfers in the last hour");
  }

  // Rule 5: Night transaction
  if (metrics.isNightTransaction) {
    ruleScore += 15;
    reasons.push("Transaction initiated between 2AM–5AM IST (unusual hours)");
  }

  // Rule 6: Device change
  if (metrics.deviceChangeFlag) {
    ruleScore += 10;
    reasons.push("Transaction from unrecognized device");
  }

  // Rule 7: Geo-velocity
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

  // Rule 10: Behavioral drift
  if (metrics.behavioralDriftScore > 40) {
    const driftPts = Math.min(Math.round(metrics.behavioralDriftScore / 10), 10);
    ruleScore += driftPts;
    reasons.push(`Behavioral drift detected: ${metrics.behavioralDriftScore}% deviation from 90-day baseline`);
  }

  return { ruleScore: Math.min(ruleScore, 100), reasons };
}

/**
 * Isolation Forest — linear scaling for extreme deviations.
 */
export function computeIsolationForestScore(metrics: DeviationMetrics): { score: number; contributions: Record<string, number> } {
  // Cross-feature interaction multipliers: co-occurring anomalies amplify each other
  const locationAndAmount = metrics.locationFlag && metrics.amountDeviation > 3 ? 1.25 : 1.0;
  const newUpiAndHighAmount = metrics.isFirstTimeBeneficiary && metrics.amountDeviation > 4 ? 1.20 : 1.0;
  const fraudHistoryAmplifier = metrics.historicalFraudExposureFlag ? 1.15 : 1.0;
  const newAccountHighAmount = metrics.accountAgeDays < 60 && metrics.amountDeviation > 5 ? 1.30 : 1.0;
  const nightAndNewCity = metrics.isNightTransaction && metrics.locationFlag ? 1.20 : 1.0;

  // Sigmoid-shaped amount deviation: steeper curve for moderate anomalies, asymptotes at extremes
  const rawDev = metrics.amountDeviation;
  const amountSignal =
    rawDev <= 1 ? 0 :
    rawDev <= 3 ? (rawDev - 1) / 2 * 0.2 :           // 1-3x: very low (0–0.2)
    rawDev <= 8 ? 0.2 + (rawDev - 3) / 5 * 0.35 :    // 3-8x: moderate (0.2–0.55)
    rawDev <= 20 ? 0.55 + (rawDev - 8) / 12 * 0.3 :  // 8-20x: high (0.55–0.85)
    Math.min(0.85 + (rawDev - 20) / 30 * 0.15, 1.0); // 20x+: near max (0.85–1.0)

  // Spend/salary ratio: sharper penalty for exceeding monthly salary
  const salaryRatio = metrics.salaryRatio ?? 0;
  const spendSignal =
    salaryRatio <= 0.3 ? 0 :
    salaryRatio <= 0.6 ? (salaryRatio - 0.3) / 0.3 * 0.15 :
    salaryRatio <= 1.0 ? 0.15 + (salaryRatio - 0.6) / 0.4 * 0.35 :
    Math.min(0.5 + (salaryRatio - 1.0) / 2 * 0.5, 1.0);

  const features: { name: string; signal: number; weight: number; multiplier: number }[] = [
    { name: "Amount Deviation",   signal: amountSignal,                                             weight: 0.24, multiplier: locationAndAmount * newUpiAndHighAmount * newAccountHighAmount },
    { name: "Spend Ratio",        signal: spendSignal,                                              weight: 0.12, multiplier: 1.0 },
    { name: "Location Anomaly",   signal: metrics.locationFlag ? 1 : 0,                            weight: 0.14, multiplier: nightAndNewCity },
    { name: "Frequency Spike",    signal: metrics.frequencySpike ? 0.85 : 0,                       weight: 0.09, multiplier: 1.0 },
    { name: "Time Pattern",       signal: metrics.transactionTimeRisk,                             weight: 0.07, multiplier: 1.0 },
    { name: "Geo-Velocity",       signal: metrics.geoVelocityFlag ? 1 : 0,                         weight: 0.10, multiplier: 1.0 },
    { name: "Device Change",      signal: metrics.deviceChangeFlag ? 0.9 : 0,                      weight: 0.07, multiplier: 1.0 },
    { name: "Account Age",        signal: metrics.accountAgeDays < 20 ? 1 : metrics.accountAgeDays < 60 ? 0.6 : metrics.accountAgeDays < 120 ? 0.25 : 0, weight: 0.06, multiplier: newAccountHighAmount },
    { name: "Rapid Small Txns",   signal: metrics.rapidSmallTransactionsFlag ? 0.8 : 0,            weight: 0.04, multiplier: 1.0 },
    { name: "Behavioral Drift",   signal: Math.min(metrics.behavioralDriftScore / 70, 1),          weight: 0.06, multiplier: 1.0 },
    { name: "Fraud History",      signal: metrics.historicalFraudExposureFlag ? Math.min(1, 0.4 + metrics.amountDeviation / 20) : 0, weight: 0.04, multiplier: fraudHistoryAmplifier },
    { name: "Beneficiary Risk",   signal: Math.min(metrics.beneficiaryRiskScore / 100, 1) * (newUpiAndHighAmount - 1 + 1), weight: 0.04, multiplier: 1.0 },
  ];

  // Normalize weights (they may sum slightly over 1 after adding new features)
  const totalWeight = features.reduce((s, f) => s + f.weight, 0);

  const contributions: Record<string, number> = {};
  let weightedSum = 0;
  for (const f of features) {
    const contrib = f.signal * (f.weight / totalWeight) * f.multiplier * 100;
    contributions[f.name] = Math.round(contrib);
    weightedSum += contrib;
  }

  const score = Math.min(Math.round(weightedSum), 100);
  return { score, contributions };
}

/**
 * LightGBM — magnitude-aware scoring with link deep inspection.
 */
export function computeLightGBMScore(metrics: DeviationMetrics): { score: number; contributions: Record<string, number> } {
  const contributions: Record<string, number> = {};

  // Beneficiary risk: weighted by account age severity
  const bRisk = metrics.beneficiaryRiskScore;
  contributions["Beneficiary Risk"] = Math.round(bRisk * 0.28);

  // First-time beneficiary: more weight when high amount involved
  const ftbBoost = metrics.isFirstTimeBeneficiary
    ? (metrics.amountDeviation > 5 ? 20 : metrics.amountDeviation > 2 ? 16 : 12)
    : 0;
  contributions["First-Time Beneficiary"] = ftbBoost;

  // UPI age: graduated penalty
  const upiAgeContrib =
    metrics.upiAgeDays < 3  ? 25 :
    metrics.upiAgeDays < 7  ? 20 :
    metrics.upiAgeDays < 14 ? 14 :
    metrics.upiAgeDays < 30 ? 9  : 0;
  contributions["UPI Account Age"] = upiAgeContrib;

  // Payment link risk with deep inspection
  let linkContrib = 0;
  if (metrics.isPaymentLink) {
    if (metrics.linkRiskScore > 0) {
      linkContrib = metrics.linkRiskScore;
    } else {
      linkContrib = metrics.linkRisk === "new" ? 22 : metrics.linkRisk === "unknown" ? 16 : 4;
    }
  }
  contributions["Payment Link Risk"] = linkContrib;

  // Device change
  contributions["Device Change"] = metrics.deviceChangeFlag ? 13 : 0;

  // Night transaction
  contributions["Night Transaction"] = metrics.isNightTransaction ? 9 : 0;

  // Account age: tighter thresholds
  contributions["Account Age"] =
    metrics.accountAgeDays < 20  ? 14 :
    metrics.accountAgeDays < 60  ? 9  :
    metrics.accountAgeDays < 120 ? 4  : 0;

  // Historical fraud: amplified by how much fraud (count) via a proxy of historicalFraudExposureFlag
  // We use the flag; counts tracked in dataset but not surfaced in metrics — add a compounding factor
  contributions["Fraud History"] = metrics.historicalFraudExposureFlag ? 14 : 0;

  // Amount anomaly: sigmoid-shaped similar to ISO for consistency
  const rawDev = metrics.amountDeviation;
  const amountFraudSignal =
    rawDev <= 2  ? 0 :
    rawDev <= 6  ? (rawDev - 2) / 4 * 8 :
    rawDev <= 15 ? 8 + (rawDev - 6) / 9 * 10 :
    Math.min(18 + (rawDev - 15) / 20 * 6, 24);
  contributions["Amount Anomaly"] = Math.round(amountFraudSignal);

  // Salary overrun: penalise crossing monthly salary
  const salaryRatio = metrics.salaryRatio ?? 0;
  const salarySignal =
    salaryRatio < 0.5 ? 0 :
    salaryRatio < 1.0 ? (salaryRatio - 0.5) / 0.5 * 8 :
    salaryRatio < 2.0 ? 8 + (salaryRatio - 1.0) * 6 :
    Math.min(14 + (salaryRatio - 2.0) * 2, 20);
  contributions["Salary Overrun"] = Math.round(salarySignal);

  // Behavioral drift
  const driftSignal = metrics.behavioralDriftScore > 40
    ? Math.min((metrics.behavioralDriftScore - 40) / 50, 1) * 10
    : 0;
  contributions["Behavioral Drift"] = Math.round(driftSignal);

  // Cross-feature interaction: new city + suspicious UPI together
  const locationUpiInteraction =
    (metrics.locationFlag && metrics.isFirstTimeBeneficiary && metrics.amountDeviation > 3) ? 8 : 0;
  contributions["Location×Beneficiary"] = locationUpiInteraction;

  // Geo-velocity: direct fraud signal
  contributions["Geo-Velocity"] = metrics.geoVelocityFlag ? 15 : 0;

  // Frequency spike in combination with small amounts = card testing
  contributions["Rapid Probing"] = metrics.rapidSmallTransactionsFlag ? 10 : 0;

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

  const allContribs = [
    ...Object.entries(iso.contributions).map(([k, v]) => ({ model: "Isolation Forest", feature: k, value: v, total: iso.score })),
    ...Object.entries(lgbm.contributions).map(([k, v]) => ({ model: "LightGBM", feature: k, value: v, total: lgbm.score })),
  ]
    .filter((c) => c.value > 3)
    .sort((a, b) => b.value - a.value);

  if (mlScore >= 15) {
    const maxReasons = mlScore >= 50 ? 4 : mlScore >= 30 ? 2 : 1;
    const seen = new Set<string>();

    for (const c of allContribs) {
      if (seen.size >= maxReasons) break;
      const key = c.feature.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

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
 * Full scoring pipeline.
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
  const riskLevel = getAdaptiveRiskLevel(finalScore, user);
  const confidenceScore = computeConfidenceScore(ruleScore, mlScore);

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
    confidenceScore,
  };
}
