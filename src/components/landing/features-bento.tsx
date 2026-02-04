"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

// Custom easing
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

// ============================================
// CARD COMPONENTS — Mix of content types
// ============================================

// 1. Serial Tracking — Typography + tiny serial list
function SerialTrackingCard() {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 lg:col-span-2 transition-all duration-300 hover:border-[#B87333]/25"
    >
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B87333]" />
        <span className="text-[11px] font-heading font-semibold text-[#B87333] tracking-wide">
          Serial Tracking
        </span>
      </div>

      {/* Headline */}
      <h3 className="font-heading font-bold text-xl md:text-2xl text-[var(--text)] mb-2 leading-tight">
        Know every unit&apos;s story.
      </h3>

      {/* Description */}
      <p className="text-sm text-[var(--text-muted)] mb-4 max-w-[340px] leading-relaxed">
        From arrival to sale to warranty claim. Every serial number tracked, every transaction recorded.
      </p>

      {/* Tiny visual — simple serial list */}
      <div className="space-y-1.5">
        {["SN-2024-001847", "SN-2024-001832", "SN-2024-001829"].map((serial, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#B87333]/70">{serial}</span>
            <span className="h-px flex-1 bg-[var(--border)]" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/40" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// 2. Point of Sale — Typography-focused with price accent
function POSCard() {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[#B87333]/25"
    >
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B87333]" />
        <span className="text-[11px] font-heading font-semibold text-[#B87333] tracking-wide">
          Point of Sale
        </span>
      </div>

      {/* Headline */}
      <h3 className="font-heading font-bold text-lg md:text-xl text-[var(--text)] mb-2 leading-tight">
        Serial-aware checkout.
      </h3>

      {/* Description */}
      <p className="text-sm text-[var(--text-muted)] leading-relaxed">
        Select exact units at sale. Receipts include warranty info automatically.
      </p>

      {/* Price accent */}
      <div className="mt-4 pt-3 border-t border-[var(--border)]">
        <span className="text-2xl font-heading font-bold text-[var(--text)]">$1,198</span>
        <span className="text-xs text-[var(--text-muted)] ml-2">ready</span>
      </div>
    </motion.div>
  );
}

// 3. Warranty Claims — Minimal timeline
function WarrantyCard() {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[#B87333]/25"
    >
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B87333]" />
        <span className="text-[11px] font-heading font-semibold text-[#B87333] tracking-wide">
          Warranty Claims
        </span>
      </div>

      {/* Headline */}
      <h3 className="font-heading font-bold text-lg md:text-xl text-[var(--text)] mb-2 leading-tight">
        Receipt to resolution.
      </h3>

      {/* Description */}
      <p className="text-sm text-[var(--text-muted)] leading-relaxed">
        Track every claim from customer receipt to supplier credit.
      </p>

      {/* Full-width timeline */}
      <div className="mt-4 w-full flex items-center">
        <span className="w-2.5 h-2.5 rounded-full bg-[#B87333] shrink-0" />
        <span className="flex-1 h-0.5 bg-[#B87333]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#B87333] shrink-0" />
        <span className="flex-1 h-0.5 bg-[var(--border)]" />
        <span className="w-2.5 h-2.5 rounded-full border-2 border-[var(--border)] bg-[var(--surface)] shrink-0" />
      </div>
      <div className="flex mt-1.5">
        <span className="flex-1 text-[9px] text-[var(--text-muted)] text-left">Received</span>
        <span className="flex-1 text-[9px] text-[var(--text)] text-center">Review</span>
        <span className="flex-1 text-[9px] text-[var(--text-muted)] text-right">Done</span>
      </div>
    </motion.div>
  );
}

// 4. Reports — Big stat number
function ReportsCard() {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 transition-all duration-300 hover:border-[#B87333]/25"
    >
      {/* Big number */}
      <span className="block font-heading font-bold text-4xl md:text-5xl text-[#B87333]/80 leading-none mb-2">
        24+
      </span>

      {/* Label */}
      <span className="text-xs font-heading font-semibold text-[var(--text)] tracking-wide uppercase">
        Report Types
      </span>

      {/* Description */}
      <p className="text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">
        Sales, margins, inventory value, exports.
      </p>
    </motion.div>
  );
}

// 5. Stock Control — Typography-focused
function StockControlCard() {
  return (
    <motion.div
      variants={cardVariants}
      className="group relative rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 transition-all duration-300 hover:border-[#B87333]/25"
    >
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B87333]" />
        <span className="text-[11px] font-heading font-semibold text-[#B87333] tracking-wide">
          Stock Control
        </span>
      </div>

      {/* Headline */}
      <h3 className="font-heading font-bold text-lg md:text-xl text-[var(--text)] mb-2 leading-tight">
        Never oversell.
      </h3>

      {/* Description */}
      <p className="text-sm text-[var(--text-muted)] leading-relaxed">
        Real-time levels, low stock alerts, purchase orders.
      </p>

      {/* Simple indicator */}
      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)]">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span className="text-xs font-medium text-[var(--text)]">142 units</span>
      </div>
    </motion.div>
  );
}

// 6. Business Management — Typography + tiny bars
function BusinessCard() {
  const items = [
    { label: "Rent", width: "60%" },
    { label: "Payroll", width: "100%" },
    { label: "Utilities", width: "25%" },
  ];

  return (
    <motion.div
      variants={cardVariants}
      className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 lg:col-span-3 transition-all duration-300 hover:border-[#B87333]/25"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Text content */}
        <div className="flex-1">
          {/* Label */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B87333]" />
            <span className="text-[11px] font-heading font-semibold text-[#B87333] tracking-wide">
              Business Management
            </span>
          </div>

          {/* Headline */}
          <h3 className="font-heading font-bold text-lg md:text-xl text-[var(--text)] mb-2 leading-tight">
            More than inventory.
          </h3>

          {/* Description */}
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-[320px]">
            Track expenses, manage cash flow, understand your business.
          </p>
        </div>

        {/* Expense bars */}
        <div className="w-full md:flex-1 md:max-w-md space-y-2">
          {items.map((item, i) => (
            <div key={i} className="space-y-0.5">
              <span className="text-[10px] text-[var(--text-muted)]">{item.label}</span>
              <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#B87333]/60"
                  style={{ width: item.width }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function FeaturesBento() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-20 md:py-28 overflow-hidden bg-[var(--background)]"
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.12] dark:opacity-[0.03] pointer-events-none mix-blend-multiply dark:mix-blend-normal"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="mb-12 md:mb-16"
        >
          {/* Label */}
          <span className="inline-block font-heading font-bold text-xs tracking-[0.3em] uppercase text-[#B87333] mb-3">
            Features
          </span>

          {/* Headline */}
          <h2 className="font-display italic text-[var(--text)] text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-4">
            Every serial. Every sale. Every claim.
          </h2>

          {/* Subtext */}
          <p className="font-heading text-sm md:text-base text-[var(--text-muted)]">
            Six modules built for tech retail. Zero fluff.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 [grid-auto-flow:dense]"
        >
          {/* Row 1: Serial (2col) + POS (1col) */}
          <SerialTrackingCard />
          <POSCard />
          {/* Row 2: Warranty + Reports + Stock (1col each) */}
          <WarrantyCard />
          <ReportsCard />
          <StockControlCard />
          {/* Row 3: Business (full width) */}
          <BusinessCard />
        </motion.div>
      </div>
    </section>
  );
}
