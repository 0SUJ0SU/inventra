"use client";

import { Suspense, lazy } from "react";
import { useTheme } from "next-themes";
import { Navbar } from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import FeaturesBento from "@/components/landing/features-bento";
import HowItWorks from "@/components/landing/how-it-works";
import DashboardPreview from "@/components/landing/dashboard-preview";
import Stats from "@/components/landing/stats";
import MarqueeTicker from "@/components/landing/marquee-ticker";
import Testimonials from "@/components/landing/testimonials";
import About from "@/components/landing/about";
import { Pricing } from "@/components/landing/pricing";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

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

      {/* Marquee Ticker */}
      <MarqueeTicker />

      {/* Stats Section */}
      <Stats />

      {/* Testimonials Section */}
      <Testimonials />

      {/* About Section */}
      <About />

      {/* Pricing Section */}
      <Pricing />

      {/* Final CTA Section */}
      <CTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
