"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // Layout
      "inline-flex items-center justify-center gap-1",
      // Background - warm background alt
      "bg-[var(--background-alt)]",
      // Border radius
      "rounded-lg",
      // Padding
      "p-1",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Layout
      "inline-flex items-center justify-center whitespace-nowrap",
      // Padding
      "px-3 py-1.5",
      // Border radius
      "rounded-md",
      // Typography
      "text-sm font-medium",
      // Inactive state - muted text, transparent bg
      "text-[var(--text-muted)] bg-transparent",
      // Transitions
      "transition-all duration-200",
      // Hover state (inactive) - text secondary
      "hover:text-[var(--text-secondary)]",
      // Active state - full text color, surface bg, shadow
      "data-[state=active]:bg-[var(--surface)] data-[state=active]:text-[var(--text)] data-[state=active]:shadow-sm",
      // Focus visible - warm copper ring
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]/20",
      // Disabled state
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      // Margin top
      "mt-4",
      // Focus visible - warm copper ring
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)]/20",
      // Animation - subtle fade in on tab change
      "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-200",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
