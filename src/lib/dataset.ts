import { DatasetUser, HistoricalTransaction, UpiIdInfo } from "./types";

// UPI ID registry with creation dates
export const upiIdRegistry: Record<string, UpiIdInfo> = {
  "priya.sharma@okaxis": { upiId: "priya.sharma@okaxis", creationDate: "2024-06-15", ageDays: 615 },
  "rahul.mehta@ybl": { upiId: "rahul.mehta@ybl", creationDate: "2025-01-10", ageDays: 405 },
  "anita.das@paytm": { upiId: "anita.das@paytm", creationDate: "2025-08-20", ageDays: 183 },
  "vikram.singh@oksbi": { upiId: "vikram.singh@oksbi", creationDate: "2024-11-01", ageDays: 476 },
  "deepa.nair@ibl": { upiId: "deepa.nair@ibl", creationDate: "2025-05-12", ageDays: 283 },
  "bigbasket@razorpay": { upiId: "bigbasket@razorpay", creationDate: "2022-03-01", ageDays: 1451 },
  "swiggy@paytm": { upiId: "swiggy@paytm", creationDate: "2021-06-01", ageDays: 1724 },
  "flipkart@axl": { upiId: "flipkart@axl", creationDate: "2020-01-15", ageDays: 2227 },
  "irctc@sbi": { upiId: "irctc@sbi", creationDate: "2019-09-01", ageDays: 2363 },
  "apollo247@hdfcbank": { upiId: "apollo247@hdfcbank", creationDate: "2023-01-10", ageDays: 1136 },
  "electricity.tneb@paytm": { upiId: "electricity.tneb@paytm", creationDate: "2022-08-15", ageDays: 1284 },
  "zomato@ybl": { upiId: "zomato@ybl", creationDate: "2021-11-01", ageDays: 1572 },
  // Suspicious / mule UPI IDs
  "quickcash9871@ybl": { upiId: "quickcash9871@ybl", creationDate: "2026-02-14", ageDays: 5 },
  "earnmoney.now@okaxis": { upiId: "earnmoney.now@okaxis", creationDate: "2026-02-16", ageDays: 3 },
  "lucky.winner2026@paytm": { upiId: "lucky.winner2026@paytm", creationDate: "2026-02-12", ageDays: 7 },
  "invest.returns@ybl": { upiId: "invest.returns@ybl", creationDate: "2026-01-25", ageDays: 25 },
  "refund.process@oksbi": { upiId: "refund.process@oksbi", creationDate: "2026-02-10", ageDays: 9 },
};

export const userDataset: DatasetUser[] = [
  {
    userId: "IND-001",
    name: "Priya Sharma",
    monthlySalary: 75000,
    avgTransactionAmount: 1200,
    avgMonthlySpend: 45000,
    avgWeeklyFrequency: 14,
    usualCities: ["Chennai", "Bangalore", "Coimbatore"],
    usualUpiIds: ["bigbasket@razorpay", "swiggy@paytm", "flipkart@axl", "electricity.tneb@paytm"],
    transactionHistory: [
      { transactionId: "hist-001-01", userId: "IND-001", amount: 850, timestamp: "2026-02-19T10:30:00Z", city: "Chennai", upiId: "swiggy@paytm", category: "Food & Dining" },
      { transactionId: "hist-001-02", userId: "IND-001", amount: 2499, timestamp: "2026-02-18T14:15:00Z", city: "Bangalore", upiId: "flipkart@axl", category: "Shopping" },
      { transactionId: "hist-001-03", userId: "IND-001", amount: 1500, timestamp: "2026-02-17T09:45:00Z", city: "Chennai", upiId: "bigbasket@razorpay", category: "Groceries" },
      { transactionId: "hist-001-04", userId: "IND-001", amount: 450, timestamp: "2026-02-16T12:00:00Z", city: "Coimbatore", upiId: "zomato@ybl", category: "Food & Dining" },
      { transactionId: "hist-001-05", userId: "IND-001", amount: 980, timestamp: "2026-02-15T16:20:00Z", city: "Chennai", upiId: "electricity.tneb@paytm", category: "Bills & Utilities" },
    ],
  },
  {
    userId: "IND-002",
    name: "Rahul Mehta",
    monthlySalary: 120000,
    avgTransactionAmount: 2500,
    avgMonthlySpend: 72000,
    avgWeeklyFrequency: 10,
    usualCities: ["Mumbai", "Pune", "Nashik"],
    usualUpiIds: ["swiggy@paytm", "flipkart@axl", "zomato@ybl", "apollo247@hdfcbank"],
    transactionHistory: [
      { transactionId: "hist-002-01", userId: "IND-002", amount: 3200, timestamp: "2026-02-19T08:00:00Z", city: "Mumbai", upiId: "flipkart@axl", category: "Shopping" },
      { transactionId: "hist-002-02", userId: "IND-002", amount: 1800, timestamp: "2026-02-18T19:30:00Z", city: "Pune", upiId: "swiggy@paytm", category: "Food & Dining" },
      { transactionId: "hist-002-03", userId: "IND-002", amount: 2700, timestamp: "2026-02-17T15:00:00Z", city: "Mumbai", upiId: "zomato@ybl", category: "Food & Dining" },
      { transactionId: "hist-002-04", userId: "IND-002", amount: 1500, timestamp: "2026-02-16T10:45:00Z", city: "Nashik", upiId: "irctc@sbi", category: "Travel" },
    ],
  },
  {
    userId: "IND-003",
    name: "Anita Das",
    monthlySalary: 35000,
    avgTransactionAmount: 550,
    avgMonthlySpend: 22000,
    avgWeeklyFrequency: 16,
    usualCities: ["Kolkata", "Howrah", "Siliguri"],
    usualUpiIds: ["bigbasket@razorpay", "swiggy@paytm", "electricity.tneb@paytm"],
    transactionHistory: [
      { transactionId: "hist-003-01", userId: "IND-003", amount: 380, timestamp: "2026-02-19T07:30:00Z", city: "Kolkata", upiId: "swiggy@paytm", category: "Food & Dining" },
      { transactionId: "hist-003-02", userId: "IND-003", amount: 720, timestamp: "2026-02-18T18:00:00Z", city: "Howrah", upiId: "bigbasket@razorpay", category: "Groceries" },
      { transactionId: "hist-003-03", userId: "IND-003", amount: 290, timestamp: "2026-02-17T12:15:00Z", city: "Kolkata", upiId: "swiggy@paytm", category: "Food & Dining" },
      { transactionId: "hist-003-04", userId: "IND-003", amount: 650, timestamp: "2026-02-16T09:00:00Z", city: "Siliguri", upiId: "apollo247@hdfcbank", category: "Healthcare" },
      { transactionId: "hist-003-05", userId: "IND-003", amount: 450, timestamp: "2026-02-15T20:00:00Z", city: "Kolkata", upiId: "zomato@ybl", category: "Food & Dining" },
    ],
  },
  {
    userId: "IND-004",
    name: "Vikram Singh",
    monthlySalary: 150000,
    avgTransactionAmount: 4500,
    avgMonthlySpend: 95000,
    avgWeeklyFrequency: 8,
    usualCities: ["Delhi", "Gurgaon", "Noida"],
    usualUpiIds: ["flipkart@axl", "swiggy@paytm", "irctc@sbi", "zomato@ybl"],
    transactionHistory: [
      { transactionId: "hist-004-01", userId: "IND-004", amount: 5500, timestamp: "2026-02-19T11:00:00Z", city: "Delhi", upiId: "flipkart@axl", category: "Shopping" },
      { transactionId: "hist-004-02", userId: "IND-004", amount: 3800, timestamp: "2026-02-18T14:00:00Z", city: "Gurgaon", upiId: "swiggy@paytm", category: "Food & Dining" },
      { transactionId: "hist-004-03", userId: "IND-004", amount: 4200, timestamp: "2026-02-17T16:30:00Z", city: "Delhi", upiId: "zomato@ybl", category: "Food & Dining" },
      { transactionId: "hist-004-04", userId: "IND-004", amount: 2800, timestamp: "2026-02-16T09:15:00Z", city: "Noida", upiId: "irctc@sbi", category: "Travel" },
    ],
  },
  {
    userId: "IND-005",
    name: "Deepa Nair",
    monthlySalary: 55000,
    avgTransactionAmount: 800,
    avgMonthlySpend: 35000,
    avgWeeklyFrequency: 12,
    usualCities: ["Kochi", "Trivandrum", "Calicut"],
    usualUpiIds: ["bigbasket@razorpay", "swiggy@paytm", "electricity.tneb@paytm", "apollo247@hdfcbank"],
    transactionHistory: [
      { transactionId: "hist-005-01", userId: "IND-005", amount: 620, timestamp: "2026-02-19T09:00:00Z", city: "Kochi", upiId: "swiggy@paytm", category: "Food & Dining" },
      { transactionId: "hist-005-02", userId: "IND-005", amount: 950, timestamp: "2026-02-18T13:00:00Z", city: "Trivandrum", upiId: "bigbasket@razorpay", category: "Groceries" },
      { transactionId: "hist-005-03", userId: "IND-005", amount: 480, timestamp: "2026-02-17T17:45:00Z", city: "Kochi", upiId: "swiggy@paytm", category: "Food & Dining" },
      { transactionId: "hist-005-04", userId: "IND-005", amount: 1200, timestamp: "2026-02-16T11:30:00Z", city: "Calicut", upiId: "apollo247@hdfcbank", category: "Healthcare" },
    ],
  },
];

// Anomalous cities not in any user's usual set
export const anomalousCities = ["Imphal", "Gangtok", "Port Blair", "Leh", "Itanagar"];

// Suspicious payment links
export const suspiciousPaymentLinks = [
  "rzp.io/i/freeoffer2026",
  "paytm.me/quickcash",
  "bit.ly/win50k",
  "tinyurl.com/upi-refund",
  "shorturl.at/invest-now",
];

const categories = ["Food & Dining", "Shopping", "Groceries", "Travel", "Entertainment", "Bills & Utilities", "Healthcare", "Other"];

const suspiciousUpiIds = ["quickcash9871@ybl", "earnmoney.now@okaxis", "lucky.winner2026@paytm", "invest.returns@ybl", "refund.process@oksbi"];
const normalUpiIds = ["bigbasket@razorpay", "swiggy@paytm", "flipkart@axl", "irctc@sbi", "apollo247@hdfcbank", "electricity.tneb@paytm", "zomato@ybl"];

let txnCounter = 1000;

export function getUpiInfo(upiId: string): UpiIdInfo {
  return upiIdRegistry[upiId] || { upiId, creationDate: "2026-02-18", ageDays: 1 };
}

/**
 * Generate a transaction for a random user from the Indian dataset.
 * ~25% chance of injecting an anomaly.
 */
export function generateDatasetTransaction(): HistoricalTransaction & { _userRef: DatasetUser; _upiInfo: UpiIdInfo } {
  const user = userDataset[Math.floor(Math.random() * userDataset.length)];
  const isAnomaly = Math.random() < 0.25;
  txnCounter++;

  let amount: number;
  let city: string;
  let upiId: string;
  let paymentLink: string | undefined;

  if (isAnomaly) {
    const anomalyType = Math.random();
    if (anomalyType < 0.25) {
      // High amount + suspicious UPI
      amount = user.avgTransactionAmount * (3.5 + Math.random() * 4);
      city = user.usualCities[Math.floor(Math.random() * user.usualCities.length)];
      upiId = suspiciousUpiIds[Math.floor(Math.random() * suspiciousUpiIds.length)];
    } else if (anomalyType < 0.45) {
      // Foreign city
      amount = user.avgTransactionAmount * (0.8 + Math.random() * 1.5);
      city = anomalousCities[Math.floor(Math.random() * anomalousCities.length)];
      upiId = normalUpiIds[Math.floor(Math.random() * normalUpiIds.length)];
    } else if (anomalyType < 0.65) {
      // Payment link fraud
      amount = user.avgTransactionAmount * (2 + Math.random() * 3);
      city = user.usualCities[Math.floor(Math.random() * user.usualCities.length)];
      upiId = suspiciousUpiIds[Math.floor(Math.random() * suspiciousUpiIds.length)];
      paymentLink = suspiciousPaymentLinks[Math.floor(Math.random() * suspiciousPaymentLinks.length)];
    } else if (anomalyType < 0.8) {
      // Night transaction + high amount
      amount = user.avgTransactionAmount * (3 + Math.random() * 3);
      city = user.usualCities[Math.floor(Math.random() * user.usualCities.length)];
      upiId = suspiciousUpiIds[Math.floor(Math.random() * suspiciousUpiIds.length)];
    } else {
      // Everything suspicious
      amount = user.avgTransactionAmount * (4 + Math.random() * 5);
      city = anomalousCities[Math.floor(Math.random() * anomalousCities.length)];
      upiId = suspiciousUpiIds[Math.floor(Math.random() * suspiciousUpiIds.length)];
      paymentLink = suspiciousPaymentLinks[Math.floor(Math.random() * suspiciousPaymentLinks.length)];
    }
  } else {
    const variance = 0.3 + Math.random() * 1.4;
    amount = Math.round(user.avgTransactionAmount * variance * 100) / 100;
    city = user.usualCities[Math.floor(Math.random() * user.usualCities.length)];
    upiId = user.usualUpiIds[Math.floor(Math.random() * user.usualUpiIds.length)];
  }

  amount = Math.round(amount);

  const upiInfo = getUpiInfo(upiId);

  return {
    transactionId: `txn-${txnCounter}`,
    userId: user.userId,
    amount,
    timestamp: new Date().toISOString(),
    city,
    upiId,
    category: categories[Math.floor(Math.random() * categories.length)],
    paymentLink,
    _userRef: user,
    _upiInfo: upiInfo,
  };
}

export function getUserProfile(userId: string): DatasetUser | undefined {
  return userDataset.find((u) => u.userId === userId);
}
