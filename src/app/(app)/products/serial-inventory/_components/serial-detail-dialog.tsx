"use client"

import { useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, Barcode, Package, Tag, DollarSign, CalendarDays, User } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { STATUS_CONFIG, CONDITION_CONFIG, getWarrantyStatus, getWarrantyDaysRemaining, type SerialListItem } from "./serial-types"

const ease = [0.16, 1, 0.3, 1] as const

function DetailRow({ icon: Icon, label, displayText }: { icon: React.ElementType; label: string; displayText: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={12} strokeWidth={1.5} className="text-blue-primary/20 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-blue-primary/30 block leading-none">{label}</span>
        <span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/70 block mt-0.5 leading-snug truncate">{displayText}</span>
      </div>
    </div>
  )
}

export function SerialDetailDialog({ item, onClose }: { item: SerialListItem | null; onClose: () => void }) {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)
  if (!mounted || !item) return null

  const warrantyStatus = getWarrantyStatus(item)
  const warrantyDays = getWarrantyDaysRemaining(item)
  const statusCfg = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.in_stock
  const conditionCfg = CONDITION_CONFIG[item.condition as keyof typeof CONDITION_CONFIG] ?? CONDITION_CONFIG.new
  const warrantyCfg = { active: { color: "text-emerald-700", bg: "bg-emerald-700/10", label: "Active" }, expiring_soon: { color: "text-amber-600", bg: "bg-amber-600/10", label: "Expiring" }, expired: { color: "text-error", bg: "bg-error/10", label: "Expired" }, "n/a": { color: "text-blue-primary/30", bg: "bg-blue-primary/5", label: "N/A" } }[warrantyStatus]

  return createPortal(
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-blue-primary/20 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="w-full max-w-2xl max-h-[85vh] bg-cream-primary border border-blue-primary/10 shadow-lg flex flex-col" initial={{ y: 30, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.97 }} transition={{ duration: 0.3, ease }} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
            <div className="flex items-center gap-3 min-w-0"><Barcode size={16} strokeWidth={1.5} className="text-blue-primary/40 shrink-0" /><p className="font-mono text-[11px] tracking-[0.08em] uppercase text-blue-primary truncate">{item.serialNumber}</p></div>
            <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-blue-primary/30 hover:text-blue-primary transition-colors shrink-0"><X size={14} strokeWidth={2} /></button>
          </div>
          <div className="p-5 space-y-5 overflow-y-auto flex-1">
            <div className="grid grid-cols-3 gap-px bg-blue-primary/10 border border-blue-primary/10">
              <div className="bg-cream-light px-4 py-3 text-center">
                <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/40 block mb-1.5">Status</span>
                <span className={`inline-block font-mono text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 ${statusCfg.color} ${statusCfg.bg}`}>{statusCfg.label}</span>
              </div>
              <div className="bg-cream-light px-4 py-3 text-center">
                <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/40 block mb-1.5">Condition</span>
                <span className={`inline-block font-mono text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 ${conditionCfg.color} ${conditionCfg.bg}`}>{conditionCfg.label}</span>
              </div>
              <div className="bg-cream-light px-4 py-3 text-center">
                <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-blue-primary/40 block mb-1.5">Warranty</span>
                <span className={`inline-block font-mono text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 ${warrantyCfg.color} ${warrantyCfg.bg}`}>{warrantyCfg.label}</span>
                {warrantyDays !== null && <span className={`font-mono text-[8px] tracking-[0.06em] block mt-1 ${warrantyDays <= 30 ? "text-amber-600" : "text-blue-primary/30"}`}>{warrantyDays > 0 ? `${warrantyDays} days remaining` : `Expired ${Math.abs(warrantyDays)} days ago`}</span>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 pb-1 border-b border-blue-primary/8">Product Info</p>
                <DetailRow icon={Package} label="Product" displayText={item.product.name} />
                <DetailRow icon={Tag} label="Cost" displayText={item.purchaseCost != null ? formatCurrency(item.purchaseCost) : "-"} />
                {item.soldPrice != null && <DetailRow icon={DollarSign} label="Sold For" displayText={formatCurrency(item.soldPrice)} />}
              </div>
              <div className="space-y-3">
                <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 pb-1 border-b border-blue-primary/8">Transaction Info</p>
                <DetailRow icon={CalendarDays} label="Purchased" displayText={item.purchaseDate ? formatDate(item.purchaseDate) : "-"} />
                <DetailRow icon={User} label="Customer" displayText={item.customer?.name ?? "-"} />
                {item.soldDate && <DetailRow icon={CalendarDays} label="Sold" displayText={formatDate(item.soldDate)} />}
              </div>
            </div>
            {item.notes && (
              <div>
                <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/40 pb-1 border-b border-blue-primary/8 mb-2">Notes</p>
                <div className="p-3 bg-cream-light border border-blue-primary/8"><p className="font-mono text-[10px] tracking-[0.03em] text-blue-primary/60 leading-relaxed">{item.notes}</p></div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end px-5 py-3 border-t border-blue-primary/8">
            <button onClick={onClose} className="h-9 px-5 border border-blue-primary/15 font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/50 hover:text-blue-primary hover:border-blue-primary/30 transition-colors">Close</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
