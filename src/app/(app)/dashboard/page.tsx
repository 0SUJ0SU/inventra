// src/app/(app)/dashboard/page.tsx
"use client";

import { motion } from "framer-motion";

const STATS = [
  { label: "Revenue", value: "RM 24.8K", change: "+12.4%", positive: true },
  { label: "Orders", value: "1,847", change: "+8.2%", positive: true },
  { label: "Units Sold", value: "3,291", change: "+15.7%", positive: true },
  { label: "Low Stock Alerts", value: "12", change: "-3", positive: false },
];

const ACTIVITY = [
  { action: "Sale completed #1847", time: "2m ago", type: "sale" },
  { action: "Stock in — 24 units (iPhone 15 Pro)", time: "15m ago", type: "stock" },
  { action: "Warranty claim #WC-0042 opened", time: "1h ago", type: "warranty" },
  { action: "New customer registered — Circuit Hub", time: "2h ago", type: "customer" },
  { action: "Purchase order #PO-0189 completed", time: "3h ago", type: "purchase" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* ─── PAGE HEADER ──────────────────────────── */}
      <div className="flex items-end justify-between">
        <div>
          <motion.h1
            className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-blue-primary leading-none"
            initial={{ x: -30 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Dashboard
          </motion.h1>
          <motion.p
            className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            Overview of your business performance
          </motion.p>
        </div>
        <motion.span
          className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          [INV.DASH]
        </motion.span>
      </div>

      {/* Blueprint divider */}
      <div className="h-px bg-blue-primary/10" />

      {/* ─── KPI CARDS ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="relative border border-blue-primary/10 bg-cream-light p-5"
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1 + i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Top line accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-primary" />
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
              {stat.label}
            </p>
            <p className="font-sans text-3xl font-bold tracking-tight text-blue-primary mt-2">
              {stat.value}
            </p>
            <p
              className={`font-mono text-[10px] tracking-[0.1em] mt-1.5 ${
                stat.positive ? "text-success" : "text-error"
              }`}
            >
              {stat.change}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ─── CONTENT GRID ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Trend — spans 2 cols */}
        <motion.div
          className="lg:col-span-2 border border-blue-primary/10 bg-cream-light p-5"
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between mb-6">
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
              Sales Trend — 30D
            </p>
            <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
              /001
            </span>
          </div>
          {/* Placeholder chart area */}
          <div className="h-48 border border-dashed border-blue-primary/10 flex items-center justify-center">
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/15">
              Chart will be implemented in dashboard milestone
            </span>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="border border-blue-primary/10 bg-cream-light p-5"
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
              Recent Activity
            </p>
            <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
              /002
            </span>
          </div>
          <div className="space-y-0">
            {ACTIVITY.map((item, i) => (
              <div
                key={i}
                className={`flex items-start justify-between py-3 ${
                  i < ACTIVITY.length - 1 ? "border-b border-blue-primary/8" : ""
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                      i === 0 ? "bg-blue-primary" : "bg-blue-primary/25"
                    }`}
                  />
                  <span className="font-mono text-[10px] tracking-[0.05em] uppercase text-blue-primary/70 leading-relaxed">
                    {item.action}
                  </span>
                </div>
                <span className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/25 shrink-0 ml-3">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── QUICK ACTIONS ────────────────────────── */}
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/30 mb-3">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "New Sale", href: "/sales/pos" },
            { label: "Add Product", href: "/products" },
            { label: "Stock In", href: "/purchases" },
            { label: "View Reports", href: "/reports" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="font-mono text-[11px] tracking-[0.12em] uppercase h-10 flex items-center justify-center bg-blue-primary text-cream-primary hover:bg-blue-dark transition-colors duration-200"
            >
              [ {action.label} → ]
            </a>
          ))}
        </div>
      </motion.div>

      {/* Bottom marker */}
      <div className="flex items-center justify-between pt-4">
        <div className="h-px flex-1 bg-blue-primary/8" />
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">
          [INV.DASH.END]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  );
}
