import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { AnalysisResult } from "@/lib/types";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: AnalysisResult;
  onConfirm: (response: "legit" | "fraud") => void;
}

const ConfirmationModal = ({ open, onOpenChange, result, onConfirm }: ConfirmationModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-warning/15">
            <AlertTriangle className="h-6 w-6 text-warning" />
          </div>
          <DialogTitle className="text-center text-lg">Unusual UPI Transaction Detected</DialogTitle>
          <DialogDescription className="text-center text-xs">
            Transaction flagged due to deviation from Indian UPI behavioral profile. No automatic blocking — your confirmation is required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-foreground">{result.riskScore}</span>
            <Badge variant="outline" className="bg-warning/15 text-warning border-warning/30">
              Risk Score
            </Badge>
          </div>

          <div className="rounded-xl bg-muted p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reasons</p>
            <ul className="space-y-1.5">
              {result.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-warning shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-safe hover:bg-safe/90 text-safe-foreground"
              onClick={() => onConfirm("legit")}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Yes, this was me
            </Button>
            <Button
              className="flex-1 bg-danger hover:bg-danger/90 text-danger-foreground"
              onClick={() => onConfirm("fraud")}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Report Fraud
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
