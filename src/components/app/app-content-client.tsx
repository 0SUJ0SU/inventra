// src/components/app/app-content-client.tsx
"use client";

import { useState, useEffect } from "react";

const COLLAPSED_KEY = "inventra_sidebar_collapsed";
const SIDEBAR_EVENT = "inventra:sidebar-toggled";

// Call this from sidebar when toggling
export function notifySidebarToggle() {
  setTimeout(() => window.dispatchEvent(new Event(SIDEBAR_EVENT)), 0);
}

export function AppContentClient({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Read initial state
    try {
      const stored = localStorage.getItem(COLLAPSED_KEY);
      if (stored === "true") setCollapsed(true);
    } catch {
      // localStorage may be unavailable (e.g. SSR, privacy mode)
    }

    // Listen for sidebar toggle events (same tab)
    const handleToggle = () => {
      try {
        const current = localStorage.getItem(COLLAPSED_KEY);
        setCollapsed(current === "true");
      } catch {
        // localStorage may be unavailable
      }
    };

    window.addEventListener(SIDEBAR_EVENT, handleToggle);
    window.addEventListener("storage", handleToggle);

    return () => {
      window.removeEventListener(SIDEBAR_EVENT, handleToggle);
      window.removeEventListener("storage", handleToggle);
    };
  }, []);

  return (
    <div
      className={`
        min-h-screen transition-[padding-left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${collapsed ? "lg:pl-[60px]" : "lg:pl-[240px]"}
      `}
    >
      {children}
    </div>
  );
}
