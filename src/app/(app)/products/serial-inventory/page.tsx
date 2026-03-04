// src/app/(app)/products/serial-inventory/page.tsx
"use client";

import { useState, useMemo, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  AlertTriangle,
  Wrench,
  Trash2,
  Barcode,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ShieldOff,
  Clock,
  Package,
  CircleDot,
  CalendarDays,
  User,
  Truck,
  DollarSign,
  Tag,
} from "lucide-react";
import {
  SERIALIZED_ITEMS,
  PRODUCTS,
  type SerializedItem,
  type SerialStatus,
  type SerialCondition,
  type WarrantyStatus,
  getWarrantyStatus,
  getWarrantyDaysRemaining,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils/format";

// ————————————————————————————————————————————————
// TYPES
// ————————————————————————————————————————————————

type SortKey =
  | "serialNumber"
  | "productName"
  | "status"
  | "condition"
  | "purchaseDate"
  | "soldDate"
  | "customer"
  | "warrantyStatus";
type SortDir = "asc" | "desc";

type StatusFilter = "all" | SerialStatus;
type ConditionFilter = "all" | SerialCondition;
type WarrantyFilter = "all" | WarrantyStatus;

// ————————————————————————————————————————————————
// CONSTANTS
// ————————————————————————————————————————————————

const PAGE_SIZES = [10, 20, 50] as const;
const ease = [0.16, 1, 0.3, 1] as const;

const STATUS_CONFIG: Record<SerialStatus, { label: string; color: string; bg: string }> = {
  in_stock: { label: "In Stock", color: "text-emerald-700", bg: "bg-emerald-700/10" },
  sold: { label: "Sold", color: "text-blue-primary", bg: "bg-blue-primary/8" },
  reserved: { label: "Reserved", color: "text-amber-600", bg: "bg-amber-600/10" },
  defective: { label: "Defective", color: "text-error", bg: "bg-error/10" },
  in_repair: { label: "In Repair", color: "text-orange-600", bg: "bg-orange-600/10" },
  scrapped: { label: "Scrapped", color: "text-blue-primary/40", bg: "bg-blue-primary/5" },
};

const CONDITION_CONFIG: Record<SerialCondition, { label: string; color: string; bg: string }> = {
  new: { label: "New", color: "text-emerald-700", bg: "bg-emerald-700/10" },
  good: { label: "Good", color: "text-blue-primary", bg: "bg-blue-primary/8" },
  damaged: { label: "Damaged", color: "text-amber-600", bg: "bg-amber-600/10" },
  defective: { label: "Defective", color: "text-error", bg: "bg-error/10" },
};

const WARRANTY_CONFIG: Record<WarrantyStatus, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  active: { label: "Active", color: "text-emerald-700", bg: "bg-emerald-700/10", Icon: ShieldCheck },
  expiring_soon: { label: "Expiring", color: "text-amber-600", bg: "bg-amber-600/10", Icon: ShieldAlert },
  expired: { label: "Expired", color: "text-error", bg: "bg-error/10", Icon: ShieldX },
  "n/a": { label: "N/A", color: "text-blue-primary/30", bg: "bg-blue-primary/5", Icon: ShieldOff },
};

const TIMELINE_ICONS: Record<string, React.ElementType> = {
  Purchased: Truck,
  Received: Package,
  Sold: DollarSign,
  Returned: Package,
  "Warranty Claim": ShieldAlert,
  "In Repair": Wrench,
  Replaced: Package,
  Scrapped: Trash2,
  Defective: AlertTriangle,
  Reserved: Clock,
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

// Get unique products that are serial-tracked
function getSerialTrackedProducts() {
  const productIds = new Set(SERIALIZED_ITEMS.map((s) => s.productId));
  return PRODUCTS.filter((p) => productIds.has(p.id));
}

// ————————————————————————————————————————————————
// SORT ICON
// ————————————————————————————————————————————————

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== col)
    return <ChevronsUpDown size={12} strokeWidth={1.5} className="text-blue-primary/20" />;
  return sortDir === "asc" ? (
    <ChevronUp size={12} strokeWidth={2} className="text-blue-primary" />
  ) : (
    <ChevronDown size={12} strokeWidth={2} className="text-blue-primary" />
  );
}

// ————————————————————————————————————————————————
// PAGE
// ————————————————————————————————————————————————

export default function SerialInventoryPage() {
  // — Mounted (portal hydration fix) —
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  // — Filter state —
  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [conditionFilter, setConditionFilter] = useState<ConditionFilter>("all");
  const [warrantyFilter, setWarrantyFilter] = useState<WarrantyFilter>("all");

  // — Sort state —
  const [sortKey, setSortKey] = useState<SortKey>("serialNumber");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // — Pagination —
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // — Selection —
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // — Action menu —
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // — Detail modal —
  const [detailItem, setDetailItem] = useState<SerializedItem | null>(null);

  // — Local mutable state (demo) —
  const [items, setItems] = useState<SerializedItem[]>(() => [...SERIALIZED_ITEMS]);

  const serialProducts = useMemo(() => getSerialTrackedProducts(), []);

  // ——— DERIVED DATA ———

  const filtered = useMemo(() => {
    let data = [...items];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      data = data.filter(
        (s) =>
          s.serialNumber.toLowerCase().includes(q) ||
          s.productName.toLowerCase().includes(q) ||
          (s.customer && s.customer.toLowerCase().includes(q))
      );
    }

    // Product
    if (productFilter !== "all") {
      data = data.filter((s) => s.productId === productFilter);
    }

    // Status
    if (statusFilter !== "all") {
      data = data.filter((s) => s.status === statusFilter);
    }

    // Condition
    if (conditionFilter !== "all") {
      data = data.filter((s) => s.condition === conditionFilter);
    }

    // Warranty
    if (warrantyFilter !== "all") {
      data = data.filter((s) => getWarrantyStatus(s) === warrantyFilter);
    }

    return data;
  }, [search, productFilter, statusFilter, conditionFilter, warrantyFilter, items]);

  const sorted = useMemo(() => {
    const data = [...filtered];
    data.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "serialNumber":
          cmp = a.serialNumber.localeCompare(b.serialNumber);
          break;
        case "productName":
          cmp = a.productName.localeCompare(b.productName);
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
        case "condition":
          cmp = a.condition.localeCompare(b.condition);
          break;
        case "purchaseDate":
          cmp = a.purchaseDate.localeCompare(b.purchaseDate);
          break;
        case "soldDate":
          cmp = (a.soldDate ?? "").localeCompare(b.soldDate ?? "");
          break;
        case "customer":
          cmp = (a.customer ?? "").localeCompare(b.customer ?? "");
          break;
        case "warrantyStatus": {
          const order: Record<WarrantyStatus, number> = { expired: 0, expiring_soon: 1, active: 2, "n/a": 3 };
          cmp = order[getWarrantyStatus(a)] - order[getWarrantyStatus(b)];
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

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (paginated.every((s) => selectedIds.has(s.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((s) => s.id)));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  // — Bulk status update —
  const handleBulkScrap = () => {
    setItems((prev) =>
      prev.map((s) =>
        selectedIds.has(s.id) ? { ...s, status: "scrapped" as SerialStatus, condition: "defective" as SerialCondition } : s
      )
    );
    clearSelection();
  };

  // — Single actions —
  const handleUpdateCondition = (id: string, condition: SerialCondition) => {
    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, condition } : s))
    );
    setActionMenuId(null);
  };

  const handleMarkScrapped = (id: string) => {
    setItems((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "scrapped" as SerialStatus, condition: "defective" as SerialCondition } : s
      )
    );
    setActionMenuId(null);
  };

  const allOnPageSelected =
    paginated.length > 0 && paginated.every((s) => selectedIds.has(s.id));

  // Active filter count
  const activeFilterCount = [
    productFilter !== "all",
    statusFilter !== "all",
    conditionFilter !== "all",
    warrantyFilter !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setProductFilter("all");
    setStatusFilter("all");
    setConditionFilter("all");
    setWarrantyFilter("all");
    resetPage();
  };

  // ——— STATUS SUMMARY ———

  const statusSummary = useMemo(() => {
    const counts: Record<string, number> = {
      in_stock: 0, sold: 0, reserved: 0, defective: 0, in_repair: 0, scrapped: 0,
    };
    items.forEach((s) => { counts[s.status]++; });
    return counts;
  }, [items]);

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
            Serial Inventory
          </motion.h1>
          <motion.p
            className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
          >
            {items.length} serialized unit{items.length !== 1 && "s"} tracked
          </motion.p>
        </div>
        <motion.div
          className="flex items-center gap-3"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
        >
          <span className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20 hidden sm:block">
            [INV.SER]
          </span>
        </motion.div>
      </div>

      {/* Blueprint divider */}
      <div className="h-px bg-blue-primary/10" />

      {/* ━━━ STATUS SUMMARY CARDS ━━━ */}
      <motion.div
        className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-blue-primary/10 border border-blue-primary/10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease }}
      >
        {(Object.entries(STATUS_CONFIG) as [SerialStatus, typeof STATUS_CONFIG[SerialStatus]][]).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => {
              setStatusFilter(statusFilter === key ? "all" : key);
              resetPage();
            }}
            className={`bg-cream-light px-3 py-3 text-center transition-colors hover:bg-blue-primary/[0.03] ${
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
        className="space-y-3"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease }}
      >
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
              placeholder="SEARCH SERIAL, PRODUCT, OR CUSTOMER..."
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

          {/* Filter pills */}
          <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2">
            {/* Product */}
            <select
              value={productFilter}
              onChange={(e) => { setProductFilter(e.target.value); resetPage(); }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[130px]"
            >
              <option value="all">All Products</option>
              {serialProducts.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); resetPage(); }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
              <option value="defective">Defective</option>
              <option value="in_repair">In Repair</option>
              <option value="scrapped">Scrapped</option>
            </select>

            {/* Condition */}
            <select
              value={conditionFilter}
              onChange={(e) => { setConditionFilter(e.target.value as ConditionFilter); resetPage(); }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[120px]"
            >
              <option value="all">All Condition</option>
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="damaged">Damaged</option>
              <option value="defective">Defective</option>
            </select>

            {/* Warranty */}
            <select
              value={warrantyFilter}
              onChange={(e) => { setWarrantyFilter(e.target.value as WarrantyFilter); resetPage(); }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[130px]"
            >
              <option value="all">All Warranty</option>
              <option value="active">Active</option>
              <option value="expiring_soon">Expiring Soon</option>
              <option value="expired">Expired</option>
              <option value="n/a">N/A</option>
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

        {/* Bulk actions bar */}
        {selectedIds.size > 0 && (
          <motion.div
            className="bg-blue-primary text-cream-primary"
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <div className="px-4 h-9 flex items-center justify-center border-b border-cream-primary/10">
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase">
                {selectedIds.size} unit{selectedIds.size !== 1 && "s"} selected
              </span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-cream-primary/10">
              <button
                onClick={handleBulkScrap}
                className="font-mono text-[9px] tracking-[0.1em] uppercase text-cream-primary/70 hover:text-cream-primary hover:bg-cream-primary/5 flex items-center justify-center gap-1.5 h-9 transition-colors"
              >
                <Trash2 size={12} strokeWidth={1.5} />
                Mark Scrapped
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
            Serial Number Registry
          </p>
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/001</span>
        </div>

        {/* Scrollable table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-blue-primary/10 h-11">
                <th className="w-12 px-4 align-middle">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 accent-blue-primary cursor-pointer block"
                  />
                </th>
                <th className="text-left px-3 align-middle">
                  <button onClick={() => handleSort("serialNumber")} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors">
                    Serial # <SortIcon col="serialNumber" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button onClick={() => handleSort("productName")} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors">
                    Product <SortIcon col="productName" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-center px-3 align-middle">
                  <button onClick={() => handleSort("status")} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto">
                    Status <SortIcon col="status" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-center px-3 align-middle">
                  <button onClick={() => handleSort("condition")} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto">
                    Condition <SortIcon col="condition" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button onClick={() => handleSort("purchaseDate")} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors">
                    Purchased <SortIcon col="purchaseDate" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button onClick={() => handleSort("customer")} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors">
                    Customer <SortIcon col="customer" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="text-center px-3 align-middle">
                  <button onClick={() => handleSort("warrantyStatus")} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto">
                    Warranty <SortIcon col="warrantyStatus" sortKey={sortKey} sortDir={sortDir} />
                  </button>
                </th>
                <th className="w-12 px-3 align-middle" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16">
                    <Barcode size={28} strokeWidth={1} className="text-blue-primary/15 mx-auto mb-3" />
                    <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary/30">
                      {search || activeFilterCount > 0 ? "No serial items found" : "No serialized items yet"}
                    </p>
                    <p className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/20 mt-1">
                      {search || activeFilterCount > 0
                        ? "Try adjusting your filters"
                        : "Serial items will appear after stock is received"}
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  const ws = getWarrantyStatus(item);
                  const wDays = getWarrantyDaysRemaining(item);
                  const sCfg = STATUS_CONFIG[item.status];
                  const cCfg = CONDITION_CONFIG[item.condition];
                  const wCfg = WARRANTY_CONFIG[ws];

                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-blue-primary/6 transition-colors duration-150 h-14 ${
                        isSelected ? "bg-blue-primary/[0.03]" : "hover:bg-blue-primary/[0.02]"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="w-12 px-4 align-middle">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(item.id)}
                          className="w-3.5 h-3.5 accent-blue-primary cursor-pointer block"
                        />
                      </td>
                      {/* Serial # */}
                      <td className="px-3 align-middle">
                        <button
                          onClick={() => setDetailItem(item)}
                          className="font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary hover:underline underline-offset-2 decoration-blue-primary/30 transition-colors text-left"
                        >
                          {item.serialNumber}
                        </button>
                      </td>
                      {/* Product */}
                      <td className="px-3 align-middle">
                        <p className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary truncate max-w-[200px] leading-none">
                          {item.productName}
                        </p>
                        <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/25 mt-1 block leading-none">
                          {formatCurrency(item.purchaseCost)} cost
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-3 align-middle text-center">
                        <span className={`inline-block font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-1 leading-none ${sCfg.color} ${sCfg.bg}`}>
                          {sCfg.label}
                        </span>
                      </td>
                      {/* Condition */}
                      <td className="px-3 align-middle text-center">
                        <span className={`inline-block font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-1 leading-none ${cCfg.color} ${cCfg.bg}`}>
                          {cCfg.label}
                        </span>
                      </td>
                      {/* Purchase date */}
                      <td className="px-3 align-middle">
                        <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50">
                          {formatDate(item.purchaseDate)}
                        </span>
                      </td>
                      {/* Customer */}
                      <td className="px-3 align-middle">
                        <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50">
                          {item.customer ?? "\u2014"}
                        </span>
                      </td>
                      {/* Warranty */}
                      <td className="px-3 align-middle text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`inline-block font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-1 leading-none ${wCfg.color} ${wCfg.bg}`}>
                            {wCfg.label}
                          </span>
                          {wDays !== null && wDays > 0 && wDays <= 30 && (
                            <span className="font-mono text-[7px] tracking-[0.08em] text-amber-600 leading-none">
                              {wDays}d
                            </span>
                          )}
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="w-12 px-3 align-middle text-center relative">
                        <button
                          onClick={() => setActionMenuId(actionMenuId === item.id ? null : item.id)}
                          className="p-1 text-blue-primary/30 hover:text-blue-primary transition-colors"
                        >
                          <MoreHorizontal size={14} strokeWidth={1.5} />
                        </button>
                        {actionMenuId === item.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActionMenuId(null)} />
                            <div className="absolute right-3 top-full z-20 w-40 bg-cream-primary border border-blue-primary/10 shadow-sm py-1">
                              <button
                                onClick={() => { setActionMenuId(null); setDetailItem(item); }}
                                className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/60 hover:bg-blue-primary/5 hover:text-blue-primary transition-colors"
                              >
                                <Eye size={12} strokeWidth={1.5} /> View Details
                              </button>
                              {item.status !== "scrapped" && (
                                <>
                                  <div className="h-px bg-blue-primary/8 mx-2 my-1" />
                                  <p className="px-3 pt-1.5 pb-1 font-mono text-[7px] tracking-[0.15em] uppercase text-blue-primary/30">
                                    Set Condition
                                  </p>
                                  {(["new", "good", "damaged", "defective"] as SerialCondition[]).map((c) => {
                                    const cc = CONDITION_CONFIG[c];
                                    const isActive = item.condition === c;
                                    return (
                                      <button
                                        key={c}
                                        onClick={() => handleUpdateCondition(item.id, c)}
                                        className={`w-full flex items-center gap-2 px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] uppercase transition-colors ${
                                          isActive
                                            ? `${cc.color} ${cc.bg}`
                                            : "text-blue-primary/50 hover:bg-blue-primary/5 hover:text-blue-primary"
                                        }`}
                                      >
                                        <CircleDot size={10} strokeWidth={isActive ? 2.5 : 1.5} />
                                        {cc.label}
                                        {isActive && (
                                          <span className="ml-auto font-mono text-[7px] tracking-[0.1em] opacity-50">current</span>
                                        )}
                                      </button>
                                    );
                                  })}
                                  <div className="h-px bg-blue-primary/8 mx-2 my-1" />
                                  <button
                                    onClick={() => handleMarkScrapped(item.id)}
                                    className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-[0.1em] uppercase text-error/60 hover:bg-error/5 hover:text-error transition-colors"
                                  >
                                    <Trash2 size={12} strokeWidth={1.5} /> Mark Scrapped
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

        {/* ━━━ PAGINATION ━━━ */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-blue-primary/8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
              {sorted.length === 0 ? "0" : `${(safePage - 1) * pageSize + 1}`}&ndash;{Math.min(safePage * pageSize, sorted.length)} of {sorted.length}
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
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">[INV.SER.END]</span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>

      {/* ━━━ DETAIL MODAL ━━━ */}
      {mounted && createPortal(
        <AnimatePresence>
          {detailItem && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-blue-primary/20 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDetailItem(null)}
              />
              {/* Panel */}
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-full max-w-2xl max-h-[85vh] bg-cream-primary border border-blue-primary/10 shadow-lg flex flex-col"
                  initial={{ y: 30, scale: 0.97 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: 20, scale: 0.97 }}
                  transition={{ duration: 0.3, ease }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
                    <div className="flex items-center gap-3 min-w-0">
                      <Barcode size={16} strokeWidth={1.5} className="text-blue-primary/40 shrink-0" />
                      <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-blue-primary truncate">
                        {detailItem.serialNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => setDetailItem(null)}
                      className="w-6 h-6 flex items-center justify-center text-blue-primary/30 hover:text-blue-primary transition-colors shrink-0"
                    >
                      <X size={14} strokeWidth={2} />
                    </button>
                  </div>

                  {/* Modal body */}
                  <div className="p-5 space-y-5 overflow-y-auto flex-1">
                    {/* Status + condition + warranty row */}
                    <div className="grid grid-cols-3 gap-px bg-blue-primary/10 border border-blue-primary/10">
                      <div className="bg-cream-light px-4 py-3 text-center">
                        <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/40 block mb-1.5">Status</span>
                        <span className={`inline-block font-mono text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 ${STATUS_CONFIG[detailItem.status].color} ${STATUS_CONFIG[detailItem.status].bg}`}>
                          {STATUS_CONFIG[detailItem.status].label}
                        </span>
                      </div>
                      <div className="bg-cream-light px-4 py-3 text-center">
                        <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/40 block mb-1.5">Condition</span>
                        <span className={`inline-block font-mono text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 ${CONDITION_CONFIG[detailItem.condition].color} ${CONDITION_CONFIG[detailItem.condition].bg}`}>
                          {CONDITION_CONFIG[detailItem.condition].label}
                        </span>
                      </div>
                      <div className="bg-cream-light px-4 py-3 text-center">
                        <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/40 block mb-1.5">Warranty</span>
                        {(() => {
                          const ws = getWarrantyStatus(detailItem);
                          const wDays = getWarrantyDaysRemaining(detailItem);
                          const wCfg = WARRANTY_CONFIG[ws];
                          return (
                            <div>
                              <span className={`inline-block font-mono text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 ${wCfg.color} ${wCfg.bg}`}>
                                {wCfg.label}
                              </span>
                              {wDays !== null && (
                                <span className={`font-mono text-[8px] tracking-[0.06em] block mt-1 ${wDays <= 30 ? "text-amber-600" : "text-blue-primary/30"}`}>
                                  {wDays > 0 ? `${wDays} days remaining` : `Expired ${Math.abs(wDays)} days ago`}
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Product + Purchase info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 pb-1 border-b border-blue-primary/8">
                          Product Info
                        </p>
                        <DetailRow icon={Package} label="Product" value={detailItem.productName} />
                        <DetailRow icon={Tag} label="Cost" value={formatCurrency(detailItem.purchaseCost)} />
                        {detailItem.soldPrice !== null && detailItem.soldPrice !== undefined && (
                          <DetailRow icon={DollarSign} label="Sold For" value={formatCurrency(detailItem.soldPrice)} />
                        )}
                      </div>
                      <div className="space-y-3">
                        <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 pb-1 border-b border-blue-primary/8">
                          Transaction Info
                        </p>
                        <DetailRow icon={Truck} label="Supplier" value={detailItem.supplier} />
                        <DetailRow icon={CalendarDays} label="Purchased" value={formatDate(detailItem.purchaseDate)} />
                        <DetailRow icon={User} label="Customer" value={detailItem.customer ?? "\u2014"} />
                        {detailItem.soldDate && (
                          <DetailRow icon={CalendarDays} label="Sold" value={formatDate(detailItem.soldDate)} />
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {detailItem.notes && (
                      <div>
                        <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 pb-1 border-b border-blue-primary/8 mb-2">
                          Notes
                        </p>
                        <div className="p-3 bg-cream-light border border-blue-primary/8">
                          <p className="font-mono text-[10px] tracking-[0.03em] text-blue-primary/60 leading-relaxed">
                            {detailItem.notes}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Timeline */}
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 pb-1 border-b border-blue-primary/8 mb-3">
                        Lifecycle Timeline
                      </p>
                      <div className="space-y-0">
                        {detailItem.timeline.map((event, i) => {
                          const TimelineIcon = TIMELINE_ICONS[event.action] ?? CircleDot;
                          const isLast = i === detailItem.timeline.length - 1;
                          return (
                            <div key={i} className="flex gap-3">
                              {/* Line + dot */}
                              <div className="flex flex-col items-center shrink-0">
                                <div className={`w-6 h-6 flex items-center justify-center border ${
                                  isLast ? "border-blue-primary/30 bg-blue-primary/5" : "border-blue-primary/10 bg-cream-light"
                                }`}>
                                  <TimelineIcon size={11} strokeWidth={1.5} className={isLast ? "text-blue-primary/60" : "text-blue-primary/25"} />
                                </div>
                                {!isLast && <div className="w-px flex-1 min-h-[16px] bg-blue-primary/10" />}
                              </div>
                              {/* Content */}
                              <div className={`pb-3 min-w-0 ${isLast ? "" : ""}`}>
                                <div className="flex items-center gap-2">
                                  <span className={`font-mono text-[10px] tracking-[0.05em] uppercase leading-none ${
                                    isLast ? "text-blue-primary" : "text-blue-primary/60"
                                  }`}>
                                    {event.action}
                                  </span>
                                  <span className="font-mono text-[8px] tracking-[0.06em] text-blue-primary/25 leading-none">
                                    {formatDateShort(event.date)}
                                  </span>
                                </div>
                                <p className="font-mono text-[9px] tracking-[0.02em] text-blue-primary/40 mt-1 leading-relaxed">
                                  {event.detail}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Modal footer */}
                  <div className="flex items-center justify-end px-5 py-3 border-t border-blue-primary/8">
                    <button
                      onClick={() => setDetailItem(null)}
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
