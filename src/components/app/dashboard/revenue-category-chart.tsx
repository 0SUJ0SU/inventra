// src/components/app/dashboard/revenue-category-chart.tsx
"use client";

import { motion } from "framer-motion";
import { DashboardPeriod, PERIOD_CONFIG, getRevenueByCategory } from "@/lib/demo-data";
import { formatNumber } from "@/lib/utils/format";

const CATEGORY_COLORS = [
  "#1925AA",
  "#4A5AD0",
  "#8B93E0",
  "#B8BDE9",
  "#D6D9F3",
];

interface RevenueCategoryChartProps {
  period: DashboardPeriod;
}

export function RevenueCategoryChart({ period }: RevenueCategoryChartProps) {
  const data = getRevenueByCategory(period);
  const total = data.reduce((sum, c) => sum + c.value, 0);

  let cumulative = 0;
  const gradientStops = total === 0
    ? "transparent 0deg 360deg"
    : data
        .map((cat, i) => {
          const start = cumulative;
          cumulative += (cat.value / total) * 360;
          return `${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} ${start}deg ${cumulative}deg`;
        })
        .join(", ");

  const formatTotal = (v: number) => {
    if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `$${(v / 1000).toFixed(1)}K`;
    return `$${v}`;
  };

  return (
    <motion.div
      className="border border-blue-primary/10 bg-cream-light p-5 flex flex-col"
      initial={{ y: 30 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div className="flex items-center gap-3">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
            Revenue by Category
          </p>
          <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/20">
            {PERIOD_CONFIG[period].label}
          </span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
          /002
        </span>
      </div>

      {/* Donut */}
      <div className="flex justify-center mb-5">
        <div className="relative w-36 h-36">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: `conic-gradient(${gradientStops})` }}
          />
          <div className="absolute inset-[26%] rounded-full bg-cream-light flex items-center justify-center flex-col">
            <span className="font-sans text-sm font-bold tracking-tight text-blue-primary leading-none">
              {formatTotal(total)}
            </span>
            <span className="font-mono text-[7px] tracking-[0.12em] uppercase text-blue-primary/30 mt-0.5">
              Total
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {data.map((cat, i) => (
          <div key={cat.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 shrink-0 border border-blue-primary/10"
                style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
              />
              <span className="font-mono text-[10px] tracking-[0.05em] uppercase text-blue-primary/60">
                {cat.name}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[10px] tracking-[0.05em] text-blue-primary/70 font-medium tabular-nums">
                ${formatNumber(cat.value)}
              </span>
              <span className="font-mono text-[9px] tracking-[0.05em] text-blue-primary/50 tabular-nums w-7 text-right">
                {cat.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
