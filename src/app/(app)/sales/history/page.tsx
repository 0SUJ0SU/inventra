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
  ShoppingCart,
  Ban,
} from "lucide-react";
import {
  SALE_RECORDS,
  SALE_STATUS_CONFIG,
  PAYMENT_METHOD_CONFIG,
  type SaleRecord,
  type SaleStatus,
  type PaymentMethod,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils/format";
import Link from "next/link";

type SortKey =
  | "saleNumber"
  | "date"
  | "customerName"
  | "itemCount"
  | "total"
  | "paymentMethod"
  | "status";
type SortDir = "asc" | "desc";

const PAGE_SIZES = [10, 20, 50] as const;
const ease = [0.16, 1, 0.3, 1] as const;

const VALID_SALE_STATUSES: readonly SaleStatus[] = [
  "completed",
  "refunded",
  "partial_refund",
  "voided",
] as const;

const VALID_PAYMENT_METHODS: readonly PaymentMethod[] = [
  "cash",
  "card",
  "transfer",
] as const;

function isSaleStatus(candidate: string): candidate is SaleStatus {
  return (VALID_SALE_STATUSES as readonly string[]).includes(candidate);
}

function isPaymentMethod(candidate: string): candidate is PaymentMethod {
  return (VALID_PAYMENT_METHODS as readonly string[]).includes(candidate);
}

function parseSaleStatusFilter(candidate: string): SaleStatus | "all" {
  if (candidate === "all") return "all";
  if (isSaleStatus(candidate)) return candidate;
  return "all";
}

function parsePaymentMethodFilter(candidate: string): PaymentMethod | "all" {
  if (candidate === "all") return "all";
  if (isPaymentMethod(candidate)) return candidate;
  return "all";
}

function formatSaleDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getUniqueCustomers(sales: SaleRecord[]): string[] {
  const customerNameSet = new Set(sales.map((sale) => sale.customerName));
  return Array.from(customerNameSet).sort();
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
    return (
      <ChevronsUpDown size={12} strokeWidth={1.5} className="text-blue-primary/20" />
    );
  return sortDir === "asc" ? (
    <ChevronUp size={12} strokeWidth={2} className="text-blue-primary" />
  ) : (
    <ChevronDown size={12} strokeWidth={2} className="text-blue-primary" />
  );
}

export default function SalesHistoryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SaleStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | "all">("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const [sales, setSales] = useState<SaleRecord[]>(() => [...SALE_RECORDS]);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(loadingTimer);
  }, []);

  const uniqueCustomers = useMemo(() => getUniqueCustomers(sales), [sales]);

  const filtered = useMemo(() => {
    let matchingSales = [...sales];

    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      matchingSales = matchingSales.filter(
        (sale) =>
          sale.saleNumber.toLowerCase().includes(searchTerm) ||
          sale.customerName.toLowerCase().includes(searchTerm) ||
          sale.items.some(
            (lineItem) =>
              lineItem.productName.toLowerCase().includes(searchTerm) ||
              lineItem.sku.toLowerCase().includes(searchTerm) ||
              (lineItem.serialNumber && lineItem.serialNumber.toLowerCase().includes(searchTerm))
          )
      );
    }

    if (statusFilter !== "all") matchingSales = matchingSales.filter((sale) => sale.status === statusFilter);
    if (paymentFilter !== "all") matchingSales = matchingSales.filter((sale) => sale.paymentMethod === paymentFilter);
    if (customerFilter !== "all") matchingSales = matchingSales.filter((sale) => sale.customerName === customerFilter);
    if (dateFrom) matchingSales = matchingSales.filter((sale) => sale.date >= dateFrom);
    if (dateTo) matchingSales = matchingSales.filter((sale) => sale.date <= dateTo);

    return matchingSales;
  }, [search, statusFilter, paymentFilter, customerFilter, dateFrom, dateTo, sales]);

  const sorted = useMemo(() => {
    const sortableSales = [...filtered];
    sortableSales.sort((left, right) => {
      let comparison = 0;
      switch (sortKey) {
        case "saleNumber":   comparison = left.saleNumber.localeCompare(right.saleNumber); break;
        case "date":         comparison = left.date.localeCompare(right.date); break;
        case "customerName": comparison = left.customerName.localeCompare(right.customerName); break;
        case "itemCount":    comparison = left.items.length - right.items.length; break;
        case "total":        comparison = left.total - right.total; break;
        case "paymentMethod":comparison = left.paymentMethod.localeCompare(right.paymentMethod); break;
        case "status": {
          const statusOrder: Record<SaleStatus, number> = {
            completed: 0, partial_refund: 1, refunded: 2, voided: 3,
          };
          comparison = statusOrder[left.status] - statusOrder[right.status];
          break;
        }
      }
      return sortDir === "asc" ? comparison : -comparison;
    });
    return sortableSales;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const resetPage = useCallback(() => setCurrentPage(1), []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((currentDir) => (currentDir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const activeFilterCount = [
    statusFilter !== "all",
    paymentFilter !== "all",
    customerFilter !== "all",
    !!(dateFrom || dateTo),
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setCustomerFilter("all");
    setDateFrom("");
    setDateTo("");
    resetPage();
  };

  const handleVoid = (saleId: string) => {
    if (!confirm("Void this sale? This cannot be undone.")) return;
    setSales((prevSales) =>
      prevSales.map((sale) => (sale.id === saleId ? { ...sale, status: "voided" satisfies SaleStatus } : sale))
    );
    setActionMenuId(null);
  };

  const toggleSelect = (saleId: string) => {
    setSelectedIds((prevIds) => {
      const updatedIds = new Set(prevIds);
      if (updatedIds.has(saleId)) updatedIds.delete(saleId);
      else updatedIds.add(saleId);
      return updatedIds;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prevIds) => {
      const updatedIds = new Set(prevIds);
      if (paginated.length > 0 && paginated.every((sale) => updatedIds.has(sale.id))) {
        paginated.forEach((sale) => updatedIds.delete(sale.id));
      } else {
        paginated.forEach((sale) => updatedIds.add(sale.id));
      }
      return updatedIds;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());
  const allOnPageSelected =
    paginated.length > 0 && paginated.every((sale) => selectedIds.has(sale.id));

  const handleBulkVoid = () => {
    if (!confirm(`Void ${selectedIds.size} selected sale(s)?`)) return;
    setSales((prevSales) =>
      prevSales.map((sale) =>
        selectedIds.has(sale.id) && sale.status !== "voided"
          ? { ...sale, status: "voided" satisfies SaleStatus }
          : sale
      )
    );
    clearSelection();
  };

  const buildExportRows = (rows: SaleRecord[]) =>
    rows.map((sale) => ({
      "Sale #": sale.saleNumber,
      Date: sale.date,
      Customer: sale.customerName,
      Items: sale.items.map((lineItem) => `${lineItem.productName} x${lineItem.qty}`).join("; "),
      Subtotal: sale.subtotal,
      Discount: sale.discount,
      Total: sale.total,
      "Payment Method": PAYMENT_METHOD_CONFIG[sale.paymentMethod].label,
      Status: SALE_STATUS_CONFIG[sale.status].label,
      "Handled By": sale.handledBy,
      Notes: sale.notes ?? "",
    }));

  const handleExport = async () => {
    const XLSX = await import("xlsx");
    const worksheet = XLSX.utils.json_to_sheet(buildExportRows(sorted));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales History");
    XLSX.writeFile(workbook, `sales-history-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const handleExportSelected = async () => {
    const XLSX = await import("xlsx");
    const selectedRows = sorted.filter((sale) => selectedIds.has(sale.id));
    const worksheet = XLSX.utils.json_to_sheet(buildExportRows(selectedRows));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales History");
    XLSX.writeFile(
      workbook,
      `sales-selected-${new Date().toISOString().split("T")[0]}.xlsx`
    );
    clearSelection();
  };

  const statusSummary = useMemo(() => {
    const counts: Record<SaleStatus, number> = {
      completed: 0, refunded: 0, partial_refund: 0, voided: 0,
    };
    sales.forEach((sale) => { counts[sale.status]++; });
    return counts;
  }, [sales]);

  const totalRevenue = useMemo(
    () => sales.filter((sale) => sale.status === "completed").reduce((accumulator, sale) => accumulator + sale.total, 0),
    [sales]
  );

  const statusConfigEntries = Object.keys(SALE_STATUS_CONFIG).filter(isSaleStatus);

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
            Sales History
          </motion.h1>
          <motion.p
            className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
          >
            {sales.length} total transaction{sales.length !== 1 && "s"}&nbsp;&middot;&nbsp;
            {formatCurrency(totalRevenue)} revenue
          </motion.p>
        </div>
        <motion.div
          className="flex items-center gap-3"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
        >
          <span className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20 hidden sm:block">
            [INV.SALES]
          </span>
          <button
            onClick={handleExport}
            className="h-9 px-4 border border-blue-primary/15 text-blue-primary/50 font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:border-blue-primary/30 hover:text-blue-primary transition-colors"
          >
            <Download size={13} strokeWidth={1.5} />
            Export
          </button>
          <Link
            href="/sales/pos"
            className="h-9 px-4 bg-blue-primary text-cream-primary font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:bg-blue-dark transition-colors"
          >
            <Plus size={13} strokeWidth={1.5} />
            New Sale
          </Link>
        </motion.div>
      </div>

      <div className="h-px bg-blue-primary/10" />

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-blue-primary/10 border border-blue-primary/10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease }}
      >
        {statusConfigEntries.map((statusKey) => {
          const cfg = SALE_STATUS_CONFIG[statusKey];
          return (
            <button
              key={statusKey}
              onClick={() => {
                setStatusFilter(statusFilter === statusKey ? "all" : statusKey);
                resetPage();
              }}
              className={`bg-cream-light px-2 py-4 text-center transition-colors hover:bg-blue-primary/[0.03] ${
                statusFilter === statusKey ? "ring-1 ring-inset ring-blue-primary/30" : ""
              }`}
            >
              <span
                className={`font-mono text-[22px] font-semibold leading-none block ${cfg.color}`}
              >
                {statusSummary[statusKey]}
              </span>
              <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-blue-primary/40 mt-1.5 block">
                {cfg.label}
              </span>
            </button>
          );
        })}
      </motion.div>

      <motion.div
        className="space-y-2"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease }}
      >
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              size={14}
              strokeWidth={1.5}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-primary/30"
            />
            <input
              type="text"
              placeholder="SEARCH SALE #, CUSTOMER, PRODUCT, SERIAL..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
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
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(parseSaleStatusFilter(event.target.value));
                resetPage();
              }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[120px]"
            >
              <option value="all">All Status</option>
              {statusConfigEntries.map((statusKey) => (
                <option key={statusKey} value={statusKey}>
                  {SALE_STATUS_CONFIG[statusKey].label}
                </option>
              ))}
            </select>

            <select
              value={paymentFilter}
              onChange={(event) => {
                setPaymentFilter(parsePaymentMethodFilter(event.target.value));
                resetPage();
              }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[130px]"
            >
              <option value="all">All Payments</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="transfer">Transfer</option>
            </select>

            <select
              value={customerFilter}
              onChange={(event) => {
                setCustomerFilter(event.target.value);
                resetPage();
              }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[140px]"
            >
              <option value="all">All Customers</option>
              {uniqueCustomers.map((name) => (
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

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30 shrink-0">
            Date range
          </span>
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => {
              setDateFrom(event.target.value);
              resetPage();
            }}
            className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.05em] text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer w-36"
          />
          <span className="font-mono text-[9px] text-blue-primary/20">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(event) => {
              setDateTo(event.target.value);
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

        {selectedIds.size > 0 && (
          <motion.div
            className="bg-blue-primary text-cream-primary"
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <div className="px-4 h-9 flex items-center justify-center border-b border-cream-primary/10">
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase">
                {selectedIds.size} sale{selectedIds.size !== 1 && "s"} selected
              </span>
            </div>
            <div className="grid grid-cols-3 divide-x divide-cream-primary/10">
              <button
                onClick={handleBulkVoid}
                className="font-mono text-[9px] tracking-[0.1em] uppercase text-cream-primary/70 hover:text-cream-primary hover:bg-cream-primary/5 flex items-center justify-center gap-1.5 h-9 transition-colors"
              >
                <Ban size={12} strokeWidth={1.5} />
                Void Selected
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

      <motion.div
        className="border border-blue-primary/10 bg-cream-light overflow-hidden"
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease }}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
            Transaction Registry
          </p>
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
            /001
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
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
                    onClick={() => handleSort("saleNumber")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Sale # <SortIcon col="saleNumber" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Date <SortIcon col="date" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button
                    onClick={() => handleSort("customerName")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Customer <SortIcon col="customerName" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-center px-3 align-middle">
                  <button
                    onClick={() => handleSort("itemCount")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto"
                  >
                    Items <SortIcon col="itemCount" sortKey={sortKey} sortDir={sortDir} />
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
                    onClick={() => handleSort("paymentMethod")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto"
                  >
                    Payment <SortIcon col="paymentMethod" sortKey={sortKey} sortDir={sortDir} />
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
              {isLoading ? (
                Array.from({ length: 8 }).map((_, skeletonIndex) => (
                  <tr key={skeletonIndex} className="border-b border-blue-primary/6 h-14">
                    <td className="w-12 px-4 align-middle">
                      <div className="w-3.5 h-3.5 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-24 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-24 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-28 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-8 bg-blue-primary/8 animate-pulse mx-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-20 bg-blue-primary/8 animate-pulse ml-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-5 w-16 bg-blue-primary/8 animate-pulse mx-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-5 w-20 bg-blue-primary/8 animate-pulse mx-auto" />
                    </td>
                    <td className="w-12 px-3 align-middle" />
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16">
                    <ShoppingCart
                      size={28}
                      strokeWidth={1}
                      className="text-blue-primary/15 mx-auto mb-3"
                    />
                    <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary/30">
                      {search || activeFilterCount > 0
                        ? "No sales found"
                        : "No sales recorded yet"}
                    </p>
                    <p className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/20 mt-1">
                      {search || activeFilterCount > 0
                        ? "Try adjusting your filters or date range"
                        : "Sales will appear once transactions are processed"}
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
                paginated.map((sale) => {
                  const isSelected = selectedIds.has(sale.id);
                  const statusCfg = SALE_STATUS_CONFIG[sale.status];
                  const totalItems = sale.items.reduce((accumulator, lineItem) => accumulator + lineItem.qty, 0);
                  const hasDiscount = sale.discount > 0;

                  return (
                    <tr
                      key={sale.id}
                      className={`border-b border-blue-primary/6 transition-colors duration-150 h-14 ${
                        isSelected
                          ? "bg-blue-primary/[0.03]"
                          : "hover:bg-blue-primary/[0.02]"
                      }`}
                    >
                      <td className="w-12 px-4 align-middle">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(sale.id)}
                          className="w-3.5 h-3.5 accent-blue-primary cursor-pointer block"
                        />
                      </td>
                      <td className="px-3 align-middle">
                        <Link
                          href={`/sales/history/${sale.id}`}
                          className="font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary hover:underline underline-offset-2 decoration-blue-primary/30 transition-colors"
                        >
                          {sale.saleNumber}
                        </Link>
                      </td>
                      <td className="px-3 align-middle">
                        <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50">
                          {formatSaleDate(sale.date)}
                        </span>
                      </td>
                      <td className="px-3 align-middle">
                        <p className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary truncate max-w-[160px] leading-none">
                          {sale.customerName}
                        </p>
                      </td>
                      <td className="px-3 align-middle text-center">
                        <span className="font-mono text-[11px] tracking-[0.04em] font-semibold text-blue-primary/60 block">
                          {totalItems}
                        </span>
                        <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/25 block leading-none mt-0.5">
                          {sale.items.length} line{sale.items.length !== 1 && "s"}
                        </span>
                      </td>
                      <td className="px-3 align-middle text-right">
                        <span className="font-mono text-[12px] tracking-[0.03em] font-semibold text-blue-primary leading-none block">
                          {formatCurrency(sale.total)}
                        </span>
                        {hasDiscount && (
                          <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/25 block mt-0.5 leading-none">
                            -{formatCurrency(sale.discount)} disc
                          </span>
                        )}
                      </td>
                      <td className="px-3 align-middle text-center">
                        <span className="inline-block font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-1 leading-none bg-blue-primary/5 text-blue-primary/50">
                          {PAYMENT_METHOD_CONFIG[sale.paymentMethod].label}
                        </span>
                      </td>
                      <td className="px-3 align-middle">
                        <div className="flex justify-center">
                          <span
                            className={`font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-1 leading-none ${statusCfg.color} ${statusCfg.bg}`}
                          >
                            {statusCfg.label}
                          </span>
                        </div>
                      </td>
                      <td className="w-12 px-3 align-middle text-center relative">
                        <button
                          onClick={() =>
                            setActionMenuId(
                              actionMenuId === sale.id ? null : sale.id
                            )
                          }
                          className="p-1 text-blue-primary/30 hover:text-blue-primary transition-colors"
                        >
                          <MoreHorizontal size={14} strokeWidth={1.5} />
                        </button>
                        {actionMenuId === sale.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActionMenuId(null)}
                            />
                            <div className="absolute right-3 top-full z-20 w-40 bg-cream-primary border border-blue-primary/10 shadow-sm py-1">
                              <Link
                                href={`/sales/history/${sale.id}`}
                                onClick={() => setActionMenuId(null)}
                                className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/60 hover:bg-blue-primary/5 hover:text-blue-primary transition-colors"
                              >
                                <Eye size={12} strokeWidth={1.5} />
                                View Details
                              </Link>
                              {sale.status !== "voided" && (
                                <>
                                  <div className="h-px bg-blue-primary/8 mx-2 my-1" />
                                  <button
                                    onClick={() => handleVoid(sale.id)}
                                    className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-[0.1em] uppercase text-error/60 hover:bg-error/5 hover:text-error transition-colors"
                                  >
                                    <Ban size={12} strokeWidth={1.5} />
                                    Void Sale
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
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setCurrentPage(1);
              }}
              className="h-7 px-2 bg-transparent border border-blue-primary/10 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/50 focus:outline-none cursor-pointer appearance-none"
            >
              {PAGE_SIZES.map((rowCount) => (
                <option key={rowCount} value={rowCount}>
                  {rowCount} rows
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                const previousPage = visiblePages[position - 1];
                const showEllipsis = previousPage != null && pageNum - previousPage > 1;
                return (
                  <span key={pageNum} className="flex items-center">
                    {showEllipsis && (
                      <span className="w-7 h-7 flex items-center justify-center font-mono text-[9px] text-blue-primary/20">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => setCurrentPage(pageNum)}
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
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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
          [INV.SALES.END]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  );
}
