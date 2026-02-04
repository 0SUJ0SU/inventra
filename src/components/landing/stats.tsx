"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";

// ============================================
// DARK BAND SECTION
// This section intentionally stays dark in both light and dark modes.
// All colors are hardcoded hex values - do NOT use CSS variables or dark: prefixes.
// ============================================

// Custom easing curve (expo out)
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ============================================
// TYPES & DATA
// ============================================

interface Stat {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  decimals?: number;
}

const stats: Stat[] = [
  { value: 99.9, suffix: "%", label: "System Uptime", decimals: 1 },
  { value: 50, suffix: "%", label: "Faster Stock Counts" },
  { value: 10, suffix: "K+", label: "Products Tracked" },
  { prefix: "$", value: 2, suffix: "M+", label: "Sales Processed" },
];

// ============================================
// ANIMATION VARIANTS
// ============================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

const statVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

// ============================================
// ANIMATED COUNTER HOOK
// ============================================

function useAnimatedCounter(
  end: number,
  duration: number = 2000,
  isInView: boolean,
  decimals: number = 0
): string {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isInView) return;

    // Reset on view
    countRef.current = 0;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for smooth deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = easedProgress * end;

      countRef.current = currentValue;
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isInView]);

  return decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toString();
}

// ============================================
// STAT CARD COMPONENT
// ============================================

function StatCard({
  stat,
  isInView,
  isLast,
}: {
  stat: Stat;
  isInView: boolean;
  isLast: boolean;
}) {
  const animatedValue = useAnimatedCounter(
    stat.value,
    2000,
    isInView,
    stat.decimals ?? 0
  );

  return (
    <motion.div
      variants={statVariants}
      className="relative flex flex-col items-center text-center py-8 md:py-0"
    >
      {/* Value */}
      <div className="flex items-baseline justify-center">
        {stat.prefix && (
          <span className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-[#B87333] leading-none">
            {stat.prefix}
          </span>
        )}
        <span className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-[#B87333] leading-none tabular-nums">
          {animatedValue}
        </span>
        <span className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#B87333] leading-none ml-0.5">
          {stat.suffix}
        </span>
      </div>

      {/* Label */}
      <p className="font-body text-sm sm:text-base text-[#C4BBB5] mt-3 tracking-wide">
        {stat.label}
      </p>

      {/* Vertical divider (desktop only, not on last item) */}
      {!isLast && (
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-[#352F31]" />
      )}

      {/* Horizontal divider (mobile only, not on last item) */}
      {!isLast && (
        <div className="lg:hidden absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-px bg-[#352F31]" />
      )}
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden bg-[#141113]"
    >
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        {/* Optional headline */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <span className="inline-block font-heading font-semibold text-xs tracking-[0.3em] uppercase text-[#B87333] mb-3">
            Built for Scale
          </span>
          <h2 className="font-display italic text-[#F5F0EB] text-3xl sm:text-4xl leading-[1.15]">
            Numbers that matter.
          </h2>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0"
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              isInView={isInView}
              isLast={index === stats.length - 1}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
