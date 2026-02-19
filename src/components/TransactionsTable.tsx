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
    SAFE: "bg-safe/15 text-safe border-safe/30",
    WARNING: "bg-warning/15 text-warning border-warning/30",
    HIGH_RISK: "bg-danger/15 text-danger border-danger/30",
  };
  const labels: Record<RiskLevel, string> = { SAFE: "Safe", WARNING: "Warning", HIGH_RISK: "High Risk" };
  return <Badge variant="outline" className={styles[level]}>{labels[level]}</Badge>;
};

const statusStyle = (status: string) => {
  if (status === "Confirmed Legit") return "text-safe";
  if (status === "Fraud") return "text-danger";
  return "text-warning";
};

const TransactionsTable = () => {
  const { reviewedTransactions } = useReviewedTransactionStore();
  const [filter, setFilter] = useState<"all" | RiskLevel>("all");

  const filtered = filter === "all" ? reviewedTransactions : reviewedTransactions.filter((t) => t.riskLevel === filter);

  return (
    <Card className="glass-card rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Recent Transactions
            {reviewedTransactions.length > 0 && (
              <Badge variant="outline" className="ml-1 text-[10px] bg-primary/10 text-primary border-primary/30">
                {reviewedTransactions.length}
              </Badge>
            )}
          </CardTitle>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList className="h-8 bg-secondary/50">
              <TabsTrigger value="all" className="text-xs px-2.5 h-6">All</TabsTrigger>
              <TabsTrigger value="SAFE" className="text-xs px-2.5 h-6">Safe</TabsTrigger>
              <TabsTrigger value="WARNING" className="text-xs px-2.5 h-6">Warning</TabsTrigger>
              <TabsTrigger value="HIGH_RISK" className="text-xs px-2.5 h-6">High Risk</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead className="pr-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence initial={false}>
              {filtered.map((txn) => (
                <motion.tr
                  key={txn.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <TableCell className="pl-6 text-xs">
                    {new Date(txn.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </TableCell>
                  <TableCell className="font-medium">₹{txn.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-xs">{txn.location}</TableCell>
                  <TableCell>
                    <span className={`text-sm font-semibold ${txn.riskScore >= 70 ? "text-danger" : txn.riskScore >= 50 ? "text-warning" : "text-safe"}`}>
                      {txn.riskScore}
                    </span>
                  </TableCell>
                  <TableCell>{riskBadge(txn.riskLevel)}</TableCell>
                  <TableCell className={`pr-6 text-xs font-medium ${statusStyle(txn.status)}`}>{txn.status}</TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                  {reviewedTransactions.length === 0 ? "No reviewed transactions yet — analyze or confirm transactions to see them here" : "No transactions match this filter"}
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
