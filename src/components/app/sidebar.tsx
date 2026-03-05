// src/components/app/sidebar.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { notifySidebarToggle } from "./app-content-client";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Users as UsersIcon,
  ShieldCheck,
  UserCircle,
  Briefcase,
  Receipt,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  X,
  ChevronDown,
} from "lucide-react";

// ─── NAV STRUCTURE ───────────────────────────────────────
interface NavChild {
  label: string;
  href: string;
  icon?: React.ElementType;
}

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: NavChild[];
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Management",
    items: [
      {
        label: "Products",
        icon: Package,
        children: [
          { label: "All Products", href: "/products" },
          { label: "Categories", href: "/products/categories" },
          { label: "Serial Inventory", href: "/products/serial-inventory" },
        ],
      },
      {
        label: "Sales",
        icon: ShoppingCart,
        children: [
          { label: "POS / Cashier", href: "/sales/pos" },
          { label: "Sales History", href: "/sales/history" },
        ],
      },
      {
        label: "Purchases",
        icon: Truck,
        children: [
          { label: "Purchase Orders", href: "/purchases" },
          { label: "Suppliers", href: "/purchases/suppliers" },
        ],
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Warranty",
        icon: ShieldCheck,
        children: [
          { label: "Warranty Claims", href: "/warranty/claims" },
        ],
      },
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
];

// ─── SIDEBAR CONTEXT ─────────────────────────────────────
const COLLAPSED_KEY = "inventra_sidebar_collapsed";

// ─── SIDEBAR COMPONENT ──────────────────────────────────
export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(COLLAPSED_KEY) === "true";
    }
    return false;
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    const expanded: string[] = [];
    NAV_GROUPS.forEach((group) => {
      group.items.forEach((item) => {
        if (item.children) {
          const isChildActive = item.children.some((child) =>
            pathname.startsWith(child.href)
          );
          if (isChildActive) {
            expanded.push(item.label);
          }
        }
      });
    });
    return expanded;
  });

  // Adjust state when pathname changes (React-recommended pattern)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    // Close mobile on route change
    if (mobileOpen) setMobileOpen(false);
    // Auto-expand parent of active route
    NAV_GROUPS.forEach((group) => {
      group.items.forEach((item) => {
        if (item.children) {
          const isChildActive = item.children.some((child) =>
            pathname.startsWith(child.href)
          );
          if (isChildActive) {
            setExpandedItems((prev) =>
              prev.includes(item.label) ? prev : [...prev, item.label]
            );
          }
        }
      });
    });
  }

  // Toggle collapsed
  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSED_KEY, String(next));
      notifySidebarToggle();
      return next;
    });
  }, []);

  // Toggle expanded sub-items
  const toggleExpanded = useCallback((label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  }, []);

  // Check active state
  const isActive = (href: string) => pathname === href;
  const isGroupActive = (item: NavItem) => {
    if (item.href) return isActive(item.href);
    return item.children?.some((child) => pathname.startsWith(child.href)) ?? false;
  };

  // ─── RENDER NAV ITEM ────────────────────────────────
  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isGroupActive(item);
    const expanded = expandedItems.includes(item.label);
    const hasChildren = !!item.children;

    // Simple link item (no children)
    if (!hasChildren && item.href) {
      return (
        <Link
          key={item.label}
          href={item.href}
          className={`
            group relative flex items-center gap-3 h-10 rounded-none transition-colors duration-200
            ${collapsed ? "justify-center px-0" : "px-3"}
            ${active
              ? "bg-cream-primary text-blue-primary"
              : "text-cream-primary/70 hover:text-cream-primary hover:bg-cream-primary/8"
            }
          `}
          title={collapsed ? item.label : undefined}
        >
          <Icon size={18} strokeWidth={1.5} className="shrink-0" />
          {!collapsed && (
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase truncate">
              {item.label}
            </span>
          )}
          {/* Active indicator line */}
          {active && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-blue-primary" />
          )}
        </Link>
      );
    }

    // Parent item with children
    return (
      <div key={item.label}>
        <button
          onClick={() => {
            if (collapsed) {
              // If collapsed, expand sidebar then expand item
              setCollapsed(false);
              localStorage.setItem(COLLAPSED_KEY, "false");
              notifySidebarToggle();
              setExpandedItems((prev) =>
                prev.includes(item.label) ? prev : [...prev, item.label]
              );
            } else {
              toggleExpanded(item.label);
            }
          }}
          className={`
            group relative flex items-center gap-3 h-10 w-full rounded-none transition-colors duration-200
            ${collapsed ? "justify-center px-0" : "px-3"}
            ${active
              ? "text-cream-primary"
              : "text-cream-primary/70 hover:text-cream-primary hover:bg-cream-primary/8"
            }
          `}
          title={collapsed ? item.label : undefined}
        >
          <Icon size={18} strokeWidth={1.5} className="shrink-0" />
          {!collapsed && (
            <>
              <span className="font-mono text-[11px] tracking-[0.14em] uppercase truncate flex-1 text-left">
                {item.label}
              </span>
              <ChevronDown
                size={14}
                strokeWidth={1.5}
                className={`shrink-0 transition-transform duration-300 ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </>
          )}
          {/* Active dot for collapsed state */}
          {collapsed && active && (
            <div className="absolute right-1 top-1 w-1.5 h-1.5 rounded-full bg-cream-primary" />
          )}
        </button>

        {/* Children */}
        {!collapsed && (
          <AnimatePresence initial={false}>
            {expanded && item.children && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="ml-[27px] border-l border-cream-primary/15 pl-3 py-1">
                  {item.children.map((child) => {
                    const childActive = isActive(child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`
                          flex items-center h-8 px-2 transition-colors duration-200
                          ${childActive
                            ? "bg-cream-primary text-blue-primary"
                            : "text-cream-primary/50 hover:text-cream-primary hover:bg-cream-primary/8"
                          }
                        `}
                      >
                        <span className="font-mono text-[10px] tracking-[0.12em] uppercase truncate">
                          {child.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  };

  // ─── SIDEBAR CONTENT (shared between desktop & mobile) ──
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo block */}
      <div
        className={`flex items-center h-16 border-b border-cream-primary/15 ${
          collapsed ? "justify-center px-2" : "px-4"
        }`}
      >
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <svg
            width="24"
            height="24"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="32" cy="32" r="20" stroke="var(--color-cream-primary)" strokeWidth="3" />
            <circle cx="32" cy="32" r="8" stroke="var(--color-cream-primary)" strokeWidth="2.5" />
            <line x1="32" y1="4" x2="32" y2="18" stroke="var(--color-cream-primary)" strokeWidth="2" />
            <line x1="32" y1="46" x2="32" y2="60" stroke="var(--color-cream-primary)" strokeWidth="2" />
            <line x1="4" y1="32" x2="18" y2="32" stroke="var(--color-cream-primary)" strokeWidth="2" />
            <line x1="46" y1="32" x2="60" y2="32" stroke="var(--color-cream-primary)" strokeWidth="2" />
          </svg>
          {!collapsed && (
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-cream-primary">
              Inventra
            </span>
          )}
        </Link>
      </div>

      {/* Nav items — scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-6" data-sidebar-scroll>
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={group.label || groupIndex}>
            {/* Group label */}
            {group.label && !collapsed && (
              <div className="px-3 mb-2">
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-cream-primary/30">
                  {group.label}
                </span>
              </div>
            )}
            {/* Group divider for collapsed */}
            {group.label && collapsed && (
              <div className="mx-2 mb-3 h-px bg-cream-primary/15" />
            )}
            <div className="space-y-0.5">
              {group.items.map(renderNavItem)}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom section — collapse toggle */}
      <div className="border-t border-cream-primary/15 p-2">
        <button
          onClick={toggleCollapsed}
          className="hidden lg:flex items-center gap-2 w-full h-9 px-3 text-cream-primary/50 hover:text-cream-primary hover:bg-cream-primary/8 transition-colors duration-200"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRight size={16} strokeWidth={1.5} className="mx-auto" />
          ) : (
            <>
              <ChevronsLeft size={16} strokeWidth={1.5} />
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase">
                Collapse
              </span>
            </>
          )}
        </button>

        {/* Section marker */}
        {!collapsed && (
          <div className="px-3 pt-2 pb-1">
            <span className="font-mono text-[9px] tracking-[0.15em] text-cream-primary/20">
              [INV.APP]
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ─── DESKTOP SIDEBAR ─────────────────────────── */}
      <aside
        className={`
          hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-blue-primary z-40
          transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${collapsed ? "w-[60px]" : "w-[240px]"}
        `}
      >
        {/* Right edge blueprint line */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-cream-primary/15" />
        {sidebarContent}
      </aside>

      {/* ─── MOBILE HAMBURGER (rendered in header externally) ─── */}
      {/* The mobile trigger is handled by AppHeader */}

      {/* ─── MOBILE DRAWER OVERLAY ───────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-blue-primary/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              className="fixed top-0 left-0 h-screen w-[280px] bg-blue-primary z-50 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Close button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-cream-primary/60 hover:text-cream-primary transition-colors"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
              {/* Right edge line */}
              <div className="absolute right-0 top-0 bottom-0 w-px bg-cream-primary/15" />
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Expose mobile toggle for external use */}
      <MobileTogglePortal onToggle={() => setMobileOpen((prev) => !prev)} />
    </>
  );
}

// ─── MOBILE TOGGLE PORTAL ────────────────────────────────
// This exposes the mobile toggle function via a global event
function MobileTogglePortal({ onToggle }: { onToggle: () => void }) {
  useEffect(() => {
    const handler = () => onToggle();
    window.addEventListener("inventra:toggle-sidebar", handler);
    return () => window.removeEventListener("inventra:toggle-sidebar", handler);
  }, [onToggle]);
  return null;
}

// Helper to trigger mobile sidebar from outside (e.g., AppHeader)
export function toggleMobileSidebar() {
  window.dispatchEvent(new Event("inventra:toggle-sidebar"));
}
