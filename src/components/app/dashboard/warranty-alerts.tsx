// src/components/app/dashboard/warranty-alerts.tsx
"use client";

import { motion } from "framer-motion";
import { WARRANTY_ALERTS } from "@/lib/demo-data";

export function WarrantyAlerts() {
  return (
    <motion.div
      className="border border-blue-primary/10 bg-cream-light p-5 flex flex-col"
      initial={{ y: 30 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
          Warranty Alerts
        </p>
        <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
          /006
        </span>
      </div>

      {/* Summary stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="border border-blue-primary/8 p-3">
          <p className="font-sans text-xl font-bold tracking-tight text-warning leading-none">
            {WARRANTY_ALERTS.expiringIn30Days}
          </p>
          <p className="font-mono text-[8px] tracking-[0.12em] uppercase text-warning mt-1.5">
            Expiring Soon
          </p>
        </div>
        <div className="border border-blue-primary/8 p-3">
          <p className="font-sans text-xl font-bold tracking-tight text-blue-primary leading-none">
            {WARRANTY_ALERTS.openClaims}
          </p>
          <p className="font-mono text-[8px] tracking-[0.12em] uppercase text-blue-primary/35 mt-1.5">
            Open Claims
          </p>
        </div>
        <div className="border border-blue-primary/8 p-3">
          <p className="font-sans text-xl font-bold tracking-tight text-error leading-none">
            {WARRANTY_ALERTS.pendingReview}
          </p>
          <p className="font-mono text-[8px] tracking-[0.12em] uppercase text-error/60 mt-1.5">
            Pending Review
          </p>
        </div>
      </div>

      {/* Items expiring */}
      <p className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/25 mb-2">
        Expiring Warranties
      </p>

      <div className="divide-y divide-blue-primary/6 shrink-0 border-b border-blue-primary/6">
        {WARRANTY_ALERTS.items.map((item) => {
          const urgency =
            item.expiresIn <= 7
              ? "text-error"
              : item.expiresIn <= 14
              ? "text-warning"
              : "text-blue-primary/50";

          return (
            <div
              key={item.serial}
              className="flex items-center justify-between py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] tracking-[0.05em] uppercase text-blue-primary/70 truncate">
                  {item.product}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[8px] tracking-[0.1em] text-blue-primary/25">
                    {item.serial}
                  </span>
                  <span className="font-mono text-[8px] tracking-[0.05em] text-blue-primary/20">
                    — {item.customer}
                  </span>
                </div>
              </div>
              <span
                className={`font-mono text-[10px] tracking-[0.05em] font-medium shrink-0 ml-3 tabular-nums ${urgency}`}
              >
                {item.expiresIn}d
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer action */}
      <div className="mt-auto pt-3 shrink-0">
        <a
          href="/warranty"
          className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40 hover:text-blue-primary transition-colors duration-200"
        >
          [ View All Claims → ]
        </a>
      </div>
    </motion.div>
  );
}
