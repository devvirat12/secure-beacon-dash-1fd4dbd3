import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Transaction, RiskLevel } from "@/lib/types";

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (txn: Transaction) => void;
  updateStatus: (id: string, status: Transaction["status"]) => void;
}

const TransactionStoreContext = createContext<TransactionStore | null>(null);

export function TransactionStoreProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = useCallback((txn: Transaction) => {
    setTransactions((prev) => [txn, ...prev].slice(0, 100));
  }, []);

  const updateStatus = useCallback((id: string, status: Transaction["status"]) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }, []);

  return (
    <TransactionStoreContext.Provider value={{ transactions, addTransaction, updateStatus }}>
      {children}
    </TransactionStoreContext.Provider>
  );
}

export function useTransactionStore() {
  const ctx = useContext(TransactionStoreContext);
  if (!ctx) throw new Error("useTransactionStore must be used within TransactionStoreProvider");
  return ctx;
}
