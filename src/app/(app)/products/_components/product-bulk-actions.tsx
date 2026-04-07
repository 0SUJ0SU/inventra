"use client"

import { motion } from "framer-motion"
import { Power, Trash2, X } from "lucide-react"

interface ProductBulkActionsProps {
  selectedCount: number
  onToggleStatus: () => void
  onDelete: () => void
  onClearSelection: () => void
}

export function ProductBulkActions({ selectedCount, onToggleStatus, onDelete, onClearSelection }: ProductBulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <motion.div
      className="bg-blue-primary text-cream-primary"
      initial={{ y: -10 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="px-4 h-9 flex items-center justify-center border-b border-cream-primary/10">
        <span className="font-mono text-[10px] tracking-[0.12em] uppercase">
          {selectedCount} item{selectedCount !== 1 && "s"} selected
        </span>
      </div>
      <div className="grid grid-cols-3 divide-x divide-cream-primary/10">
        <button onClick={onToggleStatus} className="font-mono text-[9px] tracking-[0.1em] uppercase text-cream-primary/70 hover:text-cream-primary hover:bg-cream-primary/5 flex items-center justify-center gap-1.5 h-9 transition-colors">
          <Power size={12} strokeWidth={1.5} /> Flip Status
        </button>
        <button onClick={onDelete} className="font-mono text-[9px] tracking-[0.1em] uppercase text-cream-primary/70 hover:text-cream-primary hover:bg-cream-primary/5 flex items-center justify-center gap-1.5 h-9 transition-colors">
          <Trash2 size={12} strokeWidth={1.5} /> Delete
        </button>
        <button onClick={onClearSelection} className="font-mono text-[9px] tracking-[0.1em] uppercase text-cream-primary/50 hover:text-cream-primary hover:bg-cream-primary/5 flex items-center justify-center gap-1.5 h-9 transition-colors">
          <X size={12} strokeWidth={1.5} /> Deselect
        </button>
      </div>
    </motion.div>
  )
}
