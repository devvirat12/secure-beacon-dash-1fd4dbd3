import { useSyncExternalStore, useCallback, ReactNode } from "react";
import { Transaction } from "@/lib/types";

/**
 * Window-level singleton stores — guaranteed to survive HMR and module duplication.
 */
type Listener = () => void;

class TransactionStore<T extends Transaction> {
  private items: T[] = [];
  private listeners = new Set<Listener>();
  private maxItems: number;

  constructor(maxItems: number) {
    this.maxItems = maxItems;
  }

  getSnapshot = (): T[] => this.items;

  add(item: T) {
    if (this.items.some((t) => t.id === item.id)) return;
    this.items = [item, ...this.items].slice(0, this.maxItems);
    console.log(`[TransactionStore] Added ${item.id}, total: ${this.items.length}`, item);
    this.emit();
  }

  updateStatus(id: string, status: Transaction["status"]) {
    this.items = this.items.map((t) => (t.id === id ? { ...t, status } : t));
    console.log(`[TransactionStore] Updated ${id} → ${status}`);
    this.emit();
  }

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };

  private emit() {
    this.listeners.forEach((l) => l());
  }
}

// Window-level singletons — cannot be duplicated by Vite HMR
declare global {
  interface Window {
    __liveStore?: TransactionStore<Transaction & { _scoring?: any; _txnType?: string }>;
    __reviewedStore?: TransactionStore<Transaction>;
  }
}

if (!window.__liveStore) {
  window.__liveStore = new TransactionStore<Transaction & { _scoring?: any; _txnType?: string }>(50);
}
if (!window.__reviewedStore) {
  window.__reviewedStore = new TransactionStore<Transaction>(100);
}

const liveStore = window.__liveStore;
const reviewedStore = window.__reviewedStore;

// ── Providers (no-op wrappers for API compatibility) ──

export function LiveTransactionStoreProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function ReviewedTransactionStoreProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// ── Hooks ──

export function useLiveTransactionStore() {
  const liveTransactions = useSyncExternalStore(liveStore.subscribe, liveStore.getSnapshot);
  const addLiveTransaction = useCallback((txn: Transaction & { _scoring?: any; _txnType?: string }) => liveStore.add(txn), []);
  const updateLiveStatus = useCallback((id: string, status: Transaction["status"]) => liveStore.updateStatus(id, status), []);
  return { liveTransactions, addLiveTransaction, updateLiveStatus };
}

export function useReviewedTransactionStore() {
  const reviewedTransactions = useSyncExternalStore(reviewedStore.subscribe, reviewedStore.getSnapshot);
  const addReviewedTransaction = useCallback((txn: Transaction) => reviewedStore.add(txn), []);
  const updateReviewedStatus = useCallback((id: string, status: Transaction["status"]) => reviewedStore.updateStatus(id, status), []);
  console.log("[useReviewedTransactionStore] current count:", reviewedTransactions.length);
  return { reviewedTransactions, addReviewedTransaction, updateReviewedStatus };
}
