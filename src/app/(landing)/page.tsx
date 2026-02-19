"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/landing/loading-screen";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";

export default function LandingPage() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <>
      <LoadingScreen onComplete={() => setLoadingComplete(true)} />
      <Navbar />
      <Hero />

      {/* ─── About section placeholder (next milestone) ─── */}
      <section id="about" className="relative min-h-screen bg-blue-primary px-4 py-32">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-cream-primary/60">
            ABOUT
          </span>
          <span className="font-mono text-xs tracking-[0.15em] text-cream-primary/60">
            [INV.2]
          </span>
        </div>
      </section>

      {/* ─── Services section placeholder ─── */}
      <section id="services" className="relative min-h-screen bg-cream-primary px-4 py-32">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue-primary/60">
            SERVICES
          </span>
          <span className="font-mono text-xs tracking-[0.15em] text-blue-primary/60">
            [INV.3]
          </span>
        </div>
        <div className="mt-24 flex items-end gap-4">
          <h2 className="font-sans text-[clamp(60px,12vw,160px)] font-bold leading-[0.85] tracking-[-0.03em] text-blue-primary">
            Our
          </h2>
          <div className="mx-4 h-[clamp(50px,10vw,130px)] w-px bg-blue-primary/30" />
          <h2 className="font-sans text-[clamp(60px,12vw,160px)] font-bold leading-[0.85] tracking-[-0.03em] text-blue-primary">
            Services
          </h2>
        </div>
      </section>
    </>
  );
}
