import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity, AlertTriangle, CheckCircle, XCircle, BarChart3, Link2,
  UserX, Clock, Shield, TrendingUp, Zap, Cpu, GitBranch, Loader2,
  SendHorizonal, BanknoteIcon,
} from "lucide-react";
import { RiskLevel, ScoringResult, LiveTransaction } from "@/lib/types";
import { generateDatasetTransaction, getUserProfile, SimulationInjection } from "@/lib/dataset";
import { scoreTransaction } from "@/lib/scoring-engine";
import ConfirmationModal from "@/components/ConfirmationModal";
import GeoVelocityViz from "@/components/GeoVelocityViz";
import { useToast } from "@/hooks/use-toast";
import { useLiveTransactionStore, useReviewedTransactionStore } from "@/lib/transaction-store";

// ─── Lifecycle Types ───────────────────────────────────────────────────────────

type LifecycleState =
  | "INITIATED"
  | "RISK_CHECK_IN_PROGRESS"
  | "HYBRID_MODEL_EVALUATION"
  | "DECISION_PENDING"
  | "SAFE_APPROVED"
  | "WARNING_FLAGGED"
  | "HIGH_RISK_FLAGGED"
  | "COMPLETED";

interface LifecycleMeta {
  state: LifecycleState;
  startedAt: number;
  label: string;
}

type ScoredTxn = LiveTransaction & { _scoring?: ScoringResult; _txnType?: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const riskBadgeStyle = (level: RiskLevel) => {
  const map: Record<RiskLevel, string> = {
    SAFE: "bg-safe/15 text-safe border-safe/30",
    WARNING: "bg-warning/15 text-warning border-warning/30",
    HIGH_RISK: "bg-danger/15 text-danger border-danger/30",
  };
  return map[level];
};

const riskLabels: Record<RiskLevel, string> = {
  SAFE: "Safe",
  WARNING: "Warning",
  HIGH_RISK: "High Risk",
};

const txnTypeLabels: Record<string, string> = {
  standard: "Standard",
  upi: "UPI",
  payment_link: "Pay Link",
};

// Timeline steps for visual tracker
const TIMELINE_STEPS: { key: LifecycleState; label: string; icon: React.ElementType }[] = [
  { key: "INITIATED",             label: "Initiated",    icon: SendHorizonal },
  { key: "RISK_CHECK_IN_PROGRESS",label: "Rule Check",   icon: GitBranch },
  { key: "HYBRID_MODEL_EVALUATION",label: "ML Engine",   icon: Cpu },
  { key: "DECISION_PENDING",      label: "Decision",     icon: Zap },
  { key: "COMPLETED",             label: "Completed",    icon: BanknoteIcon },
];

// Map every state to its "timeline index" for progress tracking
const STATE_STEP: Record<LifecycleState, number> = {
  INITIATED: 0,
  RISK_CHECK_IN_PROGRESS: 1,
  HYBRID_MODEL_EVALUATION: 2,
  DECISION_PENDING: 3,
  SAFE_APPROVED: 3,
  WARNING_FLAGGED: 3,
  HIGH_RISK_FLAGGED: 3,
  COMPLETED: 4,
};

const lifecycleLabel: Record<LifecycleState, string> = {
  INITIATED: "Payment Initiated",
  RISK_CHECK_IN_PROGRESS: "Running Rule Engine...",
  HYBRID_MODEL_EVALUATION: "Running ML Engine...",
  DECISION_PENDING: "Evaluating Decision...",
  SAFE_APPROVED: "Payment Approved ✓",
  WARNING_FLAGGED: "Suspicious Activity Detected",
  HIGH_RISK_FLAGGED: "High Risk Transaction Detected",
  COMPLETED: "Payment Successfully Sent",
};

const lifecycleBadgeStyle: Record<LifecycleState, string> = {
  INITIATED: "bg-primary/10 text-primary border-primary/30",
  RISK_CHECK_IN_PROGRESS: "bg-warning/10 text-warning border-warning/30",
  HYBRID_MODEL_EVALUATION: "bg-warning/10 text-warning border-warning/30",
  DECISION_PENDING: "bg-primary/10 text-primary border-primary/30",
  SAFE_APPROVED: "bg-safe/15 text-safe border-safe/30",
  WARNING_FLAGGED: "bg-warning/15 text-warning border-warning/30",
  HIGH_RISK_FLAGGED: "bg-danger/15 text-danger border-danger/30",
  COMPLETED: "bg-safe/15 text-safe border-safe/30",
};

// ─── Transaction generator ─────────────────────────────────────────────────────

function generateScoredTransaction(
  recentCountMap: Map<string, number>,
  injection?: SimulationInjection
): ScoredTxn {
  const raw = generateDatasetTransaction(injection);
  const user = raw._userRef;
  const recentCount = recentCountMap.get(user.userId) || 0;

  const scoring = scoreTransaction(
    raw.transactionId, raw.amount, raw.city, raw.upiId, raw._upiInfo,
    user, recentCount, raw.paymentLink, raw.timestamp
  );

  recentCountMap.set(user.userId, recentCount + 1);

  let displayType = "standard";
  if (raw.paymentLink) displayType = "payment_link";
  else if (raw.upiId) displayType = "upi";

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

// ─── Pre-Auth Lifecycle Timeline Component ────────────────────────────────────

const PreAuthTimeline = ({ lifecycle }: { lifecycle: LifecycleMeta }) => {
  const currentStep = STATE_STEP[lifecycle.state];
  const isProcessing = ["INITIATED", "RISK_CHECK_IN_PROGRESS", "HYBRID_MODEL_EVALUATION", "DECISION_PENDING"].includes(lifecycle.state);

  return (
    <div className="rounded-xl border border-border/60 bg-secondary/20 p-3 space-y-3">
      {/* Status label */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {isProcessing && (
            <Loader2 className="h-3 w-3 text-primary animate-spin" />
          )}
          <span className="text-[11px] font-semibold text-foreground">
            {lifecycleLabel[lifecycle.state]}
          </span>
        </div>
        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${lifecycleBadgeStyle[lifecycle.state]}`}>
          {lifecycle.state.replace(/_/g, " ")}
        </Badge>
      </div>

      {/* Step tracker */}
      <div className="flex items-center gap-0">
        {TIMELINE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentStep;
          const isActive = idx === currentStep;
          const isPending = idx > currentStep;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-0.5">
                <motion.div
                  animate={isActive && isProcessing ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={{ repeat: isActive && isProcessing ? Infinity : 0, duration: 1.2 }}
                  className={`h-6 w-6 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    isDone
                      ? "bg-safe border-safe"
                      : isActive
                      ? lifecycle.state === "HIGH_RISK_FLAGGED"
                        ? "bg-danger/20 border-danger"
                        : lifecycle.state === "WARNING_FLAGGED"
                        ? "bg-warning/20 border-warning"
                        : lifecycle.state === "SAFE_APPROVED" || lifecycle.state === "COMPLETED"
                        ? "bg-safe/20 border-safe"
                        : "bg-primary/20 border-primary"
                      : "bg-secondary/50 border-border/50"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle className="h-3 w-3 text-safe-foreground" />
                  ) : (
                    <Icon className={`h-3 w-3 ${
                      isActive
                        ? lifecycle.state === "HIGH_RISK_FLAGGED" ? "text-danger"
                          : lifecycle.state === "WARNING_FLAGGED" ? "text-warning"
                          : lifecycle.state === "SAFE_APPROVED" || lifecycle.state === "COMPLETED" ? "text-safe"
                          : "text-primary"
                        : "text-muted-foreground/40"
                    }`} />
                  )}
                </motion.div>
                <span className={`text-[8px] leading-none text-center w-12 ${
                  isActive ? "text-foreground font-medium" : isPending ? "text-muted-foreground/40" : "text-muted-foreground"
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < TIMELINE_STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-0.5 mb-3 rounded-full transition-colors duration-500 ${
                  idx < currentStep ? "bg-safe" : "bg-border/40"
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

const LiveTransactionStream = () => {
  const [transactions, setTransactions] = useState<ScoredTxn[]>([]);
  const [lifecycles, setLifecycles] = useState<Map<string, LifecycleMeta>>(new Map());
  const [showModal, setShowModal] = useState(false);
  const [selectedScoring, setSelectedScoring] = useState<ScoringResult | null>(null);
  const [selectedTxnId, setSelectedTxnId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<ScoredTxn | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const frequencyMap = useRef(new Map<string, number>());
  const pendingModal = useRef<{ id: string; scoring: ScoringResult } | null>(null);
  const { toast } = useToast();
  const { updateLiveStatus } = useLiveTransactionStore();
  const { addReviewedTransaction } = useReviewedTransactionStore();

  // ── Lifecycle runner ─────────────────────────────────────────────────────

  const runLifecycle = useCallback((txn: ScoredTxn) => {
    const setLC = (state: LifecycleState) =>
      setLifecycles((prev) => new Map(prev).set(txn.id, { state, startedAt: Date.now(), label: lifecycleLabel[state] }));

    // Step 1 — INITIATED
    setLC("INITIATED");

    // Step 2 — RISK_CHECK_IN_PROGRESS
    const t1 = setTimeout(() => {
      setLC("RISK_CHECK_IN_PROGRESS");
    }, 300);

    // Step 3 — HYBRID_MODEL_EVALUATION (scoring already done, just show state)
    const t2 = setTimeout(() => {
      setLC("HYBRID_MODEL_EVALUATION");
    }, 700);

    // Step 4 — DECISION_PENDING
    const t3 = setTimeout(() => {
      setLC("DECISION_PENDING");
    }, 1100);

    // Step 5 — Apply decision
    const t4 = setTimeout(() => {
      const score = txn.riskScore;
      if (score >= 70) {
        setLC("HIGH_RISK_FLAGGED");
        // Queue modal — don't open immediately if another is open
        pendingModal.current = { id: txn.id, scoring: txn._scoring! };
        if (!showModal) {
          setSelectedScoring(txn._scoring!);
          setSelectedTxnId(txn.id);
          setShowModal(true);
        }
      } else if (score >= 50) {
        setLC("WARNING_FLAGGED");
        pendingModal.current = { id: txn.id, scoring: txn._scoring! };
        if (!showModal) {
          setSelectedScoring(txn._scoring!);
          setSelectedTxnId(txn.id);
          setShowModal(true);
        }
      } else {
        setLC("SAFE_APPROVED");
        // Auto complete after short pause
        setTimeout(() => setLC("COMPLETED"), 500);
      }
    }, 1500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [showModal]);

  // ── Seed initial transactions ─────────────────────────────────────────────

  useEffect(() => {
    const seed = Array.from({ length: 3 }, () =>
      generateScoredTransaction(frequencyMap.current)
    );
    setTransactions(seed);
    seed.forEach((txn) => {
      setLifecycles((prev) => new Map(prev).set(txn.id, {
        state: "COMPLETED",
        startedAt: Date.now() - 5000,
        label: lifecycleLabel["COMPLETED"],
      }));
    });
  }, []);

  // ── Stream new transactions ───────────────────────────────────────────────

  useEffect(() => {
    const interval = setInterval(() => {
      const newTxn = generateScoredTransaction(frequencyMap.current);
      setTransactions((prev) => [newTxn, ...prev].slice(0, 50));
      runLifecycle(newTxn);
    }, 2500 + Math.random() * 1000);
    return () => clearInterval(interval);
  }, [runLifecycle]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [transactions.length]);

  // ── Row click ─────────────────────────────────────────────────────────────

  const handleRowClick = useCallback((txn: ScoredTxn) => {
    setSelectedDetail(txn);
  }, []);

  // ── Confirmation handler ──────────────────────────────────────────────────

  const handleConfirm = (response: "legit" | "fraud") => {
    if (!selectedTxnId) return;

    if (response === "legit") {
      const txn = transactions.find((t) => t.id === selectedTxnId);
      if (txn) {
        const user = getUserProfile(txn.userId);
        if (user) {
          const histLen = user.transactionHistory.length;
          user.avgTransactionAmount = Math.round(
            ((user.avgTransactionAmount * histLen) + txn.amount) / (histLen + 1)
          );
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

    const newStatus = response === "legit" ? "Confirmed Legit" as const : "Fraud" as const;

    setTransactions((prev) =>
      prev.map((t) => t.id === selectedTxnId ? { ...t, status: newStatus } : t)
    );
    updateLiveStatus(selectedTxnId, newStatus);

    // Mark lifecycle COMPLETED (or keep flagged on fraud)
    setLifecycles((prev) => {
      const next = new Map(prev);
      next.set(selectedTxnId, {
        state: response === "legit" ? "COMPLETED" : "HIGH_RISK_FLAGGED",
        startedAt: Date.now(),
        label: response === "legit" ? lifecycleLabel["COMPLETED"] : "Transaction Blocked (Fraud Reported)",
      });
      return next;
    });

    const txn = transactions.find((t) => t.id === selectedTxnId);
    if (txn) {
      addReviewedTransaction({
        id: txn.id, date: txn.date, amount: txn.amount, location: txn.location,
        riskScore: txn.riskScore, riskLevel: txn.riskLevel, status: newStatus,
      });
    }

    toast({
      title: response === "legit" ? "Transaction Confirmed" : "Fraud Reported",
      description: response === "legit" ? "Behavioral profile updated." : "Transaction reported as fraud.",
    });

    setShowModal(false);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  const selectedLC = selectedDetail ? lifecycles.get(selectedDetail.id) : undefined;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* ── Stream ─────────────────────────────────────────────────── */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Live Transaction Stream
              <span className="ml-auto flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safe opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-safe"></span>
                </span>
                <span className="text-[11px] font-medium text-safe">Live</span>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div ref={scrollRef} className="max-h-[400px] overflow-y-auto">
              <AnimatePresence initial={false}>
                {transactions.map((txn) => {
                  const lc = lifecycles.get(txn.id);
                  const isProcessing = lc && ["INITIATED","RISK_CHECK_IN_PROGRESS","HYBRID_MODEL_EVALUATION","DECISION_PENDING"].includes(lc.state);

                  return (
                    <motion.div
                      key={txn.id}
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      onClick={() => handleRowClick(txn)}
                      className={`flex items-stretch border-b border-border/50 cursor-pointer transition-colors
                        ${txn.status === "Fraud" ? "bg-danger/3" : ""}
                        ${selectedDetail?.id === txn.id ? "bg-primary/5" : "hover:bg-secondary/50"}`}
                    >
                      {/* Left color indicator bar */}
                      <div className={`w-1 shrink-0 rounded-l ${
                        isProcessing ? "bg-primary/40" :
                        txn.status === "Fraud" || txn.riskScore >= 70 ? "bg-danger" :
                        txn.riskScore >= 50 ? "bg-warning" : "bg-safe"
                      }`} />

                      <div className="flex flex-1 items-center gap-4 px-4 py-3">
                        {/* Status icon */}
                        <div className="shrink-0">
                          {isProcessing ? (
                            <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                          ) : txn.status === "Fraud" ? (
                            <XCircle className="h-3.5 w-3.5 text-danger" />
                          ) : txn.riskScore >= 70 ? (
                            <AlertTriangle className="h-3.5 w-3.5 text-danger" />
                          ) : txn.riskScore >= 50 ? (
                            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                          ) : (
                            <CheckCircle className="h-3.5 w-3.5 text-safe" />
                          )}
                        </div>

                        {/* Transaction data */}
                        <div className="min-w-0 flex-1 grid grid-cols-5 gap-2 items-center">
                          <span className="text-[10px] text-muted-foreground font-mono truncate">{txn.id}</span>
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 w-fit border-border">
                            {txnTypeLabels[(txn as any)._txnType] || "Standard"}
                          </Badge>
                          <span className="text-xs font-semibold text-foreground">₹{txn.amount.toLocaleString("en-IN")}</span>
                          <span className="text-[10px] text-muted-foreground truncate">{txn.location}</span>
                          <span className="text-[10px] text-muted-foreground truncate">{txn.upiId || "—"}</span>
                        </div>

                        {/* Score + lifecycle badge */}
                        <div className="shrink-0 flex flex-col items-end gap-1 min-w-[56px]">
                          <span className={`text-sm font-bold tabular-nums ${
                            txn.riskScore >= 70 ? "text-danger" : txn.riskScore >= 50 ? "text-warning" : "text-safe"
                          }`}>
                            {txn.riskScore}
                          </span>
                          {lc && (
                            <Badge variant="outline" className={`text-[8px] px-1.5 py-0 leading-tight ${lifecycleBadgeStyle[lc.state]}`}>
                              {isProcessing ? (
                                <span className="flex items-center gap-0.5">
                                  <Loader2 className="h-2 w-2 animate-spin" />
                                  {lc.state === "RISK_CHECK_IN_PROGRESS" ? "Rules" :
                                   lc.state === "HYBRID_MODEL_EVALUATION" ? "ML" :
                                   lc.state === "DECISION_PENDING" ? "Deciding" : "Starting"}
                                </span>
                              ) : lc.state === "COMPLETED" ? "Sent ✓" :
                                 lc.state === "SAFE_APPROVED" ? "Approved" :
                                 lc.state === "WARNING_FLAGGED" ? "Flagged" :
                                 lc.state === "HIGH_RISK_FLAGGED" ? "Blocked" : lc.state}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* ── Risk Analysis Panel ─────────────────────────────────────── */}
        <Card className="glass-card">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Risk Analysis
            </CardTitle>
            <p className="text-[10px] text-muted-foreground mt-0.5">Pre-Auth Fraud Detection · Non-Blocking</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence mode="wait">
              {selectedDetail?._scoring ? (
                <motion.div
                  key={selectedDetail.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-4"
                >
                  {/* Pre-Auth Lifecycle Timeline */}
                  {selectedLC && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PreAuthTimeline lifecycle={selectedLC} />
                    </motion.div>
                  )}

                  {/* Final Score + Confidence */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Final Risk Score</span>
                      <motion.span
                        key={selectedDetail.riskScore}
                        initial={{ scale: 1.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`text-2xl font-bold ${
                          selectedDetail.riskScore >= 70 ? "text-danger"
                          : selectedDetail.riskScore >= 50 ? "text-warning"
                          : "text-safe"
                        }`}
                      >
                        {selectedDetail.riskScore}
                      </motion.span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={riskBadgeStyle(selectedDetail.riskLevel)}>
                        {riskLabels[selectedDetail.riskLevel]}
                      </Badge>
                      {selectedDetail._scoring.confidenceScore !== undefined && (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary border-primary/30">
                          <Shield className="h-2.5 w-2.5 mr-0.5" />
                          {selectedDetail._scoring.confidenceScore}% confidence
                        </Badge>
                      )}
                    </div>

                    <div className="rounded-lg bg-secondary/50 p-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Rule Score</span>
                        <span className="font-semibold text-foreground">{selectedDetail._scoring.ruleScore}/100</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">ML Score</span>
                        <span className="font-semibold text-foreground">{selectedDetail._scoring.mlScore}/100</span>
                      </div>
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
                        { label: "Behavioral Drift", flag: selectedDetail._scoring.metrics.behavioralDriftScore > 40, value: `${selectedDetail._scoring.metrics.behavioralDriftScore}%` },
                      ].map((rule, i) => (
                        <motion.div
                          key={rule.label}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.25 }}
                          className="flex items-center justify-between text-[11px]"
                        >
                          <span className="text-muted-foreground">{rule.label}</span>
                          <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${
                            rule.flag ? "bg-danger/15 text-danger border-danger/30" : "bg-safe/15 text-safe border-safe/30"
                          }`}>
                            {rule.value}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* B. ML Anomaly Engine */}
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">B. ML Engine (Hybrid)</p>
                      <span className="text-xs font-bold text-foreground">{selectedDetail._scoring.mlScore}/100</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Isolation Forest (Anomaly)</span>
                        </div>
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${
                          (selectedDetail._scoring.anomalyScore || 0) > 30 ? "bg-danger/15 text-danger border-danger/30" : "bg-safe/15 text-safe border-safe/30"
                        }`}>
                          {selectedDetail._scoring.anomalyScore || 0}/100
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1">
                          <UserX className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">LightGBM (Fraud Prob.)</span>
                        </div>
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${
                          (selectedDetail._scoring.fraudProbability || 0) > 30 ? "bg-danger/15 text-danger border-danger/30" : "bg-safe/15 text-safe border-safe/30"
                        }`}>
                          {selectedDetail._scoring.fraudProbability || 0}/100
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {[
                        { label: "Beneficiary Risk", flag: selectedDetail._scoring.metrics.beneficiaryRiskScore > 30, value: `${selectedDetail._scoring.metrics.beneficiaryRiskScore}/100` },
                        { label: "Device Change", flag: selectedDetail._scoring.metrics.deviceChangeFlag, value: selectedDetail._scoring.metrics.deviceChangeFlag ? "FLAGGED" : "OK" },
                        { label: "Geo-Velocity", flag: selectedDetail._scoring.metrics.geoVelocityFlag, value: selectedDetail._scoring.metrics.geoVelocityFlag ? "FLAGGED" : "OK" },
                        { label: "Account Age", flag: selectedDetail._scoring.metrics.accountAgeDays < 90, value: `${selectedDetail._scoring.metrics.accountAgeDays}d` },
                        { label: "Fraud History", flag: selectedDetail._scoring.metrics.historicalFraudExposureFlag, value: selectedDetail._scoring.metrics.historicalFraudExposureFlag ? "YES" : "NO" },
                        { label: "Link Risk Score", flag: selectedDetail._scoring.metrics.linkRiskScore > 10, value: `${selectedDetail._scoring.metrics.linkRiskScore}/30` },
                      ].map((item, i) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.04, duration: 0.25 }}
                          className="flex items-center justify-between text-[11px]"
                        >
                          <span className="text-muted-foreground">{item.label}</span>
                          <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${
                            item.flag ? "bg-danger/15 text-danger border-danger/30" : "bg-safe/15 text-safe border-safe/30"
                          }`}>
                            {item.value}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Geo-Velocity Visualization */}
                  {selectedDetail._scoring.metrics.geoVelocityFlag && selectedDetail._scoring.metrics.previousCity && (
                    <GeoVelocityViz
                      previousCity={selectedDetail._scoring.metrics.previousCity}
                      currentCity={selectedDetail.location}
                      timeDiffMinutes={Math.floor(Math.random() * 45) + 10}
                    />
                  )}

                  {/* Payment Link Deep Inspection */}
                  {selectedDetail._scoring.metrics.linkDeepInspection && (
                    <div className="space-y-1.5 pt-2 border-t border-border/50">
                      <div className="flex items-center gap-1">
                        <Link2 className="h-3 w-3 text-primary" />
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Link Deep Inspection</p>
                      </div>
                      {[
                        { label: "Domain", value: selectedDetail._scoring.metrics.linkDeepInspection.domain },
                        { label: "Shortened URL", value: selectedDetail._scoring.metrics.linkDeepInspection.isShortened ? "YES" : "NO", flag: selectedDetail._scoring.metrics.linkDeepInspection.isShortened },
                        { label: "Suspicious Keywords", value: selectedDetail._scoring.metrics.linkDeepInspection.hasSuspiciousKeywords ? "DETECTED" : "NONE", flag: selectedDetail._scoring.metrics.linkDeepInspection.hasSuspiciousKeywords },
                        { label: "Lookalike Match", value: selectedDetail._scoring.metrics.linkDeepInspection.lookalikeSimilarity > 0.5 ? `${Math.round(selectedDetail._scoring.metrics.linkDeepInspection.lookalikeSimilarity * 100)}% → ${selectedDetail._scoring.metrics.linkDeepInspection.lookalikeDomain}` : "NONE", flag: selectedDetail._scoring.metrics.linkDeepInspection.lookalikeSimilarity > 0.7 },
                        { label: "Domain Age (sim)", value: `${selectedDetail._scoring.metrics.linkDeepInspection.domainAgeSimDays}d`, flag: selectedDetail._scoring.metrics.linkDeepInspection.domainAgeSimDays < 30 },
                        { label: "Link Risk Score", value: `${selectedDetail._scoring.metrics.linkDeepInspection.linkRiskScore}/30`, flag: selectedDetail._scoring.metrics.linkDeepInspection.linkRiskScore > 10 },
                      ].map((item, i) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.04, duration: 0.25 }}
                          className="flex items-center justify-between text-[11px]"
                        >
                          <span className="text-muted-foreground">{item.label}</span>
                          <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${
                            (item as any).flag ? "bg-danger/15 text-danger border-danger/30" : "bg-safe/15 text-safe border-safe/30"
                          }`}>
                            {item.value}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Behavioral Drift Alert */}
                  {selectedDetail._scoring.metrics.behavioralDriftScore > 40 && (
                    <div className="rounded-lg bg-warning/5 border border-warning/20 p-2.5">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-warning" />
                        <span className="text-[11px] font-semibold text-warning">Behavioral Drift Detected</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        14-day spending average deviates {selectedDetail._scoring.metrics.behavioralDriftScore}% from 90-day baseline.
                      </p>
                    </div>
                  )}

                  {/* Explainable Reasons */}
                  {selectedDetail._scoring.reasons.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                      className="space-y-1.5 pt-2 border-t border-border/50"
                    >
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Explainable Alert</p>
                      {selectedDetail.riskScore >= 50 && (
                        <p className="text-[10px] text-warning font-medium">
                          Transaction flagged due to significant behavioral deviation.
                        </p>
                      )}
                      <ul className="space-y-1">
                        {selectedDetail._scoring.reasons.map((r, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.45 + i * 0.06, duration: 0.25 }}
                            className="flex items-start gap-1.5 text-[11px] text-foreground"
                          >
                            <span className="mt-1 h-1 w-1 rounded-full bg-primary shrink-0" />
                            {r}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <BarChart3 className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">Click a transaction to view<br />pre-auth fraud detection detail</p>
                </motion.div>
              )}
            </AnimatePresence>
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
