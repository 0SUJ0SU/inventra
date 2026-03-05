// src/app/(app)/expenses/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Receipt,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import { EMPLOYEES } from "@/app/(app)/employees/page";

// ——————————————————————————————————————————————————
// TYPES
// ——————————————————————————————————————————————————

type ExpenseFrequency = "monthly" | "annual" | "one_time";
type SortKey = "category" | "description" | "amount" | "frequency" | "date";
type SortDir = "asc" | "desc";

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number; // monthly equivalent
  frequency: ExpenseFrequency;
  date: string; // last updated / billed
}

// ——————————————————————————————————————————————————
// CONSTANTS
// ——————————————————————————————————————————————————

const PAGE_SIZES = [10, 20, 50] as const;
const ease = [0.16, 1, 0.3, 1] as const;

const FREQ_LABEL: Record<ExpenseFrequency, string> = {
  monthly:  "Monthly",
  annual:   "Annual",
  one_time: "One-time",
};

const OPERATING_EXPENSES: Expense[] = [
  // Rent & Utilities
  { id: "rent-main",      category: "Rent & Utilities",          description: "Main office lease — 2,400 sq ft",     amount: 8500,  frequency: "monthly",  date: "2025-03-01" },
  { id: "electric",       category: "Rent & Utilities",          description: "Electricity & HVAC",                  amount: 620,   frequency: "monthly",  date: "2025-03-01" },
  { id: "internet",       category: "Rent & Utilities",          description: "Fiber internet (2x lines)",            amount: 280,   frequency: "monthly",  date: "2025-03-01" },
  // Software & Subscriptions
  { id: "erp",            category: "Software & Subscriptions",  description: "ERP platform license",                amount: 1200,  frequency: "monthly",  date: "2025-02-15" },
  { id: "gsuite",         category: "Software & Subscriptions",  description: "Google Workspace (10 seats)",         amount: 180,   frequency: "monthly",  date: "2025-03-01" },
  { id: "slack",          category: "Software & Subscriptions",  description: "Slack Pro",                           amount: 87,    frequency: "monthly",  date: "2025-03-01" },
  { id: "figma",          category: "Software & Subscriptions",  description: "Figma Organization",                  amount: 75,    frequency: "monthly",  date: "2025-02-01" },
  { id: "aws",            category: "Software & Subscriptions",  description: "AWS infrastructure",                  amount: 340,   frequency: "monthly",  date: "2025-03-03" },
  // Marketing
  { id: "ads-google",     category: "Marketing",                 description: "Google Ads — search campaigns",       amount: 2400,  frequency: "monthly",  date: "2025-03-01" },
  { id: "ads-social",     category: "Marketing",                 description: "Meta / LinkedIn sponsored",           amount: 1100,  frequency: "monthly",  date: "2025-03-01" },
  { id: "seo",            category: "Marketing",                 description: "SEO retainer",                        amount: 800,   frequency: "monthly",  date: "2025-02-01" },
  // Equipment & Maintenance
  { id: "hardware",       category: "Equipment & Maintenance",   description: "Hardware refresh fund",               amount: 500,   frequency: "monthly",  date: "2025-01-15" },
  { id: "cleaning",       category: "Equipment & Maintenance",   description: "Office cleaning service",             amount: 350,   frequency: "monthly",  date: "2025-03-01" },
  { id: "printer",        category: "Equipment & Maintenance",   description: "Printer lease & consumables",         amount: 145,   frequency: "monthly",  date: "2025-02-20" },
  // Insurance
  { id: "biz-insurance",  category: "Insurance",                 description: "General business liability",          amount: 420,   frequency: "monthly",  date: "2025-01-01" },
  { id: "cyber-ins",      category: "Insurance",                 description: "Cyber / E&O insurance",               amount: 210,   frequency: "monthly",  date: "2025-01-01" },
];

// ——————————————————————————————————————————————————
// HELPERS
// ——————————————————————————————————————————————————

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ——————————————————————————————————————————————————
// SORT ICON
// ——————————————————————————————————————————————————

function SortIcon({
  col,
  sortKey,
  sortDir,
}: {
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
}) {
  if (sortKey !== col)
    return <ChevronsUpDown size={12} strokeWidth={1.5} className="text-blue-primary/20" />;
  return sortDir === "asc" ? (
    <ChevronUp size={12} strokeWidth={2} className="text-blue-primary" />
  ) : (
    <ChevronDown size={12} strokeWidth={2} className="text-blue-primary" />
  );
}

// ——————————————————————————————————————————————————
// PAGE
// ——————————————————————————————————————————————————

export default function ExpensesPage() {
  const [sortKey, setSortKey]   = useState<SortKey>("category");
  const [sortDir, setSortDir]   = useState<SortDir>("asc");
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // ——— Payroll derived from EMPLOYEES ———
  const monthlyPayroll = useMemo(() => {
    const annual = EMPLOYEES.filter((e) => e.status !== "inactive").reduce(
      (acc, e) => acc + e.salary,
      0
    );
    return annual / 12;
  }, []);

  // ——— Operating totals ———
  const monthlyOperating = useMemo(
    () => OPERATING_EXPENSES.reduce((acc, e) => acc + e.amount, 0),
    []
  );

  const totalMonthly = monthlyPayroll + monthlyOperating;

  // ——— Category breakdown ———
  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = { "Payroll": monthlyPayroll };
    for (const e of OPERATING_EXPENSES) {
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    }
    return Object.entries(map)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  }, [monthlyPayroll]);

  const largestCategory = categoryTotals[0];

  // ——— All rows (payroll as a single synthesised row + operating) ———
  const allRows: Expense[] = useMemo(() => [
    {
      id:          "payroll-total",
      category:    "Payroll",
      description: `${EMPLOYEES.filter((e) => e.status !== "inactive").length} active / on-leave employees`,
      amount:      monthlyPayroll,
      frequency:   "monthly",
      date:        new Date().toISOString().slice(0, 10),
    },
    ...OPERATING_EXPENSES,
  ], [monthlyPayroll]);

  // ——— Sort ———
  const sorted = useMemo(() => {
    const data = [...allRows];
    data.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "category":    cmp = a.category.localeCompare(b.category); break;
        case "description": cmp = a.description.localeCompare(b.description); break;
        case "amount":      cmp = a.amount - b.amount; break;
        case "frequency":   cmp = a.frequency.localeCompare(b.frequency); break;
        case "date":        cmp = a.date.localeCompare(b.date); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return data;
  }, [allRows, sortKey, sortDir]);

  const totalPages  = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage    = Math.min(page, totalPages);
  const paginated   = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  // ——————————————————————————————————————————————————
  // RENDER
  // ——————————————————————————————————————————————————

  return (
    <div className="space-y-6">

      {/* ┌── PAGE HEADER ──┐ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <motion.h1
            className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-blue-primary leading-none"
            initial={{ x: -30 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            Expenses
          </motion.h1>
          <motion.p
            className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
          >
            {allRows.length} line item{allRows.length !== 1 && "s"}&nbsp;&middot;&nbsp;
            {categoryTotals.length} categor{categoryTotals.length !== 1 ? "ies" : "y"}
          </motion.p>
        </div>
        <motion.span
          className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
        >
          [INV.EXP]
        </motion.span>
      </div>

      {/* Blueprint divider */}
      <div className="h-px bg-blue-primary/10" />

      {/* ┌── KPI CARDS ──┐ */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-blue-primary/10 border border-blue-primary/10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease }}
      >
        {[
          {
            label: "Total Monthly",
            value: formatCurrency(totalMonthly),
            sub:   `${formatCurrency(totalMonthly * 12)} / year`,
          },
          {
            label: "Payroll",
            value: formatCurrency(monthlyPayroll),
            sub:   `${Math.round((monthlyPayroll / totalMonthly) * 100)}% of total`,
          },
          {
            label: "Operating Costs",
            value: formatCurrency(monthlyOperating),
            sub:   `${OPERATING_EXPENSES.length} line items`,
          },
          {
            label: "Largest Category",
            value: largestCategory.name,
            sub:   formatCurrency(largestCategory.total) + " / mo",
          },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-cream-light px-4 py-5">
            <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30 block mb-2">
              {kpi.label}
            </span>
            <span className="font-sans text-2xl font-bold text-blue-primary leading-none block truncate">
              {kpi.value}
            </span>
            <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/25 mt-1.5 block">
              {kpi.sub}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ┌── CATEGORY BREAKDOWN ──┐ */}
      <motion.div
        className="border border-blue-primary/10 bg-cream-light"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease }}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
            Spend by Category
          </p>
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/001</span>
        </div>
        <div className="px-5 py-4 space-y-3">
          {categoryTotals.map((cat) => {
            const pct = (cat.total / totalMonthly) * 100;
            return (
              <div key={cat.name} className="flex items-center gap-4">
                <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/50 w-44 shrink-0 truncate">
                  {cat.name}
                </span>
                <div className="flex-1 h-1.5 bg-blue-primary/8 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-blue-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease }}
                  />
                </div>
                <span className="font-mono text-[10px] tracking-[0.04em] text-blue-primary/60 w-20 text-right shrink-0">
                  {formatCurrency(cat.total)}
                </span>
                <span className="font-mono text-[9px] tracking-[0.06em] text-blue-primary/25 w-10 text-right shrink-0">
                  {Math.round(pct)}%
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ┌── TABLE ──┐ */}
      <motion.div
        className="border border-blue-primary/10 bg-cream-light overflow-hidden"
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.16, ease }}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
            Expense Ledger
          </p>
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/002</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-blue-primary/10 h-11">
                <th className="text-left px-5 align-middle">
                  <button
                    onClick={() => handleSort("category")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Category <SortIcon col="category" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button
                    onClick={() => handleSort("description")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Description <SortIcon col="description" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-center px-3 align-middle">
                  <button
                    onClick={() => handleSort("frequency")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto"
                  >
                    Freq <SortIcon col="frequency" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-right px-3 align-middle">
                  <button
                    onClick={() => handleSort("amount")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors ml-auto"
                  >
                    Amount / mo <SortIcon col="amount" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-right px-5 align-middle">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors ml-auto"
                  >
                    Last Billed <SortIcon col="date" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* ── LOADING SKELETON ── */}
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-blue-primary/6 h-14">
                    <td className="px-5 align-middle">
                      <div className="h-2.5 w-32 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-48 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-5 w-14 bg-blue-primary/8 animate-pulse mx-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-20 bg-blue-primary/8 animate-pulse ml-auto" />
                    </td>
                    <td className="px-5 align-middle">
                      <div className="h-2.5 w-24 bg-blue-primary/8 animate-pulse ml-auto" />
                    </td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                /* ── EMPTY STATE ── */
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <Receipt size={28} strokeWidth={1} className="text-blue-primary/15 mx-auto mb-3" />
                    <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary/30">
                      No expenses recorded
                    </p>
                  </td>
                </tr>
              ) : (
                /* ── DATA ROWS ── */
                paginated.map((exp) => (
                  <tr
                    key={exp.id}
                    className="border-b border-blue-primary/6 hover:bg-blue-primary/[0.02] transition-colors duration-150 h-14"
                  >
                    {/* Category */}
                    <td className="px-5 align-middle">
                      <span className="font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary font-medium leading-none">
                        {exp.category}
                      </span>
                    </td>
                    {/* Description */}
                    <td className="px-3 align-middle">
                      <span className="font-mono text-[10px] tracking-[0.04em] text-blue-primary/55">
                        {exp.description}
                      </span>
                    </td>
                    {/* Frequency */}
                    <td className="px-3 align-middle text-center">
                      <span
                        className={`font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-1 leading-none ${
                          exp.frequency === "monthly"
                            ? "text-blue-primary bg-blue-primary/10"
                            : exp.frequency === "annual"
                            ? "text-blue-primary/60 bg-blue-primary/5"
                            : "text-blue-primary/30 bg-blue-primary/[0.03]"
                        }`}
                      >
                        {FREQ_LABEL[exp.frequency]}
                      </span>
                    </td>
                    {/* Amount */}
                    <td className="px-3 align-middle text-right">
                      <span className="font-mono text-[12px] tracking-[0.03em] font-semibold text-blue-primary leading-none block">
                        {formatCurrency(exp.amount)}
                      </span>
                      <span className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/25 block mt-0.5 leading-none">
                        {formatCurrency(exp.amount * 12)} / yr
                      </span>
                    </td>
                    {/* Date */}
                    <td className="px-5 align-middle text-right">
                      <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50">
                        {formatDate(exp.date)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ┌── PAGINATION ──┐ */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-blue-primary/8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
              {sorted.length > 0 ? `${(safePage - 1) * pageSize + 1}` : "0"}
              &ndash;{Math.min(safePage * pageSize, sorted.length)} of {sorted.length}
            </span>
            <div className="w-px h-3 bg-blue-primary/10" />
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="h-7 px-2 bg-transparent border border-blue-primary/10 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/50 focus:outline-none cursor-pointer appearance-none"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>{s} rows</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="w-7 h-7 flex items-center justify-center border border-blue-primary/10 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30 disabled:opacity-20 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft size={12} strokeWidth={2} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (totalPages <= 5) return true;
                if (p === 1 || p === totalPages) return true;
                if (Math.abs(p - safePage) <= 1) return true;
                return false;
              })
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev != null && p - prev > 1;
                return (
                  <span key={p} className="flex items-center">
                    {showEllipsis && (
                      <span className="w-7 h-7 flex items-center justify-center font-mono text-[9px] text-blue-primary/20">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 flex items-center justify-center font-mono text-[10px] tracking-[0.05em] border transition-colors ${
                        p === safePage
                          ? "bg-blue-primary text-cream-primary border-blue-primary"
                          : "border-blue-primary/10 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30"
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                );
              })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="w-7 h-7 flex items-center justify-center border border-blue-primary/10 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30 disabled:opacity-20 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight size={12} strokeWidth={2} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Bottom marker */}
      <div className="flex items-center justify-between pt-4">
        <div className="h-px flex-1 bg-blue-primary/8" />
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">
          [INV.EXP.END]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  );
}
