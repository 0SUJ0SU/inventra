"use client"

import { useState, useEffect } from "react"

const COLLAPSED_KEY = "inventra_sidebar_collapsed"

export function AppContentWrapper({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem(COLLAPSED_KEY) === "true" : false
  )

  useEffect(() => {
    const handler = () => setCollapsed(localStorage.getItem(COLLAPSED_KEY) === "true")
    window.addEventListener("inventra:sidebar-toggle", handler)
    return () => window.removeEventListener("inventra:sidebar-toggle", handler)
  }, [])

  return (
    <div
      className="transition-[padding-left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ paddingLeft: collapsed ? 60 : 240 }}
    >
      {children}
    </div>
  )
}