import { UserProfile, Transaction, AnalysisResult } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function fetchUser(userId: string): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function fetchTransactions(userId: string): Promise<Transaction[]> {
  const res = await fetch(`${API_BASE_URL}/transactions/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

// Extended receiver intelligence fields (all optional)
export interface ReceiverPayload {
  receiverId?: string;
  receiverAccountAge?: number;
  receiverTotalReceived?: number;
  receiverTotalTransactions?: number;
  receiverFraudReports?: number;
  transactionId?: string;
  isMerchantVerified?: boolean;
  isNewBeneficiary?: boolean;
}

// Extended API response fields (all optional, safe to ignore if absent)
export interface ReceiverApiResponse {
  receiver_risk?: number;
  receiver_reasons?: string[];
  transaction_id_flag?: boolean;
  receiver_account_age_flag?: boolean;
  merchant_flag?: boolean;
  beneficiary_flag?: boolean;
}

export async function analyzeTransaction(data: {
  userId: string;
  amount: number;
  location: string;
  timestamp: string;
} & ReceiverPayload): Promise<AnalysisResult & ReceiverApiResponse> {
  const res = await fetch(`${API_BASE_URL}/analyze-transaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to analyze transaction");
  return res.json();
}

export async function confirmTransaction(data: {
  transactionId: string;
  userResponse: "legit" | "fraud";
}): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/confirm-transaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to confirm transaction");
}
