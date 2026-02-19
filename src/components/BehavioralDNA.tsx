import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile, RiskTrendPoint } from "@/lib/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Brain, MapPin, Clock, Percent } from "lucide-react";

interface BehavioralDNAProps {
  user: UserProfile;
  riskTrend: RiskTrendPoint[];
}

const BehavioralDNA = ({ user, riskTrend }: BehavioralDNAProps) => {
  const insights = [
    { label: "Typical Spending Range", value: `$${user.typicalSpendingRange.min} – $${user.typicalSpendingRange.max}`, icon: Brain },
    { label: "Most Frequent Location", value: user.mostFrequentLocation, icon: MapPin },
    { label: "Normal Spending Hours", value: user.normalSpendingHours, icon: Clock },
    { label: "Income vs Spend Ratio", value: `${Math.round(user.incomeVsSpendRatio * 100)}%`, icon: Percent },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="rounded-2xl shadow-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            Behavioral DNA Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {insights.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <item.icon className="h-3 w-3" />
                <span className="text-xs">{item.label}</span>
              </div>
              <p className="text-sm font-medium text-foreground">{item.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">Risk Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={riskTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default BehavioralDNA;
