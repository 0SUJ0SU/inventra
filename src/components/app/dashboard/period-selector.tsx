// src/components/app/dashboard/period-selector.tsx
"use client";

import { motion } from "framer-motion";
import { DashboardPeriod, PERIOD_CONFIG } from "@/lib/demo-data";

const PERIODS: DashboardPeriod[] = ["today", "7d", "30d", "this-month", "this-year"];

interface PeriodSelectorProps {
  value: DashboardPeriod;
  onChange: (period: DashboardPeriod) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <motion.div
      className="flex items-center gap-0.5 border border-blue-primary/10"
      initial={{ y: -10 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {PERIODS.map((period) => (
        <button
          key={period}
          onClick={() => onChange(period)}
          className={`font-mono text-[9px] tracking-[0.12em] uppercase px-3 py-1.5 transition-colors duration-200 ${
            value === period
              ? "bg-blue-primary text-cream-primary"
              : "text-blue-primary/30 hover:text-blue-primary/60 hover:bg-blue-primary/4"
          }`}
        >
          {PERIOD_CONFIG[period].shortLabel}
        </button>
      ))}
    </motion.div>
  );
}
