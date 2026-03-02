// src/components/app/dashboard/kpi-card.tsx
"use client";

import { motion } from "framer-motion";
import { useAnimatedCounter } from "@/lib/hooks/use-animated-counter";
import { formatNumber } from "@/lib/utils/format";

interface KpiCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  format: "compact" | "number";
  change: string;
  positive: boolean;
  index: number;
}

function formatValue(value: number, format: "compact" | "number"): string {
  if (format === "compact") {
    if (value >= 1000) {
      const k = value / 1000;
      // Show one decimal if not a round number
      return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
    }
    return formatNumber(value);
  }
  return formatNumber(value);
}

export function KpiCard({
  label,
  value,
  prefix = "",
  suffix = "",
  format,
  change,
  positive,
  index,
}: KpiCardProps) {
  const animatedValue = useAnimatedCounter({
    end: value,
    duration: 2000,
    delay: 200 + index * 100,
  });

  return (
    <motion.div
      className="relative border border-blue-primary/10 bg-cream-light p-5"
      initial={{ y: 30 }}
      animate={{ y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.1 + index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Top line accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-primary" />

      {/* Label */}
      <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
        {label}
      </p>

      {/* Animated value */}
      <p className="font-sans text-3xl font-bold tracking-tight text-blue-primary mt-2">
        {prefix}{formatValue(animatedValue, format)}{suffix}
      </p>

      {/* Change indicator */}
      <p
        className={`font-mono text-[10px] tracking-[0.1em] mt-1.5 ${
          positive ? "text-success" : "text-error"
        }`}
      >
        {change}
      </p>

      {/* Card number marker */}
      <span className="absolute top-4 right-4 font-mono text-[8px] tracking-[0.1em] text-blue-primary/12">
        /{String(index + 1).padStart(3, "0")}
      </span>
    </motion.div>
  );
}
