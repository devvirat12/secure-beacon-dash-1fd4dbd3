import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle, XCircle, TrendingUp, MapPin, Zap, BarChart3 } from "lucide-react";
import { RiskLevel, ScoringResult, LiveTransaction } from "@/lib/types";
import { generateDatasetTransaction, getUserProfile } from "@/lib/dataset";
import { scoreTransaction } from "@/lib/scoring-engine";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useToast } from "@/hooks/use-toast";

const riskBadgeStyle = (level: RiskLevel) => {
  const map: Record<RiskLevel, string> = {
    SAFE: "bg-safe/15 text-safe border-safe/30",
    WARNING: "bg-warning/15 text-warning border-warning/30",
    HIGH_RISK: "bg-danger/15 text-danger border-danger/30",
  };
  return map[level];
};

const riskLabels: Record<RiskLevel, string> = { SAFE: "Safe", WARNING: "Warning", HIGH_RISK: "High Risk" };

function generateScoredTransaction(recentCountMap: Map<string, number>): LiveTransaction & { _scoring?: ScoringResult } {
  const raw = generateDatasetTransaction();
  const user = raw._userRef;
  const recentCount = recentCountMap.get(user.userId) || 0;

  const scoring = scoreTransaction(raw.transactionId, raw.amount, raw.location, user, recentCount);

  // Track frequency
  recentCountMap.set(user.userId, recentCount + 1);

  return {
    id: raw.transactionId,
    userId: user.userId,
    date: raw.timestamp,
    amount: raw.amount,
    location: raw.location,
    riskScore: scoring.riskScore,
    riskLevel: scoring.riskLevel,
    status: scoring.riskScore >= 50 ? "Pending" : "Confirmed Legit",
    metrics: scoring.metrics,
    _scoring: scoring,
  };
}

const LiveTransactionStream = () => {
  const [transactions, setTransactions] = useState<(LiveTransaction & { _scoring?: ScoringResult })[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedScoring, setSelectedScoring] = useState<ScoringResult | null>(null);
  const [selectedTxnId, setSelectedTxnId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<(LiveTransaction & { _scoring?: ScoringResult }) | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const frequencyMap = useRef(new Map<string, number>());
  const { toast } = useToast();

  useEffect(() => {
    const seed = Array.from({ length: 3 }, () => generateScoredTransaction(frequencyMap.current));
    setTransactions(seed);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTxn = generateScoredTransaction(frequencyMap.current);
      setTransactions((prev) => [newTxn, ...prev].slice(0, 50));
    }, 2000 + Math.random() * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [transactions.length]);

  const handleRowClick = useCallback((txn: LiveTransaction & { _scoring?: ScoringResult }) => {
    setSelectedDetail(txn);
    if (txn.riskScore >= 50 && txn.status === "Pending" && txn._scoring) {
      setSelectedScoring(txn._scoring);
      setSelectedTxnId(txn.id);
      setShowModal(true);
    }
  }, []);

  const handleConfirm = (response: "legit" | "fraud") => {
    if (!selectedTxnId) return;

    // If confirmed legit, update user's behavioral profile
    if (response === "legit") {
      const txn = transactions.find((t) => t.id === selectedTxnId);
      if (txn) {
        const user = getUserProfile(txn.userId);
        if (user) {
          // Incrementally update average
          const histLen = user.transactionHistory.length;
          user.avgTransactionAmount = Math.round(((user.avgTransactionAmount * histLen) + txn.amount) / (histLen + 1) * 100) / 100;
          user.transactionHistory.push({
            transactionId: txn.id,
            userId: txn.userId,
            amount: txn.amount,
            timestamp: txn.date,
            location: txn.location,
            category: "Other",
          });
        }
      }
    }

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === selectedTxnId
          ? { ...t, status: response === "legit" ? "Confirmed Legit" as const : "Fraud" as const }
          : t
      )
    );
    toast({
      title: response === "legit" ? "Transaction Confirmed" : "Fraud Reported",
      description: response === "legit" ? "Behavioral profile updated." : "Transaction reported as fraud.",
    });
    setShowModal(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Stream */}
        <Card className="rounded-2xl shadow-sm border-border/50 lg:col-span-2">
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
            <div ref={scrollRef} className="max-h-[400px] overflow-y-auto">
              <div className="divide-y divide-border">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    onClick={() => handleRowClick(txn)}
                    className={`flex items-center gap-4 px-6 py-3 transition-colors animate-in fade-in-0 slide-in-from-top-2 duration-300 ${
                      txn.status === "Fraud" ? "bg-danger/5" : ""
                    } ${selectedDetail?.id === txn.id ? "bg-primary/5" : ""} cursor-pointer hover:bg-muted/50`}
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

        {/* Risk Analysis Panel */}
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDetail?._scoring ? (
              <>
                {/* Score breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Final Risk Score</span>
                    <span className={`text-2xl font-bold ${selectedDetail.riskScore >= 70 ? "text-danger" : selectedDetail.riskScore >= 50 ? "text-warning" : "text-safe"}`}>
                      {selectedDetail.riskScore}
                    </span>
                  </div>
                  <Badge variant="outline" className={`${riskBadgeStyle(selectedDetail.riskLevel)}`}>
                    {riskLabels[selectedDetail.riskLevel]}
                  </Badge>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {[
                      { label: "Rule", value: selectedDetail._scoring.ruleScore },
                      { label: "ML", value: selectedDetail._scoring.mlScore },
                      { label: "Behavioral", value: selectedDetail._scoring.behavioralScore },
                    ].map((s) => (
                      <div key={s.label} className="rounded-lg bg-muted p-2 text-center">
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                        <p className="text-sm font-bold text-foreground">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deviation Metrics */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Deviation Metrics</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <TrendingUp className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Amount Deviation</span>
                      <span className={`ml-auto font-semibold ${selectedDetail._scoring.metrics.amountDeviation > 3 ? "text-danger" : "text-foreground"}`}>
                        {selectedDetail._scoring.metrics.amountDeviation.toFixed(1)}x
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <BarChart3 className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Monthly Spend Ratio</span>
                      <span className={`ml-auto font-semibold ${selectedDetail._scoring.metrics.monthlySpendRatio > 1.5 ? "text-warning" : "text-foreground"}`}>
                        {selectedDetail._scoring.metrics.monthlySpendRatio.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Location Anomaly</span>
                      <Badge variant="outline" className={`ml-auto text-[10px] px-1.5 py-0 ${selectedDetail._scoring.metrics.locationFlag ? "bg-danger/15 text-danger border-danger/30" : "bg-safe/15 text-safe border-safe/30"}`}>
                        {selectedDetail._scoring.metrics.locationFlag ? "FLAGGED" : "OK"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Zap className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Frequency Spike</span>
                      <Badge variant="outline" className={`ml-auto text-[10px] px-1.5 py-0 ${selectedDetail._scoring.metrics.frequencySpike ? "bg-warning/15 text-warning border-warning/30" : "bg-safe/15 text-safe border-safe/30"}`}>
                        {selectedDetail._scoring.metrics.frequencySpike ? "SPIKE" : "NORMAL"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Reasons */}
                {selectedDetail._scoring.reasons.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-border">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Why Flagged</p>
                    <ul className="space-y-1">
                      {selectedDetail._scoring.reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-foreground">
                          <span className="mt-1 h-1 w-1 rounded-full bg-primary shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BarChart3 className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">Click a transaction to view<br />dataset-driven risk analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedScoring && (
        <ConfirmationModal
          open={showModal}
          onOpenChange={setShowModal}
          result={selectedScoring}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default LiveTransactionStream;
