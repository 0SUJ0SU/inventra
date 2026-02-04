"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  Search,
  Bell,
  TrendingUp,
  AlertTriangle,
  Plus,
  Minus,
  ChevronRight,
  MoreHorizontal,
  Activity,
  Shield,
} from "lucide-react";

// Custom easing
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ============================================
// TYPES & DATA
// ============================================

type ViewId = "dashboard" | "products" | "pos";

const sidebarItems = [
  { id: "dashboard" as ViewId, icon: LayoutDashboard },
  { id: "products" as ViewId, icon: Package },
  { id: "pos" as ViewId, icon: ShoppingCart },
  { id: "customers" as const, icon: Users },
  { id: "reports" as const, icon: FileText },
];

// More varied chart data - not a nice progression
const chartData = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 78 },
  { day: "Wed", value: 35 },
  { day: "Thu", value: 91 },
  { day: "Fri", value: 28 },
  { day: "Sat", value: 65 },
  { day: "Sun", value: 84, isToday: true },
];

const topProducts = [
  { name: "iPhone 15 Pro Max", sold: 234, percent: 95 },
  { name: "Samsung Galaxy S24", sold: 186, percent: 76 },
  { name: "MacBook Pro 14\"", sold: 142, percent: 58 },
  { name: "AirPods Pro 2", sold: 128, percent: 52 },
];

const recentOrders = [
  { id: "#ORD-2024-1847", customer: "Sarah Johnson", items: "3 items", total: "$1,247.00", status: "Completed" },
  { id: "#ORD-2024-1846", customer: "Mike Chen", items: "1 item", total: "$999.00", status: "Processing" },
  { id: "#ORD-2024-1845", customer: "Emma Wilson", items: "5 items", total: "$2,156.00", status: "Completed" },
  { id: "#ORD-2024-1844", customer: "James Brown", items: "2 items", total: "$549.00", status: "Shipped" },
];

const lowStockAlerts = [
  { name: "Sony WH-1000XM5", stock: 3, threshold: 10 },
  { name: "MacBook Pro 14\"", stock: 8, threshold: 15 },
  { name: "iPad Pro 12.9\"", stock: 5, threshold: 10 },
];

const productsData = [
  { name: "iPhone 15 Pro Max 256GB", sku: "APL-IP15PM-256", category: "Phones", stock: 24, price: "$1,199.00" },
  { name: "Samsung Galaxy S24 Ultra", sku: "SAM-GS24U-512", category: "Phones", stock: 18, price: "$1,299.00" },
  { name: "MacBook Pro 14\" M3 Pro", sku: "APL-MBP14-M3P", category: "Laptops", stock: 8, price: "$1,999.00" },
  { name: "AirPods Pro 2nd Gen", sku: "APL-APP2-USB", category: "Audio", stock: 45, price: "$249.00" },
  { name: "Sony WH-1000XM5", sku: "SNY-WH1KXM5", category: "Audio", stock: 3, price: "$349.00" },
  { name: "iPad Pro 12.9\" M2", sku: "APL-IPDP-M2", category: "Tablets", stock: 12, price: "$1,099.00" },
  { name: "Apple Watch Ultra 2", sku: "APL-AWU2-49", category: "Wearables", stock: 15, price: "$799.00" },
  { name: "Google Pixel 8 Pro", sku: "GGL-PX8P-256", category: "Phones", stock: 22, price: "$999.00" },
];

const posProducts = [
  { id: 1, name: "iPhone 15 Pro", price: "$999.00" },
  { id: 2, name: "AirPods Pro 2", price: "$249.00" },
  { id: 3, name: "MacBook Air M3", price: "$1,099.00" },
  { id: 4, name: "iPad Mini", price: "$499.00" },
  { id: 5, name: "Apple Watch S9", price: "$399.00" },
  { id: 6, name: "Magic Keyboard", price: "$299.00" },
  { id: 7, name: "HomePod Mini", price: "$99.00" },
  { id: 8, name: "AirTag 4-Pack", price: "$99.00" },
  { id: 9, name: "MagSafe Charger", price: "$39.00" },
];

const cartItems = [
  { name: "iPhone 15 Pro", price: 999, qty: 1 },
  { name: "AirPods Pro 2", price: 249, qty: 2 },
  { name: "MagSafe Charger", price: 39, qty: 1 },
];

// Feature highlights for text section
const featureHighlights = [
  {
    title: "Real-time inventory tracking",
    description: "Stock levels update instantly across all locations and channels.",
  },
  {
    title: "One-click point of sale",
    description: "Process transactions in seconds with smart product search.",
  },
  {
    title: "Warranty management built-in",
    description: "Track warranties, handle claims, and notify customers automatically.",
  },
];

// Recent activity data for dashboard
const recentActivity = [
  { text: "New order #ORD-2024-1848 from Emma Wilson", time: "2 min ago" },
  { text: "iPhone 15 Pro stock updated (+50 units)", time: "15 min ago" },
  { text: "Warranty claim #WC-2024-0023 resolved", time: "1 hour ago" },
  { text: "New customer registered: James Brown", time: "2 hours ago" },
  { text: "Low stock alert: Sony WH-1000XM5", time: "3 hours ago" },
];

// Expiring warranties data
const expiringWarranties = [
  { product: "MacBook Pro 14\"", customer: "Sarah J.", expires: "3 days" },
  { product: "iPhone 14 Pro", customer: "Mike C.", expires: "1 week" },
  { product: "iPad Pro 12.9\"", customer: "Emma W.", expires: "2 weeks" },
];

// ============================================
// MINI COMPONENTS
// ============================================

function StatusBadge({ status }: { status: string }) {
  // Muted, subtle badge styles
  const styles: Record<string, string> = {
    Completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    Processing: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    Shipped: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
    Pending: "bg-stone-500/10 text-stone-600 dark:text-stone-400",
    "In Stock": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    "Low Stock": "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium tracking-wide ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
}

// Simple product image placeholder - warm gray rectangle
function ProductPlaceholder({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-full aspect-square",
  };

  return (
    <div className={`${sizeClasses[size]} rounded bg-[#E5E0DB] dark:bg-[#2A2527] flex items-center justify-center`}>
      <Package className="w-1/2 h-1/2 text-stone-400/50 dark:text-stone-600/50" strokeWidth={1} />
    </div>
  );
}

// ============================================
// PREVIEW COMPONENTS
// ============================================

function PreviewHeader() {
  return (
    <div className="h-11 bg-[var(--surface)] border-b border-[var(--border)] flex items-center px-4 gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-[#B87333] flex items-center justify-center">
          <span className="text-white font-bold text-[10px]">I</span>
        </div>
        <span className="font-heading font-semibold text-xs text-[var(--text)]">Inventra</span>
      </div>

      {/* Search - more refined */}
      <div className="flex-1 max-w-sm mx-auto">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-muted)]" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 pr-3 py-1.5 text-[10px] rounded border border-[var(--border)] bg-[var(--background)] text-[var(--text)] placeholder:text-[var(--text-muted)]/60 focus:outline-none"
            readOnly
          />
        </div>
      </div>

      {/* Right - simplified */}
      <div className="flex items-center gap-2">
        <button className="relative w-7 h-7 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
          <Bell className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>
        <div className="w-7 h-7 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
          <span className="text-[9px] font-medium text-stone-600 dark:text-stone-300">JD</span>
        </div>
      </div>
    </div>
  );
}

function PreviewSidebar({ activeView, onViewChange }: { activeView: ViewId; onViewChange: (v: ViewId) => void }) {
  return (
    <div className="w-11 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col items-center py-2 gap-0.5">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        const isClickable = item.id === "dashboard" || item.id === "products" || item.id === "pos";

        return (
          <button
            key={item.id}
            onClick={() => isClickable && onViewChange(item.id as ViewId)}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              isActive
                ? "bg-stone-200/80 dark:bg-stone-700/50 text-[var(--text)]"
                : isClickable
                ? "text-[var(--text-muted)] hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-[var(--text)]"
                : "text-[var(--text-muted)]/30 cursor-default"
            }`}
          >
            <Icon className="w-4 h-4" strokeWidth={1.5} />
          </button>
        );
      })}

      <div className="flex-1" />

      {/* Separator line */}
      <div className="w-5 h-px bg-[var(--border)] my-1" />

      <button className="w-8 h-8 rounded flex items-center justify-center text-[var(--text-muted)] hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-[var(--text)] transition-colors">
        <Settings className="w-4 h-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}

// Simplified mobile dashboard - just stats and chart
function MobileDashboardView() {
  return (
    <div className="p-2.5 space-y-2.5 overflow-y-auto h-full">
      {/* Stats Row - 2x2 grid on mobile */}
      <div className="grid grid-cols-2 gap-2">
        {/* Revenue */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[8px] text-[var(--text-muted)] font-heading font-medium uppercase tracking-wider">
              Revenue
            </span>
            <span className="text-[8px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-2 h-2" />
              +12.5%
            </span>
          </div>
          <div className="font-mono font-semibold text-lg text-[var(--text)] tracking-tight">
            $24,563
          </div>
        </div>

        {/* Orders */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5">
          <span className="text-[8px] text-[var(--text-muted)] font-heading font-medium uppercase tracking-wider block mb-0.5">
            Orders
          </span>
          <div className="font-mono font-semibold text-lg text-[var(--text)]">156</div>
          <div className="inline-flex items-center px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[7px] font-medium">
            +8% today
          </div>
        </div>

        {/* Products */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5">
          <span className="text-[8px] text-[var(--text-muted)] font-heading font-medium uppercase tracking-wider block mb-0.5">
            Products
          </span>
          <div className="font-mono font-semibold text-lg text-[var(--text)]">1,247</div>
        </div>

        {/* Low Stock */}
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5">
          <div className="flex items-center gap-1 mb-0.5">
            <AlertTriangle className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
            <span className="text-[8px] text-amber-700 dark:text-amber-400 font-heading font-medium uppercase tracking-wider">
              Low Stock
            </span>
          </div>
          <div className="font-mono font-semibold text-lg text-amber-700 dark:text-amber-400">23</div>
        </div>
      </div>

      {/* Simple Chart */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading font-semibold text-[10px] text-[var(--text)]">Weekly Revenue</h3>
          <span className="text-[9px] font-mono font-medium text-[var(--text)]">$12,847</span>
        </div>
        <div className="h-16 flex items-end justify-between gap-1">
          {chartData.map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full flex items-end justify-center h-[44px]">
                <div
                  className={`w-full max-w-[14px] rounded-t ${
                    bar.isToday ? "bg-[#B87333]" : "bg-[#B87333]/60"
                  }`}
                  style={{ height: `${bar.value}%` }}
                />
              </div>
              <span className={`text-[7px] ${bar.isToday ? "font-medium text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
                {bar.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products - simplified list */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5">
        <h3 className="font-heading font-semibold text-[10px] text-[var(--text)] mb-2">Top Selling</h3>
        <div className="space-y-1.5">
          {topProducts.slice(0, 3).map((product, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-[9px] text-[var(--text)] truncate flex-1">{product.name}</span>
              <span className="text-[8px] font-mono text-[var(--text-muted)] ml-2">{product.sold}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Full dashboard view for tablet and desktop
function DashboardView() {
  return (
    <div className="p-3 space-y-3 overflow-y-auto h-full">
      {/* Stats Row - Non-uniform cards */}
      <div className="grid grid-cols-12 gap-2">
        {/* Revenue - Larger, more prominent */}
        <div className="col-span-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-[var(--text-muted)] font-heading font-medium uppercase tracking-wider">
              Total Revenue
            </span>
            <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" />
              +12.5%
            </span>
          </div>
          <div className="font-mono font-semibold text-2xl text-[var(--text)] tracking-tight">
            $24,563
          </div>
          <div className="text-[9px] text-[var(--text-muted)] mt-0.5">vs $21,847 last month</div>
        </div>

        {/* Orders - Medium, with badge */}
        <div className="col-span-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
          <span className="text-[9px] text-[var(--text-muted)] font-heading font-medium uppercase tracking-wider block mb-1">
            Orders
          </span>
          <div className="font-mono font-semibold text-lg text-[var(--text)]">156</div>
          <div className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[8px] font-medium mt-1">
            +8% today
          </div>
        </div>

        {/* Products - Simple number */}
        <div className="col-span-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
          <span className="text-[9px] text-[var(--text-muted)] font-heading font-medium uppercase tracking-wider block mb-1">
            Products
          </span>
          <div className="font-mono font-semibold text-lg text-[var(--text)]">1,247</div>
        </div>

        {/* Low Stock - Warning style, no sparkline */}
        <div className="col-span-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <div className="flex items-center gap-1 mb-1">
            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span className="text-[9px] text-amber-700 dark:text-amber-400 font-heading font-medium uppercase tracking-wider">
              Low Stock
            </span>
          </div>
          <div className="font-mono font-semibold text-lg text-amber-700 dark:text-amber-400">23</div>
        </div>
      </div>

      {/* Chart + Top Products Row */}
      <div className="grid grid-cols-12 gap-2">
        {/* Revenue Chart - with grid lines and highlighted bar */}
        <div className="col-span-7 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-heading font-semibold text-xs text-[var(--text)]">Weekly Revenue</h3>
              <p className="text-[9px] text-[var(--text-muted)]">Last 7 days performance</p>
            </div>
            <span className="text-[10px] font-mono font-medium text-[var(--text)]">$12,847</span>
          </div>

          {/* Chart with grid lines */}
          <div className="relative h-20">
            {/* Faint grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-full h-px bg-[var(--border)]/50" />
              ))}
            </div>

            {/* Bars */}
            <div className="relative h-full flex items-end justify-between gap-1.5 px-1">
              {chartData.map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center h-[56px]">
                    <div
                      className={`w-full max-w-[18px] rounded-t transition-all ${
                        bar.isToday
                          ? "bg-[#B87333] shadow-sm shadow-[#B87333]/20"
                          : "bg-[#B87333]/60"
                      }`}
                      style={{ height: `${bar.value}%` }}
                    />
                  </div>
                  <span className={`text-[8px] ${bar.isToday ? "font-medium text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products - Simplified */}
        <div className="col-span-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-semibold text-xs text-[var(--text)]">Top Selling</h3>
            <button className="text-[9px] text-[var(--text-muted)] hover:text-[var(--text)]">View all</button>
          </div>
          <div className="space-y-2">
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-2">
                <ProductPlaceholder size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-medium text-[var(--text)] truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1 rounded-full bg-[var(--border)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-stone-400 dark:bg-stone-500"
                        style={{ width: `${product.percent}%` }}
                      />
                    </div>
                    <span className="text-[8px] font-mono text-[var(--text-muted)] shrink-0">{product.sold}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]">
          <h3 className="font-heading font-semibold text-xs text-[var(--text)]">Recent Orders</h3>
          <button className="flex items-center gap-0.5 text-[9px] text-[var(--text-muted)] hover:text-[var(--text)]">
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-3 py-1 text-[9px] font-heading font-semibold text-[var(--text-muted)] uppercase tracking-wider">Order ID</th>
                <th className="text-left px-3 py-1 text-[9px] font-heading font-semibold text-[var(--text-muted)] uppercase tracking-wider">Customer</th>
                <th className="text-right px-3 py-1 text-[9px] font-heading font-semibold text-[var(--text-muted)] uppercase tracking-wider">Total</th>
                <th className="text-right px-3 py-1 text-[9px] font-heading font-semibold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={`${idx % 2 === 1 ? "bg-stone-50/50 dark:bg-stone-800/20" : ""}`}
                >
                  <td className="px-3 py-1 text-[10px] font-mono text-[var(--text-muted)]">{order.id}</td>
                  <td className="px-3 py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center shrink-0">
                        <span className="text-[7px] font-medium text-stone-600 dark:text-stone-400">
                          {order.customer.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--text)]">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-3 py-1 text-[10px] font-mono text-[var(--text)] text-right">{order.total}</td>
                  <td className="px-3 py-1 text-right">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity + Alerts Row */}
      <div className="grid grid-cols-12 gap-2">
        {/* Recent Activity Feed */}
        <div className="col-span-7 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Activity className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <h3 className="font-heading font-semibold text-xs text-[var(--text)]">Recent Activity</h3>
          </div>
          <div className="space-y-2">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-2">
                <span className="text-[10px] text-[var(--text)] leading-tight">{item.text}</span>
                <span className="text-[9px] text-[var(--text-muted)] shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts Column */}
        <div className="col-span-5 space-y-2">
          {/* Low Stock Alerts */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <h3 className="font-heading font-semibold text-[10px] text-amber-700 dark:text-amber-400">Low Stock</h3>
            </div>
            <div className="space-y-1">
              {lowStockAlerts.slice(0, 2).map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[9px] text-[var(--text)] truncate flex-1">{item.name}</span>
                  <span className="text-[9px] font-mono font-medium text-amber-600 dark:text-amber-400 ml-2">
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Expiring Warranties */}
          <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Shield className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              <h3 className="font-heading font-semibold text-[10px] text-sky-700 dark:text-sky-400">Expiring Warranties</h3>
            </div>
            <div className="space-y-1">
              {expiringWarranties.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[9px] text-[var(--text)] truncate flex-1">{item.product}</span>
                  <span className="text-[9px] font-mono font-medium text-sky-600 dark:text-sky-400 ml-2">
                    {item.expires}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsView() {
  return (
    <div className="p-3 space-y-3 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-semibold text-sm text-[var(--text)]">Products</h2>
          <p className="text-[10px] text-[var(--text-muted)]">Manage your inventory</p>
        </div>
        <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#B87333] text-white text-[10px] font-semibold">
          <Plus className="w-3 h-3" />
          Add Product
        </button>
      </div>

      {/* Search/Filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-muted)]" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-8 pr-3 py-1.5 text-[10px] rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-muted)]/60 focus:outline-none"
            readOnly
          />
        </div>
        <select className="px-2.5 py-1.5 text-[10px] rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]">
          <option>All Categories</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left px-3 py-2 text-[9px] font-heading font-semibold text-[var(--text-muted)] uppercase tracking-wider">Product</th>
              <th className="text-left px-3 py-2 text-[9px] font-heading font-semibold text-[var(--text-muted)] uppercase tracking-wider">SKU</th>
              <th className="text-left px-3 py-2 text-[9px] font-heading font-semibold text-[var(--text-muted)] uppercase tracking-wider">Category</th>
              <th className="text-center px-3 py-2 text-[9px] font-heading font-semibold text-[var(--text-muted)] uppercase tracking-wider">Stock</th>
              <th className="text-right px-3 py-2 text-[9px] font-heading font-semibold text-[var(--text-muted)] uppercase tracking-wider">Price</th>
              <th className="text-right px-3 py-2 text-[9px] font-heading font-semibold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {productsData.map((product, i) => (
              <tr
                key={i}
                className={`${i % 2 === 1 ? "bg-stone-50/50 dark:bg-stone-800/20" : ""} hover:bg-stone-100/50 dark:hover:bg-stone-800/40 transition-colors`}
              >
                <td className="px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <ProductPlaceholder size="sm" />
                    <span className="text-[10px] font-medium text-[var(--text)] truncate max-w-[120px]">{product.name}</span>
                  </div>
                </td>
                <td className="px-3 py-1.5 text-[9px] font-mono text-[var(--text-muted)]">{product.sku}</td>
                <td className="px-3 py-1.5 text-[10px] text-[var(--text-muted)]">{product.category}</td>
                <td className="px-3 py-1.5 text-center">
                  <span className={`text-[10px] font-mono font-medium ${product.stock <= 5 ? "text-amber-600 dark:text-amber-400" : "text-[var(--text)]"}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-3 py-1.5 text-[10px] font-mono text-[var(--text)] text-right">{product.price}</td>
                <td className="px-3 py-1.5 text-right">
                  <StatusBadge status={product.stock <= 5 ? "Low Stock" : "In Stock"} />
                </td>
                <td className="px-2 py-1.5">
                  <button className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--background)]">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function POSView() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="p-3 h-full flex flex-col">
      <div className="grid grid-cols-5 gap-3 flex-1 min-h-0">
        {/* Products Grid */}
        <div className="col-span-3 flex flex-col min-h-0">
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-muted)]" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-8 pr-3 py-1.5 text-[10px] rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-muted)]/60 focus:outline-none"
              readOnly
            />
          </div>
          <div className="grid grid-cols-3 gap-1.5 flex-1 content-start overflow-y-auto">
            {posProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 hover:border-stone-300 dark:hover:border-stone-600 transition-colors cursor-pointer group h-fit"
              >
                <div className="w-full aspect-[5/4] rounded bg-[#E5E0DB] dark:bg-[#2A2527] mb-1.5 flex items-center justify-center">
                  <Package className="w-5 h-5 text-stone-400/40 dark:text-stone-600/40" strokeWidth={1} />
                </div>
                <p className="text-[9px] font-medium text-[var(--text)] truncate">{product.name}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[9px] font-mono font-medium text-[var(--text)]">{product.price}</span>
                  <button className="w-5 h-5 rounded bg-[#B87333] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="col-span-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 flex flex-col min-h-0">
          <h3 className="font-heading font-semibold text-xs text-[var(--text)] mb-2">Current Sale</h3>

          <div className="flex-1 space-y-1.5 overflow-y-auto min-h-0">
            {cartItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-[var(--background)]">
                <ProductPlaceholder size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-medium text-[var(--text)] truncate">{item.name}</p>
                  <p className="text-[8px] font-mono text-[var(--text-muted)]">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  <button className="w-5 h-5 rounded border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] bg-[var(--surface)]">
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  <span className="text-[9px] font-mono text-[var(--text)] w-5 text-center">{item.qty}</span>
                  <button className="w-5 h-5 rounded border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] bg-[var(--surface)]">
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>
                <span className="text-[9px] font-mono font-medium text-[var(--text)] w-12 text-right">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-2 mt-2 border-t border-[var(--border)] space-y-1">
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-[var(--text-muted)]">Subtotal</span>
              <span className="font-mono text-[var(--text)]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-[var(--text-muted)]">Tax (8%)</span>
              <span className="font-mono text-[var(--text)]">${tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t border-[var(--border)]">
              <span className="font-heading font-semibold text-xs text-[var(--text)]">Total</span>
              <span className="font-mono font-bold text-base text-[var(--text)]">${total.toFixed(2)}</span>
            </div>
          </div>

          <button className="w-full mt-3 py-2 rounded bg-[#B87333] hover:bg-[#96602B] text-white text-[11px] font-semibold transition-colors">
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function DashboardPreview() {
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden bg-[var(--background-alt)]"
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.03] pointer-events-none mix-blend-multiply dark:mix-blend-normal"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="flex flex-col-reverse lg:flex-row lg:items-stretch gap-8 lg:gap-12">

          {/* LEFT: App Preview (60-65%) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="lg:w-[62%] shrink-0"
          >
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl shadow-stone-900/10 dark:shadow-black/30 overflow-hidden">
              {/* App Layout - Different heights for different breakpoints */}
              <div className="flex flex-col h-[340px] sm:h-[400px] md:h-[520px] lg:h-[560px]">
                {/* Header */}
                <PreviewHeader />

                {/* Body */}
                <div className="flex flex-1 min-h-0">
                  {/* Sidebar - Hidden on mobile, visible on md+ */}
                  <div className="hidden md:block">
                    <PreviewSidebar activeView={activeView} onViewChange={setActiveView} />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0 bg-[var(--background)] overflow-hidden">
                    {/* Mobile: Always show simplified dashboard */}
                    <div className="block md:hidden h-full">
                      <MobileDashboardView />
                    </div>

                    {/* Tablet+: Show full views with animation */}
                    <div className="hidden md:block h-full">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeView}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="h-full"
                        >
                          {activeView === "dashboard" && <DashboardView />}
                          {activeView === "products" && <ProductsView />}
                          {activeView === "pos" && <POSView />}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Text Content (35-40%) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="lg:flex-1 flex flex-col justify-center"
          >
            {/* Label */}
            <span className="inline-block font-heading font-semibold text-[10px] tracking-[0.25em] uppercase text-[#B87333] mb-3 sm:mb-4">
              See It In Action
            </span>

            {/* Headline - Responsive sizing */}
            <h2 className="font-heading font-bold text-[var(--text)] text-2xl sm:text-3xl md:text-4xl leading-[1.15] mb-1">
              Your entire store,
            </h2>
            <p className="font-display italic text-[#B87333] text-2xl sm:text-3xl md:text-4xl leading-[1.15] mb-4 sm:mb-5">
              one screen.
            </p>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed mb-6 sm:mb-8 max-w-md">
              Real-time insights, intuitive navigation, and powerful tools designed for how you actually work. No learning curve, no clutter.
            </p>

            {/* Spacer */}
            <div className="h-px w-12 bg-[var(--border)] mb-4 sm:mb-6" />

            {/* Feature Highlights - Tighter spacing on mobile */}
            <div className="space-y-4 sm:space-y-6">
              {featureHighlights.map((feature, idx) => (
                <div key={idx} className="border-l-2 border-[#B87333]/60 pl-3 sm:pl-4">
                  <h4 className="font-heading font-semibold text-sm text-[var(--text)] mb-0.5 sm:mb-1">
                    {feature.title}
                  </h4>
                  <p className="font-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
