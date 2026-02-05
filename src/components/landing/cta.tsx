"use client";

import { Suspense, lazy } from "react";
import { motion, type Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Lazy load the dithering shader
const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({
    default: mod.Dithering,
  }))
);

// Custom easing
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Animation variants
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

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

export function CTA() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden bg-[var(--background)]">
      {/* Dithering Background - adapts to light/dark mode like Hero */}
      <Suspense fallback={<div className="absolute inset-0 bg-[var(--background)]" />}>
        <div
          className={`absolute inset-0 z-0 pointer-events-none ${
            isDark ? "opacity-40 mix-blend-screen" : "opacity-30 mix-blend-multiply"
          }`}
        >
          <Dithering
            colorBack="#00000000"
            colorFront={isDark ? "#D4956A" : "#B87333"}
            shape="warp"
            type="4x4"
            speed={0.03}
            className="size-full"
            minPixelRatio={1}
          />
        </div>
      </Suspense>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto flex flex-col items-center text-center"
        >
          {/* Headline */}
          <motion.h2 variants={itemVariants} className="mb-6">
            <span className="block font-display italic text-[var(--text)] text-4xl md:text-5xl lg:text-6xl leading-[1.1]">
              Stop guessing.
            </span>
            <span className="block font-heading font-bold text-[#B87333] text-4xl md:text-5xl lg:text-6xl leading-[1.1] mt-2">
              Start knowing.
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg lg:text-xl text-[#4A4544] dark:text-[#C4BBB5] max-w-2xl leading-relaxed mb-10"
          >
            Join thousands of retailers who&apos;ve transformed their inventory
            management with Inventra.
          </motion.p>

          {/* Buttons - matching Hero styling with light/dark modes */}
          <motion.div
            variants={buttonContainerVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <motion.div variants={buttonVariants} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-8 text-base font-semibold bg-[#B87333] hover:bg-[#96602B] text-[#FAF8F5]"
                asChild
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </motion.div>

            <motion.div variants={buttonVariants} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-12 px-8 text-base font-semibold bg-transparent border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#F5F1EC] dark:bg-[#2A2527]/60 dark:border-[#B87333] dark:text-[#D4956A] dark:hover:bg-[#B87333] dark:hover:text-[#F5F0EB]"
                asChild
              >
                <Link href="/demo">Try Demo</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTA;
