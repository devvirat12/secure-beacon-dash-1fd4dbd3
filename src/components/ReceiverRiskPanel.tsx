import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, UserCheck, UserX, ShieldAlert, Hash, AlertOctagon } from "lucide-react";
import { useState } from "react";
import { ReceiverApiResponse } from "@/lib/api";

interface ReceiverRiskPanelProps {
  data: ReceiverApiResponse & {
    receiverId?: string;
    receiverAccountAge?: number;
    receiverTotalReceived?: number;
    receiverTotalTransactions?: number;
    receiverFraudReports?: number;
    isMerchantVerified?: boolean;
  };
}

const flagBadge = (flag: boolean | undefined, trueLabel = "FLAGGED", falseLabel = "OK") => {
  if (flag === undefined) return null;
  return (
    <Badge
      variant="outline"
      className={`text-[9px] px-1.5 py-0 font-medium ${
        flag
          ? "bg-danger/10 text-danger border-danger/20"
          : "bg-safe/10 text-safe border-safe/20"
      }`}
    >
      {flag ? trueLabel : falseLabel}
    </Badge>
  );
};

const ReceiverRiskPanel = ({ data }: ReceiverRiskPanelProps) => {
  const [open, setOpen] = useState(true);

  // If no receiver data at all, don't render
  const hasAnyData =
    data.receiver_risk !== undefined ||
    data.receiver_reasons?.length ||
    data.transaction_id_flag !== undefined ||
    data.receiver_account_age_flag !== undefined ||
    data.merchant_flag !== undefined ||
    data.beneficiary_flag !== undefined ||
    data.receiverId ||
    data.receiverAccountAge !== undefined ||
    data.receiverTotalReceived !== undefined ||
    data.receiverTotalTransactions !== undefined ||
    data.receiverFraudReports !== undefined ||
    data.isMerchantVerified !== undefined;

  if (!hasAnyData) return null;

  const riskScore = data.receiver_risk;
  const riskColor =
    riskScore === undefined
      ? "text-muted-foreground"
      : riskScore >= 70
      ? "text-danger"
      : riskScore >= 50
      ? "text-warning"
      : "text-safe";

  return (
    <Card className="glass-card animate-in fade-in-0 slide-in-from-bottom-4 duration-400">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="w-full">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-primary" />
              Receiver Risk Insights
              <ChevronDown
                className={`h-3.5 w-3.5 text-muted-foreground ml-auto transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </CardTitle>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">

            {/* Receiver Risk Score */}
            {riskScore !== undefined && (
              <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-4 py-3">
                <span className="text-[11px] font-medium text-muted-foreground">Receiver Risk Score</span>
                <span className={`text-2xl font-bold tabular-nums ${riskColor}`}>{riskScore}</span>
              </div>
            )}

            {/* Profile rows */}
            <div className="space-y-2">
              {[
                {
                  icon: Hash,
                  label: "Receiver ID",
                  value: data.receiverId,
                  show: !!data.receiverId,
                },
                {
                  icon: UserCheck,
                  label: "Account Age",
                  value: data.receiverAccountAge !== undefined ? `${data.receiverAccountAge} days` : undefined,
                  show: data.receiverAccountAge !== undefined,
                },
                {
                  icon: UserCheck,
                  label: "Total Received (₹)",
                  value: data.receiverTotalReceived !== undefined
                    ? `₹${data.receiverTotalReceived.toLocaleString("en-IN")}`
                    : undefined,
                  show: data.receiverTotalReceived !== undefined,
                },
                {
                  icon: UserCheck,
                  label: "Total Transactions",
                  value: data.receiverTotalTransactions !== undefined
                    ? String(data.receiverTotalTransactions)
                    : undefined,
                  show: data.receiverTotalTransactions !== undefined,
                },
                {
                  icon: AlertOctagon,
                  label: "Fraud Reports",
                  value: data.receiverFraudReports !== undefined
                    ? String(data.receiverFraudReports)
                    : undefined,
                  show: data.receiverFraudReports !== undefined,
                  danger: (data.receiverFraudReports ?? 0) > 0,
                },
                {
                  icon: UserCheck,
                  label: "Merchant Verified",
                  value: data.isMerchantVerified !== undefined
                    ? data.isMerchantVerified ? "YES" : "NO"
                    : undefined,
                  show: data.isMerchantVerified !== undefined,
                  danger: data.isMerchantVerified === false,
                },
              ]
                .filter((r) => r.show && r.value !== undefined)
                .map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Icon className="h-3 w-3" />
                        {row.label}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-2 py-0.5 font-medium ${
                          row.danger
                            ? "bg-danger/10 text-danger border-danger/20"
                            : "bg-secondary text-foreground border-border"
                        }`}
                      >
                        {row.value}
                      </Badge>
                    </div>
                  );
                })}
            </div>

            {/* Detection Flags */}
            {(data.transaction_id_flag !== undefined ||
              data.receiver_account_age_flag !== undefined ||
              data.merchant_flag !== undefined ||
              data.beneficiary_flag !== undefined) && (
              <div className="space-y-2 border-t border-border pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Detection Flags
                </p>
                <div className="space-y-1.5">
                  {[
                    { label: "Transaction ID Spoofing", value: data.transaction_id_flag },
                    { label: "Account Age Flag", value: data.receiver_account_age_flag },
                    { label: "Merchant Verification Flag", value: data.merchant_flag },
                    { label: "New Beneficiary Flag", value: data.beneficiary_flag },
                  ]
                    .filter((f) => f.value !== undefined)
                    .map((f) => (
                      <div key={f.label} className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">{f.label}</span>
                        {flagBadge(f.value)}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Receiver Reasons */}
            {data.receiver_reasons && data.receiver_reasons.length > 0 && (
              <div className="space-y-2 border-t border-border pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                  <UserX className="h-3 w-3" />
                  Receiver-Side Risk Reasons
                </p>
                <ul className="space-y-1.5">
                  {data.receiver_reasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-foreground">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-danger shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ReceiverRiskPanel;
