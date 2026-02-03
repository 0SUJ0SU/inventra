"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// =============================================================================
// Types
// =============================================================================

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  backHref?: string;
  className?: string;
}

// =============================================================================
// Animation Variants
// =============================================================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

// =============================================================================
// Breadcrumbs Component
// =============================================================================

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Breadcrumb"
      className="mb-3"
    >
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <motion.li
              key={index}
              variants={itemVariants}
              className="flex items-center"
            >
              {index > 0 && (
                <ChevronRight className="mx-1 h-4 w-4 shrink-0 text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]" />
              )}
              {isLast || !item.href ? (
                <span
                  className={cn(
                    "text-sm",
                    isLast
                      ? "font-medium text-[var(--text)] dark:text-[var(--text-dark)]"
                      : "text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]"
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] transition-colors hover:text-[var(--accent-500)] dark:hover:text-[var(--accent-400)]"
                >
                  {item.label}
                </Link>
              )}
            </motion.li>
          );
        })}
      </ol>
    </motion.nav>
  );
}

// =============================================================================
// Back Button Component
// =============================================================================

function BackButton({ href }: { href: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      className="shrink-0 -ml-2 mr-2 text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] hover:text-[var(--text)] dark:hover:text-[var(--text-dark)] hover:bg-[var(--background-alt)] dark:hover:bg-[var(--background-alt-dark)]"
    >
      <Link href={href}>
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Go back</span>
      </Link>
    </Button>
  );
}

// =============================================================================
// Page Header Component
// =============================================================================

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  backHref,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} />
      )}

      {/* Main header row */}
      <motion.div
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        {/* Left side: Back button + Title + Description */}
        <div className="flex items-start gap-1">
          {backHref && <BackButton href={backHref} />}
          <div className="min-w-0 flex-1">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-[var(--text)] dark:text-[var(--text-dark)] tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm md:text-base text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right side: Actions */}
        {actions && (
          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 shrink-0"
          >
            {actions}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
