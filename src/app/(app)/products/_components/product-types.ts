export interface ProductListItem {
  id: string
  sku: string
  name: string
  categoryId: string
  category: { name: string }
  description: string | null
  costPrice: number
  sellingPrice: number
  stock: number
  minStock: number
  isSerialTracked: boolean
  warrantyMonths: number | null
  isActive: boolean
  image: string | null
  createdAt: string
}

export interface CategoryOption {
  id: string
  name: string
  description: string | null
  productCount: number
}

export type ProductSortKey = "sku" | "name" | "category" | "stock" | "sellingPrice" | "isActive"
export type SortDir = "asc" | "desc"
export type StockFilter = "all" | "low" | "out"
export type StatusFilter = "all" | "active" | "inactive"
export type SerialFilter = "all" | "yes" | "no"
