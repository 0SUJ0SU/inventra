// src/app/(app)/warranty/claims/page.tsx
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
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
  ShieldCheck,
  Clock,
  Package,
  CircleDot,
  CalendarDays,
  User,
  Truck,
  Barcode,
  ArrowRight,
  Send,
  CheckCircle2,
  XCircle,
  Wrench,
  RefreshCw,
  Plus,
  Download,
} from "lucide-react";
import {
  WARRANTY_CLAIMS,
  CLAIM_STATUS_CONFIG,
  CLAIM_TYPE_CONFIG,
  CLAIM_STATUS_TRANSITIONS,
  type WarrantyClaim,
  type WarrantyClaimNote,
  type ClaimType,
  type ClaimStatus,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils/format";
import Link from "next/link";

// ————————————————————————————————————————————————
// TYPES
// ————————————————————————————————————————————————

type SortKey =
  | "claimNumber"
  | "serialNumber"
  | "productName"
  | "claimType"
  | "status"
  | "claimDate"
  | "customerSupplier";
type SortDir = "asc" | "desc";

type StatusFilter = "all" | ClaimStatus;
type TypeFilter = "all" | ClaimType;

// ————————————————————————————————————————————————
// CONSTANTS
// ————————————————————————————————————————————————

const PAGE_SIZES = [10, 20, 50] as const;
const ease = [0.16, 1, 0.3, 1] as const;

const CLAIM_TYPE_SHORT: Record<ClaimType, string> = {
  customer_to_store: "Customer \u2192 Store",
  store_to_supplier: "Store \u2192 Supplier",
  supplier_to_store: "Supplier \u2192 Store",
};

const STATUS_WORKFLOW_ICONS: Record<ClaimStatus, React.ElementType> = {
  pending: Clock,
  in_review: Eye,
  in_repair: Wrench,
  repaired: CheckCircle2,
  replaced: RefreshCw,
  rejected: XCircle,
  closed: ShieldCheck,
};

// ————————————————————————————————————————————————
// HELPERS
// ————————————————————————————————————————————————

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "\u2014";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
}

function getCustomerSupplierLabel(claim: WarrantyClaim): string {
  if (claim.claimType === "customer_to_store") return claim.customerName ?? "\u2014";
  if (claim.claimType === "store_to_supplier") return claim.supplierName ?? "\u2014";
  if (claim.claimType === "supplier_to_store") return claim.supplierName ?? "\u2014";
  return "\u2014";
}

function getUniqueCustomers(claims: WarrantyClaim[]): string[] {
  const set = new Set<string>();
  claims.forEach((c) => { if (c.customerName) set.add(c.customerName); });
  return Array.from(set).sort();
}

function getUniqueSuppliers(claims: WarrantyClaim[]): string[] {
  const set = new Set<string>();
  claims.forEach((c) => { if (c.supplierName) set.add(c.supplierName); });
  return Array.from(set).sort();
}

// ————————————————————————————————————————————————
// PAGE
// ————————————————————————————————————————————————

export default function WarrantyClaimsPage() {
  // — Filter state —
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // — Sort state —
  const [sortKey, setSortKey] = useState<SortKey>("claimDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // — Pagination —
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // — Selection —
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // — Action menu —
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // — Detail modal —
  const [detailClaim, setDetailClaim] = useState<WarrantyClaim | null>(null);

  // — Note input —
  const [newNote, setNewNote] = useState("");

  // — Local mutable state (demo) —
  const [claims, setClaims] = useState<WarrantyClaim[]>(() => [...WARRANTY_CLAIMS]);

  // — Loading state (cosmetic skeleton on mount) —
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const uniqueCustomers = useMemo(() => getUniqueCustomers(claims), [claims]);
  const uniqueSuppliers = useMemo(() => getUniqueSuppliers(claims), [claims]);

  // ——— DERIVED DATA ———

  const filtered = useMemo(() => {
    let data = [...claims];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      data = data.filter(
        (c) =>
          c.claimNumber.toLowerCase().includes(q) ||
          c.serialNumber.toLowerCase().includes(q) ||
          c.productName.toLowerCase().includes(q) ||
          (c.customerName && c.customerName.toLowerCase().includes(q)) ||
          (c.supplierName && c.supplierName.toLowerCase().includes(q))
      );
    }

    // Status
    if (statusFilter !== "all") {
      data = data.filter((c) => c.status === statusFilter);
    }

    // Claim type
    if (typeFilter !== "all") {
      data = data.filter((c) => c.claimType === typeFilter);
    }

    // Customer
    if (customerFilter !== "all") {
      data = data.filter((c) => c.customerName === customerFilter);
    }

    // Supplier
    if (supplierFilter !== "all") {
      data = data.filter((c) => c.supplierName === supplierFilter);
    }

    // Date range — ISO date strings compare lexicographically
    if (dateFrom) {
      data = data.filter((c) => c.claimDate >= dateFrom);
    }
    if (dateTo) {
      data = data.filter((c) => c.claimDate <= dateTo);
    }

    return data;
  }, [search, statusFilter, typeFilter, customerFilter, supplierFilter, dateFrom, dateTo, claims]);

  const sorted = useMemo(() => {
    const data = [...filtered];
    data.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "claimNumber":
          cmp = a.claimNumber.localeCompare(b.claimNumber);
          break;
        case "serialNumber":
          cmp = a.serialNumber.localeCompare(b.serialNumber);
          break;
        case "productName":
          cmp = a.productName.localeCompare(b.productName);
          break;
        case "claimType":
          cmp = a.claimType.localeCompare(b.claimType);
          break;
        case "status": {
          const order: Record<ClaimStatus, number> = {
            pending: 0, in_review: 1, in_repair: 2, repaired: 3, replaced: 4, rejected: 5, closed: 6,
          };
          cmp = order[a.status] - order[b.status];
          break;
        }
        case "claimDate":
          cmp = a.claimDate.localeCompare(b.claimDate);
          break;
        case "customerSupplier":
          cmp = getCustomerSupplierLabel(a).localeCompare(getCustomerSupplierLabel(b));
          break;
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

  // Active filter count — date range counts as 1 if either field is set
  const activeFilterCount = [
    statusFilter !== "all",
    typeFilter !== "all",
    customerFilter !== "all",
    supplierFilter !== "all",
    !!(dateFrom || dateTo),
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setCustomerFilter("all");
    setSupplierFilter("all");
    setDateFrom("");
    setDateTo("");
    resetPage();
  };

  // — Status update —
  const handleStatusUpdate = (claimId: string, newStatus: ClaimStatus) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id !== claimId) return c;
        const now = new Date().toISOString().split("T")[0];
        return {
          ...c,
          status: newStatus,
          updatedAt: now,
          statusHistory: [
            ...c.statusHistory,
            { from: c.status, to: newStatus, date: now, note: `Status changed to ${CLAIM_STATUS_CONFIG[newStatus].label}` },
          ],
        };
      })
    );
    setDetailClaim((prev) => {
      if (!prev || prev.id !== claimId) return prev;
      const now = new Date().toISOString().split("T")[0];
      return {
        ...prev,
        status: newStatus,
        updatedAt: now,
        statusHistory: [
          ...prev.statusHistory,
          { from: prev.status, to: newStatus, date: now, note: `Status changed to ${CLAIM_STATUS_CONFIG[newStatus].label}` },
        ],
      };
    });
    setActionMenuId(null);
  };

  // — Add note —
  const handleAddNote = (claimId: string) => {
    if (!newNote.trim()) return;
    const now = new Date().toISOString().split("T")[0];
    const noteObj: WarrantyClaimNote = {
      id: `wcn-${Date.now()}`,
      warrantyClaimId: claimId,
      note: newNote.trim(),
      createdBy: "Admin",
      createdAt: now,
    };
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId ? { ...c, notes: [...c.notes, noteObj], updatedAt: now } : c
      )
    );
    setDetailClaim((prev) => {
      if (!prev || prev.id !== claimId) return prev;
      return { ...prev, notes: [...prev.notes, noteObj], updatedAt: now };
    });
    setNewNote("");
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
    if (paginated.length > 0 && paginated.every((c) => selectedIds.has(c.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((c) => c.id)));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  const allOnPageSelected =
    paginated.length > 0 && paginated.every((c) => selectedIds.has(c.id));

  // — Bulk close (only non-closed claims affected) —
  const handleBulkClose = () => {
    const now = new Date().toISOString().split("T")[0];
    setClaims((prev) =>
      prev.map((c) => {
        if (!selectedIds.has(c.id) || c.status === "closed") return c;
        return {
          ...c,
          status: "closed" as ClaimStatus,
          updatedAt: now,
          statusHistory: [
            ...c.statusHistory,
            { from: c.status, to: "closed" as ClaimStatus, date: now, note: "Bulk closed by admin" },
          ],
        };
      })
    );
    clearSelection();
  };

  // — Export helpers —
  const buildExportRows = (rows: WarrantyClaim[]) =>
    rows.map((claim) => ({
      "Claim #": claim.claimNumber,
      "Serial #": claim.serialNumber,
      Product: claim.productName,
      Type: CLAIM_TYPE_CONFIG[claim.claimType].label,
      Status: CLAIM_STATUS_CONFIG[claim.status].label,
      "Claim Date": claim.claimDate,
      "Customer / Supplier": getCustomerSupplierLabel(claim),
      "Issue Description": claim.issueDescription,
      "Repair Cost": claim.repairCost ?? "",
      "Replacement Serial": claim.replacementSerialNumber ?? "",
      Resolution: claim.resolution ?? "",
    }));

  // Export all filtered+sorted claims
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(buildExportRows(sorted));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Warranty Claims");
    XLSX.writeFile(wb, `warranty-claims-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  // Export only selected claims
  const handleExportSelected = () => {
    const rows = sorted.filter((c) => selectedIds.has(c.id));
    const ws = XLSX.utils.json_to_sheet(buildExportRows(rows));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Warranty Claims");
    XLSX.writeFile(wb, `warranty-claims-selected-${new Date().toISOString().split("T")[0]}.xlsx`);
    clearSelection();
  };

  // ——— SORT ICON ———

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col)
      return <ChevronsUpDown size={12} strokeWidth={1.5} className="text-blue-primary/20" />;
    return sortDir === "asc" ? (
      <ChevronUp size={12} strokeWidth={2} className="text-blue-primary" />
    ) : (
      <ChevronDown size={12} strokeWidth={2} className="text-blue-primary" />
    );
  };

  // ——— STATUS SUMMARY ———

  const statusSummary = useMemo(() => {
    const counts: Record<string, number> = {
      pending: 0, in_review: 0, in_repair: 0, repaired: 0, replaced: 0, rejected: 0, closed: 0,
    };
    claims.forEach((c) => { counts[c.status]++; });
    return counts;
  }, [claims]);

  const openClaimsCount = claims.filter((c) => c.status !== "closed").length;

  // ——— RENDER ———

  return (
    <div className="space-y-6">
      {/* ━━━ PAGE HEADER ━━━ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <motion.h1
            className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-blue-primary leading-none"
            initial={{ x: -30 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            Warranty Claims
          </motion.h1>
          <motion.p
            className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
          >
            {claims.length} total claim{claims.length !== 1 && "s"} &middot; {openClaimsCount} open
          </motion.p>
        </div>
        <motion.div
          className="flex items-center gap-3"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
        >
          <span className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20 hidden sm:block">
            [INV.WTY]
          </span>
          {/* Export all filtered */}
          <button
            onClick={handleExport}
            className="h-9 px-4 border border-blue-primary/15 text-blue-primary/50 font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:border-blue-primary/30 hover:text-blue-primary transition-colors"
          >
            <Download size={13} strokeWidth={1.5} />
            Export
          </button>
          <Link
            href="/warranty/claims/new"
            className="h-9 px-4 bg-blue-primary text-cream-primary font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:bg-blue-dark transition-colors"
          >
            <Plus size={13} strokeWidth={1.5} />
            New Claim
          </Link>
        </motion.div>
      </div>

      {/* Blueprint divider */}
      <div className="h-px bg-blue-primary/10" />

      {/* ━━━ STATUS SUMMARY CARDS ━━━ */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-px bg-blue-primary/10 border border-blue-primary/10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease }}
      >
        {(Object.entries(CLAIM_STATUS_CONFIG) as [ClaimStatus, typeof CLAIM_STATUS_CONFIG[ClaimStatus]][]).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => {
              setStatusFilter(statusFilter === key ? "all" : key);
              resetPage();
            }}
            className={`bg-cream-light px-2 py-3 text-center transition-colors hover:bg-blue-primary/[0.03] ${
              statusFilter === key ? "ring-1 ring-inset ring-blue-primary/30" : ""
            }`}
          >
            <span className={`font-mono text-[16px] lg:text-[20px] font-semibold leading-none block ${cfg.color}`}>
              {statusSummary[key]}
            </span>
            <span className="font-mono text-[7px] lg:text-[8px] tracking-[0.12em] uppercase text-blue-primary/40 mt-1.5 block">
              {cfg.label}
            </span>
          </button>
        ))}
      </motion.div>

      {/* ━━━ FILTERS ━━━ */}
      <motion.div
        className="space-y-2"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease }}
      >
        {/* Row 1: Search + dropdowns */}
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={14}
              strokeWidth={1.5}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-primary/30"
            />
            <input
              type="text"
              placeholder="SEARCH CLAIM #, SERIAL, PRODUCT..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              className="w-full h-9 pl-9 pr-3 bg-cream-light border border-blue-primary/10 font-mono text-[11px] tracking-[0.08em] uppercase text-blue-primary placeholder:text-blue-primary/25 focus:outline-none focus:border-blue-primary/30 transition-colors"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); resetPage(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-blue-primary/30 hover:text-blue-primary transition-colors"
              >
                <X size={12} strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Dropdown filters */}
          <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2">
            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); resetPage(); }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[120px]"
            >
              <option value="all">All Status</option>
              {(Object.entries(CLAIM_STATUS_CONFIG) as [ClaimStatus, typeof CLAIM_STATUS_CONFIG[ClaimStatus]][]).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>

            {/* Claim Type */}
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value as TypeFilter); resetPage(); }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[150px]"
            >
              <option value="all">All Types</option>
              <option value="customer_to_store">Customer to Store</option>
              <option value="store_to_supplier">Store to Supplier</option>
              <option value="supplier_to_store">Supplier to Store</option>
            </select>

            {/* Customer */}
            <select
              value={customerFilter}
              onChange={(e) => { setCustomerFilter(e.target.value); resetPage(); }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[130px]"
            >
              <option value="all">All Customers</option>
              {uniqueCustomers.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            {/* Supplier */}
            <select
              value={supplierFilter}
              onChange={(e) => { setSupplierFilter(e.target.value); resetPage(); }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[130px]"
            >
              <option value="all">All Suppliers</option>
              {uniqueSuppliers.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            {/* Clear filters */}
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

        {/* Row 2: Date range filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/30 shrink-0">
            Date range
          </span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); resetPage(); }}
            className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.05em] text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer w-36"
          />
          <span className="font-mono text-[9px] text-blue-primary/20">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); resetPage(); }}
            className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.05em] text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer w-36"
          />
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(""); setDateTo(""); resetPage(); }}
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

        {/* Row 3: Bulk actions bar — shown when items are selected */}
        {selectedIds.size > 0 && (
          <motion.div
            className="bg-blue-primary text-cream-primary"
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <div className="px-4 h-9 flex items-center justify-center border-b border-cream-primary/10">
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase">
                {selectedIds.size} claim{selectedIds.size !== 1 && "s"} selected
              </span>
            </div>
            <div className="grid grid-cols-3 divide-x divide-cream-primary/10">
              <button
                onClick={handleBulkClose}
                className="font-mono text-[9px] tracking-[0.1em] uppercase text-cream-primary/70 hover:text-cream-primary hover:bg-cream-primary/5 flex items-center justify-center gap-1.5 h-9 transition-colors"
              >
                <CheckCircle2 size={12} strokeWidth={1.5} />
                Close Claims
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

      {/* ━━━ TABLE ━━━ */}
      <motion.div
        className="border border-blue-primary/10 bg-cream-light overflow-hidden"
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease }}
      >
        {/* Table header label */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
            Claims Registry
          </p>
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/001</span>
        </div>

        {/* Scrollable table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-blue-primary/10 h-11">
                {/* Checkbox column */}
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
                  <button onClick={() => handleSort("claimNumber")} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors">
                    Claim # <SortIcon col="claimNumber" />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button onClick={() => handleSort("serialNumber")} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors">
                    Serial # <SortIcon col="serialNumber" />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button onClick={() => handleSort("productName")} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors">
                    Product <SortIcon col="productName" />
                  </button>
                </th>
                <th className="text-center px-3 align-middle">
                  <button onClick={() => handleSort("claimType")} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto">
                    Type <SortIcon col="claimType" />
                  </button>
                </th>
                <th className="text-center px-3 align-middle">
                  <button onClick={() => handleSort("status")} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto">
                    Status <SortIcon col="status" />
                  </button>
                </th>
                <th className="text-center px-3 align-middle">
                  <button onClick={() => handleSort("claimDate")} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto">
                    Date <SortIcon col="claimDate" />
                  </button>
                </th>
                <th className="text-right pl-3 pr-8 align-middle">
                  <button onClick={() => handleSort("customerSupplier")} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors ml-auto">
                    Customer / Supplier <SortIcon col="customerSupplier" />
                  </button>
                </th>
                <th className="w-12 px-3 align-middle" />
              </tr>
            </thead>
            <tbody>
              {/* ── LOADING SKELETON ── */}
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-blue-primary/6 h-14">
                    <td className="w-12 px-4 align-middle">
                      <div className="w-3.5 h-3.5 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-28 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-24 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-36 bg-blue-primary/8 animate-pulse" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-5 w-24 bg-blue-primary/8 animate-pulse mx-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-5 w-16 bg-blue-primary/8 animate-pulse mx-auto" />
                    </td>
                    <td className="px-3 align-middle">
                      <div className="h-2.5 w-20 bg-blue-primary/8 animate-pulse mx-auto" />
                    </td>
                    <td className="pl-3 pr-8 align-middle">
                      <div className="h-2.5 w-20 bg-blue-primary/8 animate-pulse ml-auto" />
                    </td>
                    <td className="w-12 px-3 align-middle" />
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                /* ── EMPTY STATE ── */
                <tr>
                  <td colSpan={9} className="text-center py-16">
                    <ShieldCheck size={28} strokeWidth={1} className="text-blue-primary/15 mx-auto mb-3" />
                    <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary/30">
                      {search || activeFilterCount > 0 ? "No claims found" : "No warranty claims yet"}
                    </p>
                    <p className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/20 mt-1">
                      {search || activeFilterCount > 0
                        ? "Try adjusting your filters or date range"
                        : "Claims will appear when warranty issues are reported"}
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
                /* ── DATA ROWS ── */
                paginated.map((claim) => {
                  const isSelected = selectedIds.has(claim.id);
                  const sCfg = CLAIM_STATUS_CONFIG[claim.status];
                  const tCfg = CLAIM_TYPE_SHORT[claim.claimType];

                  return (
                    <tr
                      key={claim.id}
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
                          onChange={() => toggleSelect(claim.id)}
                          className="w-3.5 h-3.5 accent-blue-primary cursor-pointer block"
                        />
                      </td>
                      {/* Claim # */}
                      <td className="px-3 align-middle">
                        <button
                          onClick={() => setDetailClaim(claim)}
                          className="font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary hover:underline underline-offset-2 decoration-blue-primary/30 transition-colors text-left"
                        >
                          {claim.claimNumber}
                        </button>
                      </td>
                      {/* Serial # */}
                      <td className="px-3 align-middle">
                        <span className="font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary/50">
                          {claim.serialNumber}
                        </span>
                      </td>
                      {/* Product */}
                      <td className="px-3 align-middle">
                        <p className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary truncate max-w-[180px] leading-none">
                          {claim.productName}
                        </p>
                      </td>
                      {/* Type */}
                      <td className="px-3 align-middle text-center">
                        <span className="inline-block font-mono text-[8px] tracking-[0.08em] uppercase px-2 py-1 leading-none text-blue-primary/50 bg-blue-primary/5">
                          {tCfg}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-3 align-middle">
                        <div className="flex justify-center">
                          <span className={`font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-1 leading-none ${sCfg.color} ${sCfg.bg}`}>
                            {sCfg.label}
                          </span>
                        </div>
                      </td>
                      {/* Date */}
                      <td className="px-3 align-middle">
                        <div className="flex justify-center">
                          <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50">
                            {formatDate(claim.claimDate)}
                          </span>
                        </div>
                      </td>
                      {/* Customer / Supplier */}
                      <td className="pl-3 pr-8 align-middle text-right">
                        <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50">
                          {getCustomerSupplierLabel(claim)}
                        </span>
                      </td>
                      {/* Actions menu */}
                      <td className="w-12 px-3 align-middle text-center relative">
                        <button
                          onClick={() => setActionMenuId(actionMenuId === claim.id ? null : claim.id)}
                          className="p-1 text-blue-primary/30 hover:text-blue-primary transition-colors"
                        >
                          <MoreHorizontal size={14} strokeWidth={1.5} />
                        </button>
                        {actionMenuId === claim.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActionMenuId(null)} />
                            <div className="absolute right-3 top-full z-20 w-44 bg-cream-primary border border-blue-primary/10 shadow-sm py-1">
                              <button
                                onClick={() => { setActionMenuId(null); setDetailClaim(claim); }}
                                className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/60 hover:bg-blue-primary/5 hover:text-blue-primary transition-colors"
                              >
                                <Eye size={12} strokeWidth={1.5} /> View Details
                              </button>
                              {CLAIM_STATUS_TRANSITIONS[claim.status].length > 0 && (
                                <>
                                  <div className="h-px bg-blue-primary/8 mx-2 my-1" />
                                  <p className="px-3 pt-1.5 pb-1 font-mono text-[7px] tracking-[0.15em] uppercase text-blue-primary/30">
                                    Update Status
                                  </p>
                                  {CLAIM_STATUS_TRANSITIONS[claim.status].map((nextStatus) => {
                                    const nCfg = CLAIM_STATUS_CONFIG[nextStatus];
                                    const Icon = STATUS_WORKFLOW_ICONS[nextStatus];
                                    return (
                                      <button
                                        key={nextStatus}
                                        onClick={() => handleStatusUpdate(claim.id, nextStatus)}
                                        className="w-full flex items-center gap-2 px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] uppercase transition-colors text-blue-primary/50 hover:bg-blue-primary/5 hover:text-blue-primary"
                                      >
                                        <Icon size={11} strokeWidth={1.5} />
                                        {nCfg.label}
                                      </button>
                                    );
                                  })}
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

        {/* ━━━ PAGINATION ━━━ */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-blue-primary/8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
              {sorted.length > 0 ? `${(safePage - 1) * pageSize + 1}` : "0"}&ndash;{Math.min(safePage * pageSize, sorted.length)} of {sorted.length}
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
                      <span className="w-7 h-7 flex items-center justify-center font-mono text-[9px] text-blue-primary/20">...</span>
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
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">[INV.WTY.END]</span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>

      {/* ━━━ DETAIL MODAL ━━━ */}
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {detailClaim && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-blue-primary/20 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setDetailClaim(null); setNewNote(""); }}
              />
              {/* Panel */}
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-full max-w-2xl max-h-[88vh] bg-cream-primary border border-blue-primary/10 shadow-lg flex flex-col"
                  initial={{ y: 30, scale: 0.97 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: 20, scale: 0.97 }}
                  transition={{ duration: 0.3, ease }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <ShieldCheck size={16} strokeWidth={1.5} className="text-blue-primary/40 shrink-0" />
                      <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-blue-primary truncate">
                        {detailClaim.claimNumber}
                      </p>
                      <span className={`inline-block font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-0.5 shrink-0 ${CLAIM_STATUS_CONFIG[detailClaim.status].color} ${CLAIM_STATUS_CONFIG[detailClaim.status].bg}`}>
                        {CLAIM_STATUS_CONFIG[detailClaim.status].label}
                      </span>
                    </div>
                    <button
                      onClick={() => { setDetailClaim(null); setNewNote(""); }}
                      className="w-6 h-6 flex items-center justify-center text-blue-primary/30 hover:text-blue-primary transition-colors shrink-0"
                    >
                      <X size={14} strokeWidth={2} />
                    </button>
                  </div>

                  {/* Modal body */}
                  <div className="p-5 space-y-5 overflow-y-auto flex-1">

                    {/* Status + Type + Date row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-blue-primary/10 border border-blue-primary/10">
                      <div className="bg-cream-light px-4 py-3 text-center">
                        <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/40 block mb-1.5">Claim Type</span>
                        <span className="inline-block font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/70 px-2 py-1 bg-blue-primary/5">
                          {CLAIM_TYPE_SHORT[detailClaim.claimType]}
                        </span>
                      </div>
                      <div className="bg-cream-light px-4 py-3 text-center">
                        <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/40 block mb-1.5">Claim Date</span>
                        <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/70">
                          {formatDate(detailClaim.claimDate)}
                        </span>
                      </div>
                      <div className="bg-cream-light px-4 py-3 text-center">
                        <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/40 block mb-1.5">
                          {detailClaim.repairCost !== null ? "Repair Cost" : "Cost"}
                        </span>
                        <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/70">
                          {detailClaim.repairCost !== null ? formatCurrency(detailClaim.repairCost) : "\u2014"}
                        </span>
                      </div>
                    </div>

                    {/* Serial + Contact info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 pb-1 border-b border-blue-primary/8">
                          Serial Info
                        </p>
                        <DetailRow icon={Barcode} label="Serial Number" value={detailClaim.serialNumber} />
                        <DetailRow icon={Package} label="Product" value={detailClaim.productName} />
                        {detailClaim.replacementSerialNumber && (
                          <DetailRow icon={RefreshCw} label="Replacement" value={detailClaim.replacementSerialNumber} />
                        )}
                      </div>
                      <div className="space-y-3">
                        <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 pb-1 border-b border-blue-primary/8">
                          Contact
                        </p>
                        {detailClaim.customerName && (
                          <DetailRow icon={User} label="Customer" value={detailClaim.customerName} />
                        )}
                        {detailClaim.supplierName && (
                          <DetailRow icon={Truck} label="Supplier" value={detailClaim.supplierName} />
                        )}
                        <DetailRow icon={CalendarDays} label="Last Updated" value={formatDate(detailClaim.updatedAt)} />
                      </div>
                    </div>

                    {/* Issue Description */}
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 pb-1 border-b border-blue-primary/8 mb-2">
                        Issue Description
                      </p>
                      <div className="p-3 bg-cream-light border border-blue-primary/8">
                        <p className="font-mono text-[10px] tracking-[0.03em] text-blue-primary/60 leading-relaxed">
                          {detailClaim.issueDescription}
                        </p>
                      </div>
                    </div>

                    {/* Resolution */}
                    {detailClaim.resolution && (
                      <div>
                        <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 pb-1 border-b border-blue-primary/8 mb-2">
                          Resolution
                        </p>
                        <div className="p-3 bg-emerald-700/5 border border-emerald-700/10">
                          <p className="font-mono text-[10px] tracking-[0.03em] text-emerald-700/70 leading-relaxed">
                            {detailClaim.resolution}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Workflow Actions */}
                    {CLAIM_STATUS_TRANSITIONS[detailClaim.status].length > 0 && (
                      <div>
                        <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 pb-1 border-b border-blue-primary/8 mb-2">
                          Workflow Actions
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {CLAIM_STATUS_TRANSITIONS[detailClaim.status].map((nextStatus) => {
                            const nCfg = CLAIM_STATUS_CONFIG[nextStatus];
                            const Icon = STATUS_WORKFLOW_ICONS[nextStatus];
                            return (
                              <button
                                key={nextStatus}
                                onClick={() => handleStatusUpdate(detailClaim.id, nextStatus)}
                                className={`h-8 px-3 border border-blue-primary/10 font-mono text-[9px] tracking-[0.1em] uppercase flex items-center gap-1.5 hover:border-blue-primary/30 transition-colors ${nCfg.color}`}
                              >
                                <Icon size={12} strokeWidth={1.5} />
                                {nCfg.label}
                                <ArrowRight size={10} strokeWidth={1.5} className="text-blue-primary/20" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Status History Timeline */}
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 pb-1 border-b border-blue-primary/8 mb-3">
                        Status History
                      </p>
                      <div className="space-y-0">
                        {detailClaim.statusHistory.map((entry, i) => {
                          const Icon = STATUS_WORKFLOW_ICONS[entry.to] ?? CircleDot;
                          const isLast = i === detailClaim.statusHistory.length - 1;
                          const cfg = CLAIM_STATUS_CONFIG[entry.to];
                          return (
                            <div key={i} className="flex gap-3">
                              <div className="flex flex-col items-center shrink-0">
                                <div className={`w-6 h-6 flex items-center justify-center border ${
                                  isLast ? "border-blue-primary/30 bg-blue-primary/5" : "border-blue-primary/10 bg-cream-light"
                                }`}>
                                  <Icon size={11} strokeWidth={1.5} className={isLast ? "text-blue-primary/60" : "text-blue-primary/25"} />
                                </div>
                                {!isLast && <div className="w-px flex-1 min-h-[16px] bg-blue-primary/10" />}
                              </div>
                              <div className="pb-3 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`font-mono text-[9px] tracking-[0.08em] uppercase px-1.5 py-0.5 leading-none ${cfg.color} ${cfg.bg}`}>
                                    {cfg.label}
                                  </span>
                                  <span className="font-mono text-[8px] tracking-[0.06em] text-blue-primary/25 leading-none">
                                    {formatDateShort(entry.date)}
                                  </span>
                                </div>
                                <p className="font-mono text-[9px] tracking-[0.02em] text-blue-primary/40 mt-1 leading-relaxed">
                                  {entry.note}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Notes / Communication Log */}
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 pb-1 border-b border-blue-primary/8 mb-3">
                        Notes ({detailClaim.notes.length})
                      </p>
                      {detailClaim.notes.length > 0 ? (
                        <div className="space-y-2 mb-3">
                          {detailClaim.notes.map((note) => (
                            <div key={note.id} className="p-3 bg-cream-light border border-blue-primary/8">
                              <p className="font-mono text-[10px] tracking-[0.03em] text-blue-primary/60 leading-relaxed">
                                {note.note}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/30">
                                  {note.createdBy}
                                </span>
                                <span className="font-mono text-[8px] tracking-[0.06em] text-blue-primary/20">
                                  {formatDateShort(note.createdAt)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/20 mb-3">
                          No notes yet
                        </p>
                      )}
                      {detailClaim.status !== "closed" && (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleAddNote(detailClaim.id); }}
                            placeholder="ADD A NOTE..."
                            className="flex-1 h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary placeholder:text-blue-primary/20 focus:outline-none focus:border-blue-primary/30 transition-colors"
                          />
                          <button
                            onClick={() => handleAddNote(detailClaim.id)}
                            disabled={!newNote.trim()}
                            className="h-9 px-3 bg-blue-primary text-cream-primary font-mono text-[9px] tracking-[0.1em] uppercase flex items-center gap-1.5 hover:bg-blue-dark transition-colors disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <Send size={11} strokeWidth={1.5} />
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modal footer */}
                  <div className="flex items-center justify-end px-5 py-3 border-t border-blue-primary/8 shrink-0">
                    <button
                      onClick={() => { setDetailClaim(null); setNewNote(""); }}
                      className="h-9 px-5 border border-blue-primary/15 font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/50 hover:text-blue-primary hover:border-blue-primary/30 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

// ————————————————————————————————————————————————
// DETAIL ROW COMPONENT
// ————————————————————————————————————————————————

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={12} strokeWidth={1.5} className="text-blue-primary/20 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-blue-primary/30 block leading-none">
          {label}
        </span>
        <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/70 block mt-0.5 leading-snug truncate">
          {value}
        </span>
      </div>
    </div>
  );
}