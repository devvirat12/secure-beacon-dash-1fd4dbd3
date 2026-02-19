import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle, XCircle, BarChart3, Link2, UserX, Clock } from "lucide-react";
import { RiskLevel, ScoringResult, LiveTransaction } from "@/lib/types";
import { generateDatasetTransaction, getUserProfile, SimulationInjection } from "@/lib/dataset";
import { scoreTransaction } from "@/lib/scoring-engine";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useToast } from "@/hooks/use-toast";
import { SimTransactionType } from "@/components/SimulationControls";

const riskBadgeStyle = (level: RiskLevel) => {
  const map: Record<RiskLevel, string> = {
    SAFE: "bg-safe/15 text-safe border-safe/30",
    WARNING: "bg-warning/15 text-warning border-warning/30",
    HIGH_RISK: "bg-danger/15 text-danger border-danger/30",
  };
  return map[level];
};

const riskLabels: Record<RiskLevel, string> = { SAFE: "Safe", WARNING: "Warning", HIGH_RISK: "High Risk" };

const txnTypeLabels: Record<string, string> = {
  standard: "Standard",
  upi: "UPI",
  payment_link: "Pay Link",
};

function generateScoredTransaction(
  recentCountMap: Map<string, number>,
  injection?: SimulationInjection,
  txnType?: SimTransactionType
): LiveTransaction & { _scoring?: ScoringResult; _txnType?: string } {
  const raw = generateDatasetTransaction(injection, txnType);
  const user = raw._userRef;
  const recentCount = recentCountMap.get(user.userId) || 0;

  const scoring = scoreTransaction(
    raw.transactionId, raw.amount, raw.city, raw.upiId, raw._upiInfo,
    user, recentCount, raw.paymentLink, raw.timestamp
  );

  recentCountMap.set(user.userId, recentCount + 1);

  let displayType = "standard";
  if (raw.paymentLink) displayType = "payment_link";
  else if (raw.upiId && !["bigbasket@razorpay", "swiggy@paytm", "flipkart@axl", "irctc@sbi", "apollo247@hdfcbank", "electricity.tneb@paytm", "zomato@ybl"].every(id => id !== raw.upiId)) displayType = "upi";

  return {
    id: raw.transactionId,
    userId: user.userId,
    date: raw.timestamp,
    amount: raw.amount,
    location: raw.city,
    upiId: raw.upiId,
    paymentLink: raw.paymentLink,
    riskScore: scoring.riskScore,
    riskLevel: scoring.riskLevel,
    status: scoring.riskScore >= 50 ? "Pending" : "Confirmed Legit",
    metrics: scoring.metrics,
    _scoring: scoring,
    _txnType: displayType,
  };
}

const LiveTransactionStream = () => {
  const [transactions, setTransactions] = useState<(LiveTransaction & { _scoring?: ScoringResult; _txnType?: string })[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedScoring, setSelectedScoring] = useState<ScoringResult | null>(null);
  const [selectedTxnId, setSelectedTxnId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<(LiveTransaction & { _scoring?: ScoringResult; _txnType?: string }) | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const frequencyMap = useRef(new Map<string, number>());
  const { toast } = useToast();

  useEffect(() => {
    const types: SimTransactionType[] = ["normal", "upi", "payment_link"];
    const seed = Array.from({ length: 3 }, (_, i) =>
      generateScoredTransaction(frequencyMap.current, undefined, types[i % 3])
    );
    setTransactions(seed);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const effectiveType = (["normal", "upi", "payment_link"] as SimTransactionType[])[Math.floor(Math.random() * 3)];
      const newTxn = generateScoredTransaction(frequencyMap.current, undefined, effectiveType);
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

    if (response === "legit") {
      const txn = transactions.find((t) => t.id === selectedTxnId);
      if (txn) {
        const user = getUserProfile(txn.userId);
        if (user) {
          const histLen = user.transactionHistory.length;
          user.avgTransactionAmount = Math.round(((user.avgTransactionAmount * histLen) + txn.amount) / (histLen + 1));
          user.transactionHistory.push({
            transactionId: txn.id, userId: txn.userId, amount: txn.amount,
            timestamp: txn.date, city: txn.location, upiId: txn.upiId || "", category: "Other",
          });
          if (txn.upiId && !user.usualUpiIds.includes(txn.upiId)) {
            user.usualUpiIds.push(txn.upiId);
          }
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
        <Card className="glass-card rounded-2xl lg:col-span-2">
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
              <div className="divide-y divide-border/50">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    onClick={() => handleRowClick(txn)}
                    className={`flex items-center gap-4 px-6 py-3 transition-colors animate-in fade-in-0 slide-in-from-top-2 duration-300 ${
                      txn.status === "Fraud" ? "bg-danger/5" : ""
                    } ${selectedDetail?.id === txn.id ? "bg-primary/5" : ""} cursor-pointer hover:bg-secondary/30`}
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
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 w-fit">
                        {txnTypeLabels[(txn as any)._txnType] || "Standard"}
                      </Badge>
                      <span className="font-medium text-foreground">₹{txn.amount.toLocaleString("en-IN")}</span>
                      <span className="text-muted-foreground truncate">{txn.location}</span>
                      <span className="text-muted-foreground truncate">{txn.upiId || "—"}</span>
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
        <Card className="glass-card rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Risk Analysis
            </CardTitle>
            <p className="text-[10px] text-muted-foreground mt-0.5">Flagging Only — No Auto Blocking</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDetail?._scoring ? (
              <>
                {/* Final Score */}
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

                  <div className="rounded-lg bg-secondary/50 p-2 space-y-0.5">
                    <p className="text-[10px] text-muted-foreground text-center font-mono">
                      ML = (IsoForest × 0.5) + (LightGBM × 0.5)
                    </p>
                    <p className="text-[10px] text-muted-foreground text-center font-mono">
                      = ({selectedDetail._scoring.anomalyScore || 0} × 0.5) + ({selectedDetail._scoring.fraudProbability || 0} × 0.5) = <span className="font-bold text-foreground">{selectedDetail._scoring.mlScore}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground text-center font-mono mt-1">
                      Final = (Rule × 0.6) + (ML × 0.4)
                    </p>
                    <p className="text-[10px] text-muted-foreground text-center font-mono">
                      = ({selectedDetail._scoring.ruleScore} × 0.6) + ({selectedDetail._scoring.mlScore} × 0.4) = <span className="font-bold text-foreground">{selectedDetail.riskScore}</span>
                    </p>
                  </div>
                </div>

                {/* A. Rule-Based Engine */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">A. Rule-Based Engine</p>
                    <span className="text-xs font-bold text-foreground">{selectedDetail._scoring.ruleScore}/100</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { label: "Amount Deviation", flag: selectedDetail._scoring.metrics.amountDeviation > 3, value: `${selectedDetail._scoring.metrics.amountDeviation.toFixed(1)}x` },
                      { label: "City Anomaly", flag: selectedDetail._scoring.metrics.locationFlag, value: selectedDetail._scoring.metrics.locationFlag ? "FLAGGED" : "OK" },
                      { label: "Monthly Spend Ratio", flag: selectedDetail._scoring.metrics.monthlySpendRatio > 1.5, value: `${selectedDetail._scoring.metrics.monthlySpendRatio.toFixed(2)}` },
                      { label: "Frequency Spike", flag: selectedDetail._scoring.metrics.frequencySpike, value: selectedDetail._scoring.metrics.frequencySpike ? "SPIKE" : "NORMAL" },
                      { label: "Night Transaction", flag: selectedDetail._scoring.metrics.isNightTransaction, value: selectedDetail._scoring.metrics.isNightTransaction ? "2AM–5AM" : "OK" },
                    ].map((rule) => (
                      <div key={rule.label} className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">{rule.label}</span>
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${rule.flag ? "bg-danger/15 text-danger border-danger/30" : "bg-safe/15 text-safe border-safe/30"}`}>
                          {rule.value}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* B. ML Anomaly Engine */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">B. ML Engine (Hybrid)</p>
                    <span className="text-xs font-bold text-foreground">{selectedDetail._scoring.mlScore}/100</span>
                  </div>

                  {/* Model breakdown */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Isolation Forest (Anomaly)</span>
                      </div>
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${(selectedDetail._scoring.anomalyScore || 0) > 30 ? "bg-danger/15 text-danger border-danger/30" : "bg-safe/15 text-safe border-safe/30"}`}>
                        {selectedDetail._scoring.anomalyScore || 0}/100
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1">
                        <UserX className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">LightGBM (Fraud Prob.)</span>
                      </div>
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${(selectedDetail._scoring.fraudProbability || 0) > 30 ? "bg-danger/15 text-danger border-danger/30" : "bg-safe/15 text-safe border-safe/30"}`}>
                        {selectedDetail._scoring.fraudProbability || 0}/100
                      </Badge>
                    </div>
                  </div>

                  {/* Enhanced feature flags */}
                  <div className="space-y-1">
                    {[
                      { label: "Beneficiary Risk", flag: selectedDetail._scoring.metrics.beneficiaryRiskScore > 30, value: `${selectedDetail._scoring.metrics.beneficiaryRiskScore}/100` },
                      { label: "Device Change", flag: selectedDetail._scoring.metrics.deviceChangeFlag, value: selectedDetail._scoring.metrics.deviceChangeFlag ? "FLAGGED" : "OK" },
                      { label: "Geo-Velocity", flag: selectedDetail._scoring.metrics.geoVelocityFlag, value: selectedDetail._scoring.metrics.geoVelocityFlag ? "FLAGGED" : "OK" },
                      { label: "Account Age", flag: selectedDetail._scoring.metrics.accountAgeDays < 90, value: `${selectedDetail._scoring.metrics.accountAgeDays}d` },
                      { label: "Fraud History", flag: selectedDetail._scoring.metrics.historicalFraudExposureFlag, value: selectedDetail._scoring.metrics.historicalFraudExposureFlag ? "YES" : "NO" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">{item.label}</span>
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${item.flag ? "bg-danger/15 text-danger border-danger/30" : "bg-safe/15 text-safe border-safe/30"}`}>
                          {item.value}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explainable Reasons */}
                {selectedDetail._scoring.reasons.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-border/50">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Explainable Alert</p>
                    {selectedDetail.riskScore >= 50 && (
                      <p className="text-[10px] text-warning font-medium">Transaction flagged due to significant behavioral deviation.</p>
                    )}
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
