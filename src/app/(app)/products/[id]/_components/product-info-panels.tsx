"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Barcode, Clock, Package } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import type { ProductListItem } from "../../_components/product-types"

function CardHeader({ title, marker }: { title: string; marker?: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-2.5 border-b border-blue-primary/8">
      <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">{title}</p>
      {marker && <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">{marker}</span>}
    </div>
  )
}

function InfoRow({ label, content, mono = false }: { label: string; content: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-blue-primary/6 last:border-b-0">
      <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 shrink-0">{label}</span>
      <span className={`text-right ${mono ? "font-mono text-[11px] tracking-[0.05em] uppercase" : "font-mono text-[11px] tracking-[0.03em]"} text-blue-primary`}>{content}</span>
    </div>
  )
}

const ease = [0.16, 1, 0.3, 1] as const

export function ProductInfoPanels({ product }: { product: ProductListItem }) {
  const stockColor = product.stock === 0 ? "text-error" : product.stock <= product.minStock ? "text-warning" : "text-blue-primary"
  const marginPercent = product.sellingPrice > 0 ? Math.round(((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100) : 0

  return (
    <>
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch" initial={{ y: 25 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease }}>
        <div className="lg:col-span-2 flex flex-col">
          <div className="border border-blue-primary/10 bg-cream-light flex-1">
            <CardHeader title="Product Details" marker="/001" />
            <div className="px-5 py-2">
              <InfoRow label="Product Name" content={product.name} mono />
              <InfoRow label="SKU" content={product.sku} mono />
              <InfoRow label="Category" content={product.category.name} mono />
              <InfoRow label="Description" content={<span className="max-w-xs text-blue-primary/70 normal-case">{product.description ?? "—"}</span>} />
              <InfoRow label="Created" content={formatDate(product.createdAt)} mono />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="border border-blue-primary/10 bg-cream-light flex-1">
            <CardHeader title="Pricing & Stock" marker="/002" />
            <div className="px-5 py-2">
              <InfoRow label="Selling Price" content={formatCurrency(product.sellingPrice)} mono />
              <InfoRow label="Cost Price" content={formatCurrency(product.costPrice)} mono />
              <InfoRow label="Margin" content={`${marginPercent}%`} mono />
              <InfoRow label="Current Stock" content={<span className={stockColor}>{product.stock}</span>} mono />
              <InfoRow label="Min Stock" content={product.minStock} mono />
              <InfoRow label="Unit" content="PCS" mono />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-4" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.18, ease }}>
        <div className="border border-blue-primary/10 bg-cream-light">
          <CardHeader title="Recent Transactions" marker="/003" />
          <div className="px-5 py-6 flex items-center justify-center gap-2">
            <Clock size={14} strokeWidth={1} className="text-blue-primary/15" />
            <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/25">Transaction history coming in Sales module</p>
          </div>
        </div>
        {product.isSerialTracked ? (
          <div className="border border-blue-primary/10 bg-cream-light">
            <CardHeader title="Serial Numbers" marker="/004" />
            <div className="px-5 py-6 flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <Barcode size={14} strokeWidth={1} className="text-blue-primary/15" />
                <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/25">View in Serial Inventory</p>
              </div>
              <Link href="/products/serial-inventory" className="mt-1 font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/40 hover:text-blue-primary border-b border-blue-primary/15 hover:border-blue-primary/40 pb-0.5 transition-colors">View All Serials</Link>
            </div>
          </div>
        ) : (
          <div className="border border-blue-primary/10 bg-cream-light">
            <CardHeader title="Tracking Info" marker="/004" />
            <div className="px-5 py-6 flex items-center justify-center gap-2">
              <Package size={14} strokeWidth={1} className="text-blue-primary/15" />
              <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/25">Bulk quantity — no serial tracking</p>
            </div>
          </div>
        )}
      </motion.div>
    </>
  )
}
