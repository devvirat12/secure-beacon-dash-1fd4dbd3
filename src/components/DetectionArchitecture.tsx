import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, ArrowRight, Radio, BarChart3, Brain, Shield, UserCheck, Smartphone } from "lucide-react";

const steps = [
  { icon: Radio, label: "UPI Stream", desc: "Real-time ingestion" },
  { icon: BarChart3, label: "Feature Extraction", desc: "Deviation metrics" },
  { icon: Shield, label: "Rule-Based Scoring", desc: "Threshold triggers" },
  { icon: Brain, label: "ML Anomaly Scoring", desc: "UPI intelligence" },
  { icon: Layers, label: "Hybrid Risk Score", desc: "Rule×0.6 + ML×0.4" },
  { icon: UserCheck, label: "Human Confirmation", desc: "Non-blocking alert" },
];

const DetectionArchitecture = () => {
  return (
    <Card className="rounded-2xl shadow-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          Detection Architecture
          <Badge variant="outline" className="ml-auto text-[10px] bg-primary/10 text-primary border-primary/30">
            Indian UPI Pipeline
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-1 shrink-0">
              <div className="flex flex-col items-center gap-1.5 rounded-xl bg-muted p-2.5 min-w-[100px]">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <step.icon className="h-3.5 w-3.5 text-primary" />
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
      </CardContent>
    </Card>
  );
};

export default DetectionArchitecture;
