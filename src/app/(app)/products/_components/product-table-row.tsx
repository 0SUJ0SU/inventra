"use client"

import { useRouter } from "next/navigation"
import { Barcode, MoreHorizontal, Eye, Pencil, Power, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils/format"
import type { ProductListItem } from "./product-types"

interface ProductTableRowProps {
  product: ProductListItem
  isSelected: boolean
  onToggleSelect: (id: string) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
  isMenuOpen: boolean
  onToggleMenu: (id: string) => void
}

function stockColor(product: ProductListItem): string {
  if (product.stock === 0) return "text-error"
  if (product.stock <= product.minStock) return "text-warning"
  return "text-blue-primary"
}

function stockBadge(product: ProductListItem): { label: string; classes: string } | null {
  if (product.stock === 0) return { label: "OUT", classes: "bg-error/10 text-error" }
  if (product.stock <= product.minStock) return { label: "LOW", classes: "bg-warning/10 text-warning" }
  return null
}

const menuItemClass = "w-full flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-[0.1em] uppercase text-blue-primary/60 hover:bg-blue-primary/5 hover:text-blue-primary transition-colors"

export function ProductTableRow({
  product, isSelected, onToggleSelect, onDelete, onToggleStatus, isMenuOpen, onToggleMenu,
}: ProductTableRowProps) {
  const router = useRouter()
  const badge = stockBadge(product)

  return (
    <tr className={`border-b border-blue-primary/6 transition-colors duration-150 h-14 ${isSelected ? "bg-blue-primary/[0.03]" : "hover:bg-blue-primary/[0.02]"}`}>
      <td className="w-12 px-4 align-middle">
        <input type="checkbox" checked={isSelected} onChange={() => onToggleSelect(product.id)} className="w-3.5 h-3.5 accent-blue-primary cursor-pointer block" />
      </td>
      <td className="px-3 align-middle">
        <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary/50">{product.sku}</span>
      </td>
      <td className="px-3 align-middle">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 shrink-0 border border-blue-primary/10 bg-cream-primary flex items-center justify-center">
            <span className="font-mono text-[7px] tracking-[0.1em] uppercase text-blue-primary/20">{product.category.name.slice(0, 3)}</span>
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[11px] tracking-[0.04em] uppercase text-blue-primary truncate leading-none">{product.name}</p>
            <div className="flex items-center gap-2 mt-1">
              {product.isSerialTracked && (
                <span className="inline-flex items-center gap-1 font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/35 leading-none">
                  <Barcode size={9} strokeWidth={1.5} /> Serial
                </span>
              )}
              {product.warrantyMonths != null && product.warrantyMonths > 0 && (
                <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-blue-primary/25 leading-none">{product.warrantyMonths}mo warranty</span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 align-middle">
        <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-blue-primary/50">{product.category.name}</span>
      </td>
      <td className="px-3 align-middle text-right">
        <div className="flex items-center justify-end gap-2">
          <span className={`font-mono text-[12px] tracking-[0.05em] font-semibold leading-none ${stockColor(product)}`}>{product.stock}</span>
          {badge && <span className={`font-mono text-[7px] tracking-[0.15em] uppercase px-1.5 py-0.5 leading-none ${badge.classes}`}>{badge.label}</span>}
        </div>
        <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/25 block mt-1 leading-none">min: {product.minStock}</span>
      </td>
      <td className="px-3 align-middle text-right">
        <span className="font-mono text-[12px] tracking-[0.03em] font-semibold text-blue-primary leading-none block">{formatCurrency(product.sellingPrice)}</span>
        <span className="font-mono text-[8px] tracking-[0.08em] uppercase text-blue-primary/25 block mt-1 leading-none">cost: {formatCurrency(product.costPrice)}</span>
      </td>
      <td className="px-3 align-middle text-center">
        <span className={`inline-block font-mono text-[8px] tracking-[0.15em] uppercase px-2 py-1 leading-none ${product.isActive ? "bg-blue-primary/8 text-blue-primary" : "bg-blue-primary/4 text-blue-primary/30"}`}>
          {product.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="w-12 px-3 align-middle text-center relative">
        <button onClick={() => onToggleMenu(product.id)} className="p-1 text-blue-primary/30 hover:text-blue-primary transition-colors">
          <MoreHorizontal size={14} strokeWidth={1.5} />
        </button>
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => onToggleMenu(product.id)} />
            <div className="absolute right-3 top-full z-20 w-36 bg-cream-primary border border-blue-primary/10 shadow-sm py-1">
              <button onClick={() => { onToggleMenu(product.id); router.push(`/products/${product.id}`) }} className={menuItemClass}><Eye size={12} strokeWidth={1.5} /> View</button>
              <button onClick={() => { onToggleMenu(product.id); router.push(`/products/${product.id}/edit`) }} className={menuItemClass}><Pencil size={12} strokeWidth={1.5} /> Edit</button>
              <button onClick={() => { onToggleStatus(product.id); onToggleMenu(product.id) }} className={menuItemClass}><Power size={12} strokeWidth={1.5} /> {product.isActive ? "Deactivate" : "Activate"}</button>
              <div className="h-px bg-blue-primary/8 mx-2 my-1" />
              <button onClick={() => { if (confirm("Delete this product?")) { onDelete(product.id); onToggleMenu(product.id) } }} className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-[0.1em] uppercase text-error/60 hover:bg-error/5 hover:text-error transition-colors">
                <Trash2 size={12} strokeWidth={1.5} /> Delete
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  )
}
