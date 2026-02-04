"use client";

import { Suspense, lazy } from "react";
import { useTheme } from "next-themes";
import { Navbar } from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import FeaturesBento from "@/components/landing/features-bento";
import HowItWorks from "@/components/landing/how-it-works";
import DashboardPreview from "@/components/landing/dashboard-preview";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({
    default: mod.Dithering,
  }))
);

export default function LandingPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <main>
      <Navbar />

      {/* Hero Section with Dithering Background */}
      <div id="hero" className="relative overflow-hidden">
        {/* Dithering Background - slow, subtle animation */}
        <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
          <div className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen">
            <Dithering
              colorBack="#00000000"
              colorFront={isDark ? "#D4956A" : "#B87333"}
              shape="warp"
              type="4x4"
              speed={0.05}
              className="size-full"
              minPixelRatio={1}
            />
          </div>
        </Suspense>

        <Hero />
      </div>

      {/* Features Section */}
      <FeaturesBento />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Dashboard Preview Section */}
      <DashboardPreview />

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
    </main>
  );
}
