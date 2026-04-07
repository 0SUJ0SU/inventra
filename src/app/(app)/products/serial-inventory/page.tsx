"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, X, Trash2, Loader2 } from "lucide-react"
import { SerialTable } from "./_components/serial-table"
import { SerialDetailDialog } from "./_components/serial-detail-dialog"
import { ProductPagination } from "../_components/product-pagination"
import { STATUS_CONFIG, SERIAL_STATUSES, getWarrantyStatus, type SerialListItem, type SerialCondition } from "./_components/serial-types"

const ease = [0.16, 1, 0.3, 1] as const
const selectClass = "h-9 px-3 bg-cream-light border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary focus:outline-none focus:border-blue-primary/30 transition-colors cursor-pointer appearance-none min-w-[130px]"

export default function SerialInventoryPage() {
  const [items, setItems] = useState<SerialListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [productFilter, setProductFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [conditionFilter, setConditionFilter] = useState("all")
  const [warrantyFilter, setWarrantyFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [detailItem, setDetailItem] = useState<SerialListItem | null>(null)

  useEffect(() => {
    async function fetchSerials() {
      setIsLoading(true)
      const res = await fetch("/api/serial-inventory")
      const json = await res.json()
      setItems(json.serialItems ?? [])
      setIsLoading(false)
    }
    fetchSerials()
  }, [])

  const resetPage = useCallback(() => setPage(1), [])

  const uniqueProducts = useMemo(() => {
    const seen = new Map<string, string>()
    items.forEach((s) => { if (!seen.has(s.product.id)) seen.set(s.product.id, s.product.name) })
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [items])

  const filtered = useMemo(() => {
    let result = [...items]
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter((s) => s.serialNumber.toLowerCase().includes(q) || s.product.name.toLowerCase().includes(q) || (s.customer?.name ?? "").toLowerCase().includes(q))
    }
    if (productFilter !== "all") result = result.filter((s) => s.product.id === productFilter)
    if (statusFilter !== "all") result = result.filter((s) => s.status === statusFilter)
    if (conditionFilter !== "all") result = result.filter((s) => s.condition === conditionFilter)
    if (warrantyFilter !== "all") result = result.filter((s) => getWarrantyStatus(s) === warrantyFilter)
    return result
  }, [items, search, productFilter, statusFilter, conditionFilter, warrantyFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const toggleSelect = (id: string) => { setSelectedIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next }) }
  const toggleSelectAll = () => { const allSelected = paginated.every((s) => selectedIds.has(s.id)); setSelectedIds(allSelected ? new Set() : new Set(paginated.map((s) => s.id))) }
  const clearSelection = () => setSelectedIds(new Set())

  const handleUpdateCondition = async (serialId: string, condition: SerialCondition) => {
    await fetch(`/api/serial-inventory/${serialId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ condition }) })
    setItems((prev) => prev.map((s) => s.id === serialId ? { ...s, condition } : s))
  }

  const handleMarkScrapped = async (serialId: string) => {
    await fetch(`/api/serial-inventory/${serialId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "scrapped", condition: "defective" }) })
    setItems((prev) => prev.map((s) => s.id === serialId ? { ...s, status: "scrapped", condition: "defective" } : s))
  }

  const handleBulkScrap = async () => {
    await Promise.all([...selectedIds].map((id) => fetch(`/api/serial-inventory/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "scrapped", condition: "defective" }) })))
    setItems((prev) => prev.map((s) => selectedIds.has(s.id) ? { ...s, status: "scrapped", condition: "defective" } : s))
    clearSelection()
  }

  const statusSummary = useMemo(() => {
    const counts: Record<string, number> = {}
    SERIAL_STATUSES.forEach((s) => { counts[s] = 0 })
    items.forEach((s) => { counts[s.status] = (counts[s.status] ?? 0) + 1 })
    return counts
  }, [items])

  const activeFilterCount = [productFilter !== "all", statusFilter !== "all", conditionFilter !== "all", warrantyFilter !== "all"].filter(Boolean).length

  const clearFilters = () => {
    setSearch("")
    setProductFilter("all")
    setStatusFilter("all")
    setConditionFilter("all")
    setWarrantyFilter("all")
    resetPage()
  }

  if (isLoading) {
    return (<div className="flex items-center justify-center min-h-[60vh]"><div className="flex flex-col items-center gap-4"><Loader2 size={24} strokeWidth={1.5} className="text-blue-primary/40 animate-spin" /><p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/30">Loading serial inventory...</p></div></div>)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <motion.h1 className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-blue-primary leading-none" initial={{ x: -30 }} animate={{ x: 0 }} transition={{ duration: 0.5, ease }}>Serial Inventory</motion.h1>
          <motion.p className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2" initial={{ x: -20 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.05, ease }}>{items.length} serialized unit{items.length !== 1 && "s"} tracked</motion.p>
        </div>
        <motion.span className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20 hidden sm:block" initial={{ x: 20 }} animate={{ x: 0 }} transition={{ duration: 0.4, delay: 0.1, ease }}>[INV.SER]</motion.span>
      </div>
      <div className="h-px bg-blue-primary/10" />

      <motion.div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-blue-primary/10 border border-blue-primary/10" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.08, ease }}>
        {SERIAL_STATUSES.map((statusKey) => { const cfg = STATUS_CONFIG[statusKey]; return (
          <button key={statusKey} onClick={() => { setStatusFilter(statusFilter === statusKey ? "all" : statusKey); resetPage() }} className={`bg-cream-light px-3 py-3 text-center transition-colors hover:bg-blue-primary/[0.03] ${statusFilter === statusKey ? "ring-1 ring-inset ring-blue-primary/30" : ""}`}>
            <span className={`font-mono text-[16px] lg:text-[20px] font-semibold leading-none block ${cfg.color}`}>{statusSummary[statusKey] ?? 0}</span>
            <span className="font-mono text-[7px] lg:text-[8px] tracking-[0.12em] uppercase text-blue-primary/40 mt-1.5 block">{cfg.label}</span>
          </button>
        )})}
      </motion.div>

      <motion.div className="space-y-3" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.12, ease }}>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-primary/30" />
            <input type="text" placeholder="SEARCH SERIAL, PRODUCT, OR CUSTOMER..." value={search} onChange={(e) => { setSearch(e.target.value); resetPage() }} className="w-full h-9 pl-9 pr-3 bg-cream-light border border-blue-primary/10 font-mono text-[11px] tracking-[0.08em] uppercase text-blue-primary placeholder:text-blue-primary/25 focus:outline-none focus:border-blue-primary/30 transition-colors" />
            {search && <button onClick={() => { setSearch(""); resetPage() }} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-blue-primary/30 hover:text-blue-primary transition-colors"><X size={12} strokeWidth={2} /></button>}
          </div>
          <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2">
            <select value={productFilter} onChange={(e) => { setProductFilter(e.target.value); resetPage() }} className={selectClass}>
              <option value="all">All Products</option>
              {uniqueProducts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); resetPage() }} className={selectClass}>
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
              <option value="defective">Defective</option>
              <option value="in_repair">In Repair</option>
              <option value="scrapped">Scrapped</option>
            </select>
            <select value={conditionFilter} onChange={(e) => { setConditionFilter(e.target.value); resetPage() }} className={selectClass}>
              <option value="all">All Condition</option>
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="damaged">Damaged</option>
              <option value="defective">Defective</option>
            </select>
            <select value={warrantyFilter} onChange={(e) => { setWarrantyFilter(e.target.value); resetPage() }} className={selectClass}>
              <option value="all">All Warranty</option>
              <option value="active">Active</option>
              <option value="expiring_soon">Expiring Soon</option>
              <option value="expired">Expired</option>
              <option value="n/a">N/A</option>
            </select>
            {activeFilterCount > 0 && <button onClick={clearFilters} className="h-9 px-3 border border-blue-primary/10 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/50 hover:text-blue-primary hover:border-blue-primary/30 transition-colors">Clear ({activeFilterCount})</button>}
          </div>
        </div>
        {selectedIds.size > 0 && (
          <motion.div className="bg-blue-primary text-cream-primary" initial={{ y: -10 }} animate={{ y: 0 }} transition={{ duration: 0.3, ease }}>
            <div className="px-4 h-9 flex items-center justify-center border-b border-cream-primary/10"><span className="font-mono text-[10px] tracking-[0.12em] uppercase">{selectedIds.size} unit{selectedIds.size !== 1 && "s"} selected</span></div>
            <div className="grid grid-cols-2 divide-x divide-cream-primary/10">
              <button onClick={handleBulkScrap} className="font-mono text-[9px] tracking-[0.1em] uppercase text-cream-primary/70 hover:text-cream-primary hover:bg-cream-primary/5 flex items-center justify-center gap-1.5 h-9 transition-colors"><Trash2 size={12} strokeWidth={1.5} /> Mark Scrapped</button>
              <button onClick={clearSelection} className="font-mono text-[9px] tracking-[0.1em] uppercase text-cream-primary/50 hover:text-cream-primary hover:bg-cream-primary/5 flex items-center justify-center gap-1.5 h-9 transition-colors"><X size={12} strokeWidth={1.5} /> Deselect</button>
            </div>
          </motion.div>
        )}
      </motion.div>

      <SerialTable items={paginated} selectedIds={selectedIds} onToggleSelect={toggleSelect} onToggleSelectAll={toggleSelectAll} allOnPageSelected={paginated.length > 0 && paginated.every((s) => selectedIds.has(s.id))} onViewDetail={setDetailItem} onUpdateCondition={handleUpdateCondition} onMarkScrapped={handleMarkScrapped} />
      <ProductPagination page={safePage} totalPages={totalPages} pageSize={pageSize} totalItems={filtered.length} onPageChange={setPage} onPageSizeChange={(v) => { setPageSize(v); setPage(1) }} />

      <div className="flex items-center justify-between pt-4"><div className="h-px flex-1 bg-blue-primary/8" /><span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">[INV.SER.END]</span><div className="h-px flex-1 bg-blue-primary/8" /></div>
      {detailItem && <SerialDetailDialog item={detailItem} onClose={() => setDetailItem(null)} />}
    </div>
  )
}
