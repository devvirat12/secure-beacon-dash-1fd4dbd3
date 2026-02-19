import { Shield, BarChart3 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDemo } from "@/lib/demo-context";
import { useLocation, Link } from "react-router-dom";

const Header = () => {
  const { demoMode, setDemoMode } = useDemo();
  const location = useLocation();

  return (
    <header className="glass-header px-6 py-3.5 sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Shield className="h-4.5 w-4.5" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold tracking-tight text-foreground leading-tight">Fraud Buster</h1>
            <p className="text-[11px] text-muted-foreground leading-none">Real-Time Hybrid Anomaly Detection</p>
          </div>
        </div>

        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/simulate"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/simulate"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Simulate
          </Link>

          <div className="ml-3 flex items-center gap-2 border border-border rounded-lg px-3 py-1.5">
            <Label htmlFor="demo-mode" className="text-xs text-muted-foreground cursor-pointer select-none">Demo</Label>
            <Switch id="demo-mode" checked={demoMode} onCheckedChange={setDemoMode} className="scale-75 origin-right" />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
