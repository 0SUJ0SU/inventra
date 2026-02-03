"use client";

import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Custom easing curve (expo out)
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const lineVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotateX: -45,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease,
    },
  },
};

const buttonContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

const buttonVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease,
    },
  },
};

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Outer container - matches navbar alignment */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 landscape:max-lg:pt-16 landscape:max-lg:pb-12">
        {/* Inner content container - constrained for readability */}
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8 landscape:max-lg:gap-4">
          {/* Main headline with staggered reveal */}
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="leading-[1.1] tracking-tight"
            style={{ perspective: "1000px" }}
          >
            {/* Line 1: Know Your Inventory */}
            <motion.span
              variants={lineVariants}
              className="block font-display italic text-[var(--text)] text-3xl min-[360px]:text-4xl md:text-6xl lg:text-7xl min-[360px]:whitespace-nowrap landscape:max-lg:text-3xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              Know Your Inventory
            </motion.span>
            {/* Line 2: Down to the Serial */}
            <motion.span
              variants={lineVariants}
              className="block font-heading font-bold text-[var(--text)] text-3xl min-[360px]:text-4xl md:text-6xl lg:text-7xl min-[360px]:whitespace-nowrap landscape:max-lg:text-3xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              Down to the Serial
            </motion.span>
          </motion.h1>

          {/* Subheadline - fades in after headline */}
          <motion.p
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.0 }}
            className="text-base md:text-lg lg:text-xl landscape:max-lg:text-sm text-[#4A4544] dark:text-[#C4BBB5] max-w-2xl mx-auto font-body"
          >
            Stock levels, warranty dates, supplier claims — everything tracked,
            nothing forgotten. Built for tech retail.
          </motion.p>

          {/* CTA Buttons - slide up with stagger */}
          <motion.div
            variants={buttonContainerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 landscape:max-lg:gap-3 w-full sm:w-auto"
          >
            <motion.div variants={buttonVariants} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-8 text-base font-semibold bg-[#B87333] hover:bg-[#96602B] text-[#FAF8F5] landscape:max-lg:h-10 landscape:max-lg:px-6 landscape:max-lg:text-sm"
                asChild
              >
                <Link href="/demo">Try Demo</Link>
              </Button>
            </motion.div>
            <motion.div variants={buttonVariants} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-12 px-8 text-base font-semibold bg-transparent border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F5F1EC] dark:bg-[#2A2527]/60 dark:border-[#B87333] dark:text-[#D4956A] dark:hover:bg-[#B87333] dark:hover:text-[#F5F0EB] landscape:max-lg:h-10 landscape:max-lg:px-6 landscape:max-lg:text-sm"
                asChild
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
