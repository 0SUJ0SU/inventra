// src/app/(app)/customers/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  ArrowRight,
} from "lucide-react";
import { SERIALIZED_ITEMS, WARRANTY_CLAIMS } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils/format";
import Link from "next/link";

// ——————————————————————————————————————————————————
// TYPES
// ——————————————————————————————————————————————————

interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalItems: number;
  totalSpend: number;
  lastPurchaseDate: string;
  warrantyClaims: number;
}

type SortKey = "name" | "totalItems" | "totalSpend" | "lastPurchaseDate" | "warrantyClaims";
type SortDir = "asc" | "desc";

// ——————————————————————————————————————————————————
// CONSTANTS
// ——————————————————————————————————————————————————

const PAGE_SIZES = [10, 20, 50] as const;
const ease = [0.16, 1, 0.3, 1] as const;

const CUSTOMER_CONTACTS: Record<string, { email: string; phone: string }> = {
  "tech-haven":   { email: "orders@techhaven.com",   phone: "+1 (415) 882-3310" },
  "circuit-hub":  { email: "procurement@circuithub.io", phone: "+1 (312) 774-9901" },
  "digital-edge": { email: "buying@digitaledge.co",  phone: "+1 (213) 559-0044" },
  "gadget-zone":  { email: "stock@gadgetzone.net",   phone: "+1 (646) 338-7721" },
  "nex-mobile":   { email: "supply@nexmobile.com",   phone: "+1 (512) 991-2267" },
};

// ——————————————————————————————————————————————————
// HELPERS
// ——————————————————————————————————————————————————

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function deriveCustomers(): CustomerSummary[] {
  const map = new Map<string, CustomerSummary>();

  for (const item of SERIALIZED_ITEMS) {
    if (!item.customer || !item.soldDate || !item.soldPrice) continue;
    const id = slugify(item.customer);
    if (!map.has(id)) {
      const contact = CUSTOMER_CONTACTS[id] ?? { email: "", phone: "" };
      map.set(id, {
        id,
        name: item.customer,
        email: contact.email,
        phone: contact.phone,
        totalItems: 0,
        totalSpend: 0,
        lastPurchaseDate: item.soldDate,
        warrantyClaims: 0,
      });
    }
    const c = map.get(id)!;
    c.totalItems++;
    c.totalSpend += item.soldPrice;
    if (item.soldDate > c.lastPurchaseDate) c.lastPurchaseDate = item.soldDate;
  }

  // Enrich with warranty claim counts
  for (const claim of WARRANTY_CLAIMS) {
    if (!claim.customerName) continue;
    const id = slugify(claim.customerName);
    if (map.has(id)) {
      map.get(id)!.warrantyClaims++;
    }
  }

  return Array.from(map.values());
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

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("totalSpend");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const allCustomers = useMemo(() => deriveCustomers(), []);

  // ——— Page-level KPIs ———
  const totalCustomers = allCustomers.length;
  const totalRevenue = allCustomers.reduce((acc, c) => acc + c.totalSpend, 0);
  const totalClaims = allCustomers.reduce((acc, c) => acc + c.warrantyClaims, 0);
  const avgSpend =
    totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  // ——— Filter ———
  const filtered = useMemo(() => {
    if (!search.trim()) return allCustomers;
    const q = search.toLowerCase().trim();
    return allCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }, [allCustomers, search]);

  // ——— Sort ———
  const sorted = useMemo(() => {
    const data = [...filtered];
    data.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":             cmp = a.name.localeCompare(b.name); break;
        case "totalItems":       cmp = a.totalItems - b.totalItems; break;
        case "totalSpend":       cmp = a.totalSpend - b.totalSpend; break;
        case "lastPurchaseDate": cmp = a.lastPurchaseDate.localeCompare(b.lastPurchaseDate); break;
        case "warrantyClaims":   cmp = a.warrantyClaims - b.warrantyClaims; break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return data;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

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
            Customers
          </motion.h1>
          <motion.p
            className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
          >
            {totalCustomers} account{totalCustomers !== 1 && "s"}&nbsp;&middot;&nbsp;
            {formatCurrency(totalRevenue)} total revenue
          </motion.p>
        </div>
        <motion.span
          className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
        >
          [INV.CUS]
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
            label: "Total Customers",
            value: totalCustomers.toString(),
            sub: "Active accounts",
          },
          {
            label: "Total Revenue",
            value: formatCurrency(totalRevenue),
            sub: "From sold units",
          },
          {
            label: "Warranty Claims",
            value: totalClaims.toString(),
            sub: "Across all accounts",
          },
          {
            label: "Avg Customer Spend",
            value: formatCurrency(avgSpend),
            sub: "Lifetime value",
          },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-cream-light px-4 py-5">
            <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30 block mb-2">
              {kpi.label}
            </span>
            <span className="font-sans text-2xl font-bold text-blue-primary leading-none block">
              {kpi.value}
            </span>
            <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/25 mt-1.5 block">
              {kpi.sub}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ┌── SEARCH ──┐ */}
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease }}
      >
        <div className="relative max-w-md">
          <Search
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-primary/30"
          />
          <input
            type="text"
            placeholder="SEARCH CUSTOMERS OR CONTACT..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full h-9 pl-9 pr-3 bg-cream-light border border-blue-primary/10 font-mono text-[11px] tracking-[0.08em] uppercase text-blue-primary placeholder:text-blue-primary/25 focus:outline-none focus:border-blue-primary/30 transition-colors"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(1); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-blue-primary/30 hover:text-blue-primary transition-colors"
            >
              <X size={12} strokeWidth={2} />
            </button>
          )}
        </div>
      </motion.div>

      {/* ┌── TABLE ──┐ */}
      <motion.div
        className="border border-blue-primary/10 bg-cream-light overflow-hidden"
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease }}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
            Customer Registry
          </p>
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/001</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <thead>
              <tr className="border-b border-blue-primary/10 h-11">
                <th className="text-left px-5 align-middle">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Customer <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50">
                    Contact
                  </span>
                </th>
                <th className="text-center px-3 align-middle">
                  <button
                    onClick={() => handleSort("totalItems")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto"
                  >
                    Units <SortIcon col="totalItems" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-right px-3 align-middle">
                  <button
                    onClick={() => handleSort("totalSpend")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors ml-auto"
                  >
                    Total Spend <SortIcon col="totalSpend" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-center px-3 align-middle">
                  <button
                    onClick={() => handleSort("warrantyClaims")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto"
                  >
                    Claims <SortIcon col="warrantyClaims" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-right px-3 align-middle">
                  <button
                    onClick={() => handleSort("lastPurchaseDate")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors ml-auto"
                  >
                    Last Purchase <SortIcon col="lastPurchaseDate" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="w-10 px-3 align-middle" />
              </tr>
            </thead>
            <tbody>
              {/* ── LOADING SKELETON ── */}
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-blue-primary/6 h-16">
                    <td className="px-5 align-middle">
                      <div className="h-2.5 w-36 bg-blue-primary/8 animate-pulse mb-1.5" />
                      <div className="h-2 w-20 bg-blue-primary/5 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-44 bg-blue-primary/8 animate-pulse mb-1.5" />
                      <div className="h-2 w-28 bg-blue-primary/5 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-8 bg-blue-primary/8 animate-pulse mx-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-20 bg-blue-primary/8 animate-pulse ml-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-8 bg-blue-primary/8 animate-pulse mx-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-24 bg-blue-primary/8 animate-pulse ml-auto" />
                    </td>
                    <td className="px-3 align-middle" />
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                /* ── EMPTY STATE ── */
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <Users
                      size={28}
                      strokeWidth={1}
                      className="text-blue-primary/15 mx-auto mb-3"
                    />
                    <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary/30">
                      {search ? "No customers found" : "No customers yet"}
                    </p>
                    <p className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/20 mt-1">
                      {search
                        ? "Try a different search term"
                        : "Customers appear once sales are recorded"}
                    </p>
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="mt-4 h-8 px-4 border border-blue-primary/10 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30 transition-colors"
                      >
                        Clear Search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                /* ── DATA ROWS ── */
                paginated.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-blue-primary/6 hover:bg-blue-primary/[0.02] transition-colors duration-150 h-16"
                  >
                    {/* Name */}
                    <td className="px-5 align-middle">
                      <Link
                        href={`/customers/${customer.id}`}
                        className="font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary hover:underline underline-offset-2 decoration-blue-primary/30 transition-colors block leading-none"
                      >
                        {customer.name}
                      </Link>
                      <span className="font-mono text-[8px] tracking-[0.06em] text-blue-primary/25 mt-0.5 block leading-none">
                        {customer.phone}
                      </span>
                    </td>
                    {/* Contact */}
                    <td className="px-3 align-middle">
                      <span className="font-mono text-[10px] tracking-[0.02em] text-blue-primary/50">
                        {customer.email}
                      </span>
                    </td>
                    {/* Units */}
                    <td className="px-3 align-middle text-center">
                      <span className="font-mono text-[13px] font-semibold text-blue-primary/70 leading-none block">
                        {customer.totalItems}
                      </span>
                      <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/20 block mt-0.5 leading-none">
                        units
                      </span>
                    </td>
                    {/* Total spend */}
                    <td className="px-3 align-middle text-right">
                      <span className="font-mono text-[12px] tracking-[0.03em] font-semibold text-blue-primary leading-none block">
                        {formatCurrency(customer.totalSpend)}
                      </span>
                      <span className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/25 block mt-0.5 leading-none">
                        avg {formatCurrency(customer.totalItems > 0 ? customer.totalSpend / customer.totalItems : 0)} / unit
                      </span>
                    </td>
                    {/* Warranty claims */}
                    <td className="px-3 align-middle text-center">
                      {customer.warrantyClaims > 0 ? (
                        <span className="font-mono text-[12px] font-semibold text-blue-primary">
                          {customer.warrantyClaims}
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] text-blue-primary/20">—</span>
                      )}
                    </td>
                    {/* Last purchase */}
                    <td className="px-3 align-middle text-right">
                      <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50">
                        {formatDate(customer.lastPurchaseDate)}
                      </span>
                    </td>
                    {/* Arrow */}
                    <td className="w-10 px-3 align-middle text-center">
                      <Link
                        href={`/customers/${customer.id}`}
                        className="p-1 text-blue-primary/20 hover:text-blue-primary transition-colors inline-flex items-center justify-center"
                      >
                        <ArrowRight size={13} strokeWidth={1.5} />
                      </Link>
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
          [INV.CUS.END]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  );
}
