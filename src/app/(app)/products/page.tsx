"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { ProductFilters } from "./_components/product-filters"
import { ProductTable } from "./_components/product-table"
import { ProductBulkActions } from "./_components/product-bulk-actions"
import { ProductPagination } from "./_components/product-pagination"
import type {
  ProductListItem, CategoryOption, ProductSortKey,
  SortDir, StockFilter, StatusFilter, SerialFilter,
} from "./_components/product-types"

const ease = [0.16, 1, 0.3, 1] as const

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [stockFilter, setStockFilter] = useState<StockFilter>("all")
  const [serialFilter, setSerialFilter] = useState<SerialFilter>("all")
  const [sortKey, setSortKey] = useState<ProductSortKey>("name")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products"), fetch("/api/categories"),
      ])
      const productsJson = await productsRes.json()
      const categoriesJson = await categoriesRes.json()
      setProducts(productsJson.products ?? [])
      setCategories(categoriesJson.categories ?? [])
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const resetPage = useCallback(() => setPage(1), [])

  const filtered = useMemo(() => {
    let result = [...products]
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    }
    if (categoryFilter !== "all") result = result.filter((p) => p.categoryId === categoryFilter)
    if (statusFilter === "active") result = result.filter((p) => p.isActive)
    if (statusFilter === "inactive") result = result.filter((p) => !p.isActive)
    if (stockFilter === "low") result = result.filter((p) => p.stock > 0 && p.stock <= p.minStock)
    if (stockFilter === "out") result = result.filter((p) => p.stock === 0)
    if (serialFilter === "yes") result = result.filter((p) => p.isSerialTracked)
    if (serialFilter === "no") result = result.filter((p) => !p.isSerialTracked)
    return result
  }, [products, search, categoryFilter, statusFilter, stockFilter, serialFilter])

  const sorted = useMemo(() => {
    const data = [...filtered]
    data.sort((a, b) => {
      let cmp = 0
      if (sortKey === "sku") cmp = a.sku.localeCompare(b.sku)
      else if (sortKey === "name") cmp = a.name.localeCompare(b.name)
      else if (sortKey === "category") cmp = a.category.name.localeCompare(b.category.name)
      else if (sortKey === "stock") cmp = a.stock - b.stock
      else if (sortKey === "sellingPrice") cmp = a.sellingPrice - b.sellingPrice
      else if (sortKey === "isActive") cmp = Number(a.isActive) - Number(b.isActive)
      return sortDir === "asc" ? cmp : -cmp
    })
    return data
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginated = sorted.slice((safePage - 1) * pageSize, safePage * pageSize)

  const handleSort = (key: ProductSortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("asc") }
  }
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }
  const toggleSelectAll = () => {
    const allSelected = paginated.every((p) => selectedIds.has(p.id))
    setSelectedIds(allSelected ? new Set() : new Set(paginated.map((p) => p.id)))
  }
  const clearSelection = () => setSelectedIds(new Set())
  const handleDelete = async (productId: string) => {
    await fetch(`/api/products/${productId}`, { method: "DELETE" })
    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }
  const handleToggleStatus = async (productId: string) => {
    const target = products.find((p) => p.id === productId)
    if (!target) return
    await fetch(`/api/products/${productId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !target.isActive }),
    })
    setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, isActive: !p.isActive } : p))
  }
  const handleBulkDelete = async () => {
    if (!confirm("Delete selected products?")) return
    await Promise.all([...selectedIds].map((id) => fetch(`/api/products/${id}`, { method: "DELETE" })))
    setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)))
    clearSelection()
  }
  const handleBulkToggleStatus = async () => {
    const targets = products.filter((p) => selectedIds.has(p.id))
    await Promise.all(targets.map((p) =>
      fetch(`/api/products/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !p.isActive }) })
    ))
    setProducts((prev) => prev.map((p) => selectedIds.has(p.id) ? { ...p, isActive: !p.isActive } : p))
    clearSelection()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={24} strokeWidth={1.5} className="text-blue-primary/40 animate-spin" />
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/30">Loading products...</p>
        </div>
      </div>
    )
  }

  const activeFilterCount = [categoryFilter !== "all", statusFilter !== "all", stockFilter !== "all", serialFilter !== "all"].filter(Boolean).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <motion.h1 className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-blue-primary leading-none" initial={{ x: -30 }} animate={{ x: 0 }} transition={{ duration: 0.5, ease }}>Products</motion.h1>
          <motion.p className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2" initial={{ x: -20 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.05, ease }}>{sorted.length} product{sorted.length !== 1 && "s"} in inventory</motion.p>
        </div>
        <motion.div className="flex items-center gap-3" initial={{ x: 20 }} animate={{ x: 0 }} transition={{ duration: 0.4, delay: 0.1, ease }}>
          <button onClick={() => router.push("/products/new")} className="h-9 px-4 bg-blue-primary text-cream-primary font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:bg-blue-dark transition-colors">
            <Plus size={13} strokeWidth={1.5} /> Add Product
          </button>
          <span className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20 hidden sm:block">[INV.PROD]</span>
        </motion.div>
      </div>
      <div className="h-px bg-blue-primary/10" />
      <ProductFilters search={search} onSearchChange={(v) => { setSearch(v); resetPage() }} categoryFilter={categoryFilter} onCategoryChange={(v) => { setCategoryFilter(v); resetPage() }} statusFilter={statusFilter} onStatusChange={(v) => { setStatusFilter(v); resetPage() }} stockFilter={stockFilter} onStockChange={(v) => { setStockFilter(v); resetPage() }} serialFilter={serialFilter} onSerialChange={(v) => { setSerialFilter(v); resetPage() }} categories={categories} activeFilterCount={activeFilterCount} onClearFilters={() => { setSearch(""); setCategoryFilter("all"); setStatusFilter("all"); setStockFilter("all"); setSerialFilter("all"); resetPage() }} />
      <ProductBulkActions selectedCount={selectedIds.size} onToggleStatus={handleBulkToggleStatus} onDelete={handleBulkDelete} onClearSelection={clearSelection} />
      <ProductTable products={paginated} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} selectedIds={selectedIds} allOnPageSelected={paginated.length > 0 && paginated.every((p) => selectedIds.has(p.id))} onToggleSelect={toggleSelect} onToggleSelectAll={toggleSelectAll} onDelete={handleDelete} onToggleStatus={handleToggleStatus} totalCount={sorted.length} />
      <ProductPagination page={safePage} totalPages={totalPages} pageSize={pageSize} totalItems={sorted.length} onPageChange={setPage} onPageSizeChange={(v) => { setPageSize(v); setPage(1) }} />
      <div className="flex items-center justify-between pt-4"><div className="h-px flex-1 bg-blue-primary/8" /><span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">[INV.PROD.END]</span><div className="h-px flex-1 bg-blue-primary/8" /></div>
    </div>
  )
}
