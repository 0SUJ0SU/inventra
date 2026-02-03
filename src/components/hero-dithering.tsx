"use client"

import { Suspense, lazy } from "react"
import { useTheme } from "next-themes"

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
)

export function HeroDithering() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <section className="relative w-full overflow-hidden">
      {/* Dithering Background - slow, subtle animation */}
      <Suspense fallback={<div className="absolute inset-0 bg-[var(--background)]" />}>
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen">
          <Dithering
            colorBack="#00000000"
            colorFront={isDark ? "#D4956A" : "#B87333"}
            shape="warp"
            type="4x4"
            speed={0.05}
            className="size-full"
            minPixelRatio={1}
          />
        </div>
      </Suspense>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="text-center">
          <p className="mb-4 font-[var(--font-space-grotesk)] text-sm font-medium uppercase tracking-widest text-[var(--text-muted)]">
            Smart Inventory & Business Management
          </p>
          <h1 className="mb-6 text-5xl font-bold leading-tight text-[var(--text)] sm:text-6xl lg:text-7xl">
            <span className="font-[var(--font-fraunces)] italic">Built for</span>{" "}
            <span className="font-[var(--font-space-grotesk)] text-[var(--accent-500)]">
              Modern Retail
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[var(--text-secondary)]">
            A powerful inventory and business management system designed for tech and
            gadget retail businesses. Track serial numbers, manage warranties, and gain
            insights — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="inline-flex h-12 items-center justify-center rounded-lg bg-[var(--text)] px-8 font-[var(--font-space-grotesk)] font-medium text-[var(--background)] transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]">
              Try Demo
            </button>
            <button className="inline-flex h-12 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-8 font-[var(--font-space-grotesk)] font-medium text-[var(--text)] transition-all hover:bg-[var(--background-alt)] hover:border-[var(--text-muted)]">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
