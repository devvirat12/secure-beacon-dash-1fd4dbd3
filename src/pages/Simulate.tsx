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
import { Send, AlertCircle } from "lucide-react";
import { AnalysisResult, RiskLevel } from "@/lib/types";
import { useDemo } from "@/lib/demo-context";
import { generateDemoAnalysis } from "@/lib/mock-data";
import { analyzeTransaction, confirmTransaction } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const countries = [
  "United States", "United Kingdom", "Canada", "Germany", "France", "Japan",
  "Australia", "Brazil", "India", "Nigeria", "China", "South Korea",
  "Mexico", "Italy", "Spain", "Russia", "South Africa", "UAE",
];

const categories = ["Food & Dining", "Shopping", "Travel", "Entertainment", "Bills & Utilities", "Healthcare", "Other"];

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
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !location) return;

    setLoading(true);
    setResult(null);

    try {
      let analysis: AnalysisResult;
      if (demoMode) {
        await new Promise((r) => setTimeout(r, 800));
        analysis = generateDemoAnalysis(parseFloat(amount), location);
      } else {
        analysis = await analyzeTransaction({
          userId: "demo-user-001",
          amount: parseFloat(amount),
          location,
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
        description: response === "legit" ? "Transaction marked as legitimate." : "This transaction has been reported as fraud.",
      });
    } catch {
      toast({ title: "Error", description: "Failed to confirm transaction", variant: "destructive" });
    }
    setShowModal(false);
  };

  const riskLabels: Record<RiskLevel, string> = { SAFE: "Safe", WARNING: "Warning", HIGH_RISK: "High Risk" };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl space-y-6 p-6">
        {/* Form */}
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" />
              Analyze New Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs">Amount ($)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Location</Label>
                <Select value={location} onValueChange={setLocation} required>
                  <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Date & Time</Label>
                <Input value={new Date().toLocaleString()} disabled />
              </div>
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
                <Button type="submit" className="w-full" disabled={loading || !amount || !location}>
                  {loading ? "Analyzing..." : "Analyze Transaction"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Result */}
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
