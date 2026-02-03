"use client"

import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Package, Shield, BarChart3 } from "lucide-react"
import { HeroDithering } from "@/components/hero-dithering"

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Traditional Navbar: Logo left, links center, actions right */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--background)]/80 backdrop-blur-sm">
        <nav className="mx-auto grid h-14 max-w-7xl grid-cols-3 items-center px-4 sm:px-6 lg:px-8">
          {/* Left: Logo */}
          <div className="flex items-center">
            <span className="font-[var(--font-space-grotesk)] text-xl font-bold tracking-tight text-[var(--text)]">
              Inventra
            </span>
          </div>

          {/* Center: Nav Links */}
          <div className="hidden items-center justify-center gap-8 md:flex">
            <a
              href="#features"
              className="font-[var(--font-space-grotesk)] text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="font-[var(--font-space-grotesk)] text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
            >
              Pricing
            </a>
            <a
              href="#docs"
              className="font-[var(--font-space-grotesk)] text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
            >
              Docs
            </a>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-3">
            <ThemeToggle />
            <a
              href="#login"
              className="hidden h-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 font-[var(--font-space-grotesk)] text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--background-alt)] sm:inline-flex"
            >
              Log In
            </a>
            <a
              href="#get-started"
              className="inline-flex h-9 items-center justify-center rounded-md bg-[var(--text)] px-4 font-[var(--font-space-grotesk)] text-sm font-medium text-[var(--background)] transition-colors hover:opacity-90"
            >
              Get Started
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section with Dithering Background */}
      <HeroDithering />

      {/* Feature preview cards */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div id="features" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Serial Tracking",
              description:
                "Track every item by serial number. Full history from purchase to sale.",
              icon: Package,
            },
            {
              title: "Warranty Management",
              description:
                "Manage warranty claims, track expiry dates, and handle replacements.",
              icon: Shield,
            },
            {
              title: "Business Analytics",
              description:
                "Real-time insights into sales, inventory, and profit margins.",
              icon: BarChart3,
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:scale-[1.02] hover:border-[var(--border-subtle)]"
            >
              <div className="mb-4">
                <feature.icon className="h-8 w-8 text-[var(--text)]" strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 font-[var(--font-space-grotesk)] text-lg font-semibold text-[var(--text)]">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)]">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-24 border-t border-[var(--border-subtle)] pt-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Inventra = Inventory + Extra — More than just stock tracking.
          </p>
        </footer>
      </div>
    </main>
  )
}
