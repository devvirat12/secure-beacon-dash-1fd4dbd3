import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Beaker, AlertTriangle } from "lucide-react";

const activeAnomalies = [
  { label: "High Amount Spike", desc: "5–8× average injected" },
  { label: "New UPI ID (<7 days)", desc: "Potential mule account" },
  { label: "First-Time Beneficiary", desc: "Unknown recipient" },
  { label: "Suspicious Payment Link", desc: "bit.ly / rzp.io link" },
  { label: "Night Transaction (2–5AM)", desc: "Unusual hours" },
];

export interface SimulationFlags {
  highAmount: boolean;
  newUpiId: boolean;
  firstTimeBeneficiary: boolean;
  paymentLink: boolean;
  nightTransaction: boolean;
}

const SimulationControls = () => {
  return (
    <Card className="glass-card border-warning/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Beaker className="h-4 w-4 text-primary" />
            Simulation Control Panel
          </CardTitle>
          <Badge variant="outline" className="text-[10px] bg-warning/8 text-warning border-warning/25 font-medium">
            5 active anomalies
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center gap-2 rounded-lg bg-warning/8 border border-warning/20 px-3 py-2.5">
          <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
          <span className="text-[11px] font-medium text-warning">High-Risk Scenario Active — Anomalies injected into live stream</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {activeAnomalies.map((a) => (
            <div key={a.label} className="flex items-start gap-2.5 rounded-lg border border-border bg-secondary/40 px-3 py-2.5">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-danger shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-foreground leading-tight">{a.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationControls;
