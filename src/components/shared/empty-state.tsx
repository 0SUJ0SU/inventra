"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"
import { motion, type Variants } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateAction {
  label: string
  onClick: () => void
}

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: EmptyStateAction
  secondaryAction?: EmptyStateAction
  className?: string
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const iconFloatVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Icon container with subtle float animation */}
      <motion.div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-alt)] dark:bg-[var(--background-alt-dark)]"
        variants={iconFloatVariants}
        initial="initial"
        animate="animate"
      >
        <Icon className="h-8 w-8 text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]" />
      </motion.div>

      {/* Title */}
      <h3 className="mt-4 font-display text-lg font-semibold text-[var(--text)] dark:text-[var(--text-dark)]">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mt-2 max-w-sm text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-col items-center gap-2">
          {action && (
            <Button onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )
}
