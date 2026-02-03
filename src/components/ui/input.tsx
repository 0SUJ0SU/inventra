import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          "flex h-10 w-full rounded-md px-3 py-2 text-base md:text-sm",
          // Background and text
          "bg-[var(--surface)] text-[var(--text)]",
          // Border
          "border border-[var(--border)]",
          // Placeholder
          "placeholder:text-[var(--text-muted)]",
          // File input styles
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--text)]",
          // Transitions
          "transition-all duration-200",
          // Focus states - warm copper ring
          "focus-visible:outline-none focus-visible:border-[var(--accent-500)] focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]/20",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
