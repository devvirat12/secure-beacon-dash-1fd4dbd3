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
    <Card className="glass-card rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Beaker className="h-4 w-4 text-primary" />
          Simulation Control Panel
          <Badge variant="outline" className="ml-1 text-[10px] bg-danger/10 text-danger border-danger/30">
            5 active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center gap-2 rounded-lg bg-warning/10 border border-warning/30 p-3">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
          <span className="text-xs font-medium text-warning">Simulation Mode: High-Risk Scenario Enabled</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {activeAnomalies.map((a) => (
            <div key={a.label} className="flex items-center gap-2 rounded-lg bg-secondary/50 p-2.5">
              <span className="h-2 w-2 rounded-full bg-danger shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground">{a.label}</p>
                <p className="text-[10px] text-muted-foreground">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationControls;
