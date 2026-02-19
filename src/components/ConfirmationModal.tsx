import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle, UserX } from "lucide-react";
import { AnalysisResult } from "@/lib/types";
import { ReceiverApiResponse } from "@/lib/api";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: AnalysisResult & ReceiverApiResponse;
  onConfirm: (response: "legit" | "fraud") => void;
}

const ConfirmationModal = ({ open, onOpenChange, result, onConfirm }: ConfirmationModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-card border-border shadow-xl">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-warning/10 border border-warning/20">
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <DialogTitle className="text-center text-base font-semibold">Unusual Transaction Detected</DialogTitle>
          <DialogDescription className="text-center text-[11px] text-muted-foreground">
            Transaction flagged due to significant behavioral deviation. No automatic blocking — your confirmation is required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-1">
          {/* Risk score pill */}
          <div className="flex items-center justify-center gap-3 py-2 rounded-xl border border-border bg-secondary/40">
            <span className={`text-3xl font-bold tabular-nums ${result.riskScore >= 70 ? "text-danger" : result.riskScore >= 50 ? "text-warning" : "text-safe"}`}>
              {result.riskScore}
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Risk Score</span>
              <Badge variant="outline" className={`mt-0.5 text-[10px] px-2 py-0 ${
                result.riskScore >= 70 ? "bg-danger/10 text-danger border-danger/20" :
                result.riskScore >= 50 ? "bg-warning/10 text-warning border-warning/20" :
                "bg-safe/10 text-safe border-safe/20"
              }`}>
                {result.riskScore >= 70 ? "High Risk" : result.riskScore >= 50 ? "Warning" : "Safe"}
              </Badge>
            </div>
          </div>

          {/* Flagging reasons */}
          <div className="rounded-xl border border-border bg-secondary/30 p-3 space-y-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Flagging Reasons</p>
            <ul className="space-y-1.5">
              {result.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-foreground">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-warning shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Receiver Risk (appended, non-breaking) ─────────────────────── */}
          {(result.receiver_risk !== undefined || (result.receiver_reasons && result.receiver_reasons.length > 0)) && (
            <div className="rounded-xl border border-danger/20 bg-danger/4 p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <UserX className="h-3.5 w-3.5 text-danger" />
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Receiver Intelligence</p>
                {result.receiver_risk !== undefined && (
                  <Badge variant="outline" className="ml-auto text-[9px] px-1.5 py-0 bg-danger/10 text-danger border-danger/20">
                    Risk: {result.receiver_risk}
                  </Badge>
                )}
              </div>
              {result.receiver_reasons && result.receiver_reasons.length > 0 && (
                <ul className="space-y-1.5">
                  {result.receiver_reasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-foreground">
                      <span className="mt-1 h-1 w-1 rounded-full bg-danger shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.transaction_id_flag && (
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-danger/10 text-danger border-danger/20">TXN ID Spoofing</Badge>
                )}
                {result.receiver_account_age_flag && (
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-warning/10 text-warning border-warning/20">New Account</Badge>
                )}
                {result.merchant_flag && (
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-warning/10 text-warning border-warning/20">Unverified Merchant</Badge>
                )}
                {result.beneficiary_flag && (
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-warning/10 text-warning border-warning/20">New Beneficiary</Badge>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              className="flex-1 bg-safe hover:bg-safe/90 text-safe-foreground text-sm"
              onClick={() => onConfirm("legit")}
            >
              <CheckCircle className="h-4 w-4 mr-1.5" />
              Yes, this was me
            </Button>
            <Button
              className="flex-1 bg-danger hover:bg-danger/90 text-danger-foreground text-sm"
              onClick={() => onConfirm("fraud")}
            >
              <XCircle className="h-4 w-4 mr-1.5" />
              Report Fraud
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
