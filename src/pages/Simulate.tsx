import { useState } from "react";
import Header from "@/components/Header";
import RiskGauge from "@/components/RiskGauge";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, AlertCircle, Link2, CheckCircle, AlertTriangle, Globe } from "lucide-react";
import { AnalysisResult, RiskLevel } from "@/lib/types";
import { useDemo } from "@/lib/demo-context";
import { userDataset, getUpiInfo } from "@/lib/dataset";
import { scoreTransaction } from "@/lib/scoring-engine";
import { analyzeTransaction, confirmTransaction } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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
  const [txnType, setTxnType] = useState<TransactionType>("standard");
  const [amount, setAmount] = useState("");
  const [city, setCity] = useState("");
  const [upiId, setUpiId] = useState("");
  const [paymentLinkInput, setPaymentLinkInput] = useState("");
  const [category, setCategory] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [linkAnalysis, setLinkAnalysis] = useState<ReturnType<typeof analyzeLinkDomain>>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !city) return;

    setLoading(true);
    setResult(null);
    setLinkAnalysis(null);

    try {
      let analysis: AnalysisResult;
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
        analysis = await analyzeTransaction({
          userId: "IND-001",
          amount: parseFloat(amount),
          location: city,
          timestamp: new Date().toISOString(),
        });
      }

      setResult(analysis);
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
    try {
      if (!demoMode) {
        await confirmTransaction({ transactionId: result.transactionId, userResponse: response });
      }
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl space-y-6 p-6">
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" />
              Analyze Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Transaction Type */}
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs">Transaction Type</Label>
                <div className="flex gap-2 flex-wrap">
                  {(["standard", "upi", "payment_link"] as TransactionType[]).map((t) => (
                    <Button
                      key={t}
                      type="button"
                      variant={txnType === t ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      onClick={() => { setTxnType(t); setResult(null); setLinkAnalysis(null); }}
                    >
                      {txnTypeLabels[t]}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Amount (₹)</Label>
                <Input type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" step="1" required />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">City</Label>
                <Select value={city} onValueChange={setCity} required>
                  <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                  <SelectContent>
                    {indianCities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* UPI ID — only for UPI type */}
              {txnType === "upi" && (
                <div className="space-y-2">
                  <Label className="text-xs">UPI ID</Label>
                  <Select value={upiId} onValueChange={setUpiId} required>
                    <SelectTrigger><SelectValue placeholder="Select UPI ID" /></SelectTrigger>
                    <SelectContent>
                      {sampleUpiIds.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Payment Link — only for payment_link type */}
              {txnType === "payment_link" && (
                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-1.5">
                    <Link2 className="h-3 w-3 text-primary" />
                    Payment Link URL
                  </Label>
                  <Input
                    placeholder="e.g. bit.ly/win50k or razorpay.com/pay"
                    value={paymentLinkInput}
                    onChange={(e) => setPaymentLinkInput(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs">Category (optional)</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2">
                <Button type="submit" className="w-full" disabled={loading || !amount || !city || (txnType === "upi" && !upiId) || (txnType === "payment_link" && !paymentLinkInput)}>
                  {loading ? "Analyzing..." : "Analyze Transaction"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Payment Link Intelligence Panel */}
        {txnType === "payment_link" && linkAnalysis && (
          <Card className="rounded-2xl shadow-sm border-border/50 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Payment Link Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Extracted Domain", value: linkAnalysis.domain },
                { label: "Domain Reputation", value: linkAnalysis.risk === "trusted" ? "Trusted" : linkAnalysis.risk === "new" ? "Suspicious" : "Unknown" },
                { label: "New Domain Flag", value: linkAnalysis.isNewDomain ? "YES" : "NO", flag: linkAnalysis.isNewDomain },
                { label: "Shortened URL Detection", value: linkAnalysis.isShortened ? "DETECTED" : "NO", flag: linkAnalysis.isShortened },
                { label: "Risk Contribution Points", value: `+${linkAnalysis.score} pts`, flag: linkAnalysis.score > 0 },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${
                    item.flag ? "bg-danger/15 text-danger border-danger/30" :
                    linkAnalysis.risk === "trusted" ? "bg-safe/15 text-safe border-safe/30" :
                    "bg-muted text-foreground border-border"
                  }`}>
                    {item.value}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="rounded-2xl shadow-sm border-border/50 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
                <RiskGauge score={result.riskScore} />
                <div className="text-center sm:text-left space-y-2">
                  <Badge variant="outline" className={`text-sm px-3 py-1 ${riskBadgeStyle(result.riskLevel)}`}>
                    {riskLabels[result.riskLevel]}
                  </Badge>
                  <div className="space-y-3 mt-4">
                    {[
                      { label: "Rule Score", value: result.ruleScore },
                      { label: "ML Score", value: result.mlScore },
                      { label: "Behavioral Score", value: result.behavioralScore },
                    ].map((s) => (
                      <div key={s.label} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{s.label}</span>
                          <span className="font-medium text-foreground">{s.value}</span>
                        </div>
                        <Progress value={s.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {result.reasons.length > 0 && (
                <div className="rounded-xl bg-muted p-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    Why was this flagged?
                  </p>
                  <ul className="space-y-1.5">
                    {result.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {result && (
          <ConfirmationModal
            open={showModal}
            onOpenChange={setShowModal}
            result={result}
            onConfirm={handleConfirm}
          />
        )}
      </main>
    </div>
  );
};

export default Simulate;
