import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Transaction, RiskLevel, AnalysisResult } from "@/lib/types";
import { mockUser, generateDemoAnalysis } from "@/lib/mock-data";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useToast } from "@/hooks/use-toast";

const locations = ["New York", "Boston", "Chicago", "Miami", "London", "Lagos, Nigeria", "Berlin", "Tokyo", "San Francisco", "Dubai"];
const normalLocations = ["New York", "Boston", "Chicago"];

let idCounter = 100;

function generateRandomTransaction(): Transaction & { userId: string } {
  const isAnomaly = Math.random() < 0.25;
  const amount = isAnomaly
    ? 500 + Math.floor(Math.random() * 4500)
    : 10 + Math.floor(Math.random() * 200);
  const location = isAnomaly
    ? locations[Math.floor(Math.random() * locations.length)]
    : normalLocations[Math.floor(Math.random() * normalLocations.length)];

  const analysis = generateDemoAnalysis(amount, location);
  idCounter++;

  return {
    id: `txn-live-${idCounter}`,
    userId: `USR-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`,
    date: new Date().toISOString(),
    amount,
    location,
    riskScore: analysis.riskScore,
    riskLevel: analysis.riskLevel,
    status: analysis.riskScore >= 50 ? "Pending" : "Confirmed Legit",
  };
}

const riskBadgeStyle = (level: RiskLevel) => {
  const map: Record<RiskLevel, string> = {
    SAFE: "bg-safe/15 text-safe border-safe/30",
    WARNING: "bg-warning/15 text-warning border-warning/30",
    HIGH_RISK: "bg-danger/15 text-danger border-danger/30",
  };
  return map[level];
};

const riskLabels: Record<RiskLevel, string> = { SAFE: "Safe", WARNING: "Warning", HIGH_RISK: "High Risk" };

const LiveTransactionStream = () => {
  const [transactions, setTransactions] = useState<(Transaction & { userId: string })[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<AnalysisResult | null>(null);
  const [selectedTxnId, setSelectedTxnId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Seed a few initial transactions
    const seed = Array.from({ length: 3 }, () => generateRandomTransaction());
    setTransactions(seed);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTxn = generateRandomTransaction();
      setTransactions((prev) => [newTxn, ...prev].slice(0, 50));
    }, 2000 + Math.random() * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [transactions.length]);

  const handleRowClick = useCallback((txn: Transaction & { userId: string }) => {
    if (txn.riskScore < 50 || txn.status !== "Pending") return;
    const analysis = generateDemoAnalysis(txn.amount, txn.location);
    analysis.transactionId = txn.id;
    analysis.riskScore = txn.riskScore;
    analysis.riskLevel = txn.riskLevel;
    setSelectedTxn(analysis);
    setSelectedTxnId(txn.id);
    setShowModal(true);
  }, []);

  const handleConfirm = (response: "legit" | "fraud") => {
    if (!selectedTxnId) return;
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === selectedTxnId
          ? { ...t, status: response === "legit" ? "Confirmed Legit" as const : "Fraud" as const }
          : t
      )
    );
    toast({
      title: response === "legit" ? "Transaction Confirmed" : "Fraud Reported",
      description: response === "legit" ? "Marked as legitimate." : "Reported as fraud.",
    });
    setShowModal(false);
  };

  return (
    <>
      <Card className="rounded-2xl shadow-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            Live Transaction Stream
            <Badge variant="outline" className="ml-auto text-xs bg-safe/10 text-safe border-safe/30">
              ● Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div ref={scrollRef} className="max-h-[360px] overflow-y-auto">
            <div className="divide-y divide-border">
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  onClick={() => handleRowClick(txn)}
                  className={`flex items-center gap-4 px-6 py-3 transition-colors animate-in fade-in-0 slide-in-from-top-2 duration-300 ${
                    txn.status === "Fraud" ? "bg-danger/5" : ""
                  } ${txn.riskScore >= 50 && txn.status === "Pending" ? "cursor-pointer hover:bg-muted/50" : ""}`}
                >
                  <div className="shrink-0">
                    {txn.status === "Fraud" ? (
                      <XCircle className="h-4 w-4 text-danger" />
                    ) : txn.riskScore >= 50 ? (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-safe" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 grid grid-cols-5 gap-2 items-center text-xs">
                    <span className="text-muted-foreground font-mono truncate">{txn.id}</span>
                    <span className="text-muted-foreground">{txn.userId}</span>
                    <span className="font-medium text-foreground">${txn.amount.toLocaleString()}</span>
                    <span className="text-muted-foreground truncate">{txn.location}</span>
                    <span className="text-muted-foreground">
                      {new Date(txn.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className={`text-xs font-semibold ${txn.riskScore >= 70 ? "text-danger" : txn.riskScore >= 50 ? "text-warning" : "text-safe"}`}>
                      {txn.riskScore}
                    </span>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${riskBadgeStyle(txn.riskLevel)}`}>
                      {riskLabels[txn.riskLevel]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTxn && (
        <ConfirmationModal
          open={showModal}
          onOpenChange={setShowModal}
          result={selectedTxn}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default LiveTransactionStream;
