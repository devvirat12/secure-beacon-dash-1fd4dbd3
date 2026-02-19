import { useState, useEffect, useCallback, ReactNode } from "react";
import { Transaction } from "@/lib/types";

/**
 * Bulletproof global store using window + CustomEvent.
 * Cannot be broken by HMR, module duplication, or context issues.
 */

const LIVE_EVENT = "live-txn-changed";
const REVIEWED_EVENT = "reviewed-txn-changed";

declare global {
  interface Window {
    __liveTxns: (Transaction & { _scoring?: any; _txnType?: string })[];
    __reviewedTxns: Transaction[];
  }
}

// Initialize once
if (!window.__liveTxns) window.__liveTxns = [];
if (!window.__reviewedTxns) window.__reviewedTxns = [];

// ── Providers (no-op, kept for API compat) ──

export function LiveTransactionStoreProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function ReviewedTransactionStoreProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// ── Live Transaction Store ──

export function useLiveTransactionStore() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const handler = () => forceUpdate((n) => n + 1);
    window.addEventListener(LIVE_EVENT, handler);
    return () => window.removeEventListener(LIVE_EVENT, handler);
  }, []);

  const liveTransactions = window.__liveTxns;

  const addLiveTransaction = useCallback((txn: Transaction & { _scoring?: any; _txnType?: string }) => {
    if (window.__liveTxns.some((t) => t.id === txn.id)) return;
    window.__liveTxns = [txn, ...window.__liveTxns].slice(0, 50);
    console.log(`[LiveStore] Added ${txn.id}, total: ${window.__liveTxns.length}`);
    window.dispatchEvent(new CustomEvent(LIVE_EVENT));
  }, []);

  const updateLiveStatus = useCallback((id: string, status: Transaction["status"]) => {
    window.__liveTxns = window.__liveTxns.map((t) => (t.id === id ? { ...t, status } : t));
    window.dispatchEvent(new CustomEvent(LIVE_EVENT));
  }, []);

  return { liveTransactions, addLiveTransaction, updateLiveStatus };
}

// ── Reviewed Transaction Store ──

export function useReviewedTransactionStore() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const handler = () => {
      console.log("[ReviewedStore] Event received, forcing re-render. Count:", window.__reviewedTxns.length);
      forceUpdate((n) => n + 1);
    };
    window.addEventListener(REVIEWED_EVENT, handler);
    return () => window.removeEventListener(REVIEWED_EVENT, handler);
  }, []);

  const reviewedTransactions = window.__reviewedTxns;

  const addReviewedTransaction = useCallback((txn: Transaction) => {
    if (window.__reviewedTxns.some((t) => t.id === txn.id)) return;
    window.__reviewedTxns = [txn, ...window.__reviewedTxns].slice(0, 100);
    console.log(`[ReviewedStore] Added ${txn.id}, total: ${window.__reviewedTxns.length}`, txn);
    window.dispatchEvent(new CustomEvent(REVIEWED_EVENT));
  }, []);

  const updateReviewedStatus = useCallback((id: string, status: Transaction["status"]) => {
    window.__reviewedTxns = window.__reviewedTxns.map((t) => (t.id === id ? { ...t, status } : t));
    console.log(`[ReviewedStore] Updated ${id} → ${status}`);
    window.dispatchEvent(new CustomEvent(REVIEWED_EVENT));
  }, []);

  return { reviewedTransactions, addReviewedTransaction, updateReviewedStatus };
}
