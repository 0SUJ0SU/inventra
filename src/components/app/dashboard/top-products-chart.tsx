// src/components/app/dashboard/top-products-chart.tsx
"use client";

import { motion } from "framer-motion";
import { DashboardPeriod, PERIOD_CONFIG, getTopProducts } from "@/lib/demo-data";
import { formatNumber } from "@/lib/utils/format";

interface TopProductsChartProps {
  period: DashboardPeriod;
}

export function TopProductsChart({ period }: TopProductsChartProps) {
  const data = getTopProducts(period);
  const maxUnits = Math.max(...data.map((p) => p.units));

  return (
    <motion.div
      className="border border-blue-primary/10 bg-cream-light p-5 flex flex-col"
      initial={{ y: 30 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
            Top Products
          </p>
          <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/20">
            {PERIOD_CONFIG[period].label}
          </span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
          /005
        </span>
      </div>

      {/* Horizontal bars */}
      <div className="space-y-3.5">
        {data.map((product, i) => (
          <div key={product.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] tracking-[0.05em] uppercase text-blue-primary/70">
                {product.name}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] tracking-[0.05em] text-blue-primary/35 tabular-nums">
                  {product.units} units
                </span>
                <span className="font-mono text-[11px] tracking-[0.03em] text-blue-primary font-medium tabular-nums">
                  ${formatNumber(product.revenue)}
                </span>
              </div>
            </div>
            <div className="h-[6px] bg-blue-primary/6 w-full">
              <motion.div
                className="h-full bg-blue-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(product.units / maxUnits) * 100}%` }}
                transition={{
                  duration: 0.8,
                  delay: 0.5 + i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3 shrink-0">
        <a
          href="/products"
          className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40 hover:text-blue-primary transition-colors duration-200"
        >
          [ View All Products → ]
        </a>
      </div>
    </motion.div>
  );
}
