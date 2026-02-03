"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type DateRange = "7d" | "30d" | "3m" | "12m" | "all"

interface ChartCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  dateFilter?: boolean
  onDateRangeChange?: (range: DateRange) => void
  action?: React.ReactNode
  loading?: boolean
  className?: string
}

const dateRangeOptions: { value: DateRange; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "3m", label: "Last 3 months" },
  { value: "12m", label: "Last 12 months" },
  { value: "all", label: "All time" },
]

function ChartCardSkeleton() {
  return (
    <div className="flex h-[200px] w-full items-center justify-center">
      <div className="h-full w-full animate-pulse rounded-md bg-[var(--border)] dark:bg-[var(--border-dark)]" />
    </div>
  )
}

export function ChartCard({
  title,
  subtitle,
  children,
  dateFilter = false,
  onDateRangeChange,
  action,
  loading = false,
  className,
}: ChartCardProps) {
  const [selectedRange, setSelectedRange] = React.useState<DateRange>("30d")

  const handleRangeChange = (value: DateRange) => {
    setSelectedRange(value)
    onDateRangeChange?.(value)
  }

  return (
    <Card className={cn("p-6", className)}>
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Title and subtitle */}
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-base font-semibold text-[var(--text)] dark:text-[var(--text-dark)]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">
              {subtitle}
            </p>
          )}
        </div>

        {/* Actions / Date filter */}
        <div className="flex items-center gap-2">
          {dateFilter && (
            <Select value={selectedRange} onValueChange={handleRangeChange}>
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-xs"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {action}
        </div>
      </div>

      {/* Chart content */}
      <div className="min-h-[200px]">
        {loading ? <ChartCardSkeleton /> : children}
      </div>
    </Card>
  )
}
