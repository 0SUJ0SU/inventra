// src/components/app/dashboard/stock-levels-chart.tsx
"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { STOCK_LEVELS } from "@/lib/demo-data";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-blue-primary px-3 py-2 border border-cream-primary/20">
      <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-cream-primary/60 mb-1">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="font-mono text-[9px] tracking-[0.05em] text-cream-primary/80">
            {entry.name}: {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({
  payload,
}: {
  payload?: Array<{ value: string; color: string }>;
}) {
  if (!payload) return null;
  return (
    <div className="flex items-center justify-center gap-5 mt-2">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 shrink-0 border border-blue-primary/10"
            style={{ backgroundColor: entry.color }}
          />
          <span className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/40">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function StockLevelsChart() {
  return (
    <motion.div
      className="border border-blue-primary/10 bg-cream-light p-5 flex flex-col h-[300px]"
      initial={{ y: 30 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
          Stock Levels by Category
        </p>
        <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
          /006
        </span>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={STOCK_LEVELS}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1925AA"
              strokeOpacity={0.06}
              vertical={false}
            />
            <XAxis
              dataKey="category"
              tick={{
                fontSize: 9,
                fontFamily: "var(--font-mono)",
                fill: "#1925AA",
                fillOpacity: 0.3,
              }}
              tickLine={false}
              axisLine={{ stroke: "#1925AA", strokeOpacity: 0.1 }}
              interval={0}
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
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1925AA", fillOpacity: 0.04 }} />
            <Legend content={<CustomLegend />} />
            <Bar
              dataKey="inStock"
              name="In Stock"
              fill="#22C55E"
              radius={[1, 1, 0, 0]}
              animationDuration={1000}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="lowStock"
              name="Low Stock"
              fill="#EAB308"
              radius={[1, 1, 0, 0]}
              animationDuration={1000}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="outOfStock"
              name="Out of Stock"
              fill="#EF4444"
              radius={[1, 1, 0, 0]}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
