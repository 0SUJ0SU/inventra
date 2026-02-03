"use client";

import { useState, Suspense, lazy } from "react";
import { useTheme } from "next-themes";
import { Navbar } from "@/components/landing/navbar";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
);

export default function LandingPage() {
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
      >

        {/* Dithering Background */}
        <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
          <div className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen">
            <Dithering
              colorBack="#00000000"
              colorFront={isDark ? "#D4956A" : "#B87333"}
              shape="warp"
              type="4x4"
              speed={isHeroHovered ? 0.5 : 0.15}
              className="size-full"
              minPixelRatio={1}
            />
          </div>
        </Suspense>

        {/* Hero Content Placeholder */}
        <div className="relative z-10 text-center px-4">
          <p className="text-sm font-medium uppercase tracking-widest text-text-muted dark:text-text-muted-dark mb-4 font-space-grotesk">
            Coming Soon
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text dark:text-text-dark mb-6">
            <span className="font-fraunces italic">Hero Section</span>
          </h1>
          <p className="text-lg text-text-secondary dark:text-text-secondary-dark max-w-md mx-auto">
            The full hero content with animations will be added in the next step.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="min-h-[50vh] flex items-center justify-center border-t border-border dark:border-border-dark"
      >
        <div className="text-center px-4">
          <p className="text-sm font-medium uppercase tracking-widest text-accent-500 mb-4 font-space-grotesk">
            Section
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text dark:text-text-dark font-space-grotesk">
            Features
          </h2>
          <p className="text-text-secondary dark:text-text-secondary-dark mt-4">
            Feature cards and content coming soon.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="min-h-[50vh] flex items-center justify-center border-t border-border dark:border-border-dark bg-background-alt dark:bg-background-alt-dark"
      >
        <div className="text-center px-4">
          <p className="text-sm font-medium uppercase tracking-widest text-accent-500 mb-4 font-space-grotesk">
            Section
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text dark:text-text-dark font-space-grotesk">
            Pricing
          </h2>
          <p className="text-text-secondary dark:text-text-secondary-dark mt-4">
            Pricing tiers and details coming soon.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="min-h-[50vh] flex items-center justify-center border-t border-border dark:border-border-dark"
      >
        <div className="text-center px-4">
          <p className="text-sm font-medium uppercase tracking-widest text-accent-500 mb-4 font-space-grotesk">
            Section
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text dark:text-text-dark font-space-grotesk">
            About
          </h2>
          <p className="text-text-secondary dark:text-text-secondary-dark mt-4">
            About Inventra content coming soon.
          </p>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="py-8 border-t border-border dark:border-border-dark">
        <p className="text-center text-sm text-text-muted dark:text-text-muted-dark">
          Inventra = Inventory + Extra — More than just stock tracking.
        </p>
      </footer>
    </>
  );
}
