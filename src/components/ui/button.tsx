import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary: Warm copper background, cream text
        default:
          "bg-[var(--accent-500)] text-[#FAF8F5] hover:bg-[var(--accent-600)]",
        // Secondary: Surface background with border
        secondary:
          "bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--background-alt)]",
        // Outline: Transparent with copper border and text
        outline:
          "border border-[var(--accent-500)] bg-transparent text-[var(--accent-500)] hover:bg-[var(--accent-500)] hover:text-[#FAF8F5]",
        // Ghost: Transparent, text color, subtle hover
        ghost:
          "bg-transparent text-[var(--text)] hover:bg-[var(--background-alt)]",
        // Link: Copper text with underline on hover
        link:
          "bg-transparent text-[var(--accent-600)] underline-offset-4 hover:underline dark:text-[var(--accent-400)]",
        // Destructive: Error red for both modes
        destructive:
          "bg-[var(--error)] text-[#FAF8F5] hover:bg-[#DC2626]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
