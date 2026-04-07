"use client"

import { useState, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Pencil } from "lucide-react"

interface CategoryDialogProps {
  open: boolean
  mode: "add" | "edit"
  initialName: string
  initialDescription: string
  existingNames: string[]
  editId: string | null
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (name: string, description: string) => void
}

const ease = [0.16, 1, 0.3, 1] as const

export function CategoryDialog({
  open, mode, initialName, initialDescription,
  existingNames, editId, isSubmitting, onClose, onSubmit,
}: CategoryDialogProps) {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [prevInitialName, setPrevInitialName] = useState(initialName)
  const [prevInitialDescription, setPrevInitialDescription] = useState(initialDescription)

  if (prevInitialName !== initialName || prevInitialDescription !== initialDescription) {
    setPrevInitialName(initialName)
    setPrevInitialDescription(initialDescription)
    setName(initialName)
    setDescription(initialDescription)
    setErrors({})
  }

  const handleSubmit = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = "Required"
    else if (name.trim().length < 2) errs.name = "Min 2 characters"
    else if (existingNames.some((n) => n.toLowerCase() === name.trim().toLowerCase() && (!editId || n.toLowerCase() !== initialName.toLowerCase()))) errs.name = "Already exists"
    if (description.trim().length > 200) errs.description = "Max 200 characters"
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit(name.trim(), description.trim())
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-blue-primary/20 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="w-full max-w-md bg-cream-primary border border-blue-primary/10 shadow-lg"
              initial={{ y: 30, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.97 }}
              transition={{ duration: 0.3, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-blue-primary/8">
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/50">{mode === "add" ? "New Category" : "Edit Category"}</p>
                <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-blue-primary/30 hover:text-blue-primary transition-colors"><X size={14} strokeWidth={2} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50">Category Name<span className="text-error ml-0.5">*</span></label>
                    {errors.name && <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-error">{errors.name}</span>}
                  </div>
                  <input
                    type="text" value={name} autoFocus
                    onChange={(e) => { setName(e.target.value); setErrors((prev) => { const next = { ...prev }; delete next.name; return next }) }}
                    placeholder="e.g. Smartphones"
                    className={`w-full h-9 px-3 bg-cream-light border font-mono text-[11px] tracking-[0.05em] uppercase text-blue-primary placeholder:text-blue-primary/20 focus:outline-none transition-colors ${errors.name ? "border-error/40 focus:border-error/60" : "border-blue-primary/10 focus:border-blue-primary/30"}`}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-mono text-[9px] tracking-[0.15em] uppercase text-blue-primary/50">Description</label>
                    {errors.description && <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-error">{errors.description}</span>}
                  </div>
                  <textarea
                    value={description} rows={3}
                    onChange={(e) => { setDescription(e.target.value); setErrors((prev) => { const next = { ...prev }; delete next.description; return next }) }}
                    placeholder="Brief description of this category..."
                    className={`w-full px-3 py-2 bg-cream-light border font-mono text-[11px] tracking-[0.03em] text-blue-primary placeholder:text-blue-primary/20 focus:outline-none transition-colors resize-none ${errors.description ? "border-error/40 focus:border-error/60" : "border-blue-primary/10 focus:border-blue-primary/30"}`}
                  />
                  <p className="font-mono text-[7px] tracking-[0.1em] uppercase text-blue-primary/20 mt-1 text-right">{description.length}/200</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-blue-primary/8">
                <button onClick={onClose} disabled={isSubmitting} className="h-9 px-4 border border-blue-primary/15 font-mono text-[9px] tracking-[0.12em] uppercase text-blue-primary/50 hover:text-blue-primary hover:border-blue-primary/30 transition-colors disabled:opacity-40">Cancel</button>
                <button onClick={handleSubmit} disabled={isSubmitting} className="h-9 px-5 bg-blue-primary text-cream-primary font-mono text-[9px] tracking-[0.12em] uppercase flex items-center gap-2 hover:bg-blue-dark transition-colors disabled:opacity-60">
                  {mode === "add" ? <><Plus size={12} strokeWidth={1.5} /> {isSubmitting ? "Adding..." : "Add Category"}</> : <><Pencil size={12} strokeWidth={1.5} /> {isSubmitting ? "Updating..." : "Update"}</>}
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
