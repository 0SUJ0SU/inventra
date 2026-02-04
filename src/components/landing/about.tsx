"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

// Custom easing curve (expo out)
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Animation variants
const storyVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease },
  },
};

const nameplateVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease, delay: 0.2 },
  },
};

// Spec data for the nameplate
const specs = [
  { label: "TYPE", value: "Inventory + Business" },
  { label: "SERIAL", value: "Stock \u2022 Warranties \u2022 Claims" },
  { label: "EXTRA", value: "Expenses \u2022 Employees \u2022 Reports" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-[#F5F1EC] dark:bg-[#141113]"
    >
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        {/* Main content: Two columns */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
          {/* ════════════════════════════════════════════════════════════
              LEFT COLUMN - Industrial Nameplate (40%)
              On mobile: appears second (order-2), on desktop: appears first (order-1)
          ════════════════════════════════════════════════════════════ */}
          <motion.div
            variants={nameplateVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:w-[40%] flex justify-center lg:justify-start order-2 lg:order-1"
          >
            <div className="w-full max-w-md lg:max-w-lg border border-[#E0DAD3] dark:border-[#2A2527] bg-[#FAF8F5]/50 dark:bg-[#1A1618]/50 p-6 sm:p-8 lg:p-10">
              {/* Model label */}
              <span className="block font-heading font-semibold text-[10px] tracking-[0.25em] uppercase text-[#B87333] mb-2 sm:mb-3">
                Model
              </span>

              {/* Brand name: Inventra - Space Grotesk Bold, color split */}
              <div className="mb-4 sm:mb-6">
                <span className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-[#1C1917] dark:text-[#F5F0EB] leading-none">
                  Invent
                </span>
                <span className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-[#B87333] leading-none">
                  ra
                </span>
              </div>

              {/* Divider */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="w-[40%] h-px bg-[#B87333]/60" />
              </div>

              {/* Specification label */}
              <span className="block font-heading font-semibold text-[10px] tracking-[0.25em] uppercase text-[#B87333] mb-3 sm:mb-4">
                Specification
              </span>

              {/* Spec lines */}
              <div className="space-y-1.5 sm:space-y-2 mb-6 sm:mb-8">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex font-mono text-xs sm:text-sm">
                    <span className="w-14 sm:w-16 text-[#8A8380] dark:text-[#6A6560] shrink-0">
                      {spec.label}
                    </span>
                    <span className="text-[#4A4544] dark:text-[#C4BBB5]">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Bottom tagline */}
              <p className="font-body text-[11px] sm:text-xs text-[#8A8380] dark:text-[#6A6560] tracking-wide">
                Built for precision. Designed for clarity.
              </p>
            </div>
          </motion.div>

          {/* ════════════════════════════════════════════════════════════
              RIGHT COLUMN - The Story (60%)
              On mobile: appears first (order-1), on desktop: appears second (order-2)
          ════════════════════════════════════════════════════════════ */}
          <motion.div
            variants={storyVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:w-[60%] mb-12 md:mb-16 lg:mb-0 text-center lg:text-left order-1 lg:order-2"
          >
            {/* Label */}
            <span className="inline-block font-heading font-semibold text-xs tracking-[0.2em] uppercase text-[#B87333] mb-4 md:mb-6">
              About Us
            </span>

            {/* Headline */}
            <h2 className="mb-6 md:mb-8">
              <span className="block font-display italic text-[#1C1917] dark:text-[#F5F0EB] text-3xl sm:text-4xl lg:text-5xl leading-[1.1]">
                Inventory alone
              </span>
              <span className="block font-heading font-bold text-[#1C1917] dark:text-[#F5F0EB] text-3xl sm:text-4xl lg:text-5xl leading-[1.1] mt-1">
                isn&apos;t enough.
              </span>
            </h2>

            {/* Body paragraphs */}
            <div className="space-y-4">
              <p className="font-body text-sm sm:text-base text-[#4A4544] dark:text-[#9A9390] leading-relaxed">
                Running a tech shop isn&apos;t just about counting stock. It&apos;s
                tracking rent, payroll, utilities, and supplier payments. It&apos;s
                knowing which serial numbers are under warranty and which claims
                are still open. It&apos;s a dozen spreadsheets that never talk to
                each other.
              </p>
              <p className="font-body text-sm sm:text-base text-[#4A4544] dark:text-[#9A9390] leading-relaxed">
                Inventra brings it all together. Track every serial number from
                arrival to sale. Manage warranties and claims without the paperwork.
                Monitor expenses, employees, and cash flow — all in one system built
                specifically for tech retail.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
