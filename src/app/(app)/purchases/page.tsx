// src/app/(app)/purchases/page.tsx
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  MoreHorizontal,
  Eye,
  Download,
  Plus,
  Truck,
  Ban,
} from "lucide-react";
import {
  PURCHASE_ORDERS,
  PURCHASE_STATUS_CONFIG,
  type PurchaseOrder,
  type PurchaseStatus,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils/format";
import Link from "next/link";

// ————————————————————————————————————————————————
// TYPES
// ————————————————————————————————————————————————

type SortKey =
  | "poNumber"
  | "date"
  | "expectedDate"
  | "supplierName"
  | "itemCount"
  | "total"
  | "status";
type SortDir = "asc" | "desc";

// ————————————————————————————————————————————————
// CONSTANTS
// ————————————————————————————————————————————————

const PAGE_SIZES = [10, 20, 50] as const;
const ease = [0.16, 1, 0.3, 1] as const;

// ————————————————————————————————————————————————
// HELPERS
// ————————————————————————————————————————————————

function formatPoDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getUniqueSuppliers(orders: PurchaseOrder[]): string[] {
  const set = new Set(orders.map((o) => o.supplierName));
  return Array.from(set).sort();
}

// ————————————————————————————————————————————————
// SORT ICON
// ————————————————————————————————————————————————

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
    return (
      <ChevronsUpDown size={12} strokeWidth={1.5} className="text-blue-primary/20" />
    );
  return sortDir === "asc" ? (
    <ChevronUp size={12} strokeWidth={2} className="text-blue-primary" />
  ) : (
    <ChevronDown size={12} strokeWidth={2} className="text-blue-primary" />
  );
}

// ————————————————————————————————————————————————
// PAGE
// ————————————————————————————————————————————————

export default function PurchaseOrdersPage() {
  // — Filter state —
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | "all">("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // — Sort state —
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // — Pagination —
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // — Selection —
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // — Action menu —
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // — Local mutable state —
  const [orders, setOrders] = useState<PurchaseOrder[]>(() => [...PURCHASE_ORDERS]);

  // — Loading skeleton on mount —
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const uniqueSuppliers = useMemo(() => getUniqueSuppliers(orders), [orders]);

  // ——— DERIVED DATA ———

  const filtered = useMemo(() => {
    let data = [...orders];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      data = data.filter(
        (o) =>
          o.poNumber.toLowerCase().includes(q) ||
          o.supplierName.toLowerCase().includes(q) ||
          o.items.some(
            (i) =>
              i.productName.toLowerCase().includes(q) ||
              i.sku.toLowerCase().includes(q)
          )
      );
    }

    if (statusFilter !== "all") data = data.filter((o) => o.status === statusFilter);
    if (supplierFilter !== "all") data = data.filter((o) => o.supplierName === supplierFilter);
    if (dateFrom) data = data.filter((o) => o.date >= dateFrom);
    if (dateTo) data = data.filter((o) => o.date <= dateTo);

    return data;
  }, [search, statusFilter, supplierFilter, dateFrom, dateTo, orders]);

  const sorted = useMemo(() => {
    const data = [...filtered];
    data.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "poNumber":     cmp = a.poNumber.localeCompare(b.poNumber); break;
        case "date":         cmp = a.date.localeCompare(b.date); break;
        case "expectedDate": cmp = a.expectedDate.localeCompare(b.expectedDate); break;
        case "supplierName": cmp = a.supplierName.localeCompare(b.supplierName); break;
        case "itemCount":    cmp = a.items.length - b.items.length; break;
        case "total":        cmp = a.total - b.total; break;
        case "status": {
          const order: Record<PurchaseStatus, number> = {
            draft: 0, sent: 1, partial: 2, received: 3, cancelled: 4,
          };
          cmp = order[a.status] - order[b.status];
          break;
        }
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return data;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const resetPage = useCallback(() => setPage(1), []);

  // ——— HANDLERS ———

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const activeFilterCount = [
    statusFilter !== "all",
    supplierFilter !== "all",
    !!(dateFrom || dateTo),
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setSupplierFilter("all");
    setDateFrom("");
    setDateTo("");
    resetPage();
  };

  // — Cancel single order —
  const handleCancel = (id: string) => {
    if (!confirm("Cancel this purchase order? This cannot be undone.")) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "cancelled" as PurchaseStatus } : o))
    );
    setActionMenuId(null);
  };

  // — Selection handlers —
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (paginated.length > 0 && paginated.every((o) => next.has(o.id))) {
        paginated.forEach((o) => next.delete(o.id));
      } else {
        paginated.forEach((o) => next.add(o.id));
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());
  const allOnPageSelected =
    paginated.length > 0 && paginated.every((o) => selectedIds.has(o.id));

  // — Bulk cancel —
  const handleBulkCancel = () => {
    if (!confirm(`Cancel ${selectedIds.size} selected order(s)?`)) return;
    setOrders((prev) =>
      prev.map((o) =>
        selectedIds.has(o.id) && o.status !== "cancelled"
          ? { ...o, status: "cancelled" as PurchaseStatus }
          : o
      )
    );
    clearSelection();
  };

  // — Export helpers —
  const buildExportRows = (rows: PurchaseOrder[]) =>
    rows.map((o) => ({
      "PO #": o.poNumber,
      "Date": o.date,
      "Expected": o.expectedDate,
      "Supplier": o.supplierName,
      "Contact": o.supplierContact,
      "Items": o.items.map((i) => `${i.productName} x${i.qty}`).join("; "),
      "Subtotal": o.subtotal,
      "Shipping": o.shippingCost,
      "Total": o.total,
      "Status": PURCHASE_STATUS_CONFIG[o.status].label,
      "Handled By": o.handledBy,
      "Notes": o.notes ?? "",
    }));

  const handleExport = async () => {
    const XLSX = await import("xlsx");
    const ws = XLSX.utils.json_to_sheet(buildExportRows(sorted));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Purchase Orders");
    XLSX.writeFile(wb, `purchase-orders-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const handleExportSelected = async () => {
    const XLSX = await import("xlsx");
    const rows = sorted.filter((o) => selectedIds.has(o.id));
    const ws = XLSX.utils.json_to_sheet(buildExportRows(rows));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Purchase Orders");
    XLSX.writeFile(
      wb,
      `purchases-selected-${new Date().toISOString().split("T")[0]}.xlsx`
    );
    clearSelection();
  };

  // ——— STATUS SUMMARY ———

  const statusSummary = useMemo(() => {
    const counts: Record<PurchaseStatus, number> = {
      draft: 0, sent: 0, partial: 0, received: 0, cancelled: 0,
    };
    orders.forEach((o) => { counts[o.status]++; });
    return counts;
  }, [orders]);

  const totalSpend = useMemo(
    () =>
      orders
        .filter((o) => o.status === "received" || o.status === "partial")
        .reduce((acc, o) => acc + o.total, 0),
    [orders]
  );

  // ——— RENDER ———

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
            Purchase Orders
          </motion.h1>
          <motion.p
            className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
          >
            {orders.length} total order{orders.length !== 1 && "s"}&nbsp;&middot;&nbsp;
            {formatCurrency(totalSpend)} total spend
          </motion.p>
        </div>
        <motion.div
          className="flex items-center gap-3"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
        >
          <span className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20 hidden sm:block">
            [INV.PO]
          </span>
          <button
            onClick={handleExport}
            className="h-9 px-4 border border-blue-primary/15 text-blue-primary/50 font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:border-blue-primary/30 hover:text-blue-primary transition-colors"
          >
            <Download size={13} strokeWidth={1.5} />
            Export
          </button>
          <Link
            href="/purchases/new"
            className="h-9 px-4 bg-blue-primary text-cream-primary font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:bg-blue-dark transition-colors"
          >
            <Plus size={13} strokeWidth={1.5} />
            New Order
          </Link>
        </motion.div>
      </div>

      {/* Blueprint divider */}
      <div className="h-px bg-blue-primary/10" />

      {/* ┌── STATUS SUMMARY CARDS ──┐ */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-blue-primary/10 border border-blue-primary/10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease }}
      >
        {(
          Object.entries(PURCHASE_STATUS_CONFIG) as [
            PurchaseStatus,
            (typeof PURCHASE_STATUS_CONFIG)[PurchaseStatus]
          ][]
        ).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => {
              setStatusFilter(statusFilter === key ? "all" : key);
              resetPage();
            }}
            className={`bg-cream-light px-2 py-4 text-center transition-colors hover:bg-blue-primary/[0.03] ${
              statusFilter === key ? "ring-1 ring-inset ring-blue-primary/30" : ""
            }`}
          >
            <span
              className={`font-mono text-[22px] font-semibold leading-none block ${cfg.color}`}
            >
              {statusSummary[key]}
            </span>
            <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-blue-primary/40 mt-1.5 block">
              {cfg.label}
            </span>
          </button>
        ))}
      </motion.div>

      {/* ┌── FILTERS ──┐ */}
      <motion.div
        className="space-y-2"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease }}
      >
        {/* Row 1: Search + dropdowns */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              size={14}
              strokeWidth={1.5}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-primary/30"
            />
            <input
              type="text"
              placeholder="SEARCH PO #, SUPPLIER, PRODUCT, SKU..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              className="w-full h-9 pl-9 pr-3 bg-cream-light border border-blue-primary/10 font-mono text-[11px] tracking-[0.08em] uppercase text-blue-primary placeholder:text-blue-primary/25 focus:outline-none focus:border-blue-primary/30 transition-colors"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  resetPage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-blue-primary/30 hover:text-blue-primary transition-colors"
              >
                <X size={12} strokeWidth={2} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2">
            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as PurchaseStatus | "all");
                resetPage();
              }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[120px]"
            >
              <option value="all">All Status</option>
              {(
                Object.entries(PURCHASE_STATUS_CONFIG) as [
                  PurchaseStatus,
                  (typeof PURCHASE_STATUS_CONFIG)[PurchaseStatus]
                ][]
              ).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.label}
                </option>
              ))}
            </select>

            {/* Supplier */}
            <select
              value={supplierFilter}
              onChange={(e) => {
                setSupplierFilter(e.target.value);
                resetPage();
              }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[160px]"
            >
              <option value="all">All Suppliers</option>
              {uniqueSuppliers.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="h-9 px-3 border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/50 hover:text-blue-primary hover:border-blue-primary/30 transition-colors"
              >
                Clear ({activeFilterCount})
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Date range */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30 shrink-0">
            Order date
          </span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              resetPage();
            }}
            className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.05em] text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer w-36"
          />
          <span className="font-mono text-[9px] text-blue-primary/20">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              resetPage();
            }}
            className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.05em] text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer w-36"
          />
          {(dateFrom || dateTo) && (
            <button
              onClick={() => {
                setDateFrom("");
                setDateTo("");
                resetPage();
              }}
              className="h-9 w-9 flex items-center justify-center border border-blue-primary/10 text-blue-primary/30 hover:text-blue-primary hover:border-blue-primary/30 transition-colors"
            >
              <X size={12} strokeWidth={2} />
            </button>
          )}
          {(dateFrom || dateTo) && (
            <span className="font-mono text-[9px] tracking-[0.08em] text-blue-primary/30">
              {sorted.length} result{sorted.length !== 1 && "s"}
            </span>
          )}
        </div>

        {/* Row 3: Bulk actions */}
        {selectedIds.size > 0 && (
          <motion.div
            className="bg-blue-primary text-cream-primary"
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <div className="px-4 h-9 flex items-center justify-center border-b border-cream-primary/10">
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase">
                {selectedIds.size} order{selectedIds.size !== 1 && "s"} selected
              </span>
            </div>
            <div className="grid grid-cols-3 divide-x divide-cream-primary/10">
              <button
                onClick={handleBulkCancel}
                className="font-mono text-[9px] tracking-[0.1em] uppercase text-cream-primary/70 hover:text-cream-primary hover:bg-cream-primary/5 flex items-center justify-center gap-1.5 h-9 transition-colors"
              >
                <Ban size={12} strokeWidth={1.5} />
                Cancel Selected
              </button>
              <button
                onClick={handleExportSelected}
                className="font-mono text-[9px] tracking-[0.1em] uppercase text-cream-primary/70 hover:text-cream-primary hover:bg-cream-primary/5 flex items-center justify-center gap-1.5 h-9 transition-colors"
              >
                <Download size={12} strokeWidth={1.5} />
                Export Selected
              </button>
              <button
                onClick={clearSelection}
                className="font-mono text-[9px] tracking-[0.1em] uppercase text-cream-primary/50 hover:text-cream-primary hover:bg-cream-primary/5 flex items-center justify-center gap-1.5 h-9 transition-colors"
              >
                <X size={12} strokeWidth={1.5} />
                Deselect
              </button>
            </div>
          </motion.div>
        )}
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
            Order Registry
          </p>
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
            /001
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px]">
            <thead>
              <tr className="border-b border-blue-primary/10 h-11">
                <th className="w-12 px-4 align-middle">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleSelectAll}
                    disabled={isLoading || paginated.length === 0}
                    className="w-3.5 h-3.5 accent-blue-primary cursor-pointer block disabled:opacity-30"
                  />
                </th>
                <th className="text-left px-3 align-middle">
                  <button
                    onClick={() => handleSort("poNumber")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    PO # <SortIcon col="poNumber" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Order Date <SortIcon col="date" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button
                    onClick={() => handleSort("expectedDate")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Expected <SortIcon col="expectedDate" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button
                    onClick={() => handleSort("supplierName")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Supplier <SortIcon col="supplierName" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-center px-3 align-middle">
                  <button
                    onClick={() => handleSort("itemCount")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto"
                  >
                    Lines <SortIcon col="itemCount" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-right px-3 align-middle">
                  <button
                    onClick={() => handleSort("total")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors ml-auto"
                  >
                    Total <SortIcon col="total" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-center px-3 align-middle">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto"
                  >
                    Status <SortIcon col="status" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="w-12 px-3 align-middle" />
              </tr>
            </thead>
            <tbody>
              {/* —— LOADING SKELETON —— */}
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-blue-primary/6 h-14">
                    <td className="w-12 px-4 align-middle">
                      <div className="w-3.5 h-3.5 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-20 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-24 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-24 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-36 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-8 bg-blue-primary/8 animate-pulse mx-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-20 bg-blue-primary/8 animate-pulse ml-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-5 w-20 bg-blue-primary/8 animate-pulse mx-auto" />
                    </td>
                    <td className="w-12 px-3 align-middle" />
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                /* —— EMPTY STATE —— */
                <tr>
                  <td colSpan={9} className="text-center py-16">
                    <Truck
                      size={28}
                      strokeWidth={1}
                      className="text-blue-primary/15 mx-auto mb-3"
                    />
                    <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary/30">
                      {search || activeFilterCount > 0
                        ? "No orders found"
                        : "No purchase orders yet"}
                    </p>
                    <p className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/20 mt-1">
                      {search || activeFilterCount > 0
                        ? "Try adjusting your filters or date range"
                        : "Purchase orders will appear once created"}
                    </p>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="mt-4 h-8 px-4 border border-blue-primary/10 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                /* —— DATA ROWS —— */
                paginated.map((order) => {
                  const isSelected = selectedIds.has(order.id);
                  const sCfg = PURCHASE_STATUS_CONFIG[order.status];
                  const totalQty = order.items.reduce((acc, i) => acc + i.qty, 0);
                  const totalReceived = order.items.reduce((acc, i) => acc + i.qtyReceived, 0);
                  const hasShipping = order.shippingCost > 0;

                  return (
                    <tr
                      key={order.id}
                      className={`border-b border-blue-primary/6 transition-colors duration-150 h-14 ${
                        isSelected
                          ? "bg-blue-primary/[0.03]"
                          : "hover:bg-blue-primary/[0.02]"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="w-12 px-4 align-middle">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(order.id)}
                          className="w-3.5 h-3.5 accent-blue-primary cursor-pointer block"
                        />
                      </td>
                      {/* PO # */}
                      <td className="px-3 align-middle">
                        <Link
                          href={`/purchases/${order.id}`}
                          className="font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary hover:underline underline-offset-2 decoration-blue-primary/30 transition-colors"
                        >
                          {order.poNumber}
                        </Link>
                      </td>
                      {/* Order Date */}
                      <td className="px-3 align-middle">
                        <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50">
                          {formatPoDate(order.date)}
                        </span>
                      </td>
                      {/* Expected */}
                      <td className="px-3 align-middle">
                        <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50">
                          {formatPoDate(order.expectedDate)}
                        </span>
                      </td>
                      {/* Supplier */}
                      <td className="px-3 align-middle">
                        <p className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary truncate max-w-[180px] leading-none">
                          {order.supplierName}
                        </p>
                        <p className="font-mono text-[8px] tracking-[0.06em] text-blue-primary/30 mt-0.5 leading-none truncate max-w-[180px]">
                          {order.supplierContact}
                        </p>
                      </td>
                      {/* Lines */}
                      <td className="px-3 align-middle text-center">
                        <span className="font-mono text-[11px] tracking-[0.04em] font-semibold text-blue-primary/60">
                          {order.items.length}
                        </span>
                        <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/25 block leading-none mt-0.5">
                          {totalQty} units
                        </span>
                      </td>
                      {/* Total */}
                      <td className="px-3 align-middle text-right">
                        <span className="font-mono text-[12px] tracking-[0.03em] font-semibold text-blue-primary leading-none block">
                          {formatCurrency(order.total)}
                        </span>
                        {hasShipping && (
                          <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/25 block mt-0.5 leading-none">
                            +{formatCurrency(order.shippingCost)} ship
                          </span>
                        )}
                      </td>
                      {/* Status */}
                      <td className="px-3 align-middle">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-1 leading-none ${sCfg.color} ${sCfg.bg}`}
                          >
                            {sCfg.label}
                          </span>
                          {(order.status === "partial" || order.status === "received") && (
                            <span className="font-mono text-[7px] tracking-[0.08em] uppercase text-blue-primary/30 leading-none">
                              {totalReceived}/{totalQty} recv
                            </span>
                          )}
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="w-12 px-3 align-middle text-center relative">
                        <button
                          onClick={() =>
                            setActionMenuId(
                              actionMenuId === order.id ? null : order.id
                            )
                          }
                          className="p-1 text-blue-primary/30 hover:text-blue-primary transition-colors"
                        >
                          <MoreHorizontal size={14} strokeWidth={1.5} />
                        </button>
                        {actionMenuId === order.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActionMenuId(null)}
                            />
                            <div className="absolute right-3 top-full z-20 w-44 bg-cream-primary border border-blue-primary/10 shadow-sm py-1">
                              <Link
                                href={`/purchases/${order.id}`}
                                onClick={() => setActionMenuId(null)}
                                className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/60 hover:bg-blue-primary/5 hover:text-blue-primary transition-colors"
                              >
                                <Eye size={12} strokeWidth={1.5} />
                                View Details
                              </Link>
                              {order.status !== "cancelled" &&
                                order.status !== "received" && (
                                  <>
                                    <div className="h-px bg-blue-primary/8 mx-2 my-1" />
                                    <button
                                      onClick={() => handleCancel(order.id)}
                                      className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-[0.1em] uppercase text-error/60 hover:bg-error/5 hover:text-error transition-colors"
                                    >
                                      <Ban size={12} strokeWidth={1.5} />
                                      Cancel Order
                                    </button>
                                  </>
                                )}
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ┌── PAGINATION ──┐ */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-blue-primary/8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
              {sorted.length > 0 ? `${(safePage - 1) * pageSize + 1}` : "0"}
              &ndash;
              {Math.min(safePage * pageSize, sorted.length)} of {sorted.length}
            </span>
            <div className="w-px h-3 bg-blue-primary/10" />
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="h-7 px-2 bg-transparent border border-blue-primary/10 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/50 focus:outline-none cursor-pointer appearance-none"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s} rows
                </option>
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
          [INV.PO.END]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  );
}
