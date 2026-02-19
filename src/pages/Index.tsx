import { useState, useCallback } from "react";
import Header from "@/components/Header";
import MetricCards from "@/components/MetricCards";
import BehavioralDNA from "@/components/BehavioralDNA";
import TransactionsTable from "@/components/TransactionsTable";
import LiveTransactionStream from "@/components/LiveTransactionStream";
import DetectionArchitecture from "@/components/DetectionArchitecture";
import SimulationControls, { SimulationFlags } from "@/components/SimulationControls";
import { useDemo } from "@/lib/demo-context";
import { mockUser, mockTransactions, mockRiskTrend } from "@/lib/mock-data";
import { Shield } from "lucide-react";

const trustedDomains = ["razorpay", "paytm", "phonepe", "gpay", "bhim", "sbi", "hdfc", "icici", "axis"];

function analyzeLinkDomain(link: string): { domain: string; risk: string; score: number } {
  const lower = link.toLowerCase().trim();
  if (!lower) return { domain: "", risk: "none", score: 0 };

  // Extract domain-like part
  const domainMatch = lower.replace(/https?:\/\//, "").split("/")[0].split("?")[0];
  const domain = domainMatch || lower;

  if (trustedDomains.some((d) => domain.includes(d))) {
    return { domain, risk: "trusted", score: 0 };
  }
  if (domain.includes("bit.ly") || domain.includes("tinyurl") || domain.includes("shorturl")) {
    return { domain, risk: "new", score: 20 };
  }
  return { domain, risk: "unknown", score: 15 };
}

const Index = () => {
  const { demoMode } = useDemo();
  const user = mockUser;
  const transactions = mockTransactions;
  const riskTrend = mockRiskTrend;

  const [simFlags, setSimFlags] = useState<SimulationFlags>({
    highAmount: false,
    newUpiId: false,
    firstTimeBeneficiary: false,
    paymentLink: false,
    nightTransaction: false,
  });

  const [testLink, setTestLink] = useState("");
  const [linkResult, setLinkResult] = useState<{ domain: string; risk: string; score: number } | null>(null);

  const handleTestLink = useCallback(() => {
    if (testLink.trim()) {
      setLinkResult(analyzeLinkDomain(testLink));
    }
  }, [testLink]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl space-y-6 p-6">
        <DetectionArchitecture />
        <SimulationControls
          flags={simFlags}
          onFlagsChange={setSimFlags}
          testLink={testLink}
          onTestLinkChange={setTestLink}
          linkResult={linkResult}
          onTestLink={handleTestLink}
        />
        <MetricCards user={user} />
        <LiveTransactionStream simulationFlags={simFlags} />
        <BehavioralDNA user={user} riskTrend={riskTrend} />
        <TransactionsTable transactions={transactions} />
      </main>
      <footer className="border-t border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>This system uses lightweight hybrid scoring suitable for real-time edge deployment. Detection Layer: Flagging Only — No Automatic Blocking.</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
