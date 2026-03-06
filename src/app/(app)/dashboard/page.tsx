"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { KpiCard } from "@/components/app/dashboard/kpi-card";
import { PeriodSelector } from "@/components/app/dashboard/period-selector";
import { SalesTrendChart } from "@/components/app/dashboard/sales-trend-chart";
import { RevenueCategoryChart } from "@/components/app/dashboard/revenue-category-chart";
import { PaymentMethodChart } from "@/components/app/dashboard/payment-method-chart";
import { TopCustomers } from "@/components/app/dashboard/top-customers";
import { TopProductsChart } from "@/components/app/dashboard/top-products-chart";
import { StockLevelsChart } from "@/components/app/dashboard/stock-levels-chart";
import { LowStockAlerts } from "@/components/app/dashboard/low-stock-alerts";
import { WarrantyAlerts } from "@/components/app/dashboard/warranty-alerts";
import {
  DashboardPeriod,
  getKpiStats,
  RECENT_ACTIVITY,
} from "@/lib/demo-data";

export default function DashboardPage() {
  const [period, setPeriod] = useState<DashboardPeriod>("30d");
  const kpiStats = getKpiStats(period);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
            transition={{
              duration: 0.5,
              delay: 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            Overview of your business performance
          </motion.p>
        </div>
        <div className="flex items-center gap-4">
          <PeriodSelector value={period} onChange={setPeriod} />
          <motion.span
            className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20 hidden sm:block"
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            [INV.DASH]
          </motion.span>
        </div>
      </div>

      <div className="h-px bg-blue-primary/10" />

      <div
        key={period}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {kpiStats.map((stat, i) => (
          <KpiCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            prefix={stat.prefix}
            suffix={stat.suffix}
            format={stat.format}
            change={stat.change}
            positive={stat.positive}
            index={i}
          />
        ))}
      </div>

      <SalesTrendChart period={period} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RevenueCategoryChart period={period} />
        <PaymentMethodChart period={period} />
        <TopCustomers period={period} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopProductsChart period={period} />
        <StockLevelsChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <LowStockAlerts />
        <WarrantyAlerts />

        <motion.div
          className="border border-blue-primary/10 bg-cream-light p-5 flex flex-col"
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.65,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="flex items-center justify-between mb-4 shrink-0">
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
              Recent Activity
            </p>
            <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
              /008
            </span>
          </div>
          <div className="divide-y divide-blue-primary/6 border-b border-blue-primary/6">
            {RECENT_ACTIVITY.map((item, i) => (
              <div
                key={i}
                className="flex items-start justify-between py-2.5"
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="mt-1.5 w-1.5 h-1.5 shrink-0 bg-blue-primary" />
                  <span className="font-mono text-[10px] tracking-[0.05em] uppercase text-blue-primary/70 leading-relaxed truncate">
                    {item.action}
                  </span>
                </div>
                <span className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/25 shrink-0 ml-3">
                  {item.time}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-3 shrink-0">
            <Link
              href="/sales"
              className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40 hover:text-blue-primary transition-colors duration-200"
            >
              [ View All Activity → ]
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
            <Link
              key={action.label}
              href={action.href}
              className="font-mono text-[11px] tracking-[0.12em] uppercase h-10 flex items-center justify-center bg-blue-primary text-cream-primary hover:bg-blue-dark transition-colors duration-200"
            >
              [ {action.label} → ]
            </Link>
          ))}
        </div>
      </motion.div>

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
