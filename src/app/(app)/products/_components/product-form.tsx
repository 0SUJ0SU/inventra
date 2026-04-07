"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Plus, ImageIcon, Barcode, RefreshCw, AlertTriangle } from "lucide-react"
import { FieldLabel, TextInput, FormCard } from "./form-primitives"
import { ProductFormPricing } from "./product-form-pricing"
import type { CategoryOption, ProductListItem } from "./product-types"

export interface ProductFormData {
  sku: string; name: string; categoryId: string; description: string
  costPrice: string; sellingPrice: string; stock: string; minStock: string
  isSerialTracked: boolean; warrantyMonths: string; isActive: boolean
}

interface ProductFormProps {
  mode: "add" | "edit"
  categories: CategoryOption[]
  initialData?: ProductListItem
  onSubmit: (data: ProductFormData) => Promise<void>
  onSubmitAndNew?: (data: ProductFormData) => Promise<void>
}

function validate(data: ProductFormData): Record<string, string> {
  const e: Record<string, string> = {}
  if (!data.sku.trim() || data.sku.trim().length < 3) e.sku = data.sku.trim() ? "Min 3 characters" : "Required"
  if (!data.name.trim() || data.name.trim().length < 2) e.name = data.name.trim() ? "Min 2 characters" : "Required"
  if (!data.categoryId) e.categoryId = "Required"
  if (isNaN(parseFloat(data.costPrice)) || parseFloat(data.costPrice) < 0) e.costPrice = "Invalid"
  if (isNaN(parseFloat(data.sellingPrice)) || parseFloat(data.sellingPrice) <= 0) e.sellingPrice = "Invalid"
  if (!data.isSerialTracked && (isNaN(parseInt(data.stock)) || parseInt(data.stock) < 0)) e.stock = "Invalid"
  if (isNaN(parseInt(data.minStock)) || parseInt(data.minStock) < 0) e.minStock = "Invalid"
  if (data.isSerialTracked && (isNaN(parseInt(data.warrantyMonths)) || parseInt(data.warrantyMonths) < 0)) e.warrantyMonths = "Invalid"
  return e
}

function generateSku(name: string, categoryId: string, cats: CategoryOption[]): string {
  const cat = cats.find((c) => c.id === categoryId)
  const catCode = cat ? cat.name.slice(0, 3).toUpperCase() : "GEN"
  const words = name.toUpperCase().replace(/[^A-Z0-9\s]/g, "").split(/\s+/).filter(Boolean)
  const nameCode = words.length >= 2 ? words[0].slice(0, 3) + "-" + words[1].slice(0, 3) : words[0]?.slice(0, 6) ?? "PROD"
  return `${catCode}-${nameCode}-${Math.floor(Math.random() * 90 + 10)}`.toUpperCase()
}

const ease = [0.16, 1, 0.3, 1] as const

export function ProductForm({ mode, categories, initialData, onSubmit, onSubmitAndNew }: ProductFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<ProductFormData>(() => initialData ? {
    sku: initialData.sku, name: initialData.name, categoryId: initialData.categoryId,
    description: initialData.description ?? "", costPrice: String(initialData.costPrice),
    sellingPrice: String(initialData.sellingPrice), stock: String(initialData.stock),
    minStock: String(initialData.minStock), isSerialTracked: initialData.isSerialTracked,
    warrantyMonths: String(initialData.warrantyMonths ?? 0), isActive: initialData.isActive,
  } : { sku: "", name: "", categoryId: "", description: "", costPrice: "", sellingPrice: "", stock: "0", minStock: "5", isSerialTracked: false, warrantyMonths: "12", isActive: true })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = useCallback((key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => { const next = { ...prev }; delete next[key]; return next })
  }, [])

  const handleSerialToggle = (checked: boolean) => {
    setForm((prev) => ({ ...prev, isSerialTracked: checked, ...(checked ? { stock: "0" } : {}) }))
    setErrors((prev) => { const next = { ...prev }; delete next.isSerialTracked; if (checked) delete next.stock; return next })
  }

  const handleSubmit = async (andNew = false) => {
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setIsSubmitting(true)
    try { andNew && onSubmitAndNew ? await onSubmitAndNew(form) : await onSubmit(form) } finally { setIsSubmitting(false) }
  }

  const showSerialWarning = mode === "edit" && form.isSerialTracked && !initialData?.isSerialTracked && (initialData?.stock ?? 0) > 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <motion.button onClick={() => router.push("/products")} className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/40 hover:text-blue-primary flex items-center gap-2 transition-colors w-fit" initial={{ x: -20 }} animate={{ x: 0 }} transition={{ duration: 0.4, ease }}>
          <ArrowLeft size={12} strokeWidth={1.5} /> Back to products
        </motion.button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <motion.h1 className="font-sans text-3xl lg:text-4xl font-bold tracking-tight text-blue-primary leading-none" initial={{ x: -30 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.03, ease }}>{mode === "add" ? "Add Product" : "Edit Product"}</motion.h1>
          <motion.span className="font-mono text-[10px] tracking-[0.15em] text-blue-primary/20 hidden sm:block" initial={{ x: 20 }} animate={{ x: 0 }} transition={{ duration: 0.4, delay: 0.1, ease }}>{mode === "add" ? "[INV.PROD.NEW]" : "[INV.PROD.EDIT]"}</motion.span>
        </div>
      </div>
      <div className="h-px bg-blue-primary/10" />
      <motion.div className="space-y-4" initial={{ y: 25 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormCard title="Product Image"><div className="h-28 border border-dashed border-blue-primary/15 flex items-center justify-center gap-3 cursor-pointer hover:border-blue-primary/30 transition-colors"><ImageIcon size={20} strokeWidth={1} className="text-blue-primary/20" /><div><p className="font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/30">Click to upload</p><p className="font-mono text-[7px] tracking-[0.1em] uppercase text-blue-primary/15 mt-0.5">PNG, JPG up to 2MB</p></div></div></FormCard>
          <FormCard title="Status"><button type="button" onClick={() => update("isActive", !form.isActive)} className={`w-full h-28 border font-mono text-[10px] tracking-[0.12em] uppercase flex flex-col items-center justify-center gap-2 transition-colors ${form.isActive ? "bg-blue-primary/8 border-blue-primary/20 text-blue-primary" : "bg-transparent border-blue-primary/10 text-blue-primary/30"}`}><div className={`w-3 h-3 rounded-full ${form.isActive ? "bg-emerald-500" : "bg-blue-primary/20"}`} />{form.isActive ? "Active" : "Inactive"}<span className="font-mono text-[7px] tracking-[0.1em] uppercase text-blue-primary/20">Click to toggle</span></button></FormCard>
          <FormCard title="Serial Tracking"><button type="button" onClick={() => handleSerialToggle(!form.isSerialTracked)} className={`w-full h-28 border font-mono text-[10px] tracking-[0.12em] uppercase flex flex-col items-center justify-center gap-2 transition-colors ${form.isSerialTracked ? "bg-blue-primary/8 border-blue-primary/20 text-blue-primary" : "bg-transparent border-blue-primary/10 text-blue-primary/30"}`}><Barcode size={18} strokeWidth={1.5} />{form.isSerialTracked ? "Serial Tracked" : "Not Tracked"}<span className="font-mono text-[7px] tracking-[0.1em] uppercase text-blue-primary/20">Click to toggle</span></button></FormCard>
        </div>
        {showSerialWarning && <div className="p-3 border border-warning/20 bg-warning/5 flex items-start gap-2"><AlertTriangle size={13} strokeWidth={1.5} className="text-warning shrink-0" /><p className="font-mono text-[9px] tracking-[0.05em] uppercase text-warning/80 leading-relaxed">Enabling serial tracking on a product with existing stock requires assigning serial numbers to current units.</p></div>}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          <div className="lg:col-span-2 flex flex-col">
            <FormCard title="Basic Information" marker="/001" className="flex-1 flex flex-col">
              <div className="space-y-4 flex flex-col flex-1">
                <div><FieldLabel label="Product Name" required error={errors.name} /><TextInput value={form.name} onChange={(v) => update("name", v)} placeholder="e.g. iPhone 15 Pro 256GB" error={!!errors.name} /></div>
                <div><FieldLabel label="SKU" required error={errors.sku} /><div className="flex gap-2"><div className="flex-1"><TextInput value={form.sku} onChange={(v) => update("sku", v)} placeholder="e.g. IP15P-256-BK" error={!!errors.sku} /></div><button type="button" onClick={() => { if (form.name.trim()) update("sku", generateSku(form.name, form.categoryId, categories)) }} className="h-9 px-3 border border-blue-primary/10 text-blue-primary/40 hover:text-blue-primary hover:border-blue-primary/30 flex items-center gap-1.5 font-mono text-[8px] tracking-[0.1em] uppercase transition-colors shrink-0"><RefreshCw size={11} strokeWidth={1.5} /> Auto</button></div></div>
                <div><FieldLabel label="Category" required error={errors.categoryId} /><select value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)} className={`w-full h-9 px-3 bg-cream-light border font-mono text-[11px] tracking-[0.05em] uppercase text-blue-primary focus:outline-none transition-colors cursor-pointer appearance-none ${errors.categoryId ? "border-error/40 focus:border-error/60" : "border-blue-primary/10 focus:border-blue-primary/30"}`}><option value="">Select category...</option>{categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></div>
                <div className="flex flex-col flex-1"><FieldLabel label="Description" /><textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Product description..." className="w-full flex-1 px-3 py-2 bg-cream-light border border-blue-primary/10 font-mono text-[11px] tracking-[0.03em] text-blue-primary placeholder:text-blue-primary/20 focus:outline-none focus:border-blue-primary/30 transition-colors resize-none" /></div>
              </div>
            </FormCard>
          </div>
          <div className="flex flex-col">
            <ProductFormPricing costPrice={form.costPrice} sellingPrice={form.sellingPrice} stock={form.stock} minStock={form.minStock} warrantyMonths={form.warrantyMonths} isSerialTracked={form.isSerialTracked} errors={errors} onUpdate={update} />
          </div>
        </div>
      </motion.div>
      <motion.div className="border-t border-blue-primary/10 pt-4 pb-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3" initial={{ y: 15 }} animate={{ y: 0 }} transition={{ duration: 0.4, delay: 0.2, ease }}>
        <button type="button" onClick={() => router.push("/products")} className="h-10 px-5 border border-blue-primary/15 font-mono text-[10px] tracking-[0.12em] uppercase text-blue-primary/50 hover:text-blue-primary hover:border-blue-primary/30 flex items-center justify-center gap-2 transition-colors">Cancel</button>
        <div className="flex items-center gap-2">
          {mode === "add" && onSubmitAndNew && <button type="button" onClick={() => handleSubmit(true)} disabled={isSubmitting} className="h-10 px-5 border border-blue-primary/15 font-mono text-[10px] tracking-[0.12em] uppercase text-blue-primary/60 hover:text-blue-primary hover:border-blue-primary/30 flex items-center justify-center gap-2 transition-colors disabled:opacity-40"><Plus size={13} strokeWidth={1.5} /> Save & Add Another</button>}
          <button type="button" onClick={() => handleSubmit(false)} disabled={isSubmitting} className="h-10 px-6 bg-blue-primary text-cream-primary font-mono text-[10px] tracking-[0.12em] uppercase flex items-center justify-center gap-2 hover:bg-blue-dark transition-colors disabled:opacity-60"><Save size={13} strokeWidth={1.5} /> {isSubmitting ? "Saving..." : mode === "add" ? "Save Product" : "Update Product"}</button>
        </div>
      </motion.div>
      <div className="flex items-center justify-between"><div className="h-px flex-1 bg-blue-primary/8" /><span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">{mode === "add" ? "[INV.PROD.NEW.END]" : "[INV.PROD.EDIT.END]"}</span><div className="h-px flex-1 bg-blue-primary/8" /></div>
    </div>
  )
}
