"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import type { NavItem } from "./sidebar-nav-data"

interface SidebarNavItemProps {
  item: NavItem
  collapsed: boolean
  expanded: boolean
  onToggleExpand: (label: string) => void
  onExpand: (label: string) => void
}

export function SidebarNavItem({ item, collapsed, expanded, onToggleExpand, onExpand }: SidebarNavItemProps) {
  const pathname = usePathname()
  const Icon = item.icon
  const hasChildren = !!item.children
  const isActive = item.href ? pathname === item.href : item.children?.some((c) => pathname.startsWith(c.href)) ?? false

  if (!hasChildren && item.href) {
    return (
      <Link href={item.href} className={`group relative flex items-center gap-3 h-10 transition-colors duration-200 ${collapsed ? "justify-center px-0" : "px-3"} ${isActive ? "bg-cream-primary text-blue-primary" : "text-cream-primary/70 hover:text-cream-primary hover:bg-cream-primary/8"}`} title={collapsed ? item.label : undefined}>
        <Icon size={18} strokeWidth={1.5} className="shrink-0" />
        {!collapsed && <span className="font-mono text-[11px] tracking-[0.14em] uppercase truncate">{item.label}</span>}
        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-blue-primary" />}
      </Link>
    )
  }

  return (
    <div>
      <button
        onClick={() => collapsed ? onExpand(item.label) : onToggleExpand(item.label)}
        className={`group relative flex items-center gap-3 h-10 w-full transition-colors duration-200 ${collapsed ? "justify-center px-0" : "px-3"} ${isActive ? "text-cream-primary" : "text-cream-primary/70 hover:text-cream-primary hover:bg-cream-primary/8"}`}
        title={collapsed ? item.label : undefined}
      >
        <Icon size={18} strokeWidth={1.5} className="shrink-0" />
        {!collapsed && (
          <>
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase truncate flex-1 text-left">{item.label}</span>
            <ChevronDown size={14} strokeWidth={1.5} className={`shrink-0 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
          </>
        )}
        {collapsed && isActive && <div className="absolute right-1 top-1 w-1.5 h-1.5 rounded-full bg-cream-primary" />}
      </button>
      {!collapsed && (
        <AnimatePresence initial={false}>
          {expanded && item.children && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
              <div className="ml-[27px] border-l border-cream-primary/15 pl-3 py-1">
                {item.children.map((child) => {
                  const childActive = pathname === child.href
                  return (
                    <Link key={child.href} href={child.href} className={`flex items-center h-8 px-2 transition-colors duration-200 ${childActive ? "bg-cream-primary text-blue-primary" : "text-cream-primary/50 hover:text-cream-primary hover:bg-cream-primary/8"}`}>
                      <span className="font-mono text-[10px] tracking-[0.12em] uppercase truncate">{child.label}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}