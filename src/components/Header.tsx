import { Shield, BarChart3 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDemo } from "@/lib/demo-context";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

const Header = () => {
  const { demoMode, setDemoMode } = useDemo();
  const location = useLocation();

  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">2C: Real-Time Payment Anomaly Detector</h1>
            <p className="text-xs text-muted-foreground">Hybrid Rule + ML Fraud Intelligence Layer</p>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <a
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/" ? "text-primary" : "text-muted-foreground"}`}
          >
            Dashboard
          </a>
          <a
            href="/simulate"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/simulate" ? "text-primary" : "text-muted-foreground"}`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Simulate
          </a>

          <div className="ml-4 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5">
            <Label htmlFor="demo-mode" className="text-xs text-muted-foreground cursor-pointer">Demo</Label>
            <Switch id="demo-mode" checked={demoMode} onCheckedChange={setDemoMode} className="scale-75" />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
