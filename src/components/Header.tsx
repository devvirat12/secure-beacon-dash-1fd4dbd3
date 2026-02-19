import { Shield, BarChart3 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDemo } from "@/lib/demo-context";
import { useLocation, Link } from "react-router-dom";

const Header = () => {
  const { demoMode, setDemoMode } = useDemo();
  const location = useLocation();

  return (
    <header className="glass-header px-6 py-4 sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">Fraud Buster</h1>
            <p className="text-xs text-muted-foreground">Real-Time Hybrid Anomaly Detection Engine</p>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/" ? "text-primary" : "text-muted-foreground"}`}
          >
            Dashboard
          </Link>
          <Link
            to="/simulate"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/simulate" ? "text-primary" : "text-muted-foreground"}`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Simulate
          </Link>

          <div className="ml-4 flex items-center gap-2 rounded-lg glass-card-light px-3 py-1.5">
            <Label htmlFor="demo-mode" className="text-xs text-muted-foreground cursor-pointer">Demo</Label>
            <Switch id="demo-mode" checked={demoMode} onCheckedChange={setDemoMode} className="scale-75" />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
