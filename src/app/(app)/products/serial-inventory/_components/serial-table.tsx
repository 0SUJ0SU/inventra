"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MoreHorizontal, Eye, Trash2, CircleDot, Barcode } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { STATUS_CONFIG, CONDITION_CONFIG, SERIAL_CONDITIONS, getWarrantyStatus, getWarrantyDaysRemaining, type SerialListItem, type SerialCondition } from "./serial-types"

const ease = [0.16, 1, 0.3, 1] as const
const thClass = "font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50 hover:text-blue-primary transition-colors"

const WARRANTY_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "text-emerald-700", bg: "bg-emerald-700/10" },
  expiring_soon: { label: "Expiring", color: "text-amber-600", bg: "bg-amber-600/10" },
  expired: { label: "Expired", color: "text-error", bg: "bg-error/10" },
  "n/a": { label: "N/A", color: "text-blue-primary/30", bg: "bg-blue-primary/5" },
}

interface SerialTableProps {
  items: SerialListItem[]
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  allOnPageSelected: boolean
  onViewDetail: (item: SerialListItem) => void
  onUpdateCondition: (id: string, condition: SerialCondition) => void
  onMarkScrapped: (id: string) => void
}

export function SerialTable({ items, selectedIds, onToggleSelect, onToggleSelectAll, allOnPageSelected, onViewDetail, onUpdateCondition, onMarkScrapped }: SerialTableProps) {
  const [menuId, setMenuId] = useState<string | null>(null)

  return (
    <motion.div className="border border-blue-primary/10 bg-cream-light overflow-hidden" initial={{ y: 30 }} animate={{ y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease }}>
      <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/40">Serial Number Registry</p>
        <span className="font-mono text-[9px] tracking-[0.1em] text-blue-primary/20">/001</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead><tr className="border-b border-blue-primary/10 h-11">
            <th className="w-12 px-4 align-middle"><input type="checkbox" checked={allOnPageSelected} onChange={onToggleSelectAll} className="w-3.5 h-3.5 accent-blue-primary cursor-pointer block" /></th>
            <th className="text-left px-3 align-middle"><span className={thClass}>Serial #</span></th>
            <th className="text-left px-3 align-middle"><span className={thClass}>Product</span></th>
            <th className="text-center px-3 align-middle"><span className={thClass}>Status</span></th>
            <th className="text-center px-3 align-middle"><span className={thClass}>Condition</span></th>
            <th className="text-left px-3 align-middle"><span className={thClass}>Purchased</span></th>
            <th className="text-left px-3 align-middle"><span className={thClass}>Customer</span></th>
            <th className="text-center px-3 align-middle"><span className={thClass}>Warranty</span></th>
            <th className="w-12 px-3 align-middle" />
          </tr></thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-16">
                <Barcode size={28} strokeWidth={1} className="text-blue-primary/15 mx-auto mb-3" />
                <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-blue-primary/30">No serial items found</p>
                <p className="font-mono text-[9px] tracking-[0.08em] uppercase text-blue-primary/20 mt-1">Serial items appear after stock is received via Purchase Orders</p>
              </td></tr>
            ) : items.map((serial) => {
              const isSelected = selectedIds.has(serial.id)
              const sCfg = STATUS_CONFIG[serial.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.in_stock
              const cCfg = CONDITION_CONFIG[serial.condition as keyof typeof CONDITION_CONFIG] ?? CONDITION_CONFIG.new
              const wStatus = getWarrantyStatus(serial)
              const wDays = getWarrantyDaysRemaining(serial)
              const wCfg = WARRANTY_BADGE[wStatus]
              return (
                <tr key={serial.id} className={`border-b border-blue-primary/6 transition-colors duration-150 h-14 ${isSelected ? "bg-blue-primary/[0.03]" : "hover:bg-blue-primary/[0.02]"}`}>
                  <td className="w-12 px-4 align-middle"><input type="checkbox" checked={isSelected} onChange={() => onToggleSelect(serial.id)} className="w-3.5 h-3.5 accent-blue-primary cursor-pointer block" /></td>
                  <td className="px-3 align-middle"><button onClick={() => onViewDetail(serial)} className="font-mono text-[10px] tracking-[0.06em] uppercase text-blue-primary hover:underline underline-offset-2 decoration-blue-primary/30 text-left">{serial.serialNumber}</button></td>
                  <td className="px-3 align-middle"><p className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary truncate max-w-[200px] leading-none">{serial.product.name}</p>{serial.purchaseCost != null && <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/25 mt-1 block leading-none">{formatCurrency(serial.purchaseCost)} cost</span>}</td>
                  <td className="px-3 align-middle text-center"><span className={`inline-block font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-1 leading-none ${sCfg.color} ${sCfg.bg}`}>{sCfg.label}</span></td>
                  <td className="px-3 align-middle text-center"><span className={`inline-block font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-1 leading-none ${cCfg.color} ${cCfg.bg}`}>{cCfg.label}</span></td>
                  <td className="px-3 align-middle"><span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50">{serial.purchaseDate ? formatDate(serial.purchaseDate) : "-"}</span></td>
                  <td className="px-3 align-middle"><span className="font-mono text-[10px] tracking-[0.04em] uppercase text-blue-primary/50">{serial.customer?.name ?? "-"}</span></td>
                  <td className="px-3 align-middle text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className={`inline-block font-mono text-[8px] tracking-[0.12em] uppercase px-2 py-1 leading-none ${wCfg.color} ${wCfg.bg}`}>{wCfg.label}</span>
                      {wDays !== null && wDays > 0 && wDays <= 30 && <span className="font-mono text-[7px] tracking-[0.08em] text-amber-600 leading-none">{wDays}d</span>}
                    </div>
                  </td>
                  <td className="w-12 px-3 align-middle text-center relative">
                    <button onClick={() => setMenuId(menuId === serial.id ? null : serial.id)} className="p-1 text-blue-primary/30 hover:text-blue-primary transition-colors"><MoreHorizontal size={14} strokeWidth={1.5} /></button>
                    {menuId === serial.id && (<>
                      <div className="fixed inset-0 z-10" onClick={() => setMenuId(null)} />
                      <div className="absolute right-3 top-full z-20 w-40 bg-cream-primary border border-blue-primary/10 shadow-sm py-1">
                        <button onClick={() => { setMenuId(null); onViewDetail(serial) }} className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/60 hover:bg-blue-primary/5 hover:text-blue-primary transition-colors"><Eye size={12} strokeWidth={1.5} /> View Details</button>
                        {serial.status !== "scrapped" && (<>
                          <div className="h-px bg-blue-primary/8 mx-2 my-1" />
                          <p className="px-3 pt-1.5 pb-1 font-mono text-[7px] tracking-[0.15em] uppercase text-blue-primary/30">Set Condition</p>
                          {SERIAL_CONDITIONS.map((condKey) => { const cfg = CONDITION_CONFIG[condKey]; const isCurrent = serial.condition === condKey; return (
                            <button key={condKey} onClick={() => { onUpdateCondition(serial.id, condKey); setMenuId(null) }} className={`w-full flex items-center gap-2 px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] uppercase transition-colors ${isCurrent ? `${cfg.color} ${cfg.bg}` : "text-blue-primary/50 hover:bg-blue-primary/5 hover:text-blue-primary"}`}>
                              <CircleDot size={10} strokeWidth={isCurrent ? 2.5 : 1.5} /> {cfg.label} {isCurrent && <span className="ml-auto font-mono text-[7px] tracking-[0.1em] opacity-50">current</span>}
                            </button>
                          )})}
                          <div className="h-px bg-blue-primary/8 mx-2 my-1" />
                          <button onClick={() => { onMarkScrapped(serial.id); setMenuId(null) }} className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-[0.1em] uppercase text-error/60 hover:bg-error/5 hover:text-error transition-colors"><Trash2 size={12} strokeWidth={1.5} /> Mark Scrapped</button>
                        </>)}
                      </div>
                    </>)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
