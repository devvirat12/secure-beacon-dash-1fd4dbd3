import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, CreditCard, Activity, MapPin } from "lucide-react";
import { UserProfile } from "@/lib/types";

interface MetricCardsProps {
  user: UserProfile;
}

const MetricCards = ({ user }: MetricCardsProps) => {
  const metrics = [
    { label: "Monthly Salary", value: `₹${user.monthlySalary.toLocaleString("en-IN")}`, icon: DollarSign, color: "text-safe" },
    { label: "Avg Transaction", value: `₹${user.avgTransactionAmount.toLocaleString("en-IN")}`, icon: CreditCard, color: "text-primary" },
    { label: "Avg Monthly Spend", value: `₹${user.avgMonthlySpend.toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-warning" },
    { label: "Weekly Frequency", value: `${user.weeklyTransactionFrequency} txns`, icon: Activity, color: "text-primary" },
    { label: "Usual Cities", value: user.usualCities.join(", "), icon: MapPin, color: "text-muted-foreground" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {metrics.map((m) => (
        <Card key={m.label} className="glass-card rounded-2xl">
          <CardContent className="flex items-start gap-3 p-4">
            <div className={`mt-0.5 ${m.color}`}>
              <m.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground truncate">{m.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricCards;
