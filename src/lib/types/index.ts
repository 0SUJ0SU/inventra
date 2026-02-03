// Core TypeScript types for Inventra
// Based on FEATURES.md data models

// =====================
// Enums / Union Types
// =====================

export type SerialStatus =
  | "in_stock"
  | "sold"
  | "reserved"
  | "defective"
  | "in_repair"
  | "scrapped"

export type SerialCondition = "new" | "good" | "damaged" | "defective"

export type ClaimStatus =
  | "pending"
  | "in_review"
  | "in_repair"
  | "repaired"
  | "replaced"
  | "rejected"
  | "closed"

export type ClaimType =
  | "customer_to_store"
  | "store_to_supplier"
  | "supplier_to_store"

export type PaymentMethod = "cash" | "card" | "transfer"

export type ExpenseCategory =
  | "rent"
  | "utilities"
  | "supplies"
  | "marketing"
  | "maintenance"
  | "other"

export type StockInStatus = "pending" | "completed" | "partial"

// =====================
// Base Types
// =====================

export interface Category {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  sku: string
  name: string
  categoryId: string
  description?: string
  costPrice: number
  sellingPrice: number
  stock: number
  minStock: number
  unit: string
  image?: string
  isActive: boolean
  isSerialTracked: boolean
  warrantyMonths: number
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Supplier {
  id: string
  name: string
  contactPerson?: string
  phone: string
  email?: string
  address?: string
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Employee {
  id: string
  name: string
  role: string
  phone: string
  email?: string
  address?: string
  hireDate: Date
  salary?: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// =====================
// Serial Tracking Types
// =====================

export interface SerializedItem {
  id: string
  productId: string
  serialNumber: string
  status: SerialStatus
  condition: SerialCondition
  purchaseId?: string
  purchaseDate?: Date
  purchaseCost?: number
  transactionId?: string
  soldDate?: Date
  soldPrice?: number
  customerId?: string
  warrantyMonths: number
  warrantyExpiry?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// =====================
// Warranty Types
// =====================

export interface WarrantyClaim {
  id: string
  claimNumber: string
  serializedItemId: string
  claimType: ClaimType
  status: ClaimStatus
  claimDate: Date
  issueDescription: string
  customerId?: string
  supplierId?: string
  repairCost?: number
  replacementSerialId?: string
  resolution?: string
  attachments?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface WarrantyClaimNote {
  id: string
  warrantyClaimId: string
  note: string
  createdBy: string
  createdAt: Date
}

// =====================
// Stock / Purchase Types
// =====================

export interface StockIn {
  id: string
  invoiceNo: string
  supplierId: string
  date: Date
  total: number
  status: StockInStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface StockInItem {
  id: string
  stockInId: string
  productId: string
  quantity: number
  unitCost: number
  serialNumbers?: string[]
}

// =====================
// Transaction / Sale Types
// =====================

export interface Transaction {
  id: string
  receiptNo: string
  customerId?: string
  employeeId?: string
  date: Date
  subtotal: number
  discount: number
  tax: number
  total: number
  paymentMethod: PaymentMethod
  amountPaid: number
  change: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface TransactionItem {
  id: string
  transactionId: string
  productId: string
  quantity: number
  unitPrice: number
  serializedItemIds?: string[]
}

// =====================
// Expense Type
// =====================

export interface Expense {
  id: string
  date: Date
  category: ExpenseCategory
  description: string
  amount: number
  receiptImage?: string
  notes?: string
  isRecurring?: boolean
  createdAt: Date
  updatedAt: Date
}

// =====================
// Settings Type
// =====================

export interface Settings {
  storeName: string
  address?: string
  phone?: string
  email?: string
  logo?: string
  receiptHeader?: string
  receiptFooter?: string
  currency: string
  taxRate: number
  taxEnabled: boolean
  lowStockThreshold: number
  dateFormat: string
  theme: "light" | "dark" | "system"
  defaultWarrantyMonths: number
  warrantyAlertDays: number
  claimNumberPrefix: string
  features: {
    expenses: boolean
    customers: boolean
    payroll: boolean
    creditSales: boolean
    creditPurchases: boolean
    serialTracking: boolean
    warranty: boolean
  }
}

// =====================
// User Type (Portfolio only)
// =====================

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: string
  createdAt: Date
}
