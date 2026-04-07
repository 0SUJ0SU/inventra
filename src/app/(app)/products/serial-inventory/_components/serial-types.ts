export interface SerialListItem {
  id: string
  serialNumber: string
  productId: string
  status: string
  condition: string
  purchaseDate: string | null
  purchaseCost: number | null
  soldDate: string | null
  soldPrice: number | null
  warrantyMonths: number | null
  warrantyExpiry: string | null
  notes: string | null
  createdAt: string
  product: { id: string; name: string; sku: string }
  customer: { id: string; name: string } | null
}

export type SerialStatus = "in_stock" | "sold" | "reserved" | "defective" | "in_repair" | "scrapped"
export type SerialCondition = "new" | "good" | "damaged" | "defective"

export const STATUS_CONFIG: Record<SerialStatus, { label: string; color: string; bg: string }> = {
  in_stock: { label: "In Stock", color: "text-emerald-700", bg: "bg-emerald-700/10" },
  sold: { label: "Sold", color: "text-blue-primary", bg: "bg-blue-primary/8" },
  reserved: { label: "Reserved", color: "text-amber-600", bg: "bg-amber-600/10" },
  defective: { label: "Defective", color: "text-error", bg: "bg-error/10" },
  in_repair: { label: "In Repair", color: "text-orange-600", bg: "bg-orange-600/10" },
  scrapped: { label: "Scrapped", color: "text-blue-primary/40", bg: "bg-blue-primary/5" },
}

export const CONDITION_CONFIG: Record<SerialCondition, { label: string; color: string; bg: string }> = {
  new: { label: "New", color: "text-emerald-700", bg: "bg-emerald-700/10" },
  good: { label: "Good", color: "text-blue-primary", bg: "bg-blue-primary/8" },
  damaged: { label: "Damaged", color: "text-amber-600", bg: "bg-amber-600/10" },
  defective: { label: "Defective", color: "text-error", bg: "bg-error/10" },
}

export const SERIAL_STATUSES: SerialStatus[] = ["in_stock", "sold", "reserved", "defective", "in_repair", "scrapped"]
export const SERIAL_CONDITIONS: SerialCondition[] = ["new", "good", "damaged", "defective"]

export function getWarrantyStatus(item: SerialListItem): "active" | "expiring_soon" | "expired" | "n/a" {
  if (!item.warrantyExpiry) return "n/a"
  const now = new Date()
  const expiry = new Date(item.warrantyExpiry)
  if (expiry < now) return "expired"
  const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (daysLeft <= 30) return "expiring_soon"
  return "active"
}

export function getWarrantyDaysRemaining(item: SerialListItem): number | null {
  if (!item.warrantyExpiry) return null
  const now = new Date()
  const expiry = new Date(item.warrantyExpiry)
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}
