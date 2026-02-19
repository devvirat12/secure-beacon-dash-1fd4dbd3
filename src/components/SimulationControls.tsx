import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Beaker, ChevronDown } from "lucide-react";

export interface SimulationFlags {
  highAmount: boolean;
  newUpiId: boolean;
  firstTimeBeneficiary: boolean;
  paymentLink: boolean;
  nightTransaction: boolean;
}

interface SimulationControlsProps {
  flags: SimulationFlags;
  onFlagsChange: (flags: SimulationFlags) => void;
}

const toggles: { key: keyof SimulationFlags; label: string; desc: string }[] = [
  { key: "highAmount", label: "High Amount Spike", desc: "Inject 5–8x average" },
  { key: "newUpiId", label: "New UPI ID (<7 days)", desc: "Potential mule account" },
  { key: "firstTimeBeneficiary", label: "First-Time Beneficiary", desc: "Unknown recipient" },
  { key: "paymentLink", label: "Suspicious Payment Link", desc: "bit.ly / rzp.io link" },
  { key: "nightTransaction", label: "Night Transaction (2–5AM)", desc: "Unusual hours" },
];

const SimulationControls = ({ flags, onFlagsChange }: SimulationControlsProps) => {
  const [open, setOpen] = useState(false);
  const activeCount = Object.values(flags).filter(Boolean).length;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="glass-card rounded-2xl">
        <CardHeader className="pb-2">
          <CollapsibleTrigger className="w-full cursor-pointer">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Beaker className="h-4 w-4 text-primary" />
              Simulation Control Panel
              {activeCount > 0 && (
                <Badge variant="outline" className="ml-1 text-[10px] bg-warning/10 text-warning border-warning/30">
                  {activeCount} active
                </Badge>
              )}
              <ChevronDown className={`h-4 w-4 ml-auto text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </CardTitle>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <p className="text-[11px] text-muted-foreground">
              Toggle anomalies to inject into the next generated transaction.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {toggles.map((t) => (
                <div key={t.key} className="flex items-center justify-between gap-3 rounded-lg bg-secondary/50 p-3">
                  <div className="min-w-0">
                    <Label className="text-xs font-medium text-foreground">{t.label}</Label>
                    <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                  </div>
                  <Switch
                    checked={flags[t.key]}
                    onCheckedChange={(checked) => onFlagsChange({ ...flags, [t.key]: checked })}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default SimulationControls;
