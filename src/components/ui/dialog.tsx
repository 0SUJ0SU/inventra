"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // Position and z-index
      "fixed inset-0 z-50",
      // Warm glass effect - darker overlay with blur
      "bg-black/60 backdrop-blur-sm",
      // Animations
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Position - centered
        "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
        // Size
        "w-full max-w-lg",
        // Layout
        "grid gap-4",
        // Background - warm surface raised
        "bg-[var(--surface-raised)]",
        // Border - warm border
        "border border-[var(--border)]",
        // Border radius
        "rounded-lg",
        // Shadow - large warm shadow
        "shadow-lg",
        // Padding
        "p-6",
        // Duration for animations
        "duration-200",
        // Open animations - scale and fade from center
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        // Close animations
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        className
      )}
      {...props}
    >
      {children}
      {/* Close button - positioned top-right */}
      <DialogPrimitive.Close
        className={cn(
          // Position
          "absolute right-4 top-4",
          // Shape
          "rounded-sm",
          // Color - muted, hover to full text
          "text-[var(--text-muted)] hover:text-[var(--text)]",
          // Hover background
          "hover:bg-[var(--background-alt)]",
          // Padding for click area
          "p-1",
          // Transitions
          "transition-colors duration-200",
          // Focus ring
          "focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)] focus:ring-offset-2 focus:ring-offset-[var(--surface-raised)]",
          // Disabled state
          "disabled:pointer-events-none"
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Layout
      "flex flex-col space-y-1.5",
      // Text alignment
      "text-center sm:text-left",
      // Margin bottom for spacing from content
      "mb-2",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Flex layout with gap
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3",
      // Margin top for spacing
      "mt-4",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      // Font - Space Grotesk display font
      "font-display font-semibold",
      // Size
      "text-lg",
      // Color - warm text
      "text-[var(--text)]",
      // Line height and tracking
      "leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      // Size
      "text-sm",
      // Color - warm muted text
      "text-[var(--text-muted)]",
      className
    )}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
