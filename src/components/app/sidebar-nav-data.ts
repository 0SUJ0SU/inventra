import {
  LayoutDashboard, Package, ShoppingCart, Truck,
  ShieldCheck, UserCircle, Briefcase, Receipt,
  BarChart3, Settings,
} from "lucide-react"
import type { ElementType } from "react"

export interface NavChild { label: string; href: string }
export interface NavItem { label: string; href?: string; icon: ElementType; children?: NavChild[] }
export interface NavGroup { label?: string; items: NavItem[] }

export const NAV_GROUPS: NavGroup[] = [
  { items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }] },
  {
    label: "Management",
    items: [
      { label: "Products", icon: Package, children: [
        { label: "All Products", href: "/products" },
        { label: "Categories", href: "/products/categories" },
        { label: "Serial Inventory", href: "/products/serial-inventory" },
      ]},
      { label: "Sales", icon: ShoppingCart, children: [
        { label: "POS / Cashier", href: "/sales/pos" },
        { label: "Sales History", href: "/sales/history" },
      ]},
      { label: "Purchases", icon: Truck, children: [
        { label: "Purchase Orders", href: "/purchases" },
        { label: "Suppliers", href: "/purchases/suppliers" },
      ]},
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Warranty", icon: ShieldCheck, children: [{ label: "Warranty Claims", href: "/warranty/claims" }] },
      { label: "Customers", href: "/customers", icon: UserCircle },
      { label: "Employees", href: "/employees", icon: Briefcase },
      { label: "Expenses", href: "/expenses", icon: Receipt },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Reports", href: "/reports", icon: BarChart3 },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
]