// src/components/app/dashboard/low-stock-alerts.tsx
"use client";

import { motion } from "framer-motion";
import { LOW_STOCK_ALERTS } from "@/lib/demo-data";

export function LowStockAlerts() {
  return (
    <motion.div
      className="border border-blue-primary/10 bg-cream-light p-5 flex flex-col"
      initial={{ y: 30 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
            Low Stock Alerts
          </p>
          <span className="font-mono text-[9px] tracking-[0.1em] border border-blue-primary/15 text-blue-primary/50 px-2 py-0.5 tabular-nums">
            {LOW_STOCK_ALERTS.length} items
          </span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
          /005
        </span>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[1fr_48px_48px] gap-x-3 pb-2 border-b border-blue-primary/10">
        <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/25">
          Product
        </span>
        <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/25 text-right">
          Stock
        </span>
        <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/25 text-right">
          Min
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-blue-primary/6 border-b border-blue-primary/6">
        {LOW_STOCK_ALERTS.map((item) => {
          const stockColor =
            item.current < item.minimum
              ? "text-error"
              : item.current === item.minimum
              ? "text-warning"
              : "text-success";

          return (
            <div
              key={item.sku}
              className="grid grid-cols-[1fr_48px_48px] gap-x-3 py-2.5 items-center"
            >
              <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-[0.05em] uppercase text-blue-primary/70 truncate">
                  {item.name}
                </p>
                <p className="font-mono text-[8px] tracking-[0.1em] text-blue-primary/25 mt-0.5">
                  {item.sku}
                </p>
              </div>
              <span className={`font-mono text-[11px] tracking-[0.05em] font-medium text-right tabular-nums ${stockColor}`}>
                {item.current}
              </span>
              <span className="font-mono text-[10px] tracking-[0.05em] text-blue-primary/30 text-right tabular-nums">
                {item.minimum}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer action */}
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
