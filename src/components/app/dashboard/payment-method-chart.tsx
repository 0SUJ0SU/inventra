// src/components/app/dashboard/payment-method-chart.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DashboardPeriod, PERIOD_CONFIG, getPaymentMethods } from "@/lib/demo-data";
import { formatNumber } from "@/lib/utils/format";

const METHOD_COLORS = [
  "#22C55E",
  "#1925AA",
  "#6E7DDC",
];

interface PaymentMethodChartProps {
  period: DashboardPeriod;
}

export function PaymentMethodChart({ period }: PaymentMethodChartProps) {
  const data = getPaymentMethods(period);
  const total = data.reduce((sum, m) => sum + m.value, 0);
  const totalTransactions = data.reduce((s, m) => s + m.transactions, 0);

  let cumulative = 0;
  const gradientStops = total === 0
    ? "transparent 0deg 360deg"
    : data
        .map((m, i) => {
          const start = cumulative;
          cumulative += (m.value / total) * 360;
          return `${METHOD_COLORS[i % METHOD_COLORS.length]} ${start}deg ${cumulative}deg`;
        })
        .join(", ");

  return (
    <motion.div
      className="border border-blue-primary/10 bg-cream-light p-5 flex flex-col"
      initial={{ y: 30 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div className="flex items-center gap-3">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
            Payment Methods
          </p>
          <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/20">
            {PERIOD_CONFIG[period].label}
          </span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
          /003
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
              {formatNumber(totalTransactions)}
            </span>
            <span className="font-mono text-[7px] tracking-[0.12em] uppercase text-blue-primary/30 mt-0.5">
              Transactions
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2.5">
        {data.map((m, i) => (
          <div key={m.method}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 shrink-0 border border-blue-primary/10"
                  style={{ backgroundColor: METHOD_COLORS[i % METHOD_COLORS.length] }}
                />
                <span className="font-mono text-[10px] tracking-[0.05em] uppercase text-blue-primary/60">
                  {m.method}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[10px] tracking-[0.05em] text-blue-primary/70 font-medium tabular-nums">
                  ${formatNumber(m.value)}
                </span>
                <span className="font-mono text-[9px] tracking-[0.05em] text-blue-primary/50 tabular-nums w-7 text-right">
                  {m.percentage}%
                </span>
              </div>
            </div>
            <div className="h-[3px] bg-blue-primary/6" style={{ width: "calc(100% - 18px)", marginLeft: 18 }}>
              <div
                className="h-full"
                style={{
                  backgroundColor: METHOD_COLORS[i % METHOD_COLORS.length],
                  width: `${m.percentage}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3 shrink-0">
        <Link
          href="/sales"
          className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40 hover:text-blue-primary transition-colors duration-200"
        >
          [ View Sales History → ]
        </Link>
      </div>
    </motion.div>
  );
}
