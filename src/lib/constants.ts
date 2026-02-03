// App-wide constants

export const APP_NAME = "Inventra"
export const APP_TAGLINE = "Smart Inventory & Business Management"
export const APP_DESCRIPTION =
  "A modern inventory and business management system designed for tech/gadget retail businesses."

// Navigation items for sidebar
export const NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Products",
    icon: "Package",
    children: [
      { title: "All Products", href: "/products" },
      { title: "Categories", href: "/products/categories" },
      { title: "Serial Inventory", href: "/serial-inventory" },
    ],
  },
  {
    title: "Sales",
    icon: "ShoppingCart",
    children: [
      { title: "POS / Cashier", href: "/pos" },
      { title: "Sales History", href: "/stock-out" },
    ],
  },
  {
    title: "Purchases",
    icon: "Truck",
    children: [
      { title: "Purchase Orders", href: "/stock-in" },
      { title: "Suppliers", href: "/suppliers" },
    ],
  },
  {
    title: "Warranty",
    icon: "Shield",
    children: [{ title: "Warranty Claims", href: "/warranty-claims" }],
  },
  {
    title: "Customers",
    href: "/customers",
    icon: "Users",
  },
  {
    title: "Employees",
    href: "/employees",
    icon: "UserCog",
  },
  {
    title: "Expenses",
    href: "/expenses",
    icon: "Receipt",
    toggleable: true,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: "BarChart3",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: "Settings",
  },
] as const

// Serial item statuses
export const SERIAL_STATUS = {
  IN_STOCK: "in_stock",
  SOLD: "sold",
  RESERVED: "reserved",
  DEFECTIVE: "defective",
  IN_REPAIR: "in_repair",
  SCRAPPED: "scrapped",
} as const

// Serial item conditions
export const SERIAL_CONDITION = {
  NEW: "new",
  GOOD: "good",
  DAMAGED: "damaged",
  DEFECTIVE: "defective",
} as const

// Warranty claim statuses
export const CLAIM_STATUS = {
  PENDING: "pending",
  IN_REVIEW: "in_review",
  IN_REPAIR: "in_repair",
  REPAIRED: "repaired",
  REPLACED: "replaced",
  REJECTED: "rejected",
  CLOSED: "closed",
} as const

// Warranty claim types
export const CLAIM_TYPE = {
  CUSTOMER_TO_STORE: "customer_to_store",
  STORE_TO_SUPPLIER: "store_to_supplier",
  SUPPLIER_TO_STORE: "supplier_to_store",
} as const

// Payment methods
export const PAYMENT_METHOD = {
  CASH: "cash",
  CARD: "card",
  TRANSFER: "transfer",
} as const

// Expense categories
export const EXPENSE_CATEGORY = {
  RENT: "rent",
  UTILITIES: "utilities",
  SUPPLIES: "supplies",
  MARKETING: "marketing",
  MAINTENANCE: "maintenance",
  OTHER: "other",
} as const
