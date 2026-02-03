"use client"

import * as React from "react"
import { LucideIcon, Circle } from "lucide-react"
import { motion } from "framer-motion"
import { formatDistanceToNow, format, isValid } from "date-fns"

import { cn } from "@/lib/utils"
import type { Variants } from "framer-motion"

type TimelineVariant = "default" | "success" | "warning" | "error" | "info"

interface TimelineProps {
  children: React.ReactNode
  className?: string
}

interface TimelineItemProps {
  title: string
  description?: string
  timestamp?: string | Date
  /** Pre-formatted timestamp string to display directly (bypasses date formatting, avoids hydration issues) */
  formattedTimestamp?: string
  icon?: LucideIcon
  variant?: TimelineVariant
  isLast?: boolean
  className?: string
}

// Variant styles for icon circles
const variantStyles: Record<
  TimelineVariant,
  { bg: string; icon: string }
> = {
  default: {
    bg: "bg-[var(--background-alt)] dark:bg-[var(--background-alt-dark)]",
    icon: "text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]",
  },
  success: {
    bg: "bg-[#10B981]/10",
    icon: "text-[#059669] dark:text-[#34D399]",
  },
  warning: {
    bg: "bg-[#F59E0B]/10",
    icon: "text-[#D97706] dark:text-[#FBBF24]",
  },
  error: {
    bg: "bg-[#EF4444]/10",
    icon: "text-[#DC2626] dark:text-[#F87171]",
  },
  info: {
    bg: "bg-[#6B8EBF]/10",
    icon: "text-[#4A6FA5] dark:text-[#8FB3DE]",
  },
}

// Format timestamp for display - returns server-safe static format
function formatTimestampStatic(timestamp: string | Date): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp

  if (!isValid(date)) {
    return "Unknown"
  }

  return format(date, "MMM d, yyyy 'at' h:mm a")
}

// Hook to get relative time on client only (avoids hydration mismatch)
function useRelativeTime(timestamp: string | Date): string {
  const [relativeTime, setRelativeTime] = React.useState<string>(() => {
    // Return static format for SSR
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
    if (!isValid(date)) return "Unknown"
    return format(date, "MMM d, yyyy")
  })

  React.useEffect(() => {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
    if (!isValid(date)) {
      setRelativeTime("Unknown")
      return
    }

    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    // Show relative time for recent events (within 7 days)
    if (diffInHours < 168) {
      setRelativeTime(formatDistanceToNow(date, { addSuffix: true }))
    } else {
      setRelativeTime(format(date, "MMM d, yyyy"))
    }
  }, [timestamp])

  return relativeTime
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export function Timeline({ children, className }: TimelineProps) {
  return (
    <motion.div
      className={cn("relative", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

export function TimelineItem({
  title,
  description,
  timestamp,
  formattedTimestamp,
  icon: Icon = Circle,
  variant = "default",
  isLast = false,
  className,
}: TimelineItemProps) {
  const styles = variantStyles[variant]
  // Use formattedTimestamp directly if provided (avoids hydration mismatch)
  const relativeTime = useRelativeTime(timestamp ?? new Date(0))
  const displayTime = formattedTimestamp ?? relativeTime
  const formatted = formattedTimestamp ?? (timestamp ? formatTimestampStatic(timestamp) : "")

  return (
    <motion.div
      className={cn("relative flex gap-4 pb-8 last:pb-0", className)}
      variants={itemVariants}
    >
      {/* Icon and connecting line */}
      <div className="relative flex flex-col items-center">
        {/* Icon circle */}
        <div
          className={cn(
            "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            styles.bg
          )}
        >
          <Icon className={cn("h-4 w-4", styles.icon)} />
        </div>

        {/* Connecting line */}
        {!isLast && (
          <div className="absolute left-1/2 top-8 h-[calc(100%-2rem)] w-0.5 -translate-x-1/2 bg-[var(--border)] dark:bg-[#4A4346]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)]">
            {title}
          </h4>
          <time
            dateTime={
              timestamp
                ? typeof timestamp === "string"
                  ? timestamp
                  : timestamp.toISOString()
                : undefined
            }
            title={formatted}
            className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]"
          >
            {displayTime}
          </time>
        </div>

        {description && (
          <p className="mt-1 text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  )
}
