import { useState, useCallback } from "react";
import Header from "@/components/Header";
import MetricCards from "@/components/MetricCards";
import BehavioralDNA from "@/components/BehavioralDNA";
import TransactionsTable from "@/components/TransactionsTable";
import LiveTransactionStream from "@/components/LiveTransactionStream";
import SimulationControls, { SimulationFlags, SimTransactionType } from "@/components/SimulationControls";
import { useDemo } from "@/lib/demo-context";
import { mockUser, mockTransactions, mockRiskTrend } from "@/lib/mock-data";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [simTxnType, setSimTxnType] = useState<SimTransactionType>("normal");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Detection badge only — no pipeline text */}
        <div className="flex items-center">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs px-3 py-1">
            <Shield className="h-3 w-3 mr-1.5" />
            Detection Layer Active – Hybrid Rule + ML
          </Badge>
        </div>

        <SimulationControls
          flags={simFlags}
          onFlagsChange={setSimFlags}
          simTxnType={simTxnType}
          onSimTxnTypeChange={setSimTxnType}
        />
        <MetricCards user={user} />
        <LiveTransactionStream simulationFlags={simFlags} simTxnType={simTxnType} />
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
