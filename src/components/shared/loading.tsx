import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// =============================================================================
// Base Skeleton Component
// =============================================================================

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({ className, variant = "rectangular" }: SkeletonProps) {
  const variantStyles = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
  };

  return (
    <div
      className={cn(
        "animate-shimmer",
        variantStyles[variant],
        className
      )}
    />
  );
}

// =============================================================================
// Skeleton Card
// =============================================================================

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] bg-[var(--surface)] dark:bg-[var(--surface-dark)] p-6",
        className
      )}
    >
      {/* Header area */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
      {/* Content area */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  );
}

// =============================================================================
// Skeleton Stat Card
// =============================================================================

interface SkeletonStatCardProps {
  className?: string;
}

export function SkeletonStatCard({ className }: SkeletonStatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] bg-[var(--surface)] dark:bg-[var(--surface-dark)] p-6",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          {/* Title line */}
          <Skeleton className="h-3 w-24" />
          {/* Large value line */}
          <Skeleton className="h-8 w-32" />
          {/* Small trend line */}
          <Skeleton className="h-3 w-20" />
        </div>
        {/* Icon placeholder */}
        <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
      </div>
    </div>
  );
}

// =============================================================================
// Skeleton Table Row
// =============================================================================

interface SkeletonTableRowProps {
  columns?: number;
  className?: string;
}

const columnWidths = ["w-[60%]", "w-[80%]", "w-[40%]", "w-[70%]", "w-[50%]", "w-[65%]", "w-[45%]", "w-[75%]"];

export function SkeletonTableRow({ columns = 5, className }: SkeletonTableRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 py-4 px-4 border-b border-[var(--border-subtle)] dark:border-[var(--border-subtle-dark)]",
        className
      )}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <div key={index} className="flex-1">
          <Skeleton
            className={cn("h-4", columnWidths[index % columnWidths.length])}
          />
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Skeleton Table
// =============================================================================

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({ rows = 5, columns = 5, className }: SkeletonTableProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] bg-[var(--surface)] dark:bg-[var(--surface-dark)] overflow-hidden",
        className
      )}
    >
      {/* Header row */}
      <div className="flex items-center gap-4 py-3 px-4 bg-[var(--background-alt)] dark:bg-[var(--background-alt-dark)] border-b border-[var(--border)] dark:border-[var(--border-dark)]">
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="flex-1">
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      {/* Body rows */}
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonTableRow
          key={index}
          columns={columns}
          className={index === rows - 1 ? "border-b-0" : ""}
        />
      ))}
    </div>
  );
}

// =============================================================================
// Skeleton Text
// =============================================================================

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

const lineWidths = ["w-full", "w-[90%]", "w-[75%]", "w-[85%]", "w-[60%]"];

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          className={cn("h-4", lineWidths[index % lineWidths.length])}
        />
      ))}
    </div>
  );
}

// =============================================================================
// Skeleton Avatar
// =============================================================================

interface SkeletonAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SkeletonAvatar({ size = "md", className }: SkeletonAvatarProps) {
  const sizeStyles = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <Skeleton
      variant="circular"
      className={cn(sizeStyles[size], className)}
    />
  );
}

// =============================================================================
// Page Loader - Bouncing Dots
// =============================================================================

interface PageLoaderProps {
  message?: string;
  className?: string;
}

export function PageLoader({ message, className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "h-full w-full flex items-center justify-center",
        className
      )}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Bouncing dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-[var(--accent-500)] rounded-full"
              animate={{
                y: [-8, 0, -8],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.1,
              }}
            />
          ))}
        </div>
        
        {/* Optional message */}
        {message && (
          <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">{message}</p>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Composite Loading States (Bonus utilities)
// =============================================================================

interface SkeletonListProps {
  count?: number;
  className?: string;
}

export function SkeletonList({ count = 3, className }: SkeletonListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] bg-[var(--surface)] dark:bg-[var(--surface-dark)]"
        >
          <SkeletonAvatar size="md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      ))}
    </div>
  );
}

interface SkeletonGridProps {
  count?: number;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function SkeletonGrid({ count = 6, columns = 3, className }: SkeletonGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
