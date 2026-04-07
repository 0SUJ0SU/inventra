"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Pencil, Power, Trash2, Barcode, Loader2 } from "lucide-react"
import { ProductStatCards } from "./_components/product-stat-cards"
import { ProductInfoPanels } from "./_components/product-info-panels"
import type { ProductListItem } from "../_components/product-types"

const ease = [0.16, 1, 0.3, 1] as const

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = String(params.id)

  const [product, setProduct] = useState<ProductListItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true)
      const res = await fetch(`/api/products/${productId}`)
      if (!res.ok) { setNotFound(true); setIsLoading(false); return }
      const json = await res.json()
      setProduct(json.product)
      setIsLoading(false)
    }
    fetchProduct()
  }, [productId])

  const handleToggleStatus = async () => {
    if (!product) return
    await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !product.isActive }),
    })
    setProduct((prev) => prev ? { ...prev, isActive: !prev.isActive } : prev)
  }

  const handleDelete = async () => {
    if (!product || !confirm("Delete this product?")) return
    await fetch(`/api/products/${product.id}`, { method: "DELETE" })
    router.push("/products")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={24} strokeWidth={1.5} className="text-blue-primary/40 animate-spin" />
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/30">Loading product...</p>
        </div>
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="font-mono text-[12px] tracking-[0.1em] uppercase text-blue-primary/40">Product not found</p>
        <button onClick={() => router.push("/products")} className="mt-4 font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/60 hover:text-blue-primary flex items-center gap-2 transition-colors">
          <ArrowLeft size={12} strokeWidth={1.5} /> Back to products
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <motion.button onClick={() => router.push("/products")} className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/40 hover:text-blue-primary flex items-center gap-2 transition-colors w-fit" initial={{ x: -20 }} animate={{ x: 0 }} transition={{ duration: 0.4, ease }}>
          <ArrowLeft size={12} strokeWidth={1.5} /> Back to products
        </motion.button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.div className="flex items-center gap-3 mb-1.5" initial={{ x: -20 }} animate={{ x: 0 }} transition={{ duration: 0.5, ease }}>
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/40">{product.sku}</span>
              <span className={`font-mono text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 ${product.isActive ? "bg-blue-primary/8 text-blue-primary" : "bg-blue-primary/4 text-blue-primary/30"}`}>{product.isActive ? "Active" : "Inactive"}</span>
              {product.isSerialTracked && <span className="flex items-center gap-1 font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/35"><Barcode size={10} strokeWidth={1.5} /> Serial</span>}
            </motion.div>
            <motion.h1 className="font-sans text-3xl lg:text-4xl font-bold tracking-tight text-blue-primary leading-none" initial={{ x: -30 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.03, ease }}>{product.name}</motion.h1>
          </div>
          <motion.div className="flex items-center gap-2" initial={{ x: 20 }} animate={{ x: 0 }} transition={{ duration: 0.4, delay: 0.08, ease }}>
            <button onClick={() => router.push(`/products/${product.id}/edit`)} className="h-9 px-4 bg-blue-primary text-cream-primary font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:bg-blue-dark transition-colors"><Pencil size={12} strokeWidth={1.5} /> Edit</button>
            <button onClick={handleToggleStatus} className="h-9 px-3 border border-blue-primary/15 text-blue-primary/50 font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:border-blue-primary/30 hover:text-blue-primary transition-colors"><Power size={12} strokeWidth={1.5} /> {product.isActive ? "Deactivate" : "Activate"}</button>
            <button onClick={handleDelete} className="h-9 px-3 border border-blue-primary/15 text-error/50 font-mono text-[10px] tracking-[0.12em] uppercase flex items-center gap-2 hover:border-error/30 hover:text-error transition-colors"><Trash2 size={12} strokeWidth={1.5} /></button>
          </motion.div>
        </div>
      </div>
      <div className="h-px bg-blue-primary/10" />
      <ProductStatCards product={product} />
      <ProductInfoPanels product={product} />
      <div className="flex items-center justify-between"><div className="h-px flex-1 bg-blue-primary/8" /><span className="font-mono text-[8px] tracking-[0.2em] text-blue-primary/15 px-4">[INV.PROD.DETAIL]</span><div className="h-px flex-1 bg-blue-primary/8" /></div>
    </div>
  )
}
