import { useEffect, useState } from "react";

interface RiskGaugeProps {
  score: number;
}

const RiskGauge = ({ score }: RiskGaugeProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * score);
      setAnimatedScore(start);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [score]);

  const size = 160;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // 270° arc (3/4 of circle), starting from bottom-left
  const arcLength = circumference * 0.75;
  const filled = (animatedScore / 100) * arcLength;
  const offset = circumference - filled;
  const rotation = -225; // start from bottom-left

  const color =
    animatedScore >= 70
      ? "hsl(var(--danger))"
      : animatedScore >= 50
        ? "hsl(var(--warning))"
        : "hsl(var(--safe))";

  const label =
    animatedScore >= 70 ? "High Risk" : animatedScore >= 50 ? "Warning" : "Safe";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          strokeDashoffset={0}
          transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute flex flex-col items-center gap-0.5">
        <span className="text-3xl font-bold text-foreground tabular-nums">{animatedScore}</span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
    </div>
  );
};

export default RiskGauge;
