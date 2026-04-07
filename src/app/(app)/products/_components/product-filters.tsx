"use client"

import { Search, X } from "lucide-react"
import { motion } from "framer-motion"
import type { CategoryOption, StatusFilter, StockFilter, SerialFilter } from "./product-types"

interface ProductFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
  statusFilter: StatusFilter
  onStatusChange: (value: StatusFilter) => void
  stockFilter: StockFilter
  onStockChange: (value: StockFilter) => void
  serialFilter: SerialFilter
  onSerialChange: (value: SerialFilter) => void
  categories: CategoryOption[]
  activeFilterCount: number
  onClearFilters: () => void
}

const selectClass = "h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[110px]"

export function ProductFilters({
  search, onSearchChange, categoryFilter, onCategoryChange,
  statusFilter, onStatusChange, stockFilter, onStockChange,
  serialFilter, onSerialChange, categories, activeFilterCount, onClearFilters,
}: ProductFiltersProps) {
  return (
    <motion.div
      className="space-y-3"
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-primary/30" />
          <input
            type="text"
            placeholder="SEARCH BY NAME OR SKU..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-cream-light border border-blue-primary/10 font-mono text-[11px] tracking-[0.08em] uppercase text-blue-primary placeholder:text-blue-primary/25 focus:outline-none focus:border-blue-primary/30 transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-blue-primary/30 hover:text-blue-primary transition-colors"
            >
              <X size={12} strokeWidth={2} />
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2">
          <select value={categoryFilter} onChange={(e) => onCategoryChange(e.target.value)} className={selectClass}>
            <option value="all">All Categories</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value as StatusFilter)} className={selectClass}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select value={stockFilter} onChange={(e) => onStockChange(e.target.value as StockFilter)} className={selectClass}>
            <option value="all">All Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
          <select value={serialFilter} onChange={(e) => onSerialChange(e.target.value as SerialFilter)} className={selectClass}>
            <option value="all">All Tracking</option>
            <option value="yes">Serial Tracked</option>
            <option value="no">Non-Tracked</option>
          </select>
          {activeFilterCount > 0 && (
            <button onClick={onClearFilters} className="h-9 px-3 border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/50 hover:text-blue-primary hover:border-blue-primary/30 transition-colors">
              Clear ({activeFilterCount})
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
