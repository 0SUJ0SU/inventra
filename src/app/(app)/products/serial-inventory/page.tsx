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

const SERIAL_STATUS_VALUES: SerialStatus[] = ["in_stock", "sold", "reserved", "defective", "in_repair", "scrapped"];
const SERIAL_CONDITION_VALUES: SerialCondition[] = ["new", "good", "damaged", "defective"];

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

const STATUS_FILTER_VALUES: readonly string[] = SERIAL_STATUS_VALUES;
const CONDITION_FILTER_VALUES: readonly string[] = SERIAL_CONDITION_VALUES;
const WARRANTY_FILTER_VALUES: readonly string[] = ["active", "expiring_soon", "expired", "n/a"];

function isStatusFilter(candidate: string): candidate is StatusFilter {
  return candidate === "all" || STATUS_FILTER_VALUES.includes(candidate);
}

function isConditionFilter(candidate: string): candidate is ConditionFilter {
  return candidate === "all" || CONDITION_FILTER_VALUES.includes(candidate);
}

function isWarrantyFilter(candidate: string): candidate is WarrantyFilter {
  return candidate === "all" || WARRANTY_FILTER_VALUES.includes(candidate);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "\u2014";
  const parsed = new Date(dateStr);
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateShort(dateStr: string): string {
  const parsed = new Date(dateStr);
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
}

function getSerialTrackedProducts() {
  const productIds = new Set(SERIALIZED_ITEMS.map((serial) => serial.productId));
  return PRODUCTS.filter((product) => productIds.has(product.id));
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== col)
    return <ChevronsUpDown size={12} strokeWidth={1.5} className="text-blue-primary/20" />;
  return sortDir === "asc" ? (
    <ChevronUp size={12} strokeWidth={2} className="text-blue-primary" />
  ) : (
    <ChevronDown size={12} strokeWidth={2} className="text-blue-primary" />
  );
}

export default function SerialInventoryPage() {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [conditionFilter, setConditionFilter] = useState<ConditionFilter>("all");
  const [warrantyFilter, setWarrantyFilter] = useState<WarrantyFilter>("all");

  const [sortKey, setSortKey] = useState<SortKey>("serialNumber");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const [detailItem, setDetailItem] = useState<SerializedItem | null>(null);

  const [items, setItems] = useState<SerializedItem[]>(() => [...SERIALIZED_ITEMS]);

  const serialProducts = useMemo(() => getSerialTrackedProducts(), []);

  const filtered = useMemo(() => {
    let serialItems = [...items];

    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      serialItems = serialItems.filter(
        (serial) =>
          serial.serialNumber.toLowerCase().includes(searchLower) ||
          serial.productName.toLowerCase().includes(searchLower) ||
          (serial.customer && serial.customer.toLowerCase().includes(searchLower))
      );
    }

    if (productFilter !== "all") {
      serialItems = serialItems.filter((serial) => serial.productId === productFilter);
    }

    if (statusFilter !== "all") {
      serialItems = serialItems.filter((serial) => serial.status === statusFilter);
    }

    if (conditionFilter !== "all") {
      serialItems = serialItems.filter((serial) => serial.condition === conditionFilter);
    }

    if (warrantyFilter !== "all") {
      serialItems = serialItems.filter((serial) => getWarrantyStatus(serial) === warrantyFilter);
    }

    return serialItems;
  }, [search, productFilter, statusFilter, conditionFilter, warrantyFilter, items]);

  const sorted = useMemo(() => {
    const sortableItems = [...filtered];
    sortableItems.sort((sortLeft, sortRight) => {
      let cmp = 0;
      switch (sortKey) {
        case "serialNumber":
          cmp = sortLeft.serialNumber.localeCompare(sortRight.serialNumber);
          break;
        case "productName":
          cmp = sortLeft.productName.localeCompare(sortRight.productName);
          break;
        case "status":
          cmp = sortLeft.status.localeCompare(sortRight.status);
          break;
        case "condition":
          cmp = sortLeft.condition.localeCompare(sortRight.condition);
          break;
        case "purchaseDate":
          cmp = sortLeft.purchaseDate.localeCompare(sortRight.purchaseDate);
          break;
        case "soldDate":
          cmp = (sortLeft.soldDate ?? "").localeCompare(sortRight.soldDate ?? "");
          break;
        case "customer":
          cmp = (sortLeft.customer ?? "").localeCompare(sortRight.customer ?? "");
          break;
        case "warrantyStatus": {
          const order: Record<WarrantyStatus, number> = { expired: 0, expiring_soon: 1, active: 2, "n/a": 3 };
          cmp = order[getWarrantyStatus(sortLeft)] - order[getWarrantyStatus(sortRight)];
          break;
        }
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sortableItems;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const resetPage = useCallback(() => setPage(1), []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((currentDir) => (currentDir === "asc" ? "desc" : "asc"));
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
    if (paginated.every((serial) => selectedIds.has(serial.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((serial) => serial.id)));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  const scrappedStatus: SerialStatus = "scrapped";
  const defectiveCondition: SerialCondition = "defective";

  const handleBulkScrap = () => {
    setItems((prev) =>
      prev.map((serial) =>
        selectedIds.has(serial.id) ? { ...serial, status: scrappedStatus, condition: defectiveCondition } : serial
      )
    );
    clearSelection();
  };

  const handleUpdateCondition = (id: string, condition: SerialCondition) => {
    setItems((prev) =>
      prev.map((serial) => (serial.id === id ? { ...serial, condition } : serial))
    );
    setActionMenuId(null);
  };

  const handleMarkScrapped = (id: string) => {
    setItems((prev) =>
      prev.map((serial) =>
        serial.id === id ? { ...serial, status: scrappedStatus, condition: defectiveCondition } : serial
      )
    );
    setActionMenuId(null);
  };

  const allOnPageSelected =
    paginated.length > 0 && paginated.every((serial) => selectedIds.has(serial.id));

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

  const statusSummary = useMemo(() => {
    const counts: Record<string, number> = {
      in_stock: 0, sold: 0, reserved: 0, defective: 0, in_repair: 0, scrapped: 0,
    };
    items.forEach((serial) => { counts[serial.status]++; });
    return counts;
  }, [items]);

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

      <div className="h-px bg-blue-primary/10" />

      <motion.div
        className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-blue-primary/10 border border-blue-primary/10"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease }}
      >
        {SERIAL_STATUS_VALUES.map((statusKey) => {
          const statusCfg = STATUS_CONFIG[statusKey];
          return (
            <button
              key={statusKey}
              onClick={() => {
                setStatusFilter(statusFilter === statusKey ? "all" : statusKey);
                resetPage();
              }}
              className={`bg-cream-light px-3 py-3 text-center transition-colors hover:bg-blue-primary/[0.03] ${
                statusFilter === statusKey ? "ring-1 ring-inset ring-blue-primary/30" : ""
              }`}
            >
              <span className={`font-mono text-[16px] lg:text-[20px] font-semibold leading-none block ${statusCfg.color}`}>
                {statusSummary[statusKey]}
              </span>
              <span className="font-mono text-[7px] lg:text-[8px] tracking-[0.12em] uppercase text-blue-primary/40 mt-1.5 block">
                {statusCfg.label}
              </span>
            </button>
          );
        })}
      </motion.div>

      <motion.div
        className="space-y-3"
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
              placeholder="SEARCH SERIAL, PRODUCT, OR CUSTOMER..."
              value={search}
              onChange={(changeEvent) => { setSearch(changeEvent.target.value); resetPage(); }}
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

          <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2">
            <select
              value={productFilter}
              onChange={(changeEvent) => { setProductFilter(changeEvent.target.value); resetPage(); }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[130px]"
            >
              <option value="all">All Products</option>
              {serialProducts.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(changeEvent) => {
                const selected = changeEvent.target.value;
                if (isStatusFilter(selected)) {
                  setStatusFilter(selected);
                  resetPage();
                }
              }}
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

            <select
              value={conditionFilter}
              onChange={(changeEvent) => {
                const selected = changeEvent.target.value;
                if (isConditionFilter(selected)) {
                  setConditionFilter(selected);
                  resetPage();
                }
              }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[120px]"
            >
              <option value="all">All Condition</option>
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="damaged">Damaged</option>
              <option value="defective">Defective</option>
            </select>

            <select
              value={warrantyFilter}
              onChange={(changeEvent) => {
                const selected = changeEvent.target.value;
                if (isWarrantyFilter(selected)) {
                  setWarrantyFilter(selected);
                  resetPage();
                }
              }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[130px]"
            >
              <option value="all">All Warranty</option>
              <option value="active">Active</option>
              <option value="expiring_soon">Expiring Soon</option>
              <option value="expired">Expired</option>
              <option value="n/a">N/A</option>
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

      <motion.div
        className="border border-blue-primary/10 bg-cream-light overflow-hidden"
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease }}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
            Serial Number Registry
          </p>
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/001</span>
        </div>

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
                paginated.map((serialItem) => {
                  const isSelected = selectedIds.has(serialItem.id);
                  const warrantyStatus = getWarrantyStatus(serialItem);
                  const warrantyDays = getWarrantyDaysRemaining(serialItem);
                  const statusConfig = STATUS_CONFIG[serialItem.status];
                  const conditionConfig = CONDITION_CONFIG[serialItem.condition];
                  const warrantyConfig = WARRANTY_CONFIG[warrantyStatus];

                  return (
                    <tr
                      key={serialItem.id}
                      className={`border-b border-blue-primary/6 transition-colors duration-150 h-14 ${
                        isSelected ? "bg-blue-primary/[0.03]" : "hover:bg-blue-primary/[0.02]"
                      }`}
                    >
                      <td className="w-12 px-4 align-middle">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(serialItem.id)}
                          className="w-3.5 h-3.5 accent-blue-primary cursor-pointer block"
                        />
                      </td>
                      <td className="px-3 align-middle">
                        <button
                          onClick={() => setDetailItem(serialItem)}
                          className="font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary hover:underline underline-offset-2 decoration-blue-primary/30 transition-colors text-left"
                        >
                          {serialItem.serialNumber}
                        </button>
                      </td>
                      <td className="px-3 align-middle">
                        <p className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary truncate max-w-[200px] leading-none">
                          {serialItem.productName}
                        </p>
                        <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/25 mt-1 block leading-none">
                          {formatCurrency(serialItem.purchaseCost)} cost
                        </span>
                      </td>
                      <td className="px-3 align-middle text-center">
                        <span className={`inline-block font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-1 leading-none ${statusConfig.color} ${statusConfig.bg}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-3 align-middle text-center">
                        <span className={`inline-block font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-1 leading-none ${conditionConfig.color} ${conditionConfig.bg}`}>
                          {conditionConfig.label}
                        </span>
                      </td>
                      <td className="px-3 align-middle">
                        <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50">
                          {formatDate(serialItem.purchaseDate)}
                        </span>
                      </td>
                      <td className="px-3 align-middle">
                        <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50">
                          {serialItem.customer ?? "\u2014"}
                        </span>
                      </td>
                      <td className="px-3 align-middle text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`inline-block font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-1 leading-none ${warrantyConfig.color} ${warrantyConfig.bg}`}>
                            {warrantyConfig.label}
                          </span>
                          {warrantyDays !== null && warrantyDays > 0 && warrantyDays <= 30 && (
                            <span className="font-mono text-[7px] tracking-[0.08em] text-amber-600 leading-none">
                              {warrantyDays}d
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="w-12 px-3 align-middle text-center relative">
                        <button
                          onClick={() => setActionMenuId(actionMenuId === serialItem.id ? null : serialItem.id)}
                          className="p-1 text-blue-primary/30 hover:text-blue-primary transition-colors"
                        >
                          <MoreHorizontal size={14} strokeWidth={1.5} />
                        </button>
                        {actionMenuId === serialItem.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActionMenuId(null)} />
                            <div className="absolute right-3 top-full z-20 w-40 bg-cream-primary border border-blue-primary/10 shadow-sm py-1">
                              <button
                                onClick={() => { setActionMenuId(null); setDetailItem(serialItem); }}
                                className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/60 hover:bg-blue-primary/5 hover:text-blue-primary transition-colors"
                              >
                                <Eye size={12} strokeWidth={1.5} /> View Details
                              </button>
                              {serialItem.status !== "scrapped" && (
                                <>
                                  <div className="h-px bg-blue-primary/8 mx-2 my-1" />
                                  <p className="px-3 pt-1.5 pb-1 font-mono text-[7px] tracking-[0.15em] uppercase text-blue-primary/30">
                                    Set Condition
                                  </p>
                                  {SERIAL_CONDITION_VALUES.map((conditionKey) => {
                                    const conditionCfg = CONDITION_CONFIG[conditionKey];
                                    const isActive = serialItem.condition === conditionKey;
                                    return (
                                      <button
                                        key={conditionKey}
                                        onClick={() => handleUpdateCondition(serialItem.id, conditionKey)}
                                        className={`w-full flex items-center gap-2 px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] uppercase transition-colors ${
                                          isActive
                                            ? `${conditionCfg.color} ${conditionCfg.bg}`
                                            : "text-blue-primary/50 hover:bg-blue-primary/5 hover:text-blue-primary"
                                        }`}
                                      >
                                        <CircleDot size={10} strokeWidth={isActive ? 2.5 : 1.5} />
                                        {conditionCfg.label}
                                        {isActive && (
                                          <span className="ml-auto font-mono text-[7px] tracking-[0.1em] opacity-50">current</span>
                                        )}
                                      </button>
                                    );
                                  })}
                                  <div className="h-px bg-blue-primary/8 mx-2 my-1" />
                                  <button
                                    onClick={() => handleMarkScrapped(serialItem.id)}
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

        <div className="flex items-center justify-between px-5 py-3 border-t border-blue-primary/8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
              {sorted.length === 0 ? "0" : `${(safePage - 1) * pageSize + 1}`}&ndash;{Math.min(safePage * pageSize, sorted.length)} of {sorted.length}
            </span>
            <div className="w-px h-3 bg-blue-primary/10" />
            <select
              value={pageSize}
              onChange={(changeEvent) => { setPageSize(Number(changeEvent.target.value)); setPage(1); }}
              className="h-7 px-2 bg-transparent border border-blue-primary/10 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/50 focus:outline-none cursor-pointer appearance-none"
            >
              {PAGE_SIZES.map((sizeOption) => (
                <option key={sizeOption} value={sizeOption}>{sizeOption} rows</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
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
              .map((pageNum, visibleIndex, visiblePages) => {
                const prevPage = visiblePages[visibleIndex - 1];
                const showEllipsis = prevPage != null && pageNum - prevPage > 1;
                return (
                  <span key={pageNum} className="flex items-center">
                    {showEllipsis && (
                      <span className="w-7 h-7 flex items-center justify-center font-mono text-[9px] text-blue-primary/20">...</span>
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
              onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
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
        <span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">[INV.SER.END]</span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {detailItem && (
            <>
              <motion.div
                className="fixed inset-0 bg-blue-primary/20 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDetailItem(null)}
              />
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
                  onClick={(clickEvent) => clickEvent.stopPropagation()}
                >
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

                  <div className="p-5 space-y-5 overflow-y-auto flex-1">
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
                          const warrantyStatus = getWarrantyStatus(detailItem);
                          const warrantyDays = getWarrantyDaysRemaining(detailItem);
                          const warrantyConfig = WARRANTY_CONFIG[warrantyStatus];
                          return (
                            <div>
                              <span className={`inline-block font-mono text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 ${warrantyConfig.color} ${warrantyConfig.bg}`}>
                                {warrantyConfig.label}
                              </span>
                              {warrantyDays !== null && (
                                <span className={`font-mono text-[8px] tracking-[0.06em] block mt-1 ${warrantyDays <= 30 ? "text-amber-600" : "text-blue-primary/30"}`}>
                                  {warrantyDays > 0 ? `${warrantyDays} days remaining` : `Expired ${Math.abs(warrantyDays)} days ago`}
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 pb-1 border-b border-blue-primary/8">
                          Product Info
                        </p>
                        <DetailRow icon={Package} label="Product" displayText={detailItem.productName} />
                        <DetailRow icon={Tag} label="Cost" displayText={formatCurrency(detailItem.purchaseCost)} />
                        {detailItem.soldPrice !== null && detailItem.soldPrice !== undefined && (
                          <DetailRow icon={DollarSign} label="Sold For" displayText={formatCurrency(detailItem.soldPrice)} />
                        )}
                      </div>
                      <div className="space-y-3">
                        <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 pb-1 border-b border-blue-primary/8">
                          Transaction Info
                        </p>
                        <DetailRow icon={Truck} label="Supplier" displayText={detailItem.supplier} />
                        <DetailRow icon={CalendarDays} label="Purchased" displayText={formatDate(detailItem.purchaseDate)} />
                        <DetailRow icon={User} label="Customer" displayText={detailItem.customer ?? "\u2014"} />
                        {detailItem.soldDate && (
                          <DetailRow icon={CalendarDays} label="Sold" displayText={formatDate(detailItem.soldDate)} />
                        )}
                      </div>
                    </div>

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

                    <div>
                      <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 pb-1 border-b border-blue-primary/8 mb-3">
                        Lifecycle Timeline
                      </p>
                      <div className="space-y-0">
                        {detailItem.timeline.map((event, eventIndex) => {
                          const TimelineIcon = TIMELINE_ICONS[event.action] ?? CircleDot;
                          const isLast = eventIndex === detailItem.timeline.length - 1;
                          return (
                            <div key={eventIndex} className="flex gap-3">
                              <div className="flex flex-col items-center shrink-0">
                                <div className={`w-6 h-6 flex items-center justify-center border ${
                                  isLast ? "border-blue-primary/30 bg-blue-primary/5" : "border-blue-primary/10 bg-cream-light"
                                }`}>
                                  <TimelineIcon size={11} strokeWidth={1.5} className={isLast ? "text-blue-primary/60" : "text-blue-primary/25"} />
                                </div>
                                {!isLast && <div className="w-px flex-1 min-h-[16px] bg-blue-primary/10" />}
                              </div>
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

function DetailRow({
  icon: Icon,
  label,
  displayText,
}: {
  icon: React.ElementType;
  label: string;
  displayText: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={12} strokeWidth={1.5} className="text-blue-primary/20 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-blue-primary/30 block leading-none">
          {label}
        </span>
        <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/70 block mt-0.5 leading-snug truncate">
          {displayText}
        </span>
      </div>
    </div>
  );
}
