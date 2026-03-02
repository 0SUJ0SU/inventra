// src/app/(app)/products/page.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Power,
  MoreHorizontal,
  Eye,
  Pencil,
  Barcode,
  X,
  Plus,
} from "lucide-react";
import { PRODUCTS, CATEGORIES, type Product } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils/format";

// ————————————————————————————————————————————————
// TYPES
// ————————————————————————————————————————————————

type SortKey =
  | "sku"
  | "name"
  | "category"
  | "stock"
  | "sellingPrice"
  | "isActive";
type SortDir = "asc" | "desc";
type StockFilter = "all" | "low" | "out";
type StatusFilter = "all" | "active" | "inactive";
type SerialFilter = "all" | "yes" | "no";

// ————————————————————————————————————————————————
// PAGE
// ————————————————————————————————————————————————

const PAGE_SIZES = [10, 20, 50] as const;

export default function ProductsPage() {
  // — Filter state —
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [serialFilter, setSerialFilter] = useState<SerialFilter>("all");

  // — Sort state —
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // — Pagination —
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // — Selection —
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // — Action menu —
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // — Local mutable products (demo: allows delete/toggle) —
  const [products, setProducts] = useState<Product[]>(() => [...PRODUCTS]);

  const router = useRouter();

  // ——— DERIVED DATA ———

  const filtered = useMemo(() => {
    let data = [...products];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    // Category
    if (categoryFilter !== "all") {
      data = data.filter((p) => p.categoryId === categoryFilter);
    }

    // Status
    if (statusFilter === "active") data = data.filter((p) => p.isActive);
    if (statusFilter === "inactive") data = data.filter((p) => !p.isActive);

    // Stock level
    if (stockFilter === "low")
      data = data.filter((p) => p.stock > 0 && p.stock <= p.minStock);
    if (stockFilter === "out") data = data.filter((p) => p.stock === 0);

    // Serial tracked
    if (serialFilter === "yes")
      data = data.filter((p) => p.isSerialTracked);
    if (serialFilter === "no")
      data = data.filter((p) => !p.isSerialTracked);

    return data;
  }, [search, categoryFilter, statusFilter, stockFilter, serialFilter, products]);

  const sorted = useMemo(() => {
    const data = [...filtered];
    data.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "sku":
          cmp = a.sku.localeCompare(b.sku);
          break;
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "category":
          cmp = a.category.localeCompare(b.category);
          break;
        case "stock":
          cmp = a.stock - b.stock;
          break;
        case "sellingPrice":
          cmp = a.sellingPrice - b.sellingPrice;
          break;
        case "isActive":
          cmp = Number(a.isActive) - Number(b.isActive);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return data;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = sorted.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  // Reset page on filter change
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
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((p) => p.id)));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  // — Bulk toggle status —
  const handleBulkToggleStatus = () => {
    setProducts((prev) =>
      prev.map((p) =>
        selectedIds.has(p.id) ? { ...p, isActive: !p.isActive } : p
      )
    );
    clearSelection();
  };

  // — Bulk delete —
  const handleBulkDelete = () => {
    setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
    clearSelection();
  };

  // — Single delete —
  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setActionMenuId(null);
  };

  // — Single toggle status —
  const handleToggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
    setActionMenuId(null);
  };

  const allOnPageSelected =
    paginated.length > 0 && selectedIds.size === paginated.length;

  // Active filter count for badge
  const activeFilterCount = [
    categoryFilter !== "all",
    statusFilter !== "all",
    stockFilter !== "all",
    serialFilter !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setStockFilter("all");
    setSerialFilter("all");
    resetPage();
  };

  // Stock color helper
  const stockColor = (p: Product) => {
    if (p.stock === 0) return "text-error";
    if (p.stock <= p.minStock) return "text-warning";
    return "text-blue-primary";
  };

  const stockLabel = (p: Product) => {
    if (p.stock === 0) return "OUT";
    if (p.stock <= p.minStock) return "LOW";
    return null;
  };

  // ——— SORT ICON ———

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col)
      return (
        <ChevronsUpDown
          size={12}
          strokeWidth={1.5}
          className="text-blue-primary/20"
        />
      );
    return sortDir === "asc" ? (
      <ChevronUp size={12} strokeWidth={2} className="text-blue-primary" />
    ) : (
      <ChevronDown size={12} strokeWidth={2} className="text-blue-primary" />
    );
  };

  // ——— RENDER ———

  return (
    <div className="space-y-6">
      {/* ━━━ PAGE HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <motion.h1
            className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-blue-primary leading-none"
            initial={{ x: -30 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Products
          </motion.h1>
          <motion.p
            className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {sorted.length} product{sorted.length !== 1 && "s"} in inventory
          </motion.p>
        </div>
        <motion.div
          className="flex items-center gap-3"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <button
            onClick={() => router.push("/products/new")}
            className="h-9 px-4 bg-blue-primary text-cream-primary font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:bg-blue-dark transition-colors"
          >
            <Plus size={13} strokeWidth={1.5} />
            Add Product
          </button>
          <span className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20 hidden sm:block">
            [INV.PROD]
          </span>
        </motion.div>
      </div>

      {/* Blueprint divider */}
      <div className="h-px bg-blue-primary/10" />

      {/* ━━━ FILTERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        className="space-y-3"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Search + filter row */}
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
              placeholder="SEARCH BY NAME OR SKU..."
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

          {/* Filter pills */}
          <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2">
            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                resetPage();
              }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[130px]"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as StatusFilter);
                resetPage();
              }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[110px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Stock */}
            <select
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value as StockFilter);
                resetPage();
              }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[120px]"
            >
              <option value="all">All Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>

            {/* Serial */}
            <select
              value={serialFilter}
              onChange={(e) => {
                setSerialFilter(e.target.value as SerialFilter);
                resetPage();
              }}
              className="h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[130px]"
            >
              <option value="all">All Tracking</option>
              <option value="yes">Serial Tracked</option>
              <option value="no">Non-Tracked</option>
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
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top: count */}
            <div className="px-4 h-9 flex items-center justify-center border-b border-cream-primary/10">
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase">
                {selectedIds.size} item{selectedIds.size !== 1 && "s"} selected
              </span>
            </div>
            {/* Bottom: three equal actions */}
            <div className="grid grid-cols-3 divide-x divide-cream-primary/10">
              <button
                onClick={handleBulkToggleStatus}
                className="font-mono text-[9px] tracking-[0.1em] uppercase text-cream-primary/70 hover:text-cream-primary hover:bg-cream-primary/5 flex items-center justify-center gap-1.5 h-9 transition-colors"
              >
                <Power size={12} strokeWidth={1.5} />
                Flip Status
              </button>
              <button
                onClick={handleBulkDelete}
                className="font-mono text-[9px] tracking-[0.1em] uppercase text-cream-primary/70 hover:text-cream-primary hover:bg-cream-primary/5 flex items-center justify-center gap-1.5 h-9 transition-colors"
              >
                <Trash2 size={12} strokeWidth={1.5} />
                Delete
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

      {/* ━━━ TABLE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        className="border border-blue-primary/10 bg-cream-light overflow-hidden"
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">
            Product Inventory
          </p>
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">
            /001
          </span>
        </div>

        {/* Scrollable table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
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
                  <button
                    onClick={() => handleSort("sku")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    SKU <SortIcon col="sku" />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Product <SortIcon col="name" />
                  </button>
                </th>
                <th className="text-left px-3 align-middle">
                  <button
                    onClick={() => handleSort("category")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"
                  >
                    Category <SortIcon col="category" />
                  </button>
                </th>
                <th className="text-right px-3 align-middle">
                  <button
                    onClick={() => handleSort("stock")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors ml-auto"
                  >
                    Stock <SortIcon col="stock" />
                  </button>
                </th>
                <th className="text-right px-3 align-middle">
                  <button
                    onClick={() => handleSort("sellingPrice")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors ml-auto"
                  >
                    Price <SortIcon col="sellingPrice" />
                  </button>
                </th>
                <th className="text-center px-3 align-middle">
                  <button
                    onClick={() => handleSort("isActive")}
                    className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors mx-auto"
                  >
                    Status <SortIcon col="isActive" />
                  </button>
                </th>
                <th className="w-12 px-3 align-middle" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-16"
                  >
                    <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary/30">
                      No products found
                    </p>
                    <p className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/20 mt-1">
                      Try adjusting your filters
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map((product) => {
                  const isSelected = selectedIds.has(product.id);
                  const sLabel = stockLabel(product);
                  return (
                    <tr
                      key={product.id}
                      className={`
                        border-b border-blue-primary/6 transition-colors duration-150 h-14
                        ${isSelected ? "bg-blue-primary/[0.03]" : "hover:bg-blue-primary/[0.02]"}
                      `}
                    >
                      {/* Checkbox */}
                      <td className="w-12 px-4 align-middle">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(product.id)}
                          className="w-3.5 h-3.5 accent-blue-primary cursor-pointer block"
                        />
                      </td>
                      {/* SKU */}
                      <td className="px-3 align-middle">
                        <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary/50">
                          {product.sku}
                        </span>
                      </td>
                      {/* Name */}
                      <td className="px-3 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 shrink-0 border border-blue-primary/10 bg-cream-primary flex items-center justify-center">
                            <span className="font-mono text-[7px] tracking-[0.1em] uppercase text-blue-primary/20">
                              {product.category.slice(0, 3)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-mono text-[11px] tracking-[0.04em] uppercase text-blue-primary truncate leading-none">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {product.isSerialTracked && (
                                <span className="inline-flex items-center gap-1 font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/35 leading-none">
                                  <Barcode size={9} strokeWidth={1.5} />
                                  Serial
                                </span>
                              )}
                              {product.warrantyMonths > 0 && (
                                <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/25 leading-none">
                                  {product.warrantyMonths}mo warranty
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Category */}
                      <td className="px-3 align-middle">
                        <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary/50">
                          {product.category}
                        </span>
                      </td>
                      {/* Stock */}
                      <td className="px-3 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={`font-mono text-[12px] tracking-[0.05em] font-semibold leading-none ${stockColor(product)}`}
                          >
                            {product.stock}
                          </span>
                          {sLabel && (
                            <span
                              className={`font-mono text-[7px] tracking-[0.15em] uppercase px-1.5 py-0.5 leading-none ${
                                sLabel === "OUT"
                                  ? "bg-error/10 text-error"
                                  : "bg-warning/10 text-warning"
                              }`}
                            >
                              {sLabel}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/25 block mt-1 leading-none">
                          min: {product.minStock}
                        </span>
                      </td>
                      {/* Price */}
                      <td className="px-3 align-middle text-right">
                        <span className="font-mono text-[12px] tracking-[0.03em] font-semibold text-blue-primary leading-none block">
                          {formatCurrency(product.sellingPrice)}
                        </span>
                        <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/25 block mt-1 leading-none">
                          cost: {formatCurrency(product.costPrice)}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-3 align-middle text-center">
                        <span
                          className={`inline-block font-mono text-[8px] tracking-[0.15em] uppercase px-2 py-1 leading-none ${
                            product.isActive
                              ? "bg-blue-primary/8 text-blue-primary"
                              : "bg-blue-primary/4 text-blue-primary/30"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="w-12 px-3 align-middle text-center relative">
                        <button
                          onClick={() =>
                            setActionMenuId(
                              actionMenuId === product.id ? null : product.id
                            )
                          }
                          className="p-1 text-blue-primary/30 hover:text-blue-primary transition-colors"
                        >
                          <MoreHorizontal size={14} strokeWidth={1.5} />
                        </button>
                        {/* Dropdown */}
                        {actionMenuId === product.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActionMenuId(null)}
                            />
                            <div className="absolute right-3 top-full z-20 w-36 bg-cream-primary border border-blue-primary/10 shadow-sm py-1">
                              <button
                                onClick={() => {
                                  setActionMenuId(null);
                                  router.push(`/products/${product.id}`);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/60 hover:bg-blue-primary/5 hover:text-blue-primary transition-colors"
                              >
                                <Eye size={12} strokeWidth={1.5} />
                                View
                              </button>
                              <button
                                onClick={() => {
                                  setActionMenuId(null);
                                  router.push(`/products/${product.id}/edit`);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/60 hover:bg-blue-primary/5 hover:text-blue-primary transition-colors"
                              >
                                <Pencil size={12} strokeWidth={1.5} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleToggleStatus(product.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/60 hover:bg-blue-primary/5 hover:text-blue-primary transition-colors"
                              >
                                <Power size={12} strokeWidth={1.5} />
                                {product.isActive ? "Deactivate" : "Activate"}
                              </button>
                              <div className="h-px bg-blue-primary/8 mx-2 my-1" />
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-[0.1em] uppercase text-error/60 hover:bg-error/5 hover:text-error transition-colors"
                              >
                                <Trash2 size={12} strokeWidth={1.5} />
                                Delete
                              </button>
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

        {/* ━━━ PAGINATION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-blue-primary/8">
          {/* Left: rows info */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">
              {(safePage - 1) * pageSize + 1}–
              {Math.min(safePage * pageSize, sorted.length)} of{" "}
              {sorted.length}
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

          {/* Right: page controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="w-7 h-7 flex items-center justify-center border border-blue-primary/10 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30 disabled:opacity-20 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft size={12} strokeWidth={2} />
            </button>

            {/* Page numbers */}
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
          [INV.PROD.END]
        </span>
        <div className="h-px flex-1 bg-blue-primary/8" />
      </div>
    </div>
  );
}
