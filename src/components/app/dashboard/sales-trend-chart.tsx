// src/components/app/dashboard/sales-trend-chart.tsx
"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DashboardPeriod,
  PERIOD_CONFIG,
  getSalesTrendData,
  getSalesTrendInterval,
} from "@/lib/demo-data";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-blue-primary px-3 py-2 border border-cream-primary/20">
      <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-cream-primary/60">
        {label}
      </p>
      <p className="font-mono text-[11px] tracking-[0.05em] text-cream-primary mt-0.5">
        ${new Intl.NumberFormat("en-US").format(payload[0].value)}
      </p>
    </div>
  );
}

interface SalesTrendChartProps {
  period: DashboardPeriod;
}

export function SalesTrendChart({ period }: SalesTrendChartProps) {
  const data = getSalesTrendData(period);
  const interval = getSalesTrendInterval(period);

  return (
    <motion.div
      className="border border-blue-primary/10 bg-cream-light p-5 flex flex-col h-[260px]"
      initial={{ y: 30 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
            Sales Trend
          </p>
          <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/20">
            {PERIOD_CONFIG[period].label}
          </span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
          /001
        </span>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={[...data]}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1925AA" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#1925AA" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1925AA"
              strokeOpacity={0.06}
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{
                fontSize: 9,
                fontFamily: "var(--font-mono)",
                fill: "#1925AA",
                fillOpacity: 0.25,
              }}
              tickLine={false}
              axisLine={{ stroke: "#1925AA", strokeOpacity: 0.1 }}
              interval={interval}
            />
            <YAxis
              tick={{
                fontSize: 9,
                fontFamily: "var(--font-mono)",
                fill: "#1925AA",
                fillOpacity: 0.25,
              }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#1925AA",
                strokeOpacity: 0.15,
                strokeDasharray: "3 3",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#1925AA"
              strokeWidth={1.5}
              fill="url(#areaGradient)"
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
