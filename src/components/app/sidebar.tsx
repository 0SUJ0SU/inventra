"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronsLeft, ChevronsRight, X } from "lucide-react"
import { NAV_GROUPS } from "./sidebar-nav-data"
import { SidebarNavItem } from "./sidebar-nav-item"

const COLLAPSED_KEY = "inventra_sidebar_collapsed"

export function emitSidebarToggle() { window.dispatchEvent(new Event("inventra:sidebar-toggle")) }
export function emitMobileSidebarToggle() { window.dispatchEvent(new Event("inventra:mobile-sidebar")) }

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(() => typeof window !== "undefined" ? localStorage.getItem(COLLAPSED_KEY) === "true" : false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    const active: string[] = []
    NAV_GROUPS.forEach((g) => g.items.forEach((item) => { if (item.children?.some((c) => pathname.startsWith(c.href))) active.push(item.label) }))
    return active
  })

  const [prevPath, setPrevPath] = useState(pathname)
  if (prevPath !== pathname) {
    setPrevPath(pathname)
    if (mobileOpen) setMobileOpen(false)
    NAV_GROUPS.forEach((g) => g.items.forEach((item) => { if (item.children?.some((c) => pathname.startsWith(c.href))) setExpandedItems((prev) => prev.includes(item.label) ? prev : [...prev, item.label]) }))
  }

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => { const next = !prev; localStorage.setItem(COLLAPSED_KEY, String(next)); emitSidebarToggle(); return next })
  }, [])

  const toggleExpand = useCallback((label: string) => { setExpandedItems((prev) => prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]) }, [])
  const forceExpand = useCallback((label: string) => { setCollapsed(false); localStorage.setItem(COLLAPSED_KEY, "false"); emitSidebarToggle(); setExpandedItems((prev) => prev.includes(label) ? prev : [...prev, label]) }, [])

  useEffect(() => {
    const handler = () => setMobileOpen((p) => !p)
    window.addEventListener("inventra:mobile-sidebar", handler)
    return () => window.removeEventListener("inventra:mobile-sidebar", handler)
  }, [])

  const navContent = (
    <div className="flex flex-col h-full">
      <div className={`flex items-center h-16 border-b border-cream-primary/15 ${collapsed ? "justify-center px-2" : "px-4"}`}>
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <svg width="24" height="24" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="20" stroke="var(--color-cream-primary)" strokeWidth="3" /><circle cx="32" cy="32" r="8" stroke="var(--color-cream-primary)" strokeWidth="2.5" /><line x1="32" y1="4" x2="32" y2="18" stroke="var(--color-cream-primary)" strokeWidth="2" /><line x1="32" y1="46" x2="32" y2="60" stroke="var(--color-cream-primary)" strokeWidth="2" /><line x1="4" y1="32" x2="18" y2="32" stroke="var(--color-cream-primary)" strokeWidth="2" /><line x1="46" y1="32" x2="60" y2="32" stroke="var(--color-cream-primary)" strokeWidth="2" /></svg>
          {!collapsed && <span className="font-mono text-xs tracking-[0.25em] uppercase text-cream-primary">Inventra</span>}
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-6" data-sidebar-scroll>
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label || gi}>
            {group.label && !collapsed && <div className="px-3 mb-2"><span className="font-mono text-[9px] tracking-[0.2em] uppercase text-cream-primary/30">{group.label}</span></div>}
            {group.label && collapsed && <div className="mx-2 mb-3 h-px bg-cream-primary/15" />}
            <div className="space-y-0.5">{group.items.map((item) => <SidebarNavItem key={item.label} item={item} collapsed={collapsed} expanded={expandedItems.includes(item.label)} onToggleExpand={toggleExpand} onExpand={forceExpand} />)}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-cream-primary/15 p-2">
        <button onClick={toggleCollapsed} className="hidden lg:flex items-center gap-2 w-full h-9 px-3 text-cream-primary/50 hover:text-cream-primary hover:bg-cream-primary/8 transition-colors duration-200" title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <ChevronsRight size={16} strokeWidth={1.5} className="mx-auto" /> : <><ChevronsLeft size={16} strokeWidth={1.5} /><span className="font-mono text-[10px] tracking-[0.12em] uppercase">Collapse</span></>}
        </button>
        {!collapsed && <div className="px-3 pt-2 pb-1"><span className="font-mono text-[9px] tracking-[0.15em] text-cream-primary/20">[INV.APP]</span></div>}
      </div>
    </div>
  )

  return (
    <>
      <aside className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-blue-primary z-40 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${collapsed ? "w-[60px]" : "w-[240px]"}`}>
        <div className="absolute right-0 top-0 bottom-0 w-px bg-cream-primary/15" />{navContent}
      </aside>
      <AnimatePresence>
        {mobileOpen && (<>
          <motion.div className="fixed inset-0 z-50 bg-blue-primary/60 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setMobileOpen(false)} />
          <motion.aside className="fixed top-0 left-0 h-screen w-[280px] bg-blue-primary z-50 lg:hidden" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1.5 text-cream-primary/60 hover:text-cream-primary transition-colors"><X size={20} strokeWidth={1.5} /></button>
            <div className="absolute right-0 top-0 bottom-0 w-px bg-cream-primary/15" />{navContent}
          </motion.aside>
        </>)}
      </AnimatePresence>
    </>
  )
}