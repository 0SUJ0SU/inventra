import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // Base styles for all badges
  [
    "inline-flex items-center",
    "rounded-full",
    "px-2.5 py-0.5",
    "text-xs font-medium",
    "transition-colors duration-150",
    "focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]/20",
  ],
  {
    variants: {
      variant: {
        // Default: Warm copper accent - primary status
        default: [
          "bg-[var(--accent-500)]",
          "text-[#FAF8F5]",
          "border-transparent",
        ],
        // Secondary: Subtle background with border
        secondary: [
          "bg-[var(--background-alt)]",
          "text-[var(--text-secondary)]",
          "border border-[var(--border)]",
        ],
        // Outline: Transparent with border
        outline: [
          "bg-transparent",
          "text-[var(--text)]",
          "border border-[var(--border)]",
        ],
        // Success: Green tinted - positive statuses
        success: [
          "bg-[#10B981]/15",
          "text-[#059669] dark:text-[#34D399]",
          "border-transparent",
        ],
        // Warning: Amber tinted - caution statuses
        warning: [
          "bg-[#F59E0B]/15",
          "text-[#D97706] dark:text-[#FBBF24]",
          "border-transparent",
        ],
        // Destructive/Error: Red tinted - negative statuses
        destructive: [
          "bg-[#EF4444]/15",
          "text-[#DC2626] dark:text-[#F87171]",
          "border-transparent",
        ],
        // Info: Blue tinted - informational statuses
        info: [
          "bg-[#6B8EBF]/15",
          "text-[#4A6FA5] dark:text-[#8FB3DE]",
          "border-transparent",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
