import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction, RiskLevel } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReviewedTransactionStore } from "@/lib/transaction-store";
import { Activity } from "lucide-react";

const riskBadge = (level: RiskLevel) => {
  const styles: Record<RiskLevel, string> = {
    SAFE: "bg-safe/10 text-safe border-safe/20",
    WARNING: "bg-warning/10 text-warning border-warning/20",
    HIGH_RISK: "bg-danger/10 text-danger border-danger/20",
  };
  const labels: Record<RiskLevel, string> = { SAFE: "Safe", WARNING: "Warning", HIGH_RISK: "High Risk" };
  return <Badge variant="outline" className={`text-[10px] font-medium ${styles[level]}`}>{labels[level]}</Badge>;
};

const riskScoreColor = (score: number) =>
  score >= 70 ? "text-danger font-bold" : score >= 50 ? "text-warning font-bold" : "text-safe font-bold";

const statusStyle = (status: string) => {
  if (status === "Confirmed Legit") return "text-safe";
  if (status === "Fraud") return "text-danger";
  if (status === "Analyzed") return "text-primary";
  return "text-warning";
};

const TransactionsTable = () => {
  const { reviewedTransactions } = useReviewedTransactionStore();
  const [filter, setFilter] = useState<"all" | RiskLevel>("all");

  const filtered = filter === "all" ? reviewedTransactions : reviewedTransactions.filter((t) => t.riskLevel === filter);

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Recent Transactions
            {reviewedTransactions.length > 0 && (
              <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                {reviewedTransactions.length}
              </span>
            )}
          </CardTitle>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList className="h-8 bg-secondary/60 p-0.5">
              <TabsTrigger value="all" className="text-[11px] px-3 h-7 data-[state=active]:bg-card data-[state=active]:shadow-sm">All</TabsTrigger>
              <TabsTrigger value="SAFE" className="text-[11px] px-3 h-7 data-[state=active]:bg-card data-[state=active]:shadow-sm">Safe</TabsTrigger>
              <TabsTrigger value="WARNING" className="text-[11px] px-3 h-7 data-[state=active]:bg-card data-[state=active]:shadow-sm">Warning</TabsTrigger>
              <TabsTrigger value="HIGH_RISK" className="text-[11px] px-3 h-7 data-[state=active]:bg-card data-[state=active]:shadow-sm">High Risk</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="pl-6 text-[11px] font-semibold text-muted-foreground">Date</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground">Amount</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground">Location</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground">Score</TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground">Risk</TableHead>
              <TableHead className="pr-6 text-[11px] font-semibold text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence initial={false}>
              {filtered.map((txn) => (
                <motion.tr
                  key={txn.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="border-b border-border/50 transition-colors hover:bg-secondary/40"
                >
                  <TableCell className="pl-6 text-[11px] text-muted-foreground">
                    {new Date(txn.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-foreground">₹{txn.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-[11px] text-muted-foreground">{txn.location}</TableCell>
                  <TableCell>
                    <span className={`text-sm ${riskScoreColor(txn.riskScore)}`}>{txn.riskScore}</span>
                  </TableCell>
                  <TableCell>{riskBadge(txn.riskLevel)}</TableCell>
                  <TableCell className={`pr-6 text-[11px] font-medium ${statusStyle(txn.status)}`}>{txn.status}</TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-xs">
                  {reviewedTransactions.length === 0
                    ? "No reviewed transactions yet — analyze or confirm transactions to see them here"
                    : "No transactions match this filter"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionsTable;
