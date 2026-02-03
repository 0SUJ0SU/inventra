"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import {
  QrCode,
  ShieldCheck,
  CreditCard,
  Package,
  BarChart3,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Single source of truth for rotation timing
const ROTATION_INTERVAL_MS = 5000;
const ROTATION_INTERVAL_SEC = ROTATION_INTERVAL_MS / 1000;

// Custom easing
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease },
  },
};

// Feature data with enhanced descriptions
interface Feature {
  id: string;
  number: string;
  icon: LucideIcon;
  title: string;
  shortTitle: string;
  description: string;
  detail: string;
}

const features: Feature[] = [
  {
    id: "serial-tracking",
    number: "01",
    icon: QrCode,
    title: "Serial Number Tracking",
    shortTitle: "Serial Tracking",
    description:
      "Every unit gets a story. From the moment it arrives to the day it leaves your store.",
    detail:
      "Scan in, scan out. Know exactly which serial went to which customer, when it was sold, and its complete warranty timeline. No more guessing which unit is which — every item is uniquely identified and fully traceable.",
  },
  {
    id: "warranty",
    number: "02",
    icon: ShieldCheck,
    title: "Warranty Claims",
    shortTitle: "Warranty Claims",
    description:
      "Customer returns and supplier claims, handled without the headache.",
    detail:
      "Full claim lifecycle tracking from customer receipt to supplier resolution. See pending claims, track RMA numbers, and never lose money on warranty issues again. Built-in timelines show exactly where each claim stands.",
  },
  {
    id: "pos",
    number: "03",
    icon: CreditCard,
    title: "Point of Sale",
    shortTitle: "Point of Sale",
    description:
      "Checkout that actually knows your inventory.",
    detail:
      "Select specific serial numbers at checkout — not just SKUs. Receipts automatically include warranty dates and coverage details. Your customers leave informed, your records stay accurate.",
  },
  {
    id: "stock",
    number: "04",
    icon: Package,
    title: "Stock Management",
    shortTitle: "Stock Control",
    description:
      "Purchase orders, receiving, transfers. Your inventory, under control.",
    detail:
      "Create POs, receive against them with serial capture, track stock across locations. Real-time levels mean you never oversell. Low stock alerts keep your best-sellers in stock.",
  },
  {
    id: "reports",
    number: "05",
    icon: BarChart3,
    title: "Business Reports",
    shortTitle: "Reports",
    description:
      "Numbers that matter, formatted how you need them.",
    detail:
      "Sales by period, profit margins by product, inventory valuations, warranty claim rates. Export to Excel or PDF with one click. Schedule automated reports to hit your inbox every Monday.",
  },
  {
    id: "suppliers",
    number: "06",
    icon: Truck,
    title: "Supplier Portal",
    shortTitle: "Suppliers",
    description:
      "Track every vendor relationship. See who delivers and who delays.",
    detail:
      "Purchase history by supplier, lead time tracking, claim success rates. Know which vendors are reliable and which cost you money in returns. Make smarter purchasing decisions backed by data.",
  },
];

// Animated icon component
function AnimatedIcon({
  icon: Icon,
  isActive,
}: {
  icon: LucideIcon;
  isActive: boolean;
}) {
  return (
    <motion.div
      className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center"
      animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={{
        duration: 2,
        repeat: isActive ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-[var(--accent-500)]/10"
        animate={isActive ? { opacity: [0.1, 0.2, 0.1] } : { opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Icon container */}
      <div className="relative z-10 w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
        <Icon
          className="text-[var(--accent-500)]"
          size={48}
          strokeWidth={1.5}
        />
      </div>
    </motion.div>
  );
}

// Feature selector item
function FeatureSelector({
  feature,
  isActive,
  onClick,
}: {
  feature: Feature;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      variants={itemVariants}
      onClick={onClick}
      className={`
        group relative w-full text-left py-4 md:py-5 pl-6 pr-4
        transition-colors duration-300
        ${isActive ? "text-[var(--text)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}
      `}
    >
      {/* Active indicator line */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--accent-500)]"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isActive ? 1 : 0 }}
        transition={{ duration: 0.3, ease }}
      />

      {/* Hover background */}
      <div
        className={`
          absolute inset-0 transition-opacity duration-300
          ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"}
        `}
        style={{
          background: "linear-gradient(90deg, var(--accent-500)/0.08 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 flex items-center gap-4">
        {/* Number */}
        <span
          className={`
            font-heading text-xs tracking-[0.2em] transition-colors duration-300
            ${isActive ? "text-[var(--accent-500)]" : "text-[var(--text-muted)]"}
          `}
        >
          {feature.number}
        </span>

        {/* Title */}
        <span className="font-heading font-semibold text-sm md:text-base">
          {feature.shortTitle}
        </span>
      </div>
    </motion.button>
  );
}

export default function FeaturesBento() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotationKey, setRotationKey] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-100px 0px",
  });

  const activeFeature = features[activeIndex];

  // Start or restart the auto-rotation interval
  const startInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
      setRotationKey((prev) => prev + 1);
    }, ROTATION_INTERVAL_MS);
  }, []);

  // Handle manual feature selection
  const handleFeatureSelect = useCallback((index: number) => {
    setActiveIndex(index);
    setRotationKey((prev) => prev + 1);
    startInterval(); // Reset the timer
  }, [startInterval]);

  // Auto-rotate features
  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startInterval]);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-20 md:py-28 lg:py-32 overflow-hidden bg-[var(--background)]"
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.22] dark:opacity-[0.04] pointer-events-none mix-blend-multiply dark:mix-blend-normal"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle gradient accent */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--accent-500) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="mb-12 md:mb-16 lg:mb-20"
        >
          {/* Label */}
          <span className="inline-block text-xs md:text-sm font-heading font-bold text-[var(--accent-600)] dark:text-[var(--accent-400)] mb-4 tracking-[0.2em] uppercase">
            Features
          </span>

          {/* Headline - all Fraunces italic */}
          <h2 className="font-display italic text-[var(--text)] text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-[1.1]">
            Every serial. Every sale. Every claim.
          </h2>

          {/* Subheadline */}
          <p className="mt-4 md:mt-6 text-[var(--text-muted)] text-base md:text-lg font-body md:whitespace-nowrap">
            Six core modules, zero fluff. Every feature exists because a real electronics retailer needed it.
          </p>
        </motion.div>

        {/* Main content area - LOCKED height at all breakpoints for zero layout shift */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,340px] xl:grid-cols-[1fr,380px] gap-6 md:gap-8 h-[520px] min-h-[520px] max-h-[520px] md:h-[600px] md:min-h-[600px] md:max-h-[600px]">
          {/* Left: Featured content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="h-full min-h-0 max-h-full overflow-hidden"
          >
            <div className="relative h-full rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 md:p-8 lg:p-10 flex flex-col overflow-hidden">
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                <div className="absolute top-4 right-4 w-px h-8 bg-[var(--border)]" />
                <div className="absolute top-4 right-4 w-8 h-px bg-[var(--border)]" />
              </div>
              <div className="absolute bottom-0 left-0 w-20 h-20 overflow-hidden">
                <div className="absolute bottom-4 left-4 w-px h-8 bg-[var(--border)]" />
                <div className="absolute bottom-4 left-4 w-8 h-px bg-[var(--border)]" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.id}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="h-full flex flex-col overflow-hidden"
                >
                  {/* Number badge */}
                  <div className="flex items-center gap-3 mb-4 lg:mb-6 shrink-0">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--accent-500)]/30 text-[var(--accent-500)] font-heading text-sm">
                      {activeFeature.number}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] to-transparent" />
                  </div>

                  {/* Icon */}
                  <div className="mb-4 lg:mb-6 shrink-0">
                    <AnimatedIcon icon={activeFeature.icon} isActive={true} />
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-[var(--text)] text-2xl md:text-3xl lg:text-4xl mb-3 lg:mb-4 shrink-0">
                    {activeFeature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[var(--text-secondary)] text-lg md:text-xl mb-3 lg:mb-4 font-body shrink-0">
                    {activeFeature.description}
                  </p>

                  {/* Detail - can shrink if needed */}
                  <p className="text-[var(--text-muted)] text-base leading-relaxed font-body shrink-0">
                    {activeFeature.detail}
                  </p>

                  {/* Spacer - fills remaining space */}
                  <div className="flex-1 min-h-4" />

                  {/* Learn more link - pinned to bottom */}
                  <motion.a
                    href="#"
                    className="inline-flex items-center gap-2 text-[var(--accent-600)] dark:text-[var(--accent-400)] font-body font-medium hover:text-[var(--accent-500)] transition-colors group shrink-0"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    Learn more
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.a>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right: Feature selector (tablet/desktop) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="hidden md:block h-full min-h-0 max-h-full overflow-hidden"
          >
            <div className="h-full rounded-2xl bg-[var(--surface)]/50 border border-[var(--border)] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-[var(--border)] shrink-0">
                <span className="text-xs font-heading font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase">
                  Select Feature
                </span>
              </div>

              {/* Feature list - fills available space */}
              <div className="py-2 flex-1 overflow-hidden">
                {features.map((feature, index) => (
                  <FeatureSelector
                    key={feature.id}
                    feature={feature}
                    isActive={index === activeIndex}
                    onClick={() => handleFeatureSelect(index)}
                  />
                ))}
              </div>

              {/* Footer with progress - stays at bottom */}
              <div className="px-6 py-4 border-t border-[var(--border)] shrink-0">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2">
                  <span className="font-heading">{activeFeature.number} / 06</span>
                  <span className="font-body">Auto-rotating</span>
                </div>
                {/* Progress bar */}
                <div className="h-px bg-[var(--border)] rounded-full overflow-hidden">
                  <motion.div
                    key={rotationKey}
                    className="h-full bg-[var(--accent-500)]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: ROTATION_INTERVAL_SEC, ease: "linear" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile progress bar - only visible below md */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease }}
          className="md:hidden mt-6"
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2">
            <span className="font-heading">{activeFeature.number} / 06</span>
            <span className="font-body">Auto-rotating</span>
          </div>
          <div className="h-px bg-[var(--border)] rounded-full overflow-hidden">
            <motion.div
              key={rotationKey}
              className="h-full bg-[var(--accent-500)]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: ROTATION_INTERVAL_SEC, ease: "linear" }}
            />
          </div>
        </motion.div>

        {/* Bottom decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.5, ease }}
          className="mt-16 md:mt-20 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent origin-center"
        />
      </div>
    </section>
  );
}
