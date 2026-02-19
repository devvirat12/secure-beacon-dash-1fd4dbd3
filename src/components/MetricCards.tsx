import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, CreditCard, Activity, MapPin } from "lucide-react";
import { UserProfile } from "@/lib/types";

interface MetricCardsProps {
  user: UserProfile;
}

const MetricCards = ({ user }: MetricCardsProps) => {
  const metrics = [
    { label: "Monthly Salary", value: `₹${user.monthlySalary.toLocaleString("en-IN")}`, icon: DollarSign, accent: "text-safe", bg: "bg-safe/8" },
    { label: "Avg Transaction", value: `₹${user.avgTransactionAmount.toLocaleString("en-IN")}`, icon: CreditCard, accent: "text-primary", bg: "bg-primary/8" },
    { label: "Monthly Spend", value: `₹${user.avgMonthlySpend.toLocaleString("en-IN")}`, icon: TrendingUp, accent: "text-warning", bg: "bg-warning/8" },
    { label: "Weekly Frequency", value: `${user.weeklyTransactionFrequency} txns`, icon: Activity, accent: "text-primary", bg: "bg-primary/8" },
    { label: "Usual Cities", value: user.usualCities.join(", "), icon: MapPin, accent: "text-muted-foreground", bg: "bg-secondary" },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {metrics.map((m) => (
        <Card key={m.label} className="glass-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${m.bg}`}>
              <m.icon className={`h-4 w-4 ${m.accent}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">{m.label}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground truncate">{m.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricCards;
