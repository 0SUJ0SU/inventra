"use client"

import * as React from "react"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { motion, useInView, useSpring, useTransform } from "framer-motion"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
  loading?: boolean
  className?: string
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const spring = useSpring(0, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  })

  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  )

  React.useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, spring, value])

  return <motion.span ref={ref}>{display}</motion.span>
}

function StatCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        {/* Icon skeleton */}
        <div className="h-10 w-10 animate-pulse rounded-lg bg-[var(--border)] dark:bg-[var(--border-dark)]" />

        {/* Title skeleton */}
        <div className="h-4 w-24 animate-pulse rounded bg-[var(--border)] dark:bg-[var(--border-dark)]" />

        {/* Value skeleton */}
        <div className="h-8 w-32 animate-pulse rounded bg-[var(--border)] dark:bg-[var(--border-dark)]" />

        {/* Trend skeleton */}
        <div className="h-4 w-16 animate-pulse rounded bg-[var(--border)] dark:bg-[var(--border-dark)]" />
      </div>
    </Card>
  )
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  loading = false,
  className,
}: StatCardProps) {
  if (loading) {
    return <StatCardSkeleton />
  }

  const numericValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]/g, "")) : value
  const isNumeric = !isNaN(numericValue) && typeof value === "number"
  const prefix = typeof value === "string" ? value.match(/^[^0-9]*/)?.[0] || "" : ""
  const suffix = typeof value === "string" ? value.match(/[^0-9]*$/)?.[0] || "" : ""

  return (
    <Card
      className={cn(
        "p-6 hover:-translate-y-1 hover:shadow-lg cursor-default",
        className
      )}
    >
      <div className="flex flex-col gap-3">
        {/* Icon */}
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-500)]/10 dark:bg-[var(--accent-400)]/10">
            <Icon className="h-5 w-5 text-[var(--accent-500)] dark:text-[var(--accent-400)]" />
          </div>

          {/* Trend indicator */}
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                trend.isPositive
                  ? "bg-[#10B981]/10 text-[#10B981]"
                  : "bg-[#EF4444]/10 text-[#EF4444]"
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>
                {trend.isPositive ? "+" : ""}
                {trend.value.toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">
          {title}
        </p>

        {/* Value */}
        <p className="font-display text-2xl font-bold text-[var(--text)] dark:text-[var(--text-dark)] sm:text-3xl">
          {isNumeric ? (
            <>
              {prefix}
              <AnimatedNumber value={numericValue} />
              {suffix}
            </>
          ) : (
            value
          )}
        </p>

        {/* Description */}
        {description && (
          <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">
            {description}
          </p>
        )}
      </div>
    </Card>
  )
}
