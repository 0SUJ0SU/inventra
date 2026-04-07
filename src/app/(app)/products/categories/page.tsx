"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search, Plus, Pencil, Trash2, X,
  ChevronUp, ChevronDown, ChevronsUpDown,
  Package, FolderOpen, Loader2,
} from "lucide-react"
import { CategoryDialog } from "./_components/category-dialog"
import { CategoryDeleteDialog } from "./_components/category-delete-dialog"

interface Category { id: string; name: string; description: string | null; productCount: number }
type SortKey = "name" | "productCount"
type SortDir = "asc" | "desc"

const ease = [0.16, 1, 0.3, 1] as const

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronsUpDown size={12} strokeWidth={1.5} className="text-blue-primary/20" />
  return sortDir === "asc" ? <ChevronUp size={12} strokeWidth={2} className="text-blue-primary" /> : <ChevronDown size={12} strokeWidth={2} className="text-blue-primary" />
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true)
      const res = await fetch("/api/categories")
      const json = await res.json()
      setCategories(json.categories ?? [])
      setIsLoading(false)
    }
    fetchCategories()
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return categories
    return categories.filter((c) => c.name.toLowerCase().includes(q) || (c.description ?? "").toLowerCase().includes(q))
  }, [categories, search])

  const sorted = useMemo(() => {
    const data = [...filtered]
    data.sort((a, b) => { const cmp = sortKey === "name" ? a.name.localeCompare(b.name) : a.productCount - b.productCount; return sortDir === "asc" ? cmp : -cmp })
    return data
  }, [filtered, sortKey, sortDir])

  const handleSort = (key: SortKey) => { if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc"); else { setSortKey(key); setSortDir("asc") } }
  const openAdd = () => { setModalMode("add"); setEditCategory(null); setModalOpen(true) }
  const openEdit = (cat: Category) => { setModalMode("edit"); setEditCategory(cat); setModalOpen(true) }

  const handleDialogSubmit = async (name: string, description: string) => {
    setIsSubmitting(true)
    try {
      if (modalMode === "add") {
        const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description: description || null }) })
        if (res.status === 409) { setIsSubmitting(false); return }
        const json = await res.json()
        setCategories((prev) => [...prev, json.category])
      } else if (editCategory) {
        const res = await fetch(`/api/categories/${editCategory.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description: description || null }) })
        const json = await res.json()
        setCategories((prev) => prev.map((c) => c.id === editCategory.id ? { ...c, name: json.category.name, description: json.category.description } : c))
      }
      setModalOpen(false)
    } finally { setIsSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await fetch(`/api/categories/${deleteTarget.id}`, { method: "DELETE" })
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  if (isLoading) {
    return (<div className="flex items-center justify-center min-h-[60vh]"><div className="flex flex-col items-center gap-4"><Loader2 size={24} strokeWidth={1.5} className="text-blue-primary/40 animate-spin" /><p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/30">Loading categories...</p></div></div>)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <motion.h1 className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-blue-primary leading-none" initial={{ x: -30 }} animate={{ x: 0 }} transition={{ duration: 0.5, ease }}>Categories</motion.h1>
          <motion.p className="font-mono text-[11px] tracking-[0.15em] uppercase text-blue-primary/40 mt-2" initial={{ x: -20 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.05, ease }}>{categories.length} categor{categories.length !== 1 ? "ies" : "y"} configured</motion.p>
        </div>
        <motion.div className="flex items-center gap-3" initial={{ x: 20 }} animate={{ x: 0 }} transition={{ duration: 0.4, delay: 0.1, ease }}>
          <button onClick={openAdd} className="h-9 px-4 bg-blue-primary text-cream-primary font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:bg-blue-dark transition-colors"><Plus size={13} strokeWidth={1.5} /> Add Category</button>
          <span className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20 hidden sm:block">[INV.CAT]</span>
        </motion.div>
      </div>
      <div className="h-px bg-blue-primary/10" />
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease }}>
        <div className="relative max-w-md">
          <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-primary/30" />
          <input type="text" placeholder="SEARCH CATEGORIES..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-9 pl-9 pr-3 bg-cream-light border border-blue-primary/10 font-mono text-[11px] tracking-[0.08em] uppercase text-blue-primary placeholder:text-blue-primary/25 focus:outline-none focus:border-blue-primary/30 transition-colors" />
          {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-blue-primary/30 hover:text-blue-primary transition-colors"><X size={12} strokeWidth={2} /></button>}
        </div>
      </motion.div>
      <motion.div className="border border-blue-primary/10 bg-cream-light overflow-hidden" initial={{ y: 30 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease }}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">Category List</p>
          <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/30">/001</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead><tr className="border-b border-blue-primary/10 h-11">
              <th className="text-left px-5 align-middle"><button onClick={() => handleSort("name")} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors">Category <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} /></button></th>
              <th className="text-left px-5 align-middle hidden sm:table-cell"><span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50">Description</span></th>
              <th className="text-right px-5 align-middle"><button onClick={() => handleSort("productCount")} className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors ml-auto">Products <SortIcon col="productCount" sortKey={sortKey} sortDir={sortDir} /></button></th>
              <th className="w-24 px-5 align-middle" />
            </tr></thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-16">
                  <FolderOpen size={28} strokeWidth={1} className="text-blue-primary/15 mx-auto mb-3" />
                  <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary/30">{search ? "No categories found" : "No categories yet"}</p>
                  <p className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/20 mt-1">{search ? "Try a different search term" : "Add your first category to get started"}</p>
                </td></tr>
              ) : sorted.map((cat) => (
                <tr key={cat.id} className="border-b border-blue-primary/6 transition-colors duration-150 h-14 hover:bg-blue-primary/[0.02]">
                  <td className="px-5 align-middle"><div className="flex items-center gap-3"><div className="w-8 h-8 shrink-0 border border-blue-primary/10 bg-cream-primary flex items-center justify-center"><Package size={14} strokeWidth={1.2} className="text-blue-primary/25" /></div><div className="min-w-0"><p className="font-mono text-[11px] tracking-[0.04em] uppercase text-blue-primary truncate leading-none">{cat.name}</p><p className="font-mono text-[8px] tracking-[0.06em] uppercase text-blue-primary/30 mt-1 sm:hidden truncate leading-none">{cat.description || "No description"}</p></div></div></td>
                  <td className="px-5 align-middle hidden sm:table-cell"><p className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50 truncate max-w-xs">{cat.description || "—"}</p></td>
                  <td className="px-5 align-middle text-right"><span className="font-mono text-[12px] tracking-[0.05em] font-semibold text-blue-primary">{cat.productCount}</span><span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/40 ml-1.5">items</span></td>
                  <td className="w-24 px-5 align-middle"><div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(cat)} className="w-7 h-7 flex items-center justify-center text-blue-primary/30 hover:text-blue-primary hover:bg-blue-primary/5 transition-colors" title="Edit"><Pencil size={13} strokeWidth={1.5} /></button>
                    <button onClick={() => setDeleteTarget(cat)} className="w-7 h-7 flex items-center justify-center text-blue-primary/20 hover:text-error hover:bg-error/5 transition-colors" title="Delete"><Trash2 size={13} strokeWidth={1.5} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-blue-primary/8">
          <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/50">{sorted.length} of {categories.length} categor{categories.length !== 1 ? "ies" : "y"}</span>
          <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/40">{categories.reduce((sum, c) => sum + c.productCount, 0)} total products</span>
        </div>
      </motion.div>
      <div className="flex items-center justify-between pt-4"><div className="h-px flex-1 bg-blue-primary/8" /><span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">[INV.CAT.END]</span><div className="h-px flex-1 bg-blue-primary/8" /></div>

      <CategoryDialog open={modalOpen} mode={modalMode} initialName={editCategory?.name ?? ""} initialDescription={editCategory?.description ?? ""} existingNames={categories.map((c) => c.name)} editId={editCategory?.id ?? null} isSubmitting={isSubmitting} onClose={() => setModalOpen(false)} onSubmit={handleDialogSubmit} />
      <CategoryDeleteDialog open={!!deleteTarget} categoryName={deleteTarget?.name ?? ""} productCount={deleteTarget?.productCount ?? 0} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
    </div>
  )
}
