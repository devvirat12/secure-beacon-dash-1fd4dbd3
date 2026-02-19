import Header from "@/components/Header";
import MetricCards from "@/components/MetricCards";
import BehavioralDNA from "@/components/BehavioralDNA";
import TransactionsTable from "@/components/TransactionsTable";
import LiveTransactionStream from "@/components/LiveTransactionStream";
import DetectionArchitecture from "@/components/DetectionArchitecture";
import { useDemo } from "@/lib/demo-context";
import { mockUser, mockTransactions, mockRiskTrend } from "@/lib/mock-data";
import { Shield } from "lucide-react";

const Index = () => {
  const { demoMode } = useDemo();

  const user = mockUser;
  const transactions = mockTransactions;
  const riskTrend = mockRiskTrend;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl space-y-6 p-6">
        <DetectionArchitecture />
        <MetricCards user={user} />
        <LiveTransactionStream />
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
