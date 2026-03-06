"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DashboardPeriod, PERIOD_CONFIG, getTopCustomers } from "@/lib/demo-data";
import { formatNumber } from "@/lib/utils/format";

interface TopCustomersProps {
  period: DashboardPeriod;
}

export function TopCustomers({ period }: TopCustomersProps) {
  const data = getTopCustomers(period);

  return (
    <motion.div
      className="border border-blue-primary/10 bg-cream-light p-5 flex flex-col"
      initial={{ y: 30 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
            Top Customers
          </p>
          <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/20">
            {PERIOD_CONFIG[period].label}
          </span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
          /004
        </span>
      </div>

      <div className="grid grid-cols-[1fr_56px_72px] gap-x-2 pb-2 border-b border-blue-primary/10 shrink-0">
        <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/25">
          Customer
        </span>
        <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/25 text-right">
          Orders
        </span>
        <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/25 text-right">
          Spent
        </span>
      </div>

      <div className="divide-y divide-blue-primary/6 border-b border-blue-primary/6">
        {data.map((customer) => (
          <div
            key={customer.name}
            className="grid grid-cols-[1fr_56px_72px] gap-x-2 py-2.5 items-center"
          >
            <div className="min-w-0">
              <p className="font-mono text-[10px] tracking-[0.05em] uppercase text-blue-primary/70 truncate">
                {customer.name}
              </p>
              <p className="font-mono text-[8px] tracking-[0.1em] text-blue-primary/25 mt-0.5">
                {customer.lastVisit}
              </p>
            </div>
            <span className="font-mono text-[10px] tracking-[0.05em] text-blue-primary/50 text-right tabular-nums">
              {customer.transactions}
            </span>
            <span className="font-mono text-[10px] tracking-[0.05em] text-blue-primary/70 font-medium text-right tabular-nums">
              ${formatNumber(customer.spent)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-3 shrink-0">
        <Link
          href="/customers"
          className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40 hover:text-blue-primary transition-colors duration-200"
        >
          [ View All Customers → ]
        </Link>
      </div>
    </motion.div>
  );
}
