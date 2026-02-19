import Header from "@/components/Header";
import MetricCards from "@/components/MetricCards";
import BehavioralDNA from "@/components/BehavioralDNA";
import TransactionsTable from "@/components/TransactionsTable";
import LiveTransactionStream from "@/components/LiveTransactionStream";
import { mockUser, mockRiskTrend } from "@/lib/mock-data";
import { Shield } from "lucide-react";

const Index = () => {
  const user = mockUser;
  const riskTrend = mockRiskTrend;

  return (
    <div className="relative min-h-screen">
      {/* blue orb accents matching landing page */}
      <div aria-hidden className="pointer-events-none fixed -top-40 -left-40 h-[600px] w-[600px] rounded-full blur-[120px] -z-10" style={{ background: "hsla(221,83%,53%,0.12)" }} />
      <div aria-hidden className="pointer-events-none fixed -bottom-40 -right-40 h-[500px] w-[500px] rounded-full blur-[120px] -z-10" style={{ background: "hsla(210,90%,60%,0.10)" }} />
      <Header />
      <main className="mx-auto max-w-7xl space-y-5 p-6">
        <MetricCards user={user} />
        <LiveTransactionStream />
        <BehavioralDNA user={user} riskTrend={riskTrend} />
        <TransactionsTable />
      </main>
      <footer className="border-t border-border mt-6 px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>Lightweight hybrid scoring for real-time edge deployment. Detection Layer: Flagging Only — No Automatic Blocking.</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
