"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react"
import { ProductTableRow } from "./product-table-row"
import type { ProductListItem, ProductSortKey, SortDir } from "./product-types"

interface ProductTableProps {
  products: ProductListItem[]
  sortKey: ProductSortKey
  sortDir: SortDir
  onSort: (key: ProductSortKey) => void
  selectedIds: Set<string>
  allOnPageSelected: boolean
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
  totalCount: number
}

function SortIcon({ col, sortKey, sortDir }: { col: ProductSortKey; sortKey: ProductSortKey; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronsUpDown size={12} strokeWidth={1.5} className="text-blue-primary/20" />
  return sortDir === "asc"
    ? <ChevronUp size={12} strokeWidth={2} className="text-blue-primary" />
    : <ChevronDown size={12} strokeWidth={2} className="text-blue-primary" />
}

const thBtnClass = "flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"

export function ProductTable({
  products, sortKey, sortDir, onSort, selectedIds, allOnPageSelected,
  onToggleSelect, onToggleSelectAll, onDelete, onToggleStatus,
}: ProductTableProps) {
  const [actionMenuId, setActionMenuId] = useState<string | null>(null)

  return (
    <motion.div
      className="border border-blue-primary/10 bg-cream-light overflow-hidden"
      initial={{ y: 30 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">Product Inventory</p>
        <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/001</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-blue-primary/10 h-11">
              <th className="w-12 px-4 align-middle">
                <input type="checkbox" checked={allOnPageSelected} onChange={onToggleSelectAll} className="w-3.5 h-3.5 accent-blue-primary cursor-pointer block" />
              </th>
              <th className="text-left px-3 align-middle"><button onClick={() => onSort("sku")} className={thBtnClass}>SKU <SortIcon col="sku" sortKey={sortKey} sortDir={sortDir} /></button></th>
              <th className="text-left px-3 align-middle"><button onClick={() => onSort("name")} className={thBtnClass}>Product <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} /></button></th>
              <th className="text-left px-3 align-middle"><button onClick={() => onSort("category")} className={thBtnClass}>Category <SortIcon col="category" sortKey={sortKey} sortDir={sortDir} /></button></th>
              <th className="text-right px-3 align-middle"><button onClick={() => onSort("stock")} className={`${thBtnClass} ml-auto`}>Stock <SortIcon col="stock" sortKey={sortKey} sortDir={sortDir} /></button></th>
              <th className="text-right px-3 align-middle"><button onClick={() => onSort("sellingPrice")} className={`${thBtnClass} ml-auto`}>Price <SortIcon col="sellingPrice" sortKey={sortKey} sortDir={sortDir} /></button></th>
              <th className="text-center px-3 align-middle"><button onClick={() => onSort("isActive")} className={`${thBtnClass} mx-auto`}>Status <SortIcon col="isActive" sortKey={sortKey} sortDir={sortDir} /></button></th>
              <th className="w-12 px-3 align-middle" />
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-16">
                <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary/30">No products found</p>
                <p className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/20 mt-1">Try adjusting your filters</p>
              </td></tr>
            ) : (
              products.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  isSelected={selectedIds.has(product.id)}
                  onToggleSelect={onToggleSelect}
                  onDelete={onDelete}
                  onToggleStatus={onToggleStatus}
                  isMenuOpen={actionMenuId === product.id}
                  onToggleMenu={(id) => setActionMenuId(actionMenuId === id ? null : id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
