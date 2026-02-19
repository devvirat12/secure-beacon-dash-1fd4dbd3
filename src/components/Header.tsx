import { Shield, BarChart3, Home } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDemo } from "@/lib/demo-context";
import { useLocation, Link } from "react-router-dom";

const Header = () => {
  const { demoMode, setDemoMode } = useDemo();
  const location = useLocation();

  const navLink = (to: string, label: string, icon?: React.ReactNode) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-white/60"
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <header className="glass-header px-6 py-3.5 sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link to="/landing" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-105"
            style={{ background: "hsl(221,83%,53%)" }}>
            <Shield className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold tracking-tight text-foreground leading-tight">Fraud Buster</h1>
            <p className="text-[11px] text-muted-foreground leading-none">Real-Time Hybrid Anomaly Detection</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navLink("/landing", "Home", <Home className="h-3.5 w-3.5" />)}
          {navLink("/", "Dashboard")}
          {navLink("/simulate", "Simulate", <BarChart3 className="h-3.5 w-3.5" />)}

          <div className="ml-2 flex items-center gap-2 rounded-xl border border-border/60 bg-white/60 backdrop-blur px-3 py-1.5">
            <Label htmlFor="demo-mode" className="text-xs text-muted-foreground cursor-pointer select-none">Demo</Label>
            <Switch id="demo-mode" checked={demoMode} onCheckedChange={setDemoMode} className="scale-75 origin-right" />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

