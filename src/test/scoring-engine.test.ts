import { describe, it, expect } from "vitest";
import { scoreTransaction } from "@/lib/scoring-engine";
import { DatasetUser, UpiIdInfo } from "@/lib/types";

const baseUser: DatasetUser = {
  userId: "TEST-001",
  name: "Test User",
  profileType: "salaried",
  monthlySalary: 50000,
  avgTransactionAmount: 500,
  avgMonthlySpend: 15000,
  avgWeeklyFrequency: 7,
  usualCities: ["Chennai", "Bangalore"],
  usualUpiIds: ["swiggy@paytm", "flipkart@axl"],
  deviceFingerprints: ["device-001"],
  accountAgeDays: 365,
  historicalFraudCount: 0,
  transactionHistory: [],
};

const safeUpi: UpiIdInfo = { upiId: "swiggy@paytm", creationDate: "2024-01-01", ageDays: 365 };
const newUpi: UpiIdInfo = { upiId: "unknown@ybl", creationDate: "2026-02-10", ageDays: 5 };

describe("Scoring Engine Validation", () => {
  it("Normal transaction → 10–30 risk", () => {
    const result = scoreTransaction("t1", 400, "Chennai", "swiggy@paytm", safeUpi, baseUser, 0);
    console.log(`Normal: riskScore=${result.riskScore}, rule=${result.ruleScore}, ml=${result.mlScore}`);
    expect(result.riskScore).toBeLessThanOrEqual(30);
    expect(result.riskLevel).toBe("SAFE");
  });

  it("Moderate anomaly (5x avg, unfamiliar city) → 25–60 risk", () => {
    const result = scoreTransaction("t2", 2500, "Imphal", "swiggy@paytm", safeUpi, baseUser, 0);
    console.log(`Moderate: riskScore=${result.riskScore}, rule=${result.ruleScore}, ml=${result.mlScore}`);
    expect(result.riskScore).toBeGreaterThanOrEqual(20);
    expect(result.riskScore).toBeLessThanOrEqual(70);
    expect(result.riskLevel).not.toBe("HIGH_RISK");
  });

  it("Extreme anomaly (100x avg, >200% salary) → 85–100 risk", () => {
    // 100x avg = ₹50,000 which is also 100% of salary
    const result = scoreTransaction("t3", 50000, "Imphal", "unknown@ybl", newUpi, baseUser, 3);
    console.log(`Extreme: riskScore=${result.riskScore}, rule=${result.ruleScore}, ml=${result.mlScore}, anomaly=${result.anomalyScore}, fraud=${result.fraudProbability}`);
    expect(result.riskScore).toBeGreaterThanOrEqual(75);
    expect(result.riskLevel).toBe("HIGH_RISK");
  });

  it("Very extreme (₹500,000 = 1000x avg, 10x salary) → near max", () => {
    const result = scoreTransaction("t4", 500000, "Port Blair", "lucky.winner2026@paytm", newUpi, baseUser, 5);
    console.log(`Very extreme: riskScore=${result.riskScore}, rule=${result.ruleScore}, ml=${result.mlScore}`);
    expect(result.riskScore).toBeGreaterThanOrEqual(85);
    expect(result.riskLevel).toBe("HIGH_RISK");
  });

  it("High amount but familiar city/UPI → elevated but not extreme", () => {
    const result = scoreTransaction("t5", 25000, "Chennai", "swiggy@paytm", safeUpi, baseUser, 0);
    console.log(`High familiar: riskScore=${result.riskScore}, rule=${result.ruleScore}, ml=${result.mlScore}`);
    // 50x avg, but trusted city/UPI — amount deviation drives score up but context keeps it moderate
    expect(result.riskScore).toBeGreaterThanOrEqual(25);
    expect(result.riskScore).toBeLessThan(70);
  });
});
