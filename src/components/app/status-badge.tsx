import * as React from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "info"

type StatusVariant = "serial" | "warranty" | "order" | "claim" | "generic"
type StatusSize = "sm" | "default" | "lg"

interface StatusBadgeProps {
  status: string
  variant: StatusVariant
  size?: StatusSize
  showDot?: boolean
  className?: string
}

// Format status text: 'in_stock' -> 'In Stock'
function formatStatusText(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

// Status to badge variant mappings
const serialStatusMap: Record<string, BadgeVariant> = {
  in_stock: "success",
  sold: "secondary",
  reserved: "warning",
  defective: "destructive",
  in_repair: "warning",
  scrapped: "destructive",
}

const warrantyStatusMap: Record<string, BadgeVariant> = {
  active: "success",
  expiring_soon: "warning",
  expired: "destructive",
  "n/a": "secondary",
  none: "secondary",
}

const orderStatusMap: Record<string, BadgeVariant> = {
  pending: "warning",
  completed: "success",
  cancelled: "destructive",
  partial: "info",
}

const claimStatusMap: Record<string, BadgeVariant> = {
  pending: "warning",
  in_review: "info",
  in_repair: "warning",
  repaired: "success",
  replaced: "success",
  rejected: "destructive",
  closed: "secondary",
}

const genericStatusMap: Record<string, BadgeVariant> = {
  active: "success",
  inactive: "secondary",
  enabled: "success",
  disabled: "secondary",
}

function getVariantForStatus(
  status: string,
  variant: StatusVariant
): BadgeVariant {
  const statusLower = status.toLowerCase()

  switch (variant) {
    case "serial":
      return serialStatusMap[statusLower] || "secondary"
    case "warranty":
      return warrantyStatusMap[statusLower] || "secondary"
    case "order":
      return orderStatusMap[statusLower] || "secondary"
    case "claim":
      return claimStatusMap[statusLower] || "secondary"
    case "generic":
      return genericStatusMap[statusLower] || "secondary"
    default:
      return "secondary"
  }
}

// Dot color mappings (matching badge text colors)
const dotColors: Record<BadgeVariant, string> = {
  default: "bg-[#FAF8F5]",
  secondary: "bg-[var(--text-secondary)]",
  success: "bg-[#059669] dark:bg-[#34D399]",
  warning: "bg-[#D97706] dark:bg-[#FBBF24]",
  destructive: "bg-[#DC2626] dark:bg-[#F87171]",
  info: "bg-[#4A6FA5] dark:bg-[#8FB3DE]",
}

// Size styles
const sizeStyles: Record<StatusSize, string> = {
  sm: "text-xs px-2 py-0.5",
  default: "text-xs px-2.5 py-0.5",
  lg: "text-sm px-3 py-1",
}

export function StatusBadge({
  status,
  variant,
  size = "default",
  showDot = false,
  className,
}: StatusBadgeProps) {
  const badgeVariant = getVariantForStatus(status, variant)
  const formattedStatus = formatStatusText(status)

  return (
    <Badge
      variant={badgeVariant}
      className={cn(sizeStyles[size], className)}
    >
      {showDot && (
        <span
          className={cn(
            "mr-1.5 h-1.5 w-1.5 rounded-full",
            dotColors[badgeVariant]
          )}
        />
      )}
      {formattedStatus}
    </Badge>
  )
}
