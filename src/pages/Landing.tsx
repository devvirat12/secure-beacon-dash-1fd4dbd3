import { Link } from "react-router-dom";
import {
  Shield,
  Brain,
  Zap,
  Eye,
  ArrowRight,
  CheckCircle,
  Activity,
  MapPin,
  TrendingUp,
  Github,
  ChevronRight,
} from "lucide-react";

/* ─── tiny helpers ─────────────────────────────────────────── */

const GlassCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-[28px] border border-white/40 bg-white/60 shadow-[0_8px_32px_rgba(30,80,200,0.10)] backdrop-blur-xl ${className}`}
  >
    {children}
  </div>
);

/* ─── data ──────────────────────────────────────────────────── */

const stats = [
  { value: "95%", label: "Anomaly Detection Accuracy", icon: TrendingUp },
  { value: "Hybrid", label: "ML Engine", icon: Brain },
  { value: "DNA", label: "Behavioral Modeling", icon: Activity },
  { value: "Live", label: "Receiver Risk Intelligence", icon: Eye },
];

const features = [
  {
    icon: Zap,
    title: "Hybrid ML Engine",
    desc: "Isolation Forest + Probability Scoring for real-time anomaly detection.",
  },
  {
    icon: Brain,
    title: "Behavioral DNA",
    desc: "Learns user patterns: spending, timing, geo-behavior over time.",
  },
  {
    icon: Eye,
    title: "Receiver Intelligence",
    desc: "Detects mule accounts, new receivers, and risky merchants automatically.",
  },
  {
    icon: Shield,
    title: "Explainable Alerts",
    desc: "Clear, human-readable reasoning for every flagged transaction.",
  },
];

const steps = [
  {
    num: "01",
    title: "Submit Transaction",
    desc: "Input transaction details — amount, type, receiver, location.",
  },
  {
    num: "02",
    title: "Hybrid Analysis",
    desc: "ML + rule engine scores 18 behavioral signals simultaneously.",
  },
  {
    num: "03",
    title: "Instant Decision",
    desc: "Get a Safe / Warning / High-Risk verdict in milliseconds.",
  },
];

const bullets = [
  "Hybrid ML + deterministic rules — not a black box",
  "Receiver-side fraud intelligence built in",
  "Real-time, non-blocking pre-authorization detection",
  "Clean, explainable risk scoring with feature breakdown",
  "Lightweight TypeScript engine — edge deployable",
  "79-user behavioral dataset across 10 distinct personas",
];

/* ─── page ──────────────────────────────────────────────────── */

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">

      {/* ── background gradient canvas ─────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, hsl(215,80%,97%) 0%, hsl(220,70%,93%) 40%, hsl(230,80%,90%) 100%)",
        }}
      />
      {/* soft blue orbs */}
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 -left-40 h-[600px] w-[600px] rounded-full blur-[120px] -z-10"
        style={{ background: "hsla(221,83%,53%,0.18)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -bottom-40 -right-40 h-[500px] w-[500px] rounded-full blur-[120px] -z-10"
        style={{ background: "hsla(210,90%,60%,0.14)" }}
      />

      {/* ── nav ────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 px-6 py-3.5 backdrop-blur-xl border-b border-white/40"
        style={{ background: "hsla(0,0%,100%,0.70)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm"
              style={{ background: "hsl(221,83%,53%)" }}>
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight" style={{ color: "hsl(222,47%,11%)" }}>
              Fraud Buster
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:block px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{ color: "hsl(221,83%,53%)" }}
            >
              Dashboard
            </Link>
            <Link
              to="/simulate"
              className="px-4 py-1.5 rounded-xl text-sm font-semibold text-white shadow transition-opacity hover:opacity-90"
              style={{ background: "hsl(221,83%,53%)" }}
            >
              Try Demo
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 space-y-24 pb-24">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="pt-20 pb-4 flex flex-col items-center text-center gap-10">
          {/* badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-1.5 text-xs font-semibold shadow-sm backdrop-blur"
            style={{ color: "hsl(221,83%,53%)" }}>
            <Zap className="h-3.5 w-3.5" />
            Hybrid ML · Real-Time · Pre-Authorization
          </div>

          <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
            style={{ color: "hsl(222,47%,11%)" }}>
            Real-Time Fraud Detection.{" "}
            <span style={{ color: "hsl(221,83%,53%)" }}>Before It Happens.</span>
          </h1>

          <p className="max-w-xl text-base sm:text-lg leading-relaxed"
            style={{ color: "hsl(215,16%,47%)" }}>
            FraudBuster uses hybrid ML + behavioral intelligence to stop suspicious
            transactions instantly — with zero false-positive blocking.
          </p>

          {/* CTA card */}
          <GlassCard className="flex flex-col sm:flex-row gap-3 p-4">
            <Link
              to="/simulate"
              className="flex items-center gap-2 justify-center rounded-2xl px-7 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(210,90%,60%))",
                boxShadow: "0 4px 24px hsla(221,83%,53%,0.40)",
              }}
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 justify-center rounded-2xl border border-blue-200 bg-white/70 px-7 py-3 text-sm font-semibold transition-all hover:bg-white"
              style={{ color: "hsl(221,83%,53%)" }}
            >
              View Dashboard
            </Link>
          </GlassCard>
        </section>

        {/* ── STATS ────────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <GlassCard key={s.label} className="flex flex-col items-center gap-2 p-6 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl"
                  style={{ background: "hsla(221,83%,53%,0.10)" }}>
                  <s.icon className="h-5 w-5" style={{ color: "hsl(221,83%,53%)" }} />
                </div>
                <p className="text-2xl font-extrabold" style={{ color: "hsl(222,47%,11%)" }}>{s.value}</p>
                <p className="text-[11px] leading-tight" style={{ color: "hsl(215,16%,47%)" }}>{s.label}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────── */}
        <section>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold" style={{ color: "hsl(222,47%,11%)" }}>Core Capabilities</h2>
            <p className="mt-2 text-sm" style={{ color: "hsl(215,16%,47%)" }}>
              Four pillars that power every risk decision
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <GlassCard key={f.title} className="flex flex-col gap-4 p-6 transition-all hover:shadow-[0_12px_40px_hsla(221,83%,53%,0.15)] hover:-translate-y-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(210,90%,65%))" }}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] mb-1" style={{ color: "hsl(222,47%,11%)" }}>{f.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "hsl(215,16%,47%)" }}>{f.desc}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────── */}
        <section>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold" style={{ color: "hsl(222,47%,11%)" }}>How It Works</h2>
            <p className="mt-2 text-sm" style={{ color: "hsl(215,16%,47%)" }}>
              Three stages. Milliseconds to decision.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-stretch gap-4">
            {steps.map((step, i) => (
              <div key={step.num} className="flex flex-1 flex-col lg:flex-row items-center gap-4">
                <GlassCard className="flex-1 w-full flex flex-col gap-3 p-7">
                  <span className="text-4xl font-extrabold"
                    style={{ color: "hsla(221,83%,53%,0.20)" }}>
                    {step.num}
                  </span>
                  <h3 className="font-bold text-base" style={{ color: "hsl(222,47%,11%)" }}>{step.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "hsl(215,16%,47%)" }}>{step.desc}</p>
                </GlassCard>
                {i < steps.length - 1 && (
                  <ChevronRight
                    className="hidden lg:block shrink-0 h-6 w-6"
                    style={{ color: "hsl(221,83%,53%)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── DEMO PREVIEW ─────────────────────────────────── */}
        <section>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold" style={{ color: "hsl(222,47%,11%)" }}>Live Transaction Monitoring</h2>
            <p className="mt-2 text-sm" style={{ color: "hsl(215,16%,47%)" }}>
              Pre-authorization risk scores for every transaction in real-time.
            </p>
          </div>

          {/* mock dashboard frame */}
          <GlassCard className="overflow-hidden p-3">
            {/* window chrome */}
            <div className="flex items-center gap-1.5 px-3 py-2 mb-3">
              <span className="h-3 w-3 rounded-full" style={{ background: "hsl(0,72%,65%)" }} />
              <span className="h-3 w-3 rounded-full" style={{ background: "hsl(38,92%,55%)" }} />
              <span className="h-3 w-3 rounded-full" style={{ background: "hsl(142,71%,45%)" }} />
              <div className="mx-auto flex items-center gap-2 rounded-lg border border-blue-100 bg-white/80 px-4 py-1 text-[11px]"
                style={{ color: "hsl(215,16%,47%)" }}>
                <Shield className="h-3 w-3" style={{ color: "hsl(221,83%,53%)" }} />
                fraudbuster.app/dashboard
              </div>
            </div>

            {/* simulated dashboard content */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "hsl(210,20%,98%)", minHeight: 320 }}>
              {/* header bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-blue-50"
                style={{ background: "hsl(0,0%,100%)" }}>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg flex items-center justify-center"
                    style={{ background: "hsl(221,83%,53%)" }}>
                    <Shield className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-xs font-bold" style={{ color: "hsl(222,47%,11%)" }}>Fraud Buster</span>
                </div>
                <div className="flex gap-2">
                  {["Dashboard", "Simulate"].map((t) => (
                    <span key={t} className="px-2.5 py-0.5 rounded-md text-[10px] font-medium"
                      style={{
                        background: t === "Dashboard" ? "hsla(221,83%,53%,0.10)" : "transparent",
                        color: t === "Dashboard" ? "hsl(221,83%,53%)" : "hsl(215,16%,47%)",
                      }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* metric cards row */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 p-4">
                {[
                  { label: "Monthly Salary", val: "₹85,000" },
                  { label: "Avg Transaction", val: "₹3,200" },
                  { label: "Monthly Spend", val: "₹28,500" },
                  { label: "Weekly Freq", val: "12 txns" },
                  { label: "Cities", val: "Mumbai, Pune" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border border-blue-50 bg-white p-3">
                    <p className="text-[9px] mb-0.5" style={{ color: "hsl(215,16%,47%)" }}>{m.label}</p>
                    <p className="text-[11px] font-bold" style={{ color: "hsl(222,47%,11%)" }}>{m.val}</p>
                  </div>
                ))}
              </div>

              {/* live stream mock */}
              <div className="mx-4 mb-4 rounded-xl border border-blue-50 bg-white overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-blue-50">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: "hsl(221,83%,53%)" }} />
                    <span className="relative inline-flex h-2 w-2 rounded-full"
                      style={{ background: "hsl(221,83%,53%)" }} />
                  </span>
                  <span className="text-[11px] font-semibold" style={{ color: "hsl(222,47%,11%)" }}>Live Transactions</span>
                </div>
                <div className="divide-y divide-blue-50">
                  {[
                    { id: "TXN-7821", amt: "₹12,500", risk: "HIGH RISK", riskColor: "hsl(0,72%,51%)", bg: "hsla(0,72%,51%,0.08)" },
                    { id: "TXN-7820", amt: "₹2,300", risk: "SAFE", riskColor: "hsl(142,71%,40%)", bg: "hsla(142,71%,40%,0.08)" },
                    { id: "TXN-7819", amt: "₹5,800", risk: "WARNING", riskColor: "hsl(38,92%,45%)", bg: "hsla(38,92%,50%,0.08)" },
                  ].map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-[10px] font-mono" style={{ color: "hsl(215,16%,47%)" }}>{tx.id}</span>
                      <span className="text-[11px] font-bold" style={{ color: "hsl(222,47%,11%)" }}>{tx.amt}</span>
                      <span className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                        style={{ color: tx.riskColor, background: tx.bg }}>
                        {tx.risk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ── WHY FRAUDBUSTER ──────────────────────────────── */}
        <section>
          <GlassCard className="p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="lg:w-72 shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl mb-4"
                  style={{ background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(210,90%,65%))" }}>
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: "hsl(222,47%,11%)" }}>
                  Why FraudBuster Is Different
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(215,16%,47%)" }}>
                  Purpose-built for UPI-scale fraud — not a generic anomaly detector.
                </p>
              </div>
              <ul className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "hsl(221,83%,53%)" }} />
                    <span className="text-sm" style={{ color: "hsl(222,47%,11%)" }}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────── */}
        <section className="flex flex-col items-center gap-5 text-center pb-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "hsl(222,47%,11%)" }}>
            Ready to Stop Fraud in Real-Time?
          </h2>
          <p className="text-sm max-w-md" style={{ color: "hsl(215,16%,47%)" }}>
            Launch the live demo and see the hybrid ML engine score transactions instantly.
          </p>

          <GlassCard className="flex flex-col sm:flex-row gap-3 p-4">
            <Link
              to="/simulate"
              className="flex items-center gap-2 justify-center rounded-2xl px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(210,90%,60%))",
                boxShadow: "0 4px 28px hsla(221,83%,53%,0.45)",
              }}
            >
              <Zap className="h-4 w-4" />
              Launch Demo
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 justify-center rounded-2xl border border-blue-200 bg-white/70 px-7 py-3 text-sm font-semibold transition-all hover:bg-white"
              style={{ color: "hsl(222,47%,11%)" }}
            >
              <Github className="h-4 w-4" />
              View Code on GitHub
            </a>
          </GlassCard>

          <p className="text-[11px]" style={{ color: "hsl(215,16%,60%)" }}>
            No account required · Fully client-side · Edge deployable
          </p>
        </section>

      </main>

      {/* ── footer ──────────────────────────────────────────── */}
      <footer className="border-t border-white/40 backdrop-blur px-6 py-5"
        style={{ background: "hsla(0,0%,100%,0.55)" }}>
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: "hsl(222,47%,11%)" }}>
            <Shield className="h-3.5 w-3.5" style={{ color: "hsl(221,83%,53%)" }} />
            Fraud Buster
          </div>
          <p className="text-[11px]" style={{ color: "hsl(215,16%,55%)" }}>
            Detection Layer: Flagging Only — No Automatic Blocking
          </p>
          <div className="flex gap-4 text-[11px]" style={{ color: "hsl(215,16%,55%)" }}>
            <Link to="/" className="hover:underline">Dashboard</Link>
            <Link to="/simulate" className="hover:underline">Simulate</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
