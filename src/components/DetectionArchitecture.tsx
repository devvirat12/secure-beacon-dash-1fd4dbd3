import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowRight, Radio, BarChart3, Brain, Shield, Layers, UserCheck, ChevronDown } from "lucide-react";
import { useState } from "react";

const steps = [
  { icon: Radio, label: "UPI Stream", desc: "Real-time ingestion" },
  { icon: BarChart3, label: "Feature Extraction", desc: "Deviation metrics" },
  { icon: Shield, label: "Rule-Based Scoring", desc: "Threshold triggers" },
  { icon: Brain, label: "ML Anomaly Scoring", desc: "UPI intelligence" },
  { icon: Layers, label: "Hybrid Risk Score", desc: "Rule×0.6 + ML×0.4" },
  { icon: UserCheck, label: "Human Confirmation", desc: "Non-blocking alert" },
];

const DetectionArchitecture = () => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs px-3 py-1">
          <Shield className="h-3 w-3 mr-1.5" />
          Detection Layer Active – Hybrid Rule + ML
        </Badge>
        <CollapsibleTrigger className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <span>{open ? "Hide" : "View"} Detection Flow</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 rounded-xl bg-muted/50 p-3">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-1 shrink-0">
              <div className="flex flex-col items-center gap-1.5 rounded-xl bg-card p-2.5 min-w-[90px] shadow-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
                  <step.icon className="h-3 w-3 text-primary" />
                </div>
                <p className="text-[10px] font-semibold text-foreground text-center leading-tight">{step.label}</p>
                <p className="text-[9px] text-muted-foreground text-center">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
              )}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DetectionArchitecture;
