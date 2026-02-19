import { DatasetUser, HistoricalTransaction } from "./types";

// Structured user dataset with transaction histories
export const userDataset: DatasetUser[] = [
  {
    userId: "USR-001",
    monthlyIncome: 5200,
    avgTransactionAmount: 85,
    avgMonthlySpend: 3100,
    avgWeeklyFrequency: 12,
    usualLocations: ["New York", "Boston", "Chicago"],
    transactionHistory: [
      { transactionId: "hist-001-01", userId: "USR-001", amount: 42.50, timestamp: "2026-02-19T10:30:00Z", location: "New York", category: "Food & Dining" },
      { transactionId: "hist-001-02", userId: "USR-001", amount: 89.99, timestamp: "2026-02-18T14:15:00Z", location: "Boston", category: "Shopping" },
      { transactionId: "hist-001-03", userId: "USR-001", amount: 125.00, timestamp: "2026-02-17T09:45:00Z", location: "New York", category: "Shopping" },
      { transactionId: "hist-001-04", userId: "USR-001", amount: 35.00, timestamp: "2026-02-16T12:00:00Z", location: "Chicago", category: "Food & Dining" },
      { transactionId: "hist-001-05", userId: "USR-001", amount: 67.80, timestamp: "2026-02-15T16:20:00Z", location: "New York", category: "Entertainment" },
      { transactionId: "hist-001-06", userId: "USR-001", amount: 110.00, timestamp: "2026-02-14T11:00:00Z", location: "Boston", category: "Bills & Utilities" },
      { transactionId: "hist-001-07", userId: "USR-001", amount: 55.25, timestamp: "2026-02-13T09:30:00Z", location: "New York", category: "Food & Dining" },
    ],
  },
  {
    userId: "USR-002",
    monthlyIncome: 8500,
    avgTransactionAmount: 150,
    avgMonthlySpend: 5200,
    avgWeeklyFrequency: 8,
    usualLocations: ["San Francisco", "Los Angeles", "Seattle"],
    transactionHistory: [
      { transactionId: "hist-002-01", userId: "USR-002", amount: 210.00, timestamp: "2026-02-19T08:00:00Z", location: "San Francisco", category: "Shopping" },
      { transactionId: "hist-002-02", userId: "USR-002", amount: 95.50, timestamp: "2026-02-18T19:30:00Z", location: "Los Angeles", category: "Food & Dining" },
      { transactionId: "hist-002-03", userId: "USR-002", amount: 180.00, timestamp: "2026-02-17T15:00:00Z", location: "San Francisco", category: "Entertainment" },
      { transactionId: "hist-002-04", userId: "USR-002", amount: 120.00, timestamp: "2026-02-16T10:45:00Z", location: "Seattle", category: "Travel" },
      { transactionId: "hist-002-05", userId: "USR-002", amount: 75.00, timestamp: "2026-02-15T13:00:00Z", location: "San Francisco", category: "Food & Dining" },
    ],
  },
  {
    userId: "USR-003",
    monthlyIncome: 3800,
    avgTransactionAmount: 45,
    avgMonthlySpend: 2100,
    avgWeeklyFrequency: 15,
    usualLocations: ["London", "Manchester", "Birmingham"],
    transactionHistory: [
      { transactionId: "hist-003-01", userId: "USR-003", amount: 32.00, timestamp: "2026-02-19T07:30:00Z", location: "London", category: "Food & Dining" },
      { transactionId: "hist-003-02", userId: "USR-003", amount: 55.00, timestamp: "2026-02-18T18:00:00Z", location: "Manchester", category: "Shopping" },
      { transactionId: "hist-003-03", userId: "USR-003", amount: 28.50, timestamp: "2026-02-17T12:15:00Z", location: "London", category: "Food & Dining" },
      { transactionId: "hist-003-04", userId: "USR-003", amount: 48.00, timestamp: "2026-02-16T09:00:00Z", location: "Birmingham", category: "Healthcare" },
      { transactionId: "hist-003-05", userId: "USR-003", amount: 65.00, timestamp: "2026-02-15T20:00:00Z", location: "London", category: "Entertainment" },
      { transactionId: "hist-003-06", userId: "USR-003", amount: 22.00, timestamp: "2026-02-14T08:30:00Z", location: "London", category: "Food & Dining" },
    ],
  },
  {
    userId: "USR-004",
    monthlyIncome: 12000,
    avgTransactionAmount: 320,
    avgMonthlySpend: 8500,
    avgWeeklyFrequency: 6,
    usualLocations: ["Dubai", "Abu Dhabi", "Riyadh"],
    transactionHistory: [
      { transactionId: "hist-004-01", userId: "USR-004", amount: 450.00, timestamp: "2026-02-19T11:00:00Z", location: "Dubai", category: "Shopping" },
      { transactionId: "hist-004-02", userId: "USR-004", amount: 280.00, timestamp: "2026-02-18T14:00:00Z", location: "Abu Dhabi", category: "Food & Dining" },
      { transactionId: "hist-004-03", userId: "USR-004", amount: 350.00, timestamp: "2026-02-17T16:30:00Z", location: "Dubai", category: "Entertainment" },
      { transactionId: "hist-004-04", userId: "USR-004", amount: 190.00, timestamp: "2026-02-16T09:15:00Z", location: "Riyadh", category: "Travel" },
    ],
  },
  {
    userId: "USR-005",
    monthlyIncome: 4200,
    avgTransactionAmount: 60,
    avgMonthlySpend: 2800,
    avgWeeklyFrequency: 10,
    usualLocations: ["Berlin", "Munich", "Hamburg"],
    transactionHistory: [
      { transactionId: "hist-005-01", userId: "USR-005", amount: 48.00, timestamp: "2026-02-19T09:00:00Z", location: "Berlin", category: "Food & Dining" },
      { transactionId: "hist-005-02", userId: "USR-005", amount: 72.00, timestamp: "2026-02-18T13:00:00Z", location: "Munich", category: "Shopping" },
      { transactionId: "hist-005-03", userId: "USR-005", amount: 35.00, timestamp: "2026-02-17T17:45:00Z", location: "Berlin", category: "Food & Dining" },
      { transactionId: "hist-005-04", userId: "USR-005", amount: 90.00, timestamp: "2026-02-16T11:30:00Z", location: "Hamburg", category: "Entertainment" },
      { transactionId: "hist-005-05", userId: "USR-005", amount: 55.00, timestamp: "2026-02-15T08:00:00Z", location: "Berlin", category: "Bills & Utilities" },
    ],
  },
];

// Anomalous locations that don't belong to any user's usual set
export const anomalousLocations = ["Lagos, Nigeria", "Caracas, Venezuela", "Minsk, Belarus", "Pyongyang, DPRK", "Mogadishu, Somalia"];

const categories = ["Food & Dining", "Shopping", "Travel", "Entertainment", "Bills & Utilities", "Healthcare", "Other"];

let txnCounter = 1000;

/**
 * Generate a transaction for a random user from the dataset.
 * ~25% chance of injecting an anomaly (high amount / foreign location).
 */
export function generateDatasetTransaction(): HistoricalTransaction & { _userRef: DatasetUser } {
  const user = userDataset[Math.floor(Math.random() * userDataset.length)];
  const isAnomaly = Math.random() < 0.25;
  txnCounter++;

  let amount: number;
  let location: string;

  if (isAnomaly) {
    // Either spike the amount, use foreign location, or both
    const anomalyType = Math.random();
    if (anomalyType < 0.4) {
      // High amount only
      amount = user.avgTransactionAmount * (3.5 + Math.random() * 4);
      location = user.usualLocations[Math.floor(Math.random() * user.usualLocations.length)];
    } else if (anomalyType < 0.7) {
      // Foreign location only
      amount = user.avgTransactionAmount * (0.5 + Math.random() * 1.5);
      location = anomalousLocations[Math.floor(Math.random() * anomalousLocations.length)];
    } else {
      // Both
      amount = user.avgTransactionAmount * (4 + Math.random() * 5);
      location = anomalousLocations[Math.floor(Math.random() * anomalousLocations.length)];
    }
  } else {
    // Normal transaction based on user's typical pattern
    const variance = 0.3 + Math.random() * 1.4; // 0.3x to 1.7x of average
    amount = Math.round(user.avgTransactionAmount * variance * 100) / 100;
    location = user.usualLocations[Math.floor(Math.random() * user.usualLocations.length)];
  }

  amount = Math.round(amount * 100) / 100;

  return {
    transactionId: `txn-${txnCounter}`,
    userId: user.userId,
    amount,
    timestamp: new Date().toISOString(),
    location,
    category: categories[Math.floor(Math.random() * categories.length)],
    _userRef: user,
  };
}

export function getUserProfile(userId: string): DatasetUser | undefined {
  return userDataset.find((u) => u.userId === userId);
}
