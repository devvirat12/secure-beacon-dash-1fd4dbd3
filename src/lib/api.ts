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

export async function analyzeTransaction(data: {
  userId: string;
  amount: number;
  location: string;
  timestamp: string;
}): Promise<AnalysisResult> {
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
