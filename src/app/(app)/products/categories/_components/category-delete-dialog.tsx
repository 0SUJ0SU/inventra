"use client"

import { useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2, AlertTriangle } from "lucide-react"

interface CategoryDeleteDialogProps {
  open: boolean
  categoryName: string
  productCount: number
  onClose: () => void
  onConfirm: () => void
}

const ease = [0.16, 1, 0.3, 1] as const

export function CategoryDeleteDialog({ open, categoryName, productCount, onClose, onConfirm }: CategoryDeleteDialogProps) {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-blue-primary/20 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="w-full max-w-sm bg-cream-primary border border-blue-primary/10 shadow-lg"
              initial={{ y: 30, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.97 }}
              transition={{ duration: 0.3, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-error/70">Delete Category</p>
                <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-blue-primary/30 hover:text-blue-primary transition-colors"><X size={14} strokeWidth={2} /></button>
              </div>
              <div className="p-5 space-y-3">
                <p className="font-mono text-[11px] tracking-[0.04em] uppercase text-blue-primary leading-relaxed">
                  Are you sure you want to delete <span className="font-semibold">{categoryName}</span>?
                </p>
                {productCount > 0 && (
                  <div className="p-3 border border-warning/20 bg-warning/5 flex items-start gap-2">
                    <AlertTriangle size={13} strokeWidth={1.5} className="text-warning shrink-0 mt-0.5" />
                    <p className="font-mono text-[9px] tracking-[0.05em] uppercase text-warning/80 leading-relaxed">
                      This category has {productCount} product{productCount !== 1 && "s"}. Delete or reassign them first.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-blue-primary/8">
                <button onClick={onClose} className="h-9 px-4 border border-blue-primary/15 font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/50 hover:text-blue-primary hover:border-blue-primary/30 transition-colors">Cancel</button>
                <button onClick={onConfirm} disabled={productCount > 0} className="h-9 px-5 bg-error text-white font-mono text-[9px] tracking-[0.12em] uppercase flex items-center gap-2 hover:bg-error/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  <Trash2 size={12} strokeWidth={1.5} /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
