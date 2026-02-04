"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

// Custom easing curve (expo out)
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Animation variants
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

const numberVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease },
  },
};

// Step data
interface Step {
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Add Products",
    description:
      "Catalog setup with serial tracking and warranty periods baked in.",
  },
  {
    number: "02",
    title: "Stock In",
    description:
      "Log every serial the moment it arrives from your supplier.",
  },
  {
    number: "03",
    title: "Sell",
    description:
      "POS auto-selects serials. Warranty countdown starts at sale.",
  },
  {
    number: "04",
    title: "Claim",
    description:
      "Track repairs and replacements. Full history, no lost paperwork.",
  },
];

// Step card component
function StepCard({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px 0px" });

  return (
    <motion.div
      ref={ref}
      variants={stepVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      {/* Base border line - always visible */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#B87333]/20" />

      {/* Hover border line - fades in (GPU-accelerated opacity) */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#B87333] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* Content */}
      <div className="pl-6">
        {/* Number */}
        <motion.span
          variants={numberVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: index * 0.1 + 0.1 }}
          className="block font-heading font-bold text-7xl lg:text-8xl text-[#B87333] leading-none mb-4 transition-transform duration-200 group-hover:translate-x-2"
        >
          {step.number}
        </motion.span>

        {/* Title */}
        <h3 className="font-heading font-bold text-xl text-[#1C1917] dark:text-[#F5F0EB] mb-2">
          {step.title}
        </h3>

        {/* Description */}
        <p className="font-body text-base text-[#4A4544] dark:text-[#8A8280] leading-relaxed max-w-[280px]">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative py-24 lg:py-32 overflow-hidden bg-[#F5F1EC] dark:bg-[#141113]"
    >
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.15] dark:opacity-[0.03] pointer-events-none mix-blend-multiply dark:mix-blend-normal"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        {/* Two-part layout */}
        <div className="flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
          {/* Left: Header (sticky on desktop) */}
          <motion.div
            ref={headerRef}
            variants={headerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:w-[30%] lg:flex-shrink-0 mb-16 lg:mb-0"
          >
            <div className="lg:sticky lg:top-32">
              {/* Label */}
              <span className="inline-block font-heading font-bold text-xs tracking-[0.3em] uppercase text-[#B87333] mb-4">
                How It Works
              </span>

              {/* Headline */}
              <h2 className="font-display italic text-[#1C1917] dark:text-[#F5F0EB] text-4xl lg:text-5xl leading-[1.1]">
                Four steps to serial sanity.
              </h2>
            </div>
          </motion.div>

          {/* Right: Steps Grid (70%) */}
          <div className="lg:w-[70%]">
            {/* Desktop/Tablet: 2x2 grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-10 lg:gap-16">
              {steps.map((step, index) => (
                <StepCard key={step.number} step={step} index={index} />
              ))}
            </div>

            {/* Mobile: single column stack */}
            <div className="md:hidden flex flex-col gap-12">
              {steps.map((step, index) => (
                <StepCard key={step.number} step={step} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
