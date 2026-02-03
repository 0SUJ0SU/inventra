import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn(
        "w-full caption-bottom text-sm border-collapse",
        className
      )}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "bg-[var(--background-alt)] dark:bg-[var(--background-alt-dark)]",
      "[&_tr]:border-b [&_tr]:border-[var(--border)] dark:[&_tr]:border-[var(--border-dark)]",
      className
    )}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "bg-[var(--surface)] dark:bg-[var(--surface-dark)]",
      "[&_tr:last-child]:border-0",
      className
    )}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "bg-[var(--background-alt)] dark:bg-[var(--background-alt-dark)]",
      "border-t border-[var(--border)] dark:border-[var(--border-dark)]",
      "font-medium",
      "[&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      // Border
      "border-b border-[var(--border)] dark:border-[var(--border-dark)]",
      // Transitions
      "transition-colors duration-150",
      // Hover state
      "hover:bg-[var(--background-alt)]/50 dark:hover:bg-[var(--background-alt-dark)]/50",
      // Selected state
      "data-[state=selected]:bg-[var(--accent-50)] dark:data-[state=selected]:bg-[var(--accent-900)]/20",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      // Padding
      "px-4 py-3",
      // Typography
      "text-left text-sm font-medium",
      "uppercase tracking-wide",
      // Color
      "text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]",
      // Alignment
      "align-middle",
      // Whitespace
      "whitespace-nowrap",
      // Border
      "border-b border-[var(--border)] dark:border-[var(--border-dark)]",
      // Checkbox alignment
      "[&:has([role=checkbox])]:pr-0",
      // Sortable styles (when aria-sort is present)
      "[&[aria-sort]]:cursor-pointer",
      "[&[aria-sort]]:select-none",
      "[&[aria-sort]]:transition-colors",
      "[&[aria-sort]]:hover:text-[var(--text)] dark:[&[aria-sort]]:hover:text-[var(--text-dark)]",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      // Padding
      "px-4 py-3",
      // Typography
      "text-sm",
      // Color
      "text-[var(--text)] dark:text-[var(--text-dark)]",
      // Alignment
      "align-middle",
      // Checkbox alignment
      "[&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      // Padding
      "py-4",
      // Typography
      "text-sm",
      // Color
      "text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]",
      className
    )}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
