import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Transaction } from "@/lib/types";

/**
 * Module-level singleton stores — survive HMR and guarantee shared state.
 */
type Listener = () => void;

class TransactionStore<T extends Transaction> {
  private items: T[] = [];
  private listeners = new Set<Listener>();
  private maxItems: number;

  constructor(maxItems: number) {
    this.maxItems = maxItems;
  }

  getItems() { return this.items; }

  add(item: T) {
    if (this.items.some((t) => t.id === item.id)) return;
    this.items = [item, ...this.items].slice(0, this.maxItems);
    console.log(`[TransactionStore] Added ${item.id}, total: ${this.items.length}`, item);
    this.notify();
  }

  updateStatus(id: string, status: Transaction["status"]) {
    this.items = this.items.map((t) => (t.id === id ? { ...t, status } : t));
    console.log(`[TransactionStore] Updated ${id} → ${status}`);
    this.notify();
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

// Module-level singletons — shared across all components, survive HMR
const liveStore = new TransactionStore<Transaction & { _scoring?: any; _txnType?: string }>(50);
const reviewedStore = new TransactionStore<Transaction>(100);

// ── Live Transaction Store ──

function useSyncedStore<T extends Transaction>(store: TransactionStore<T>) {
  const [items, setItems] = useState<T[]>(store.getItems());
  useEffect(() => {
    setItems(store.getItems()); // sync on mount
    const unsub = store.subscribe(() => setItems([...store.getItems()]));
    return () => { unsub(); };
  }, [store]);
  return items;
}

interface LiveTransactionStoreAPI {
  liveTransactions: (Transaction & { _scoring?: any; _txnType?: string })[];
  addLiveTransaction: (txn: Transaction & { _scoring?: any; _txnType?: string }) => void;
  updateLiveStatus: (id: string, status: Transaction["status"]) => void;
}

const LiveCtx = createContext<LiveTransactionStoreAPI | null>(null);

export function LiveTransactionStoreProvider({ children }: { children: ReactNode }) {
  const liveTransactions = useSyncedStore(liveStore);
  const addLiveTransaction = useCallback((txn: Transaction & { _scoring?: any; _txnType?: string }) => liveStore.add(txn), []);
  const updateLiveStatus = useCallback((id: string, status: Transaction["status"]) => liveStore.updateStatus(id, status), []);

  return (
    <LiveCtx.Provider value={{ liveTransactions, addLiveTransaction, updateLiveStatus }}>
      {children}
    </LiveCtx.Provider>
  );
}

export function useLiveTransactionStore(): LiveTransactionStoreAPI {
  const ctx = useContext(LiveCtx);
  if (!ctx) {
    // HMR fallback — still uses singleton so data isn't lost
    return {
      liveTransactions: liveStore.getItems(),
      addLiveTransaction: (txn) => liveStore.add(txn),
      updateLiveStatus: (id, s) => liveStore.updateStatus(id, s),
    };
  }
  return ctx;
}

// ── Reviewed Transaction Store ──

interface ReviewedTransactionStoreAPI {
  reviewedTransactions: Transaction[];
  addReviewedTransaction: (txn: Transaction) => void;
  updateReviewedStatus: (id: string, status: Transaction["status"]) => void;
}

const ReviewedCtx = createContext<ReviewedTransactionStoreAPI | null>(null);

export function ReviewedTransactionStoreProvider({ children }: { children: ReactNode }) {
  const reviewedTransactions = useSyncedStore(reviewedStore);
  const addReviewedTransaction = useCallback((txn: Transaction) => reviewedStore.add(txn), []);
  const updateReviewedStatus = useCallback((id: string, status: Transaction["status"]) => reviewedStore.updateStatus(id, status), []);

  return (
    <ReviewedCtx.Provider value={{ reviewedTransactions, addReviewedTransaction, updateReviewedStatus }}>
      {children}
    </ReviewedCtx.Provider>
  );
}

export function useReviewedTransactionStore(): ReviewedTransactionStoreAPI {
  const ctx = useContext(ReviewedCtx);
  if (!ctx) {
    // HMR fallback — still uses singleton so data isn't lost
    return {
      reviewedTransactions: reviewedStore.getItems(),
      addReviewedTransaction: (txn) => reviewedStore.add(txn),
      updateReviewedStatus: (id, s) => reviewedStore.updateStatus(id, s),
    };
  }
  return ctx;
}
