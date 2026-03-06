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
  Building2,
  ArrowRight,
} from "lucide-react";
import { PURCHASE_ORDERS, type PurchaseOrder } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils/format";
import Link from "next/link";

interface SupplierSummary {
  id: string;
  name: string;
  contact: string;
  totalOrders: number;
  activeOrders: number;
  totalSpend: number;
  allSpend: number;
  lastOrderDate: string;
  receivedOrders: number;
  cancelledOrders: number;
}

type SortKey = "name" | "totalOrders" | "activeOrders" | "totalSpend" | "lastOrderDate";
type SortDir = "asc" | "desc";

const PAGE_SIZES = [10, 20, 50] as const;
const ease = [0.16, 1, 0.3, 1] as const;

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

function deriveSuppliers(orders: PurchaseOrder[]): SupplierSummary[] {
  const suppliersBySlug = new Map<string, SupplierSummary>();
  for (const order of orders) {
    const slug = slugify(order.supplierName);
    if (!suppliersBySlug.has(slug)) {
      suppliersBySlug.set(slug, {
        id: slug,
        name: order.supplierName,
        contact: order.supplierContact,
        totalOrders: 0,
        activeOrders: 0,
        totalSpend: 0,
        allSpend: 0,
        lastOrderDate: order.date,
        receivedOrders: 0,
        cancelledOrders: 0,
      });
    }
    const supplier = suppliersBySlug.get(slug)!;
    supplier.totalOrders++;
    supplier.allSpend += order.total;
    if (["draft", "sent", "partial"].includes(order.status)) supplier.activeOrders++;
    if (["received", "partial"].includes(order.status)) supplier.totalSpend += order.total;
    if (order.status === "received") supplier.receivedOrders++;
    if (order.status === "cancelled") supplier.cancelledOrders++;
    if (order.date > supplier.lastOrderDate) supplier.lastOrderDate = order.date;
  }
  return Array.from(suppliersBySlug.values());
}

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

export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("totalSpend");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(loadingTimer);
  }, []);

  const allSuppliers = useMemo(() => deriveSuppliers(PURCHASE_ORDERS), []);

  const totalSuppliers = allSuppliers.length;
  const totalSpend = allSuppliers.reduce((acc, supplier) => acc + supplier.totalSpend, 0);
  const totalActiveOrders = allSuppliers.reduce((acc, supplier) => acc + supplier.activeOrders, 0);
  const avgOrderValue =
    PURCHASE_ORDERS.length > 0
      ? PURCHASE_ORDERS.reduce((acc, order) => acc + order.total, 0) / PURCHASE_ORDERS.length
      : 0;

  const filtered = useMemo(() => {
    if (!search.trim()) return allSuppliers;
    const searchLower = search.toLowerCase().trim();
    return allSuppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(searchLower) || supplier.contact.toLowerCase().includes(searchLower)
    );
  }, [allSuppliers, search]);

  const sorted = useMemo(() => {
    const cloned = [...filtered];
    cloned.sort((left, right) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":          cmp = left.name.localeCompare(right.name); break;
        case "totalOrders":   cmp = left.totalOrders - right.totalOrders; break;
        case "activeOrders":  cmp = left.activeOrders - right.activeOrders; break;
        case "totalSpend":    cmp = left.totalSpend - right.totalSpend; break;
        case "lastOrderDate": cmp = left.lastOrderDate.localeCompare(right.lastOrderDate); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return cloned;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <motion.h1
            className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-blue-primary leading-none"
            initial={{ x: -30 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            Suppliers
          </motion.h1>
          <motion.p
            className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
          >
            {totalSuppliers} vendor{totalSuppliers !== 1 && "s"}&nbsp;&middot;&nbsp;
            {formatCurrency(totalSpend)} total spend
          </motion.p>
        </div>
        <motion.span
          className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
        >
          [INV.SUP]
        </motion.span>
      </div>

      <div className="h-px bg-blue-primary/10" />

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-blue-primary/10 border border-blue-primary/10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease }}
      >
        {[
          {
            label: "Total Suppliers",
            value: totalSuppliers.toString(),
            sub: "Active vendors",
          },
          {
            label: "Total Spend",
            value: formatCurrency(totalSpend),
            sub: "Received + partial",
          },
          {
            label: "Active Orders",
            value: totalActiveOrders.toString(),
            sub: "Draft / sent / partial",
          },
          {
            label: "Avg Order Value",
            value: formatCurrency(avgOrderValue),
            sub: "Across all orders",
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
            placeholder="SEARCH SUPPLIERS OR CONTACT..."
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
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

      <motion.div
        className="border border-blue-primary/10 bg-cream-light overflow-hidden"
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease }}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
            Supplier Registry
          </p>
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/001</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-blue-primary/10 h-11">
                <th className="text-left px-5 align-middle">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Supplier <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50">
                    Contact
                  </span>
                </th>
                <th className="text-center px-3 align-middle">
                  <button
                    onClick={() => handleSort("totalOrders")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto"
                  >
                    Orders <SortIcon col="totalOrders" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-center px-3 align-middle">
                  <button
                    onClick={() => handleSort("activeOrders")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto"
                  >
                    Active <SortIcon col="activeOrders" sortKey={sortKey} sortDir={sortDir} />
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
                <th className="text-right px-3 align-middle">
                  <button
                    onClick={() => handleSort("lastOrderDate")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors ml-auto"
                  >
                    Last Order <SortIcon col="lastOrderDate" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="w-10 px-3 align-middle" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, skeletonIndex) => (
                  <tr key={skeletonIndex} className="border-b border-blue-primary/6 h-16">
                    <td className="px-5 align-middle">
                      <div className="h-2.5 w-40 bg-blue-primary/8 animate-pulse mb-1.5" />
                      <div className="h-2 w-24 bg-blue-primary/5 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-44 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-8 bg-blue-primary/8 animate-pulse mx-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-8 bg-blue-primary/8 animate-pulse mx-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-20 bg-blue-primary/8 animate-pulse ml-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-24 bg-blue-primary/8 animate-pulse ml-auto" />
                    </td>
                    <td className="px-3 align-middle" />
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <Building2
                      size={28}
                      strokeWidth={1}
                      className="text-blue-primary/15 mx-auto mb-3"
                    />
                    <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary/30">
                      {search ? "No suppliers found" : "No suppliers yet"}
                    </p>
                    <p className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/20 mt-1">
                      {search
                        ? "Try a different search term"
                        : "Suppliers appear once purchase orders are created"}
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
                paginated.map((supplier) => {
                  const fulfilmentRate =
                    supplier.totalOrders > 0
                      ? Math.round((supplier.receivedOrders / supplier.totalOrders) * 100)
                      : 0;
                  return (
                    <tr
                      key={supplier.id}
                      className="border-b border-blue-primary/6 hover:bg-blue-primary/[0.02] transition-colors duration-150 h-16"
                    >
                      <td className="px-5 align-middle">
                        <Link
                          href={`/purchases/suppliers/${supplier.id}`}
                          className="font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary hover:underline underline-offset-2 decoration-blue-primary/30 transition-colors block leading-none"
                        >
                          {supplier.name}
                        </Link>
                        <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/25 mt-0.5 block leading-none">
                          {fulfilmentRate}% fulfilment
                        </span>
                      </td>
                      <td className="px-3 align-middle">
                        <span className="font-mono text-[10px] tracking-[0.02em] text-blue-primary/50">
                          {supplier.contact}
                        </span>
                      </td>
                      <td className="px-3 align-middle text-center">
                        <span className="font-mono text-[13px] font-semibold text-blue-primary/70 leading-none block">
                          {supplier.totalOrders}
                        </span>
                        {supplier.cancelledOrders > 0 && (
                          <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/20 block mt-0.5 leading-none">
                            {supplier.cancelledOrders} cancelled
                          </span>
                        )}
                      </td>
                      <td className="px-3 align-middle text-center">
                        {supplier.activeOrders > 0 ? (
                          <span className="font-mono text-[12px] font-semibold text-blue-primary">
                            {supplier.activeOrders}
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] text-blue-primary/20">—</span>
                        )}
                      </td>
                      <td className="px-3 align-middle text-right">
                        <span className="font-mono text-[12px] tracking-[0.03em] font-semibold text-blue-primary leading-none block">
                          {formatCurrency(supplier.totalSpend)}
                        </span>
                        {supplier.totalSpend !== supplier.allSpend && (
                          <span className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/25 block mt-0.5 leading-none">
                            {formatCurrency(supplier.allSpend)} committed
                          </span>
                        )}
                      </td>
                      <td className="px-3 align-middle text-right">
                        <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50">
                          {formatDate(supplier.lastOrderDate)}
                        </span>
                      </td>
                      <td className="w-10 px-3 align-middle text-center">
                        <Link
                          href={`/purchases/suppliers/${supplier.id}`}
                          className="p-1 text-blue-primary/20 hover:text-blue-primary transition-colors inline-flex items-center justify-center"
                        >
                          <ArrowRight size={13} strokeWidth={1.5} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-blue-primary/8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
              {sorted.length > 0 ? `${(safePage - 1) * pageSize + 1}` : "0"}
              &ndash;{Math.min(safePage * pageSize, sorted.length)} of {sorted.length}
            </span>
            <div className="w-px h-3 bg-blue-primary/10" />
            <select
              value={pageSize}
              onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}
              className="h-7 px-2 bg-transparent border border-blue-primary/10 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/50 focus:outline-none cursor-pointer appearance-none"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>{size} rows</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={safePage <= 1}
              className="w-7 h-7 flex items-center justify-center border border-blue-primary/10 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30 disabled:opacity-20 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft size={12} strokeWidth={2} />
            </button>
            {Array.from({ length: totalPages }, (_, pageIndex) => pageIndex + 1)
              .filter((pageNum) => {
                if (totalPages <= 5) return true;
                if (pageNum === 1 || pageNum === totalPages) return true;
                if (Math.abs(pageNum - safePage) <= 1) return true;
                return false;
              })
              .map((pageNum, position, visiblePages) => {
                const prevPage = visiblePages[position - 1];
                const showEllipsis = prevPage != null && pageNum - prevPage > 1;
                return (
                  <span key={pageNum} className="flex items-center">
                    {showEllipsis && (
                      <span className="w-7 h-7 flex items-center justify-center font-mono text-[9px] text-blue-primary/20">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => setPage(pageNum)}
                      className={`w-7 h-7 flex items-center justify-center font-mono text-[10px] tracking-[0.05em] border transition-colors ${
                        pageNum === safePage
                          ? "bg-blue-primary text-cream-primary border-blue-primary"
                          : "border-blue-primary/10 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30"
                      }`}
                    >
                      {pageNum}
                    </button>
                  </span>
                );
              })}
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={safePage >= totalPages}
              className="w-7 h-7 flex items-center justify-center border border-blue-primary/10 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30 disabled:opacity-20 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight size={12} strokeWidth={2} />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center justify-between pt-4">
        <div className="h-px flex-1 bg-blue-primary/8" />
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">
          [INV.SUP.END]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  );
}
