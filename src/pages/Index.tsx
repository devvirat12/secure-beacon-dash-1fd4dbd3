import Header from "@/components/Header";
import MetricCards from "@/components/MetricCards";
import BehavioralDNA from "@/components/BehavioralDNA";
import TransactionsTable from "@/components/TransactionsTable";
import { useDemo } from "@/lib/demo-context";
import { mockUser, mockTransactions, mockRiskTrend } from "@/lib/mock-data";

const Index = () => {
  const { demoMode } = useDemo();

  // In production, fetch from API. For now, use demo data.
  const user = mockUser;
  const transactions = mockTransactions;
  const riskTrend = mockRiskTrend;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl space-y-6 p-6">
        <MetricCards user={user} />
        <BehavioralDNA user={user} riskTrend={riskTrend} />
        <TransactionsTable transactions={transactions} />
      </main>
    </div>
  );
};

export default Index;
