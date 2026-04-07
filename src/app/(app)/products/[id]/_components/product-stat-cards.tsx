"use client"

import { motion } from "framer-motion"
import { Package, AlertTriangle, Barcode, ShieldCheck } from "lucide-react"
import { formatCurrency } from "@/lib/utils/format"
import type { ProductListItem } from "../../_components/product-types"

function StatCard({ label, metric, sub, color = "text-blue-primary" }: {
  label: string; metric: string | number; sub?: string; color?: string
}) {
  return (
    <div className="border border-blue-primary/10 bg-cream-light p-4">
      <div className="border-t-2 border-blue-primary pt-2.5">
        <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40">{label}</p>
        <p className={`font-mono text-2xl font-bold tracking-tight mt-1 ${color}`}>{metric}</p>
        {sub && <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/30 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function StatusCard({ title, icon: Icon, iconColor, label, sublabel, barPercent, barColor }: {
  title: string; icon: React.ElementType; iconColor: string; label: string; sublabel?: string; barPercent?: number; barColor?: string
}) {
  return (
    <div className="border border-blue-primary/10 bg-cream-light">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-blue-primary/8">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">{title}</p>
      </div>
      <div className="p-5 flex items-center gap-3">
        <Icon size={18} strokeWidth={1.5} className={`${iconColor} shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[11px] tracking-[0.08em] uppercase font-semibold text-blue-primary">{label}</p>
          {barPercent !== undefined && barColor && (
            <div className="h-1.5 bg-blue-primary/8 w-full mt-2">
              <div className={`h-full transition-all ${barColor}`} style={{ width: `${Math.min(100, barPercent)}%` }} />
            </div>
          )}
          {sublabel && <p className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/30 mt-0.5">{sublabel}</p>}
        </div>
      </div>
    </div>
  )
}

const ease = [0.16, 1, 0.3, 1] as const

export function ProductStatCards({ product }: { product: ProductListItem }) {
  const stockStatus = product.stock === 0 ? "out" : product.stock <= product.minStock ? "low" : "healthy"
  const stockColor = stockStatus === "out" ? "text-error" : stockStatus === "low" ? "text-warning" : "text-blue-primary"
  const barColor = stockStatus === "out" ? "bg-error" : stockStatus === "low" ? "bg-warning" : "bg-emerald-500"
  const barPercent = (product.stock / Math.max(product.minStock * 2, 1)) * 100
  const marginPercent = product.sellingPrice > 0 ? Math.round(((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100) : 0
  const warrantyMonths = product.warrantyMonths ?? 0

  return (
    <>
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease }}>
        <StatCard label="Current Stock" metric={product.stock} sub={`Min: ${product.minStock}`} color={stockColor} />
        <StatCard label="Selling Price" metric={formatCurrency(product.sellingPrice)} sub={`Cost: ${formatCurrency(product.costPrice)}`} />
        <StatCard label="Margin" metric={`${marginPercent}%`} sub={`${formatCurrency(product.sellingPrice - product.costPrice)} per unit`} />
        <StatCard label="Stock Value" metric={formatCurrency(product.stock * product.costPrice)} sub={`${product.stock} units × ${formatCurrency(product.costPrice)}`} />
      </motion.div>

      <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4" initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.12, ease }}>
        <StatusCard
          title="Stock Status"
          icon={stockStatus === "healthy" ? Package : AlertTriangle}
          iconColor={stockStatus === "healthy" ? "text-emerald-600" : stockColor}
          label={stockStatus === "healthy" ? "In Stock" : stockStatus === "low" ? "Low Stock" : "Out of Stock"}
          barPercent={barPercent}
          barColor={barColor}
        />
        <StatusCard
          title="Serial Tracking"
          icon={Barcode}
          iconColor="text-blue-primary/30"
          label={product.isSerialTracked ? "Serial Tracked" : "Not Tracked"}
          sublabel={product.isSerialTracked ? "Each unit has unique serial" : "Bulk quantity tracking"}
        />
        <StatusCard
          title="Warranty"
          icon={ShieldCheck}
          iconColor="text-blue-primary/30"
          label={warrantyMonths > 0 ? `${warrantyMonths} Month Warranty` : "No Warranty"}
          sublabel={warrantyMonths > 0 ? "From date of sale" : "Not applicable"}
        />
      </motion.div>
    </>
  )
}
