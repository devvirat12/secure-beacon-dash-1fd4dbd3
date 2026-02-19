import { useState } from "react";
import Header from "@/components/Header";
import RiskGauge from "@/components/RiskGauge";
import ConfirmationModal from "@/components/ConfirmationModal";
import TransactionsTable from "@/components/TransactionsTable";
import ReceiverRiskPanel from "@/components/ReceiverRiskPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, AlertCircle, Link2, Globe, Shield, UserCheck } from "lucide-react";
import { AnalysisResult, RiskLevel, ScoringResult } from "@/lib/types";
import { useDemo } from "@/lib/demo-context";
import { userDataset, getUpiInfo } from "@/lib/dataset";
import { scoreTransaction } from "@/lib/scoring-engine";
import { analyzeTransaction, confirmTransaction, ReceiverApiResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useReviewedTransactionStore } from "@/lib/transaction-store";
import GeoVelocityViz from "@/components/GeoVelocityViz";

type TransactionType = "standard" | "upi" | "payment_link";

const indianCities = [
  "Chennai", "Mumbai", "Bangalore", "Delhi", "Kolkata", "Hyderabad",
  "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Kochi", "Coimbatore",
  "Gurgaon", "Noida", "Imphal", "Gangtok", "Port Blair",
];

const categories = ["Food & Dining", "Shopping", "Groceries", "Travel", "Entertainment", "Bills & Utilities", "Healthcare", "Other"];

const sampleUpiIds = [
  "swiggy@paytm", "flipkart@axl", "bigbasket@razorpay", "zomato@ybl",
  "quickcash9871@ybl", "earnmoney.now@okaxis", "lucky.winner2026@paytm",
];

const trustedDomains = ["razorpay", "paytm", "phonepe", "gpay", "bhim", "sbi", "hdfc", "icici", "axis"];

function analyzeLinkDomain(link: string) {
  const lower = link.toLowerCase().trim();
  if (!lower) return null;
  const domainMatch = lower.replace(/https?:\/\//, "").split("/")[0].split("?")[0];
  const domain = domainMatch || lower;
  const isShortened = ["bit.ly", "tinyurl", "shorturl"].some((s) => domain.includes(s));
  if (trustedDomains.some((d) => domain.includes(d))) return { domain, risk: "trusted" as const, score: 0, isShortened, isNewDomain: false };
  if (isShortened) return { domain, risk: "new" as const, score: 20, isShortened, isNewDomain: true };
  return { domain, risk: "unknown" as const, score: 15, isShortened: false, isNewDomain: true };
}

const riskBadgeStyle = (level: RiskLevel) => {
  const map: Record<RiskLevel, string> = {
    SAFE: "bg-safe/15 text-safe border-safe/30",
    WARNING: "bg-warning/15 text-warning border-warning/30",
    HIGH_RISK: "bg-danger/15 text-danger border-danger/30",
  };
  return map[level];
};

const Simulate = () => {
  const { demoMode } = useDemo();
  const { toast } = useToast();
  const { addReviewedTransaction, updateReviewedStatus } = useReviewedTransactionStore();
  const [txnType, setTxnType] = useState<TransactionType>("standard");
  const [amount, setAmount] = useState("");
  const [city, setCity] = useState("");
  const [upiId, setUpiId] = useState("");
  const [paymentLinkInput, setPaymentLinkInput] = useState("");
  const [category, setCategory] = useState("");
  const [result, setResult] = useState<ScoringResult | null>(null);
  const [receiverApiData, setReceiverApiData] = useState<ReceiverApiResponse & {
    receiverId?: string; receiverAccountAge?: number; receiverTotalReceived?: number;
    receiverTotalTransactions?: number; receiverFraudReports?: number; isMerchantVerified?: boolean;
  } | null>(null);
  const [linkAnalysis, setLinkAnalysis] = useState<ReturnType<typeof analyzeLinkDomain>>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ── Receiver Intelligence Fields ──────────────────────────────────────────
  const [receiverId, setReceiverId] = useState("");

  const simFlags = {
    highAmount: true,
    newUpiId: true,
    firstTimeBeneficiary: true,
    paymentLink: true,
    nightTransaction: true,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !city) return;

    setLoading(true);
    setResult(null);
    setLinkAnalysis(null);
    setReceiverApiData(null);

    try {
      let analysis: ScoringResult;
      const linkInfo = txnType === "payment_link" && paymentLinkInput ? analyzeLinkDomain(paymentLinkInput) : null;
      if (txnType === "payment_link") setLinkAnalysis(linkInfo);

      if (demoMode) {
        await new Promise((r) => setTimeout(r, 800));
        const user = userDataset[0];
        const effectiveUpiId = txnType === "upi" ? upiId : "swiggy@paytm";
        const upiInfo = getUpiInfo(effectiveUpiId);
        const effectiveLink = txnType === "payment_link" ? paymentLinkInput : undefined;
        analysis = scoreTransaction(`sim-${Date.now()}`, parseFloat(amount), city, effectiveUpiId, upiInfo, user, 0, effectiveLink);
      } else {
        const apiResult = await analyzeTransaction({
          userId: "IND-001",
          amount: parseFloat(amount),
          location: city,
          timestamp: new Date().toISOString(),
          ...(receiverId && { receiverId }),
        });
        // Capture optional receiver fields from API response
        setReceiverApiData({
          receiver_risk: apiResult.receiver_risk,
          receiver_reasons: apiResult.receiver_reasons,
          transaction_id_flag: apiResult.transaction_id_flag,
          receiver_account_age_flag: apiResult.receiver_account_age_flag,
          merchant_flag: apiResult.merchant_flag,
          beneficiary_flag: apiResult.beneficiary_flag,
          receiverId: receiverId || undefined,
        });
        // Wrap API result as ScoringResult with defaults
        analysis = {
          ...apiResult,
          anomalyScore: 0,
          fraudProbability: 0,
          confidenceScore: 50,
          metrics: {
            amountDeviation: 0, monthlySpendRatio: 0, locationFlag: false, frequencySpike: false,
            isFirstTimeBeneficiary: false, upiAgeDays: 0, upiAgeFlag: false, isPaymentLink: false,
            linkRisk: "none", isNightTransaction: false, deviceChangeFlag: false,
            rapidSmallTransactionsFlag: false, geoVelocityFlag: false, beneficiaryRiskScore: 0,
            accountAgeDays: 0, transactionTimeRisk: 0, historicalFraudExposureFlag: false,
            salaryRatio: 0, behavioralDriftScore: 0, linkRiskScore: 0,
          },
        };
      }

      setResult(analysis);
      const txnEntry = {
        id: analysis.transactionId,
        date: new Date().toISOString(),
        amount: parseFloat(amount),
        location: city,
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel,
        status: "Analyzed" as const,
      };
      addReviewedTransaction(txnEntry);
      if (analysis.action === "CONFIRMATION_REQUIRED") {
        setTimeout(() => setShowModal(true), 1500);
      }
    } catch {
      toast({ title: "Error", description: "Failed to analyze transaction", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (response: "legit" | "fraud") => {
    if (!result) return;
    const newStatus = response === "legit" ? "Confirmed Legit" as const : "Fraud" as const;
    try {
      if (!demoMode) {
        await confirmTransaction({ transactionId: result.transactionId, userResponse: response });
      }
      updateReviewedStatus(result.transactionId, newStatus);
      toast({
        title: response === "legit" ? "Transaction Confirmed" : "Fraud Reported",
        description: response === "legit" ? "Behavioral profile updated." : "This transaction has been reported as fraud.",
      });
    } catch {
      toast({ title: "Error", description: "Failed to confirm transaction", variant: "destructive" });
    }
    setShowModal(false);
  };

  const riskLabels: Record<RiskLevel, string> = { SAFE: "Safe", WARNING: "Warning", HIGH_RISK: "High Risk" };

  const txnTypeLabels: Record<TransactionType, string> = {
    standard: "Standard Transaction",
    upi: "UPI Transfer",
    payment_link: "Payment Link",
  };

  return (
    <div className="relative min-h-screen">
      <div aria-hidden className="pointer-events-none fixed -top-40 -left-40 h-[600px] w-[600px] rounded-full blur-[120px] -z-10" style={{ background: "hsla(221,83%,53%,0.12)" }} />
      <div aria-hidden className="pointer-events-none fixed -bottom-40 -right-40 h-[500px] w-[500px] rounded-full blur-[120px] -z-10" style={{ background: "hsla(210,90%,60%,0.10)" }} />
      <Header />
      <main className="mx-auto max-w-4xl space-y-5 p-6">
        {/* Analyze Transaction */}
        <Card className="glass-card">
          <CardHeader className="pb-4 border-b border-border">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" />
              Analyze Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Transaction Type</Label>
                <div className="flex gap-1.5 flex-wrap">
                  {(["standard", "upi", "payment_link"] as TransactionType[]).map((t) => (
                    <Button
                      key={t} type="button"
                      variant={txnType === t ? "default" : "outline"}
                      size="sm" className={`text-xs h-8 ${txnType !== t ? "border-border text-muted-foreground hover:text-foreground" : ""}`}
                      onClick={() => { setTxnType(t); setResult(null); setLinkAnalysis(null); }}
                    >
                      {txnTypeLabels[t]}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium text-muted-foreground">Amount (₹)</Label>
                <Input type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" step="1" required className="bg-secondary/30 border-border h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium text-muted-foreground">City</Label>
                <Select value={city} onValueChange={setCity} required>
                  <SelectTrigger className="bg-secondary/30 border-border h-9 text-sm"><SelectValue placeholder="Select city" /></SelectTrigger>
                  <SelectContent>
                    {indianCities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {txnType === "upi" && (
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-medium text-muted-foreground">UPI ID</Label>
                  <Select value={upiId} onValueChange={setUpiId} required>
                    <SelectTrigger className="bg-secondary/30 border-border h-9 text-sm"><SelectValue placeholder="Select UPI ID" /></SelectTrigger>
                    <SelectContent>
                      {sampleUpiIds.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {txnType === "payment_link" && (
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                    <Link2 className="h-3 w-3 text-primary" />
                    Payment Link URL
                  </Label>
                  <Input placeholder="e.g. bit.ly/win50k or razorpay.com/pay" value={paymentLinkInput} onChange={(e) => setPaymentLinkInput(e.target.value)} required className="bg-secondary/30 border-border h-9 text-sm" />
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium text-muted-foreground">Category (optional)</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-secondary/30 border-border h-9 text-sm"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* ── Receiver Intelligence (standard transactions only) ──────── */}
              {txnType === "standard" && (
                <div className="sm:col-span-2 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 mb-3">
                    <UserCheck className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Receiver Intelligence</span>
                    <span className="text-[10px] text-muted-foreground ml-0.5">(optional)</span>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-medium text-muted-foreground">Receiver ID (UPI / Account)</Label>
                    <Input placeholder="e.g. RCV-001 or user@upi" value={receiverId} onChange={(e) => setReceiverId(e.target.value)} className="bg-secondary/30 border-border h-9 text-sm" />
                  </div>
                </div>
              )}

              <div className="sm:col-span-2 pt-1">
                <Button type="submit" className="w-full h-10 text-sm font-medium" disabled={loading || !amount || !city || (txnType === "upi" && !upiId) || (txnType === "payment_link" && !paymentLinkInput)}>
                  {loading ? "Analyzing..." : "Analyze Transaction"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Payment Link Intelligence Panel */}
        {txnType === "payment_link" && linkAnalysis && (
          <Card className="glass-card animate-in fade-in-0 slide-in-from-bottom-4 duration-400">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Payment Link Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-4">
              {[
                { label: "Extracted Domain", value: linkAnalysis.domain },
                { label: "Domain Reputation", value: linkAnalysis.risk === "trusted" ? "Trusted" : linkAnalysis.risk === "new" ? "Suspicious" : "Unknown" },
                { label: "New Domain Flag", value: linkAnalysis.isNewDomain ? "YES" : "NO", flag: linkAnalysis.isNewDomain },
                { label: "Shortened URL Detection", value: linkAnalysis.isShortened ? "DETECTED" : "NO", flag: linkAnalysis.isShortened },
                { label: "Risk Contribution Points", value: `+${linkAnalysis.score} pts`, flag: linkAnalysis.score > 0 },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">{item.label}</span>
                  <Badge variant="outline" className={`text-[10px] px-2 py-0.5 font-medium ${
                    item.flag ? "bg-danger/10 text-danger border-danger/20" :
                    linkAnalysis.risk === "trusted" ? "bg-safe/10 text-safe border-safe/20" :
                    "bg-secondary text-foreground border-border"
                  }`}>
                    {item.value}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="glass-card animate-in fade-in-0 slide-in-from-bottom-4 duration-400">
            <CardContent className="p-6 space-y-5">
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-around">
                <div className="flex flex-col items-center gap-2">
                  <RiskGauge score={result.riskScore} />
                  {result.confidenceScore !== undefined && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                      <Shield className="h-3 w-3 mr-1" />
                      {result.confidenceScore}% confidence
                    </Badge>
                  )}
                </div>
                <div className="text-center sm:text-left space-y-3 w-full sm:max-w-[220px]">
                  <Badge variant="outline" className={`text-sm px-3 py-1 font-medium ${riskBadgeStyle(result.riskLevel)}`}>
                    {riskLabels[result.riskLevel]}
                  </Badge>
                  <div className="space-y-3 mt-1">
                    {[
                      { label: "Rule Score", value: result.ruleScore },
                      { label: "ML Score", value: result.mlScore },
                      { label: "Behavioral Score", value: result.behavioralScore },
                    ].map((s) => (
                      <div key={s.label} className="space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">{s.label}</span>
                          <span className="font-semibold text-foreground">{s.value}</span>
                        </div>
                        <Progress value={s.value} className="h-1.5 bg-border" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Geo-Velocity Visualization */}
              {result.metrics?.geoVelocityFlag && result.metrics?.previousCity && (
                <GeoVelocityViz
                  previousCity={result.metrics.previousCity}
                  currentCity={city}
                  timeDiffMinutes={Math.floor(Math.random() * 45) + 10}
                />
              )}

              {/* Payment Link Deep Inspection */}
              {result.metrics?.linkDeepInspection && (
                <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Link2 className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[11px] font-semibold text-foreground uppercase tracking-wide">Link Deep Inspection</span>
                  </div>
                  {[
                    { label: "Domain", value: result.metrics.linkDeepInspection.domain },
                    { label: "Shortened URL", value: result.metrics.linkDeepInspection.isShortened ? "YES" : "NO", flag: result.metrics.linkDeepInspection.isShortened },
                    { label: "Suspicious Keywords", value: result.metrics.linkDeepInspection.hasSuspiciousKeywords ? "DETECTED" : "NONE", flag: result.metrics.linkDeepInspection.hasSuspiciousKeywords },
                    { label: "Lookalike Match", value: result.metrics.linkDeepInspection.lookalikeSimilarity > 0.5 ? `${Math.round(result.metrics.linkDeepInspection.lookalikeSimilarity * 100)}% → ${result.metrics.linkDeepInspection.lookalikeDomain}` : "NONE", flag: result.metrics.linkDeepInspection.lookalikeSimilarity > 0.7 },
                    { label: "Domain Age (sim)", value: `${result.metrics.linkDeepInspection.domainAgeSimDays}d`, flag: result.metrics.linkDeepInspection.domainAgeSimDays < 30 },
                    { label: "Link Risk Score", value: `${result.metrics.linkDeepInspection.linkRiskScore}/30`, flag: result.metrics.linkDeepInspection.linkRiskScore > 10 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">{item.label}</span>
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-medium ${item.flag ? "bg-danger/10 text-danger border-danger/20" : "bg-safe/10 text-safe border-safe/20"}`}>
                        {item.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {result.reasons.length > 0 && (
                <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    Why was this flagged?
                  </p>
                  <ul className="space-y-1.5">
                    {result.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-foreground">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── Receiver Risk Insights Panel (additive, shown after analysis) ── */}
        {result && receiverApiData && (
          <ReceiverRiskPanel data={receiverApiData} />
        )}

        {/* ── Demo mode: show panel with receiver ID if provided ──────── */}
        {result && !receiverApiData && receiverId && (
          <ReceiverRiskPanel data={{
            receiverId: receiverId || undefined,
          }} />
        )}

        {result && (
          <ConfirmationModal
            open={showModal}
            onOpenChange={setShowModal}
            result={result}
            onConfirm={handleConfirm}
          />
        )}

        <TransactionsTable />
      </main>
    </div>
  );
};

export default Simulate;
