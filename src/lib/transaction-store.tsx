import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Transaction } from "@/lib/types";

/**
 * LiveTransactionStore — holds auto-generated stream transactions (monitoring feed).
 * These are NOT shown in Recent Transactions.
 */
interface LiveTransactionStore {
  liveTransactions: (Transaction & { _scoring?: any; _txnType?: string })[];
  addLiveTransaction: (txn: Transaction & { _scoring?: any; _txnType?: string }) => void;
  updateLiveStatus: (id: string, status: Transaction["status"]) => void;
}

const LiveTransactionStoreContext = createContext<LiveTransactionStore | null>(null);

export function LiveTransactionStoreProvider({ children }: { children: ReactNode }) {
  const [liveTransactions, setLiveTransactions] = useState<(Transaction & { _scoring?: any; _txnType?: string })[]>([]);

  const addLiveTransaction = useCallback((txn: Transaction & { _scoring?: any; _txnType?: string }) => {
    setLiveTransactions((prev) => [txn, ...prev].slice(0, 50));
  }, []);

  const updateLiveStatus = useCallback((id: string, status: Transaction["status"]) => {
    setLiveTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }, []);

  return (
    <LiveTransactionStoreContext.Provider value={{ liveTransactions, addLiveTransaction, updateLiveStatus }}>
      {children}
    </LiveTransactionStoreContext.Provider>
  );
}

export function useLiveTransactionStore() {
  const ctx = useContext(LiveTransactionStoreContext);
  if (!ctx) {
    // Fallback for HMR — return no-op store instead of throwing
    return { liveTransactions: [], addLiveTransaction: () => {}, updateLiveStatus: () => {} } as LiveTransactionStore;
  }
  return ctx;
}

/**
 * ReviewedTransactionStore — holds only user-reviewed transactions:
 * - Manually analyzed via Simulate
 * - Confirmed Legit / Reported Fraud from live stream
 */
interface ReviewedTransactionStore {
  reviewedTransactions: Transaction[];
  addReviewedTransaction: (txn: Transaction) => void;
  updateReviewedStatus: (id: string, status: Transaction["status"]) => void;
}

const ReviewedTransactionStoreContext = createContext<ReviewedTransactionStore | null>(null);

export function ReviewedTransactionStoreProvider({ children }: { children: ReactNode }) {
  const [reviewedTransactions, setReviewedTransactions] = useState<Transaction[]>([]);

  const addReviewedTransaction = useCallback((txn: Transaction) => {
    setReviewedTransactions((prev) => {
      // Avoid duplicates
      if (prev.some((t) => t.id === txn.id)) return prev;
      return [txn, ...prev].slice(0, 100);
    });
  }, []);

  const updateReviewedStatus = useCallback((id: string, status: Transaction["status"]) => {
    setReviewedTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }, []);

  return (
    <ReviewedTransactionStoreContext.Provider value={{ reviewedTransactions, addReviewedTransaction, updateReviewedStatus }}>
      {children}
    </ReviewedTransactionStoreContext.Provider>
  );
}

export function useReviewedTransactionStore() {
  const ctx = useContext(ReviewedTransactionStoreContext);
  if (!ctx) {
    return { reviewedTransactions: [], addReviewedTransaction: () => {}, updateReviewedStatus: () => {} } as ReviewedTransactionStore;
  }
  return ctx;
}
