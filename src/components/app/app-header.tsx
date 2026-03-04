// src/components/app/app-header.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { toggleMobileSidebar } from "./sidebar";

// ─── BREADCRUMB MAPPING ──────────────────────────────────
const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  products: "Products",
  categories: "Categories",
  "serial-inventory": "Serial Inventory",
  sales: "Sales",
  pos: "POS / Cashier",
  history: "Sales History",
  purchases: "Purchases",
  suppliers: "Suppliers",
  warranty: "Warranty",
  claims: "Warranty Claims",
  customers: "Customers",
  employees: "Employees",
  expenses: "Expenses",
  reports: "Reports",
  settings: "Settings",
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = ROUTE_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === segments.length - 1;
    return { label, href, isLast };
  });
}

// ─── HEADER COMPONENT ────────────────────────────────────
export function AppHeader() {
  const breadcrumbs = useBreadcrumbs();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ⌘K shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-profile-dropdown]")) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [profileOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 bg-cream-primary border-b border-blue-primary/10">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* LEFT — Mobile hamburger + Breadcrumbs */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => toggleMobileSidebar()}
              className="lg:hidden flex items-center justify-center w-9 h-9 text-blue-primary/60 hover:text-blue-primary hover:bg-blue-primary/5 transition-colors"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>

            {/* Breadcrumbs */}
            <nav className="hidden sm:flex items-center gap-1.5">
              {breadcrumbs.map((crumb, i) => (
                <div key={crumb.href} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <ChevronRight
                      size={12}
                      strokeWidth={1.5}
                      className="text-blue-primary/25"
                    />
                  )}
                  {crumb.isLast ? (
                    <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-blue-primary">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="font-mono text-[11px] tracking-[0.12em] uppercase text-blue-primary/40 hover:text-blue-primary transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile — page title only */}
            <span className="sm:hidden font-mono text-[11px] tracking-[0.12em] uppercase text-blue-primary">
              {breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard"}
            </span>
          </div>

          {/* RIGHT — Actions */}
          <div className="flex items-center gap-1">
            {/* Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 h-9 px-3 text-blue-primary/40 hover:text-blue-primary hover:bg-blue-primary/5 transition-colors"
              title="Search (⌘K)"
            >
              <Search size={16} strokeWidth={1.5} />
              <span className="hidden md:inline font-mono text-[10px] tracking-[0.1em] uppercase">
                Search
              </span>
              <kbd className="hidden md:inline font-mono text-[9px] tracking-wider text-blue-primary/25 border border-blue-primary/15 px-1.5 py-0.5">
                ⌘K
              </kbd>
            </button>

            {/* Blueprint divider */}
            <div className="w-px h-5 bg-blue-primary/10 mx-1" />

            {/* Notifications */}
            <button
              className="relative flex items-center justify-center w-9 h-9 text-blue-primary/40 hover:text-blue-primary hover:bg-blue-primary/5 transition-colors"
              title="Notifications"
            >
              <Bell size={16} strokeWidth={1.5} />
              {/* Notification dot */}
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-primary rounded-full" />
            </button>

            {/* Blueprint divider */}
            <div className="w-px h-5 bg-blue-primary/10 mx-1" />

            {/* Profile */}
            <div className="relative" data-profile-dropdown>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 h-9 px-2 text-blue-primary/60 hover:text-blue-primary hover:bg-blue-primary/5 transition-colors"
              >
                <div className="w-7 h-7 bg-blue-primary flex items-center justify-center">
                  <span className="font-mono text-[10px] tracking-wider text-cream-primary">
                    AD
                  </span>
                </div>
                <span className="hidden lg:inline font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/60">
                  Admin
                </span>
              </button>

              {/* Profile dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full mt-2 w-48 bg-cream-light border border-blue-primary/10 shadow-sm"
                  >
                    {/* User info */}
                    <div className="px-3 py-3 border-b border-blue-primary/10">
                      <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary">
                        Admin User
                      </p>
                      <p className="font-mono text-[9px] tracking-[0.08em] text-blue-primary/40 mt-0.5">
                        admin@inventra.com
                      </p>
                    </div>
                    {/* Actions */}
                    <div className="py-1">
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-3 h-8 text-blue-primary/60 hover:text-blue-primary hover:bg-blue-primary/5 transition-colors"
                      >
                        <User size={14} strokeWidth={1.5} />
                        <span className="font-mono text-[10px] tracking-[0.1em] uppercase">
                          Profile
                        </span>
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.removeItem("inventra_session");
                          window.location.href = "/login";
                        }}
                        className="flex items-center gap-2 w-full px-3 h-8 text-blue-primary/60 hover:text-error hover:bg-error/5 transition-colors"
                      >
                        <LogOut size={14} strokeWidth={1.5} />
                        <span className="font-mono text-[10px] tracking-[0.1em] uppercase">
                          Log Out
                        </span>
                      </button>
                    </div>
                    {/* Marker */}
                    <div className="px-3 py-1.5 border-t border-blue-primary/10">
                      <span className="font-mono text-[8px] tracking-[0.15em] text-blue-primary/15">
                        V0.1.0
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom blueprint line */}
      </header>

      {/* ─── SEARCH MODAL (⌘K) ─────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-blue-primary/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              className="fixed top-[20%] left-1/2 z-50 w-full max-w-lg -translate-x-1/2"
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mx-4 bg-cream-light border border-blue-primary/15 shadow-lg">
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 h-14 border-b border-blue-primary/10">
                  <Search size={18} strokeWidth={1.5} className="text-blue-primary/40 shrink-0" />
                  <input
                    type="text"
                    placeholder="SEARCH INVENTRA..."
                    autoFocus
                    className="flex-1 bg-transparent font-mono text-[12px] tracking-[0.1em] uppercase text-blue-primary placeholder:text-blue-primary/25 outline-none"
                  />
                  <kbd className="font-mono text-[9px] tracking-wider text-blue-primary/20 border border-blue-primary/10 px-1.5 py-0.5">
                    ESC
                  </kbd>
                </div>
                {/* Placeholder results */}
                <div className="px-4 py-6 text-center">
                  <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/25">
                    Start typing to search products, orders, customers...
                  </p>
                </div>
                {/* Bottom marker */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-blue-primary/10">
                  <span className="font-mono text-[8px] tracking-[0.15em] text-blue-primary/15">
                    [INV.SEARCH]
                  </span>
                  <span className="font-mono text-[8px] tracking-[0.1em] text-blue-primary/15">
                    POWERED BY INVENTRA
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
