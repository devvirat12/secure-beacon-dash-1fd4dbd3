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
    { label: "Typical Spending Range", value: `₹${user.typicalSpendingRange.min.toLocaleString("en-IN")} – ₹${user.typicalSpendingRange.max.toLocaleString("en-IN")}`, icon: Brain },
    { label: "Most Frequent City", value: user.mostFrequentCity, icon: MapPin },
    { label: "Normal Spending Hours", value: user.normalSpendingHours, icon: Clock },
    { label: "Salary vs Spend Ratio", value: `${Math.round(user.incomeVsSpendRatio * 100)}%`, icon: Percent },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            Behavioral Risk Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-5">
          {insights.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <item.icon className="h-3 w-3" />
                <span className="text-[11px]">{item.label}</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-foreground">Risk Trend (30 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={riskTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default BehavioralDNA;
