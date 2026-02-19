import { useState } from "react";
import { Transaction, RiskLevel } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TransactionsTableProps {
  transactions: Transaction[];
}

const riskBadge = (level: RiskLevel) => {
  const styles: Record<RiskLevel, string> = {
    SAFE: "bg-safe/15 text-safe border-safe/30",
    WARNING: "bg-warning/15 text-warning border-warning/30",
    HIGH_RISK: "bg-danger/15 text-danger border-danger/30",
  };
  const labels: Record<RiskLevel, string> = { SAFE: "Safe", WARNING: "Warning", HIGH_RISK: "High Risk" };
  return <Badge variant="outline" className={styles[level]}>{labels[level]}</Badge>;
};

const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  const [filter, setFilter] = useState<"all" | RiskLevel>("all");

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.riskLevel === filter);

  return (
    <Card className="rounded-2xl shadow-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">Recent Transactions</CardTitle>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList className="h-8">
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
            {filtered.map((txn) => (
              <TableRow key={txn.id}>
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
                <TableCell className="pr-6 text-xs text-muted-foreground">{txn.status}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No transactions found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionsTable;
