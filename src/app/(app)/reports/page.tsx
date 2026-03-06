"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { formatCurrency, formatCompact, formatNumber } from "@/lib/utils/format";
import { Download, FileText, Calendar } from "lucide-react";
import * as XLSX from "xlsx";

type Period = "7D" | "30D" | "90D" | "YTD" | "CUSTOM";

const TREND_7D = [
  { label: "Mon", revenue: 1180, cogs: 708  },
  { label: "Tue", revenue: 1340, cogs: 804  },
  { label: "Wed", revenue: 980,  cogs: 588  },
  { label: "Thu", revenue: 1520, cogs: 912  },
  { label: "Fri", revenue: 1890, cogs: 1134 },
  { label: "Sat", revenue: 820,  cogs: 492  },
  { label: "Sun", revenue: 690,  cogs: 414  },
];

const TREND_30D = [
  { label: "03",  revenue: 680,  cogs: 408  },
  { label: "04",  revenue: 720,  cogs: 432  },
  { label: "05",  revenue: 590,  cogs: 354  },
  { label: "06",  revenue: 810,  cogs: 486  },
  { label: "07",  revenue: 740,  cogs: 444  },
  { label: "08",  revenue: 420,  cogs: 252  },
  { label: "09",  revenue: 380,  cogs: 228  },
  { label: "10",  revenue: 890,  cogs: 534  },
  { label: "11",  revenue: 950,  cogs: 570  },
  { label: "12",  revenue: 870,  cogs: 522  },
  { label: "13",  revenue: 1020, cogs: 612  },
  { label: "14",  revenue: 980,  cogs: 588  },
  { label: "15",  revenue: 510,  cogs: 306  },
  { label: "16",  revenue: 460,  cogs: 276  },
  { label: "17",  revenue: 1100, cogs: 660  },
  { label: "18",  revenue: 1050, cogs: 630  },
  { label: "19",  revenue: 970,  cogs: 582  },
  { label: "20",  revenue: 1150, cogs: 690  },
  { label: "21",  revenue: 1080, cogs: 648  },
  { label: "22",  revenue: 620,  cogs: 372  },
  { label: "23",  revenue: 550,  cogs: 330  },
  { label: "24",  revenue: 1200, cogs: 720  },
  { label: "25",  revenue: 1280, cogs: 768  },
  { label: "26",  revenue: 1150, cogs: 690  },
  { label: "27",  revenue: 1320, cogs: 792  },
  { label: "28",  revenue: 1250, cogs: 750  },
  { label: "29",  revenue: 680,  cogs: 408  },
  { label: "30",  revenue: 610,  cogs: 366  },
  { label: "31",  revenue: 1380, cogs: 828  },
];

const TREND_90D = [
  { label: "Wk 1",  revenue: 7200,  cogs: 4320 },
  { label: "Wk 2",  revenue: 8100,  cogs: 4860 },
  { label: "Wk 3",  revenue: 6800,  cogs: 4080 },
  { label: "Wk 4",  revenue: 9200,  cogs: 5520 },
  { label: "Wk 5",  revenue: 7600,  cogs: 4560 },
  { label: "Wk 6",  revenue: 8400,  cogs: 5040 },
  { label: "Wk 7",  revenue: 9100,  cogs: 5460 },
  { label: "Wk 8",  revenue: 7300,  cogs: 4380 },
  { label: "Wk 9",  revenue: 8700,  cogs: 5220 },
  { label: "Wk 10", revenue: 9500,  cogs: 5700 },
  { label: "Wk 11", revenue: 8200,  cogs: 4920 },
  { label: "Wk 12", revenue: 9800,  cogs: 5880 },
  { label: "Wk 13", revenue: 7640,  cogs: 4584 },
];

const TREND_YTD = [
  { label: "Jan", revenue: 19400, cogs: 11640 },
  { label: "Feb", revenue: 21800, cogs: 13080 },
  { label: "Mar", revenue: 24600, cogs: 14760 },
  { label: "Apr", revenue: 22100, cogs: 13260 },
  { label: "May", revenue: 25800, cogs: 15480 },
  { label: "Jun", revenue: 23400, cogs: 14040 },
  { label: "Jul", revenue: 27200, cogs: 16320 },
  { label: "Aug", revenue: 26100, cogs: 15660 },
  { label: "Sep", revenue: 24800, cogs: 14880 },
  { label: "Oct", revenue: 28600, cogs: 17160 },
  { label: "Nov", revenue: 31200, cogs: 18720 },
  { label: "Dec", revenue: 12340, cogs: 7404  },
];

const TREND_MAP: Record<Period, typeof TREND_7D> = {
  "7D": TREND_7D, "30D": TREND_30D,
  "90D": TREND_90D, "YTD": TREND_YTD, "CUSTOM": TREND_30D,
};

interface PeriodKPI {
  revenue: number; transactions: number; units: number; aov: number;
  change: string; positive: boolean;
  cogs: number; grossProfit: number; grossMargin: number;
  opex: number; netProfit: number; netMargin: number;
}

const PERIOD_DATA: Record<Period, PeriodKPI> = {
  "7D":     { revenue: 8420,   transactions: 312,   units: 521,   aov: 27.0, change: "+5.2%",  positive: true, cogs: 5052,   grossProfit: 3368,  grossMargin: 40, opex: 1517,  netProfit: 1851,  netMargin: 22.0 },
  "30D":    { revenue: 34280,  transactions: 1247,  units: 2089,  aov: 27.5, change: "+12.4%", positive: true, cogs: 20568,  grossProfit: 13712, grossMargin: 40, opex: 6500,  netProfit: 7212,  netMargin: 21.0 },
  "90D":    { revenue: 98540,  transactions: 3621,  units: 6104,  aov: 27.2, change: "+8.7%",  positive: true, cogs: 59124,  grossProfit: 39416, grossMargin: 40, opex: 19500, netProfit: 19916, netMargin: 20.2 },
  "YTD":    { revenue: 287340, transactions: 10842, units: 18291, aov: 26.5, change: "+18.3%", positive: true, cogs: 172404, grossProfit: 114936, grossMargin: 40, opex: 78000, netProfit: 36936, netMargin: 12.9 },
  "CUSTOM": { revenue: 34280,  transactions: 1247,  units: 2089,  aov: 27.5, change: "+12.4%", positive: true, cogs: 20568,  grossProfit: 13712, grossMargin: 40, opex: 6500,  netProfit: 7212,  netMargin: 21.0 },
};

const TOP_PRODUCTS = [
  { rank: "01", name: "iPhone 15 Pro 256GB",    sku: "IP15P-256-BK", units: 142, revenue: 199540, margin: 18 },
  { rank: "02", name: "Galaxy S24 Ultra 512GB",  sku: "GS24U-512-GR", units: 98,  revenue: 136220, margin: 22 },
  { rank: "03", name: "MacBook Air M3 256GB",    sku: "MBA-M3-256",   units: 67,  revenue: 133330, margin: 15 },
  { rank: "04", name: "AirPods Pro 2",            sku: "APP2-WHT",    units: 213, revenue: 53463,  margin: 35 },
  { rank: "05", name: "iPad Air 5 64GB",          sku: "IPA5-64-BL",  units: 88,  revenue: 52712,  margin: 28 },
];

const STOCK_CATEGORIES = [
  { name: "Smartphones", total: 312, inStock: 280, low: 24, out: 8 },
  { name: "Laptops",     total: 156, inStock: 140, low: 12, out: 4 },
  { name: "Accessories", total: 489, inStock: 460, low: 20, out: 9 },
  { name: "Tablets",     total: 98,  inStock: 88,  low: 8,  out: 2 },
  { name: "Wearables",   total: 134, inStock: 120, low: 11, out: 3 },
];

const LOW_STOCK_ITEMS = [
  { name: "iPhone 15 Pro 256GB Black", sku: "IP15P-256-BK", stock: 3, min: 10, category: "Smartphones" },
  { name: "Galaxy S24 Ultra 512GB",    sku: "GS24U-512-GR", stock: 2, min: 8,  category: "Smartphones" },
  { name: "MacBook Air M3 256GB",      sku: "MBA-M3-256",   stock: 4, min: 10, category: "Laptops"     },
  { name: "AirPods Pro 2 USB-C",       sku: "APP2-USBC",    stock: 1, min: 15, category: "Accessories" },
  { name: "iPad Air 5 64GB Blue",      sku: "IPA5-64-BL",   stock: 2, min: 8,  category: "Tablets"     },
  { name: "Apple Watch Ultra 2 49mm",  sku: "AWU2-49MM",    stock: 3, min: 6,  category: "Wearables"   },
];

const EXPENSE_BREAKDOWN = [
  { category: "Payroll",                  amount: 52000 },
  { category: "Software & Subscriptions", amount: 22584 },
  { category: "Marketing",                amount: 10560 },
  { category: "Rent & Utilities",         amount: 11160 },
  { category: "Equipment & Maintenance",  amount: 11940 },
  { category: "Insurance",                amount: 7560  },
];

const MONTHLY_NET = [
  { label: "Jan", net: 2420 }, { label: "Feb", net: 3100 },
  { label: "Mar", net: 3840 }, { label: "Apr", net: 2980 },
  { label: "May", net: 4120 }, { label: "Jun", net: 3340 },
  { label: "Jul", net: 4880 }, { label: "Aug", net: 4420 },
  { label: "Sep", net: 3620 }, { label: "Oct", net: 4970 },
  { label: "Nov", net: 5840 }, { label: "Dec", net: 1406 },
];

const ease = [0.16, 1, 0.3, 1] as const;
const PERIODS: Period[] = ["7D", "30D", "90D", "YTD", "CUSTOM"];

function exportXLSX(period: Period) {
  const d   = PERIOD_DATA[period];
  const wb  = XLSX.utils.book_new();

  // Sheet 1 — Revenue
  const revenueRows = [
    ["Inventra — Revenue Report", `Period: ${period}`],
    [],
    ["Metric", "Value"],
    ["Total Revenue",    d.revenue],
    ["Transactions",     d.transactions],
    ["Units Sold",       d.units],
    ["Avg Order Value",  d.aov],
    [],
    ["Top Products", "", "", "", ""],
    ["Rank", "Product", "SKU", "Units Sold", "Revenue ($)", "Margin (%)"],
    ...TOP_PRODUCTS.map((p) => [p.rank, p.name, p.sku, p.units, p.revenue, p.margin]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(revenueRows), "Revenue");

  // Sheet 2 — Inventory
  const inventoryRows = [
    ["Inventra — Inventory Report"],
    [],
    ["Category", "Total Units", "In Stock", "Low Stock", "Out of Stock"],
    ...STOCK_CATEGORIES.map((c) => [c.name, c.total, c.inStock, c.low, c.out]),
    [],
    ["Low Stock Alerts", "", "", "", ""],
    ["Product", "SKU", "Category", "Current Stock", "Min Required"],
    ...LOW_STOCK_ITEMS.map((i) => [i.name, i.sku, i.category, i.stock, i.min]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(inventoryRows), "Inventory");

  // Sheet 3 — P&L
  const totalExp = EXPENSE_BREAKDOWN.reduce((a, c) => a + c.amount, 0);
  const plRows = [
    ["Inventra — Profit & Loss Statement", `Period: ${period}`],
    [],
    ["Line Item",            "Amount ($)",   "% of Revenue"],
    ["Revenue",              d.revenue,      "100%"],
    ["Cost of Goods Sold",   -d.cogs,        `${Math.round(d.cogs / d.revenue * 100)}%`],
    ["Gross Profit",         d.grossProfit,  `${d.grossMargin}%`],
    ["Operating Expenses",   -d.opex,        `${Math.round(d.opex / d.revenue * 100)}%`],
    ["Net Profit",           d.netProfit,    `${d.netMargin}%`],
    [],
    ["Expense Breakdown",    "",             ""],
    ["Category",             "Amount ($)",   "% of Total Expenses"],
    ...EXPENSE_BREAKDOWN.map((e) => [e.category, e.amount, `${Math.round(e.amount / totalExp * 100)}%`]),
    ["Total Expenses",       totalExp,       "100%"],
    [],
    ["Monthly Net Profit (YTD)", ""],
    ["Month", "Net Profit ($)"],
    ...MONTHLY_NET.map((m) => [m.label, m.net]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(plRows), "Profit & Loss");

  XLSX.writeFile(wb, `Inventra_Report_${period}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

// ──────────────────────────────────────────────────────────────────────────────
// CUSTOM TOOLTIPS
// ──────────────────────────────────────────────────────────────────────────────

function RevenueTooltip({ active, payload, label }: {
  active?: boolean; payload?: Array<{ value: number }>; label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-blue-primary px-3 py-2">
      <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-cream-primary/40 mb-1">{label}</p>
      <p className="font-mono text-[13px] font-bold text-cream-primary leading-none">
        {formatCurrency(payload[0]?.value ?? 0)}
      </p>
    </div>
  );
}

function NetTooltip({ active, payload, label }: {
  active?: boolean; payload?: Array<{ value: number }>; label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-blue-primary px-3 py-2">
      <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-cream-primary/40 mb-1">{label}</p>
      <p className="font-mono text-[13px] font-bold text-cream-primary leading-none">
        {formatCurrency(payload[0]?.value ?? 0)}
      </p>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ──────────────────────────────────────────────────────────────────────────────

function SectionHeader({ num, label, marker }: { num: string; label: string; marker: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-blue-primary/20">{num}</span>
        <div className="w-px h-3 bg-blue-primary/15" />
        <h2 className="font-mono text-[11px] tracking-[0.2em] uppercase text-blue-primary/55 font-medium">{label}</h2>
      </div>
      <span className="font-mono text-[9px] tracking-[0.15em] text-blue-primary/15">{marker}</span>
    </div>
  );
}

interface KpiItem { label: string; value: string; sub: string; invert?: boolean; }

function KpiStrip({ items, delay }: { items: KpiItem[]; delay: number }) {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-blue-primary/10 border border-blue-primary/10"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay, ease }}
    >
      {items.map((kpi) => (
        <div key={kpi.label} className={`px-4 py-5 ${kpi.invert ? "bg-blue-primary" : "bg-cream-light"}`}>
          <span className={`font-mono text-[9px] tracking-[0.15em] uppercase block mb-2 ${kpi.invert ? "text-cream-primary/40" : "text-blue-primary/30"}`}>
            {kpi.label}
          </span>
          <span className={`font-sans text-2xl font-bold leading-none block truncate ${kpi.invert ? "text-cream-primary" : "text-blue-primary"}`}>
            {kpi.value}
          </span>
          <span className={`font-mono text-[8px] tracking-[0.1em] uppercase mt-1.5 block ${kpi.invert ? "text-cream-primary/30" : "text-blue-primary/25"}`}>
            {kpi.sub}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

function Panel({ title, marker, delay, children }: {
  title: string; marker: string; delay: number; children: React.ReactNode;
}) {
  return (
    <motion.div
      className="border border-blue-primary/10 bg-cream-light overflow-hidden"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay, ease }}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">{title}</p>
        <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">{marker}</span>
      </div>
      {children}
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// PAGE
// ──────────────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [period, setPeriod]             = useState<Period>("30D");
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateFrom, setDateFrom]         = useState("");
  const [dateTo, setDateTo]             = useState("");
  const [isLoading, setIsLoading]       = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const d          = PERIOD_DATA[period];
  const trend      = TREND_MAP[period];
  const totalExp   = EXPENSE_BREAKDOWN.reduce((a, c) => a + c.amount, 0);
  const totalStock   = STOCK_CATEGORIES.reduce((a, c) => a + c.total,   0);
  const totalInStock = STOCK_CATEGORIES.reduce((a, c) => a + c.inStock, 0);
  const totalLow     = STOCK_CATEGORIES.reduce((a, c) => a + c.low,     0);
  const totalOut     = STOCK_CATEGORIES.reduce((a, c) => a + c.out,     0);

  function handlePDF() {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Inventra Report — ${period}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=JetBrains+Mono:wght@400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #E8E4DD; color: #1925AA; font-family: 'JetBrains Mono', monospace; padding: 32px; }
    h1 { font-family: 'Space Grotesk', sans-serif; font-size: 48px; font-weight: 700; color: #1925AA; }
    .sub { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(25,37,170,0.4); margin-top: 6px; }
    .divider { height: 1px; background: rgba(25,37,170,0.1); margin: 24px 0; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .section-label { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(25,37,170,0.55); }
    .section-marker { font-size: 9px; letter-spacing: 0.15em; color: rgba(25,37,170,0.15); }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid rgba(25,37,170,0.1); margin-bottom: 16px; }
    .kpi-cell { padding: 16px 14px; background: #F0EDE7; border-right: 1px solid rgba(25,37,170,0.1); }
    .kpi-cell:last-child { border-right: none; }
    .kpi-cell.invert { background: #1925AA; }
    .kpi-label { font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(25,37,170,0.3); display: block; margin-bottom: 6px; }
    .kpi-cell.invert .kpi-label { color: rgba(232,228,221,0.4); }
    .kpi-value { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; color: #1925AA; display: block; }
    .kpi-cell.invert .kpi-value { color: #E8E4DD; }
    .kpi-sub { font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(25,37,170,0.25); display: block; margin-top: 4px; }
    .kpi-cell.invert .kpi-sub { color: rgba(232,228,221,0.3); }
    .panel { border: 1px solid rgba(25,37,170,0.1); background: #F0EDE7; margin-bottom: 16px; }
    .panel-header { display: flex; justify-content: space-between; padding: 10px 16px; border-bottom: 1px solid rgba(25,37,170,0.08); }
    .panel-title { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(25,37,170,0.4); }
    .panel-marker { font-size: 9px; letter-spacing: 0.1em; color: rgba(25,37,170,0.2); }
    .panel-body { padding: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th { font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(25,37,170,0.25); font-weight: 400; padding: 8px 16px; border-bottom: 1px solid rgba(25,37,170,0.08); }
    td { font-size: 10px; padding: 12px 16px; border-bottom: 1px solid rgba(25,37,170,0.05); color: rgba(25,37,170,0.6); }
    td.primary { color: #1925AA; font-weight: 500; }
    td.bold { font-weight: 600; color: #1925AA; }
    td.dim { color: rgba(25,37,170,0.3); }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid rgba(25,37,170,0.1); margin-bottom: 16px; }
    .col { background: #F0EDE7; }
    .col:first-child { border-right: 1px solid rgba(25,37,170,0.1); }
    .bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
    .bar-label { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(25,37,170,0.5); width: 90px; flex-shrink: 0; }
    .bar-track { flex: 1; height: 6px; background: rgba(25,37,170,0.06); }
    .bar-fill { height: 100%; background: #1925AA; }
    .bar-fill.low { background: rgba(25,37,170,0.35); }
    .bar-fill.out { background: rgba(25,37,170,0.12); }
    .bar-amount { font-size: 10px; color: rgba(25,37,170,0.55); width: 72px; text-align: right; flex-shrink: 0; }
    .bar-pct { font-size: 9px; color: rgba(25,37,170,0.2); width: 28px; text-align: right; flex-shrink: 0; }
    .stock-seg { display: flex; height: 6px; overflow: hidden; margin: 6px 0; }
    .low-stock-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid rgba(25,37,170,0.05); }
    .ls-name { font-size: 10px; color: #1925AA; font-weight: 500; }
    .ls-meta { font-size: 8px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(25,37,170,0.25); margin-top: 2px; }
    .ls-num { font-size: 14px; font-weight: 700; }
    .ls-min { font-size: 8px; color: rgba(25,37,170,0.2); }
    .red { color: #ef4444; }
    .pl-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; }
    .pl-row.indented { padding-left: 16px; }
    .pl-row.divider-row { border-top: 1px solid rgba(25,37,170,0.1); margin-top: 8px; padding-top: 8px; }
    .pl-label { font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(25,37,170,0.45); }
    .pl-label.bold { color: #1925AA; font-weight: 600; }
    .pl-right { display: flex; align-items: center; gap: 24px; }
    .pl-mini-bar { width: 64px; height: 4px; background: rgba(25,37,170,0.06); }
    .pl-mini-fill { height: 100%; background: #1925AA; }
    .pl-mini-fill.neg { background: rgba(25,37,170,0.2); }
    .pl-value { font-size: 11px; width: 90px; text-align: right; color: rgba(25,37,170,0.65); }
    .pl-value.bold { color: #1925AA; font-weight: 600; }
    .pl-value.neg { color: rgba(25,37,170,0.35); }
    .pl-pct { font-size: 9px; color: rgba(25,37,170,0.15); width: 32px; text-align: right; }
    .section { margin-bottom: 8px; }
    @page { size: A4; margin: 12mm; }
  </style>
</head>
<body>

  <!-- HEADER -->
  <h1>Reports</h1>
  <p class="sub">Business performance overview &nbsp;·&nbsp; Period: ${period}</p>
  <div class="divider"></div>

  <!-- SECTION 01 — REVENUE -->
  <div class="section">
    <div class="section-header">
      <span class="section-label">/01 &nbsp; Revenue</span>
      <span class="section-marker">[INV.REP.01]</span>
    </div>

    <div class="kpi-grid">
      <div class="kpi-cell">
        <span class="kpi-label">Total Revenue</span>
        <span class="kpi-value">${formatCurrency(d.revenue)}</span>
        <span class="kpi-sub">${d.change} vs prev period</span>
      </div>
      <div class="kpi-cell">
        <span class="kpi-label">Transactions</span>
        <span class="kpi-value">${formatNumber(d.transactions)}</span>
        <span class="kpi-sub">completed orders</span>
      </div>
      <div class="kpi-cell">
        <span class="kpi-label">Units Sold</span>
        <span class="kpi-value">${formatNumber(d.units)}</span>
        <span class="kpi-sub">items dispatched</span>
      </div>
      <div class="kpi-cell">
        <span class="kpi-label">Avg Order Value</span>
        <span class="kpi-value">${formatCurrency(d.aov)}</span>
        <span class="kpi-sub">per transaction</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Revenue Trend — ${period}</span>
        <span class="panel-marker">/001</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="text-align:left">Period</th>
            <th style="text-align:right">Revenue</th>
            <th style="text-align:right">COGS</th>
            <th style="text-align:right">Gross Profit</th>
          </tr>
        </thead>
        <tbody>
          ${TREND_MAP[period].map(row => `
          <tr>
            <td class="primary">${row.label}</td>
            <td style="text-align:right" class="bold">${formatCurrency(row.revenue)}</td>
            <td style="text-align:right" class="dim">(${formatCurrency(row.cogs)})</td>
            <td style="text-align:right">${formatCurrency(row.revenue - row.cogs)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>

    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Top Products by Revenue</span>
        <span class="panel-marker">/002</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="text-align:right">#</th>
            <th style="text-align:left">Product</th>
            <th style="text-align:left">SKU</th>
            <th style="text-align:right">Units</th>
            <th style="text-align:right">Revenue</th>
            <th style="text-align:right">Margin</th>
          </tr>
        </thead>
        <tbody>
          ${TOP_PRODUCTS.map(p => `
          <tr>
            <td style="text-align:right" class="dim">${p.rank}</td>
            <td class="primary">${p.name}</td>
            <td class="dim" style="font-size:9px;letter-spacing:0.08em">${p.sku}</td>
            <td style="text-align:right">${formatNumber(p.units)}</td>
            <td style="text-align:right" class="bold">${formatCurrency(p.revenue)}</td>
            <td style="text-align:right">${p.margin}%</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
  </div>

  <div class="divider"></div>

  <!-- SECTION 02 — INVENTORY -->
  <div class="section">
    <div class="section-header">
      <span class="section-label">/02 &nbsp; Inventory</span>
      <span class="section-marker">[INV.REP.02]</span>
    </div>

    <div class="kpi-grid">
      <div class="kpi-cell">
        <span class="kpi-label">Total SKUs</span>
        <span class="kpi-value">${formatNumber(totalStock)}</span>
        <span class="kpi-sub">across all categories</span>
      </div>
      <div class="kpi-cell">
        <span class="kpi-label">In Stock</span>
        <span class="kpi-value">${formatNumber(totalInStock)}</span>
        <span class="kpi-sub">${Math.round(totalInStock / totalStock * 100)}% available</span>
      </div>
      <div class="kpi-cell">
        <span class="kpi-label">Low Stock</span>
        <span class="kpi-value">${formatNumber(totalLow)}</span>
        <span class="kpi-sub">below minimum threshold</span>
      </div>
      <div class="kpi-cell">
        <span class="kpi-label">Out of Stock</span>
        <span class="kpi-value">${formatNumber(totalOut)}</span>
        <span class="kpi-sub">require immediate reorder</span>
      </div>
    </div>

    <div class="two-col">
      <div class="col">
        <div class="panel-header">
          <span class="panel-title">Stock by Category</span>
          <span class="panel-marker">/003</span>
        </div>
        <div class="panel-body">
          ${STOCK_CATEGORIES.map(cat => {
            const inPct  = Math.round(cat.inStock / cat.total * 100);
            const lowPct = Math.round(cat.low / cat.total * 100);
            const outPct = Math.round(cat.out / cat.total * 100);
            return `
          <div style="margin-bottom:18px">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(25,37,170,0.5)">${cat.name}</span>
              <span style="font-size:9px;color:rgba(25,37,170,0.25)">${cat.total} units</span>
            </div>
            <div class="stock-seg">
              <div style="width:${inPct}%;height:100%;background:#1925AA"></div>
              <div style="width:${lowPct}%;height:100%;background:rgba(25,37,170,0.35)"></div>
              <div style="width:${outPct}%;height:100%;background:rgba(25,37,170,0.12)"></div>
            </div>
            <div style="display:flex;gap:16px;margin-top:4px">
              <span style="font-size:8px;text-transform:uppercase;color:rgba(25,37,170,0.4)">${cat.inStock} in stock</span>
              <span style="font-size:8px;text-transform:uppercase;color:rgba(25,37,170,0.25)">${cat.low} low</span>
              <span style="font-size:8px;text-transform:uppercase;color:rgba(25,37,170,0.15)">${cat.out} out</span>
            </div>
          </div>`;
          }).join("")}
        </div>
      </div>
      <div class="col">
        <div class="panel-header">
          <span class="panel-title">Low Stock Alerts</span>
          <span class="panel-marker">/004</span>
        </div>
        ${LOW_STOCK_ITEMS.map(item => `
        <div class="low-stock-row">
          <div>
            <div class="ls-name">${item.name}</div>
            <div class="ls-meta">${item.sku} · ${item.category}</div>
          </div>
          <div style="text-align:right">
            <div class="ls-num ${item.stock <= 2 ? "red" : ""}">${item.stock}</div>
            <div class="ls-min">/ ${item.min} min</div>
          </div>
        </div>`).join("")}
      </div>
    </div>
  </div>

  <div class="divider"></div>

  <!-- SECTION 03 — PROFIT & LOSS -->
  <div class="section">
    <div class="section-header">
      <span class="section-label">/03 &nbsp; Profit & Loss</span>
      <span class="section-marker">[INV.REP.03]</span>
    </div>

    <div class="kpi-grid">
      <div class="kpi-cell">
        <span class="kpi-label">Gross Revenue</span>
        <span class="kpi-value">${formatCurrency(d.revenue)}</span>
        <span class="kpi-sub">before deductions</span>
      </div>
      <div class="kpi-cell">
        <span class="kpi-label">Gross Profit</span>
        <span class="kpi-value">${formatCurrency(d.grossProfit)}</span>
        <span class="kpi-sub">${d.grossMargin}% margin</span>
      </div>
      <div class="kpi-cell">
        <span class="kpi-label">Operating Exp</span>
        <span class="kpi-value">${formatCurrency(d.opex)}</span>
        <span class="kpi-sub">payroll + overhead</span>
      </div>
      <div class="kpi-cell invert">
        <span class="kpi-label">Net Profit</span>
        <span class="kpi-value">${formatCurrency(d.netProfit)}</span>
        <span class="kpi-sub">${d.netMargin}% net margin</span>
      </div>
    </div>

    <div class="two-col">
      <div class="col">
        <div class="panel-header">
          <span class="panel-title">Income Statement</span>
          <span class="panel-marker">/005</span>
        </div>
        <div class="panel-body">
          ${[
            { label: "Revenue",            value: d.revenue,     display: formatCurrency(d.revenue),           pct: 100,                                  indent: false, bold: false, divider: false },
            { label: "Cost of Goods Sold", value: -d.cogs,       display: `(${formatCurrency(d.cogs)})`,       pct: Math.round(d.cogs / d.revenue * 100), indent: true,  bold: false, divider: false },
            { label: "Gross Profit",       value: d.grossProfit, display: formatCurrency(d.grossProfit),       pct: d.grossMargin,                        indent: false, bold: true,  divider: true  },
            { label: "Operating Expenses", value: -d.opex,       display: `(${formatCurrency(d.opex)})`,       pct: Math.round(d.opex / d.revenue * 100), indent: true,  bold: false, divider: false },
            { label: "Net Profit",         value: d.netProfit,   display: formatCurrency(d.netProfit),         pct: d.netMargin,                          indent: false, bold: true,  divider: true  },
          ].map((row) => `
            ${row.divider ? '<div style="height:1px;background:rgba(25,37,170,0.1);margin:8px 0"></div>' : ""}
            <div class="pl-row ${row.indent ? "indented" : ""}">
              <span class="pl-label ${row.bold ? "bold" : ""}">${row.label}</span>
              <div class="pl-right">
                <div class="pl-mini-bar"><div class="pl-mini-fill ${row.value < 0 ? "neg" : ""}" style="width:${Math.min(100, Math.abs(row.pct))}%"></div></div>
                <span class="pl-value ${row.bold ? "bold" : ""} ${row.value < 0 ? "neg" : ""}">${row.display}</span>
                <span class="pl-pct">${row.pct}%</span>
              </div>
            </div>`).join("")}
        </div>
      </div>
      <div class="col">
        <div class="panel-header">
          <span class="panel-title">Expense Breakdown</span>
          <span class="panel-marker">/006</span>
        </div>
        <div class="panel-body">
          ${EXPENSE_BREAKDOWN.map((exp) => {
            const pct = Math.round(exp.amount / totalExp * 100);
            return `
          <div class="bar-row">
            <span class="bar-label">${exp.category}</span>
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
            <span class="bar-amount">${formatCurrency(exp.amount)}</span>
            <span class="bar-pct">${pct}%</span>
          </div>`;
          }).join("")}
          <div style="border-top:1px solid rgba(25,37,170,0.08);padding-top:10px;display:flex;justify-content:space-between;margin-top:8px">
            <span style="font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(25,37,170,0.3);font-weight:600">Total Expenses</span>
            <span style="font-size:11px;font-weight:600;color:#1925AA">${formatCurrency(totalExp)}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Monthly Net Profit — Year to Date</span>
        <span class="panel-marker">/007</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="text-align:left">Month</th>
            <th style="text-align:right">Net Profit</th>
            <th style="text-align:right">vs Average</th>
          </tr>
        </thead>
        <tbody>
          ${(() => {
            const avg = Math.round(MONTHLY_NET.reduce((a, m) => a + m.net, 0) / MONTHLY_NET.length);
            return MONTHLY_NET.map(m => {
              const diff = m.net - avg;
              const sign = diff >= 0 ? "+" : "";
              return `
          <tr>
            <td class="primary">${m.label}</td>
            <td style="text-align:right" class="bold">${formatCurrency(m.net)}</td>
            <td style="text-align:right" class="${diff >= 0 ? "" : "dim"}">${sign}${formatCurrency(diff)}</td>
          </tr>`;
            }).join("");
          })()}
        </tbody>
      </table>
    </div>
  </div>

  <div style="display:flex;align-items:center;gap:16px;margin-top:24px">
    <div style="flex:1;height:1px;background:rgba(25,37,170,0.08)"></div>
    <span style="font-size:8px;letter-spacing:0.2em;color:rgba(25,37,170,0.15)">[INV.REP.END]</span>
    <div style="flex:1;height:1px;background:rgba(25,37,170,0.08)"></div>
  </div>

</body>
</html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.onload = () => {
      win.print();
      win.close();
    };
  }

  // ── RENDER ────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-0">

        {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-6">
          <div>
            <motion.h1
              className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-blue-primary leading-none"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease }}
            >
              Reports
            </motion.h1>
            <motion.p
              className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.05, ease }}
            >
              Business performance overview
            </motion.p>
          </div>

          {/* Controls */}
          <motion.div
            className="no-print flex items-center gap-2 flex-wrap"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease }}
          >
            {/* Period pills */}
            <div className="flex items-center gap-px border border-blue-primary/10">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => { setPeriod(p); setShowCalendar(p === "CUSTOM"); }}
                  className={`font-mono text-[9px] tracking-[0.15em] uppercase px-3 h-8 transition-colors ${
                    period === p
                      ? "bg-blue-primary text-cream-primary"
                      : "text-blue-primary/40 hover:text-blue-primary hover:bg-blue-primary/5"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-blue-primary/10" />

            {/* XLSX export */}
            <button
              onClick={() => exportXLSX(period)}
              className="font-mono text-[9px] tracking-[0.12em] uppercase h-8 px-3 border border-blue-primary/10 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30 transition-colors flex items-center gap-1.5"
            >
              <Download size={10} strokeWidth={1.5} />
              XLSX
            </button>

            {/* PDF export */}
            <button
              onClick={handlePDF}
              className="font-mono text-[9px] tracking-[0.12em] uppercase h-8 px-3 border border-blue-primary/10 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30 transition-colors flex items-center gap-1.5"
            >
              <FileText size={10} strokeWidth={1.5} />
              PDF
            </button>

            <span className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20 hidden sm:block ml-1">
              [INV.REP]
            </span>
          </motion.div>
        </div>

        {/* Custom date range */}
        {showCalendar && (
          <motion.div
            className="no-print flex items-center gap-4 flex-wrap mb-4 px-4 py-3 border border-blue-primary/10 bg-cream-light"
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25, ease }}
          >
            <Calendar size={11} strokeWidth={1.5} className="text-blue-primary/30 shrink-0" />
            <div className="flex items-end gap-3 flex-wrap">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/25">From</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="font-mono text-[10px] tracking-[0.04em] text-blue-primary bg-transparent border border-blue-primary/15 px-2 h-7 focus:outline-none focus:border-blue-primary/40 transition-colors"
                />
              </div>
              <div className="w-3 h-px bg-blue-primary/15 mb-3.5" />
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/25">To</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="font-mono text-[10px] tracking-[0.04em] text-blue-primary bg-transparent border border-blue-primary/15 px-2 h-7 focus:outline-none focus:border-blue-primary/40 transition-colors"
                />
              </div>
              <button className="font-mono text-[9px] tracking-[0.12em] uppercase h-7 px-3 bg-blue-primary text-cream-primary hover:bg-blue-dark transition-colors mb-px">
                [ Apply ]
              </button>
            </div>
          </motion.div>
        )}

        {/* Blueprint divider */}
        <div className="h-px bg-blue-primary/10" />

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* SECTION 01 — REVENUE                                              */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="py-8 space-y-5">
          <SectionHeader num="/01" label="Revenue" marker="[INV.REP.01]" />

          <KpiStrip delay={0.08} items={[
            { label: "Total Revenue",   value: formatCurrency(d.revenue),    sub: `${d.change} vs prev period` },
            { label: "Transactions",    value: formatNumber(d.transactions), sub: "completed orders"           },
            { label: "Units Sold",      value: formatNumber(d.units),        sub: "items dispatched"           },
            { label: "Avg Order Value", value: formatCurrency(d.aov),        sub: "per transaction"            },
          ]} />

          {/* Revenue trend */}
          <Panel title="Revenue Trend" marker="/001" delay={0.12}>
            <div className="p-5" style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#1925AA" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#1925AA" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#1925AA" strokeOpacity={0.05} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false}
                    tick={{ fontFamily: "JetBrains Mono", fontSize: 9, fill: "#1925AA", opacity: 0.3 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis axisLine={false} tickLine={false}
                    tick={{ fontFamily: "JetBrains Mono", fontSize: 9, fill: "#1925AA", opacity: 0.3 }}
                    tickFormatter={(v) => `$${formatCompact(v)}`}
                    width={50}
                  />
                  <Tooltip content={<RevenueTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#1925AA" strokeWidth={1.5}
                    fill="url(#revGrad)" dot={false}
                    activeDot={{ r: 3, fill: "#1925AA", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          {/* Top products */}
          <Panel title="Top Products by Revenue" marker="/002" delay={0.16}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr className="border-b border-blue-primary/8 h-9">
                    {["#", "Product", "SKU", "Units", "Revenue", "Margin"].map((h, i) => (
                      <th key={h} className={`font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/25 font-normal px-5 align-middle ${i === 0 || i >= 3 ? "text-right" : "text-left"}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TOP_PRODUCTS.map((p) => (
                    <tr key={p.sku} className="border-b border-blue-primary/5 h-12 hover:bg-blue-primary/[0.02] transition-colors">
                      <td className="px-5 text-right align-middle">
                        <span className="font-mono text-[10px] tracking-[0.06em] text-blue-primary/20">{p.rank}</span>
                      </td>
                      <td className="px-5 align-middle">
                        <span className="font-mono text-[10px] tracking-[0.04em] text-blue-primary font-medium">{p.name}</span>
                      </td>
                      <td className="px-5 align-middle">
                        <span className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/30">{p.sku}</span>
                      </td>
                      <td className="px-5 text-right align-middle">
                        <span className="font-mono text-[11px] text-blue-primary/60">{formatNumber(p.units)}</span>
                      </td>
                      <td className="px-5 text-right align-middle">
                        <span className="font-mono text-[11px] font-semibold text-blue-primary">{formatCurrency(p.revenue)}</span>
                      </td>
                      <td className="px-5 text-right align-middle">
                        <span className="font-mono text-[10px] text-blue-primary/45">{p.margin}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </section>

        <div className="h-px bg-blue-primary/10" />

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* SECTION 02 — INVENTORY                                            */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="py-8 space-y-5">
          <SectionHeader num="/02" label="Inventory" marker="[INV.REP.02]" />

          <KpiStrip delay={0.2} items={[
            { label: "Total SKUs",   value: formatNumber(totalStock),    sub: "across all categories"                                    },
            { label: "In Stock",     value: formatNumber(totalInStock),  sub: `${Math.round(totalInStock / totalStock * 100)}% available` },
            { label: "Low Stock",    value: formatNumber(totalLow),      sub: "below minimum threshold"                                  },
            { label: "Out of Stock", value: formatNumber(totalOut),      sub: "require immediate reorder"                                },
          ]} />

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-blue-primary/10 border border-blue-primary/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.24, ease }}
          >
            {/* Stock by category */}
            <div className="bg-cream-light">
              <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">Stock by Category</p>
                <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/003</span>
              </div>
              <div className="px-5 py-4 space-y-5">
                {STOCK_CATEGORIES.map((cat, i) => {
                  const inPct  = (cat.inStock / cat.total) * 100;
                  const lowPct = (cat.low     / cat.total) * 100;
                  const outPct = (cat.out     / cat.total) * 100;
                  return (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/50">{cat.name}</span>
                        <span className="font-mono text-[9px] tracking-[0.06em] text-blue-primary/25">{cat.total} units</span>
                      </div>
                      <div className="h-2 bg-blue-primary/6 flex overflow-hidden">
                        <motion.div className="h-full bg-blue-primary"
                          style={{ width: `${inPct}%` }}
                          initial={{ width: 0 }} animate={{ width: `${inPct}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.04, ease }}
                        />
                        <motion.div className="h-full bg-blue-primary/35"
                          style={{ width: `${lowPct}%` }}
                          initial={{ width: 0 }} animate={{ width: `${lowPct}%` }}
                          transition={{ duration: 0.8, delay: 0.34 + i * 0.04, ease }}
                        />
                        <motion.div className="h-full bg-blue-primary/12"
                          style={{ width: `${outPct}%` }}
                          initial={{ width: 0 }} animate={{ width: `${outPct}%` }}
                          transition={{ duration: 0.8, delay: 0.38 + i * 0.04, ease }}
                        />
                      </div>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/40">{cat.inStock} in stock</span>
                        <span className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/25">{cat.low} low</span>
                        <span className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/15">{cat.out} out</span>
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center gap-5 pt-2 border-t border-blue-primary/6">
                  {[
                    { label: "In Stock", cls: "bg-blue-primary"    },
                    { label: "Low",      cls: "bg-blue-primary/35" },
                    { label: "Out",      cls: "bg-blue-primary/12" },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className={`w-3 h-1.5 ${l.cls}`} />
                      <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/25">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Low stock list */}
            <div className="bg-cream-light">
              <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">Low Stock Alerts</p>
                <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/004</span>
              </div>
              <div className="divide-y divide-blue-primary/5">
                {LOW_STOCK_ITEMS.map((item) => (
                  <div key={item.sku} className="px-5 py-3.5 flex items-center justify-between hover:bg-blue-primary/[0.02] transition-colors">
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[10px] tracking-[0.04em] text-blue-primary font-medium block truncate">{item.name}</span>
                      <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/25 mt-0.5 block">
                        {item.sku} · {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0 text-right">
                      <div>
                        <span className={`font-mono text-[14px] font-bold block leading-none ${item.stock <= 2 ? "text-red-500" : "text-blue-primary/50"}`}>
                          {item.stock}
                        </span>
                        <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/20 block mt-0.5">
                          / {item.min} min
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <div className="h-px bg-blue-primary/10" />

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* SECTION 03 — PROFIT & LOSS                                        */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="py-8 space-y-5">
          <SectionHeader num="/03" label="Profit & Loss" marker="[INV.REP.03]" />

          <KpiStrip delay={0.32} items={[
            { label: "Gross Revenue", value: formatCurrency(d.revenue),     sub: "before deductions"          },
            { label: "Gross Profit",  value: formatCurrency(d.grossProfit), sub: `${d.grossMargin}% margin`   },
            { label: "Operating Exp", value: formatCurrency(d.opex),        sub: "payroll + overhead"         },
            { label: "Net Profit",    value: formatCurrency(d.netProfit),   sub: `${d.netMargin}% net margin`, invert: true },
          ]} />

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-blue-primary/10 border border-blue-primary/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.36, ease }}
          >
            {/* Income statement */}
            <div className="bg-cream-light">
              <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">Income Statement</p>
                <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/005</span>
              </div>
              <div className="px-5 py-4 space-y-0.5">
                {[
                  { label: "Revenue",             value:  d.revenue,     display: formatCurrency(d.revenue),             pct: 100,                                       indent: false, bold: false, dividerBefore: false },
                  { label: "Cost of Goods Sold",  value: -d.cogs,        display: `(${formatCurrency(d.cogs)})`,         pct: Math.round(d.cogs / d.revenue * 100),      indent: true,  bold: false, dividerBefore: false },
                  { label: "Gross Profit",        value:  d.grossProfit, display: formatCurrency(d.grossProfit),         pct: d.grossMargin,                             indent: false, bold: true,  dividerBefore: true  },
                  { label: "Operating Expenses",  value: -d.opex,        display: `(${formatCurrency(d.opex)})`,         pct: Math.round(d.opex / d.revenue * 100),      indent: true,  bold: false, dividerBefore: false },
                  { label: "Net Profit",          value:  d.netProfit,   display: formatCurrency(d.netProfit),           pct: d.netMargin,                               indent: false, bold: true,  dividerBefore: true  },
                ].map((row, i) => (
                  <div key={row.label}>
                    {row.dividerBefore && <div className="h-px bg-blue-primary/10 my-2" />}
                    <div className={`flex items-center justify-between py-2 ${row.indent ? "pl-4" : ""}`}>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {row.indent && <div className="w-px h-3 bg-blue-primary/15 shrink-0" />}
                        <span className={`font-mono text-[10px] tracking-[0.06em] uppercase truncate ${row.bold ? "text-blue-primary font-semibold" : "text-blue-primary/45"}`}>
                          {row.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 ml-4">
                        <div className="w-16 h-1 bg-blue-primary/6 hidden sm:block overflow-hidden">
                          <motion.div
                            className={`h-full ${row.value >= 0 ? "bg-blue-primary" : "bg-blue-primary/20"}`}
                            style={{ width: `${Math.min(100, Math.abs(row.pct))}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, Math.abs(row.pct))}%` }}
                            transition={{ duration: 0.8, delay: 0.4 + i * 0.06, ease }}
                          />
                        </div>
                        <span className={`font-mono text-[11px] tracking-[0.02em] w-24 text-right ${row.bold ? "font-semibold text-blue-primary" : row.value < 0 ? "text-blue-primary/35" : "text-blue-primary/65"}`}>
                          {row.display}
                        </span>
                        <span className="font-mono text-[9px] tracking-[0.04em] text-blue-primary/15 w-8 text-right">
                          {row.pct}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense breakdown */}
            <div className="bg-cream-light">
              <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">Expense Breakdown</p>
                <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/006</span>
              </div>
              <div className="px-5 py-4 space-y-3">
                {EXPENSE_BREAKDOWN.map((exp, i) => {
                  const pct = (exp.amount / totalExp) * 100;
                  return (
                    <div key={exp.category} className="flex items-center gap-3">
                      <span className="font-mono text-[9px] tracking-[0.06em] uppercase text-blue-primary/45 w-40 shrink-0 truncate">
                        {exp.category}
                      </span>
                      <div className="flex-1 h-1.5 bg-blue-primary/6 overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-primary"
                          style={{ width: `${pct}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.45 + i * 0.05, ease }}
                        />
                      </div>
                      <span className="font-mono text-[10px] tracking-[0.03em] text-blue-primary/55 w-20 text-right shrink-0">
                        {formatCurrency(exp.amount)}
                      </span>
                      <span className="font-mono text-[9px] tracking-[0.04em] text-blue-primary/20 w-8 text-right shrink-0">
                        {Math.round(pct)}%
                      </span>
                    </div>
                  );
                })}
                <div className="pt-2 border-t border-blue-primary/8 flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/30 font-semibold">Total Expenses</span>
                  <span className="font-mono text-[11px] tracking-[0.03em] font-semibold text-blue-primary">{formatCurrency(totalExp)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Monthly net profit bar chart */}
          <Panel title="Monthly Net Profit — Year to Date" marker="/007" delay={0.44}>
            <div className="p-5" style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_NET} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barSize={16}>
                  <CartesianGrid vertical={false} stroke="#1925AA" strokeOpacity={0.05} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false}
                    tick={{ fontFamily: "JetBrains Mono", fontSize: 9, fill: "#1925AA", opacity: 0.3 }}
                  />
                  <YAxis axisLine={false} tickLine={false}
                    tick={{ fontFamily: "JetBrains Mono", fontSize: 9, fill: "#1925AA", opacity: 0.3 }}
                    tickFormatter={(v) => `$${formatCompact(v)}`}
                    width={50}
                  />
                  <Tooltip content={<NetTooltip />} />
                  <Bar dataKey="net" fill="#1925AA" fillOpacity={0.8} radius={0} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </section>

        {/* Bottom marker */}
        <div className="flex items-center justify-between pt-4">
          <div className="h-px flex-1 bg-blue-primary/8" />
          <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">
            [INV.REP.END]
          </span>
          <div className="h-px flex-1 bg-blue-primary/8" />
        </div>
      </div>
    </>
  );
}
