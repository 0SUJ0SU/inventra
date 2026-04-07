"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Bell, Menu, ChevronRight, User, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { emitMobileSidebarToggle } from "./sidebar"

const LABELS: Record<string, string> = {
  dashboard: "Dashboard", products: "Products", categories: "Categories",
  "serial-inventory": "Serial Inventory", sales: "Sales", pos: "POS / Cashier",
  history: "Sales History", purchases: "Purchases", suppliers: "Suppliers",
  warranty: "Warranty", claims: "Warranty Claims", customers: "Customers",
  employees: "Employees", expenses: "Expenses", reports: "Reports", settings: "Settings",
  new: "New", edit: "Edit",
}

export function AppHeader() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs = segments
    .map((seg, i) => ({
      label: LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
      href: "/" + segments.slice(0, i + 1).join("/"),
      isLast: i === segments.length - 1,
      isId: !LABELS[seg] && /^[a-z0-9]{20,}$/i.test(seg),
    }))
    .filter((crumb) => !crumb.isId)

  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen((p) => !p) }
      if (e.key === "Escape") { setSearchOpen(false); setProfileOpen(false) }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  useEffect(() => {
    if (!profileOpen) return
    const handler = (e: MouseEvent) => { if (e.target instanceof HTMLElement && !e.target.closest("[data-profile-dropdown]")) setProfileOpen(false) }
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  }, [profileOpen])

  return (
    <>
      <header className="sticky top-0 z-30 bg-cream-primary border-b border-blue-primary/10">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => emitMobileSidebarToggle()} className="lg:hidden flex items-center justify-center w-9 h-9 text-blue-primary/60 hover:text-blue-primary hover:bg-blue-primary/5 transition-colors"><Menu size={20} strokeWidth={1.5} /></button>
            <nav className="hidden sm:flex items-center gap-1.5">
              {breadcrumbs.map((crumb, i) => (
                <div key={crumb.href} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight size={12} strokeWidth={1.5} className="text-blue-primary/25" />}
                  {crumb.isLast ? <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-blue-primary">{crumb.label}</span> : <Link href={crumb.href} className="font-mono text-[11px] tracking-[0.12em] uppercase text-blue-primary/40 hover:text-blue-primary transition-colors">{crumb.label}</Link>}
                </div>
              ))}
            </nav>
            <span className="sm:hidden font-mono text-[11px] tracking-[0.12em] uppercase text-blue-primary">{breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard"}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 h-9 px-3 text-blue-primary/40 hover:text-blue-primary hover:bg-blue-primary/5 transition-colors" title="Search (⌘K)">
              <Search size={16} strokeWidth={1.5} /><span className="hidden md:inline font-mono text-[10px] tracking-[0.1em] uppercase">Search</span><kbd className="hidden md:inline font-mono text-[9px] tracking-wider text-blue-primary/25 border border-blue-primary/15 px-1.5 py-0.5">⌘K</kbd>
            </button>
            <div className="w-px h-5 bg-blue-primary/10 mx-1" />
            <button className="relative flex items-center justify-center w-9 h-9 text-blue-primary/40 hover:text-blue-primary hover:bg-blue-primary/5 transition-colors" title="Notifications"><Bell size={16} strokeWidth={1.5} /></button>
            <div className="w-px h-5 bg-blue-primary/10 mx-1" />
            <div className="relative" data-profile-dropdown>
              <button onClick={() => setProfileOpen((p) => !p)} className="flex items-center gap-2 h-9 px-2 text-blue-primary/60 hover:text-blue-primary hover:bg-blue-primary/5 transition-colors">
                <div className="w-7 h-7 bg-blue-primary flex items-center justify-center"><span className="font-mono text-[10px] tracking-wider text-cream-primary">AD</span></div>
                <span className="hidden lg:inline font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary/60">Admin</span>
              </button>
              <AnimatePresence>{profileOpen && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }} className="absolute right-0 top-full mt-2 w-48 bg-cream-light border border-blue-primary/10 shadow-sm">
                  <div className="px-3 py-3 border-b border-blue-primary/10"><p className="font-mono text-[10px] tracking-[0.1em] uppercase text-blue-primary">Admin User</p><p className="font-mono text-[9px] tracking-[0.08em] text-blue-primary/40 mt-0.5">demo@inventra.dev</p></div>
                  <div className="py-1">
                    <Link href="/settings" className="flex items-center gap-2 px-3 h-8 text-blue-primary/60 hover:text-blue-primary hover:bg-blue-primary/5 transition-colors"><User size={14} strokeWidth={1.5} /><span className="font-mono text-[10px] tracking-[0.1em] uppercase">Profile</span></Link>
                    <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex items-center gap-2 w-full px-3 h-8 text-blue-primary/60 hover:text-error hover:bg-error/5 transition-colors"><LogOut size={14} strokeWidth={1.5} /><span className="font-mono text-[10px] tracking-[0.1em] uppercase">Log Out</span></button>
                  </div>
                  <div className="px-3 py-1.5 border-t border-blue-primary/10"><span className="font-mono text-[8px] tracking-[0.15em] text-blue-primary/15">V4.0.0</span></div>
                </motion.div>
              )}</AnimatePresence>
            </div>
          </div>
        </div>
      </header>
      <AnimatePresence>{searchOpen && (<>
        <motion.div className="fixed inset-0 z-50 bg-blue-primary/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={() => setSearchOpen(false)} />
        <motion.div className="fixed top-[20%] left-1/2 z-50 w-full max-w-lg -translate-x-1/2" initial={{ opacity: 0, y: -20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.98 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          <div className="mx-4 bg-cream-light border border-blue-primary/15 shadow-lg">
            <div className="flex items-center gap-3 px-4 h-14 border-b border-blue-primary/10"><Search size={18} strokeWidth={1.5} className="text-blue-primary/40 shrink-0" /><input type="text" placeholder="SEARCH INVENTRA..." autoFocus className="flex-1 bg-transparent font-mono text-[12px] tracking-[0.1em] uppercase text-blue-primary placeholder:text-blue-primary/25 outline-none" /><kbd className="font-mono text-[9px] tracking-wider text-blue-primary/20 border border-blue-primary/10 px-1.5 py-0.5">ESC</kbd></div>
            <div className="px-4 py-6 text-center"><p className="font-mono text-[10px] tracking-[0.15em] uppercase text-blue-primary/25">Start typing to search products, orders, customers...</p></div>
          </div>
        </motion.div>
      </>)}</AnimatePresence>
    </>
  )
}