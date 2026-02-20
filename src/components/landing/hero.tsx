"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { DitherEffect } from "@/components/shaders";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Wait for loading screen to finish (roughly 2.5s based on M3)
      const delay = 2.6;

      // Headline slides up from below
      gsap.fromTo(
        headlineRef.current,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 1.2,
          delay,
          ease: "power4.out",
        }
      );

      // Description slides in from left
      gsap.fromTo(
        taglineRef.current,
        { x: -40, clipPath: "inset(0 100% 0 0)" },
        {
          x: 0,
          clipPath: "inset(0 0% 0 0)",
          duration: 0.9,
          delay: delay + 0.4,
          ease: "power3.out",
        }
      );

      // CTAs slide in from right
      if (ctaRef.current) {
        const links = ctaRef.current.querySelectorAll("a");
        gsap.fromTo(
          links,
          { x: 30, clipPath: "inset(0 0 0 100%)" },
          {
            x: 0,
            clipPath: "inset(0 0 0 0%)",
            duration: 0.7,
            delay: delay + 0.6,
            stagger: 0.1,
            ease: "power3.out",
          }
        );
      }

      // Section marker slides in
      gsap.fromTo(
        markerRef.current,
        { x: 20, clipPath: "inset(0 0 0 100%)" },
        {
          x: 0,
          clipPath: "inset(0 0 0 0%)",
          duration: 0.6,
          delay: delay + 0.3,
          ease: "power3.out",
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen w-full bg-blue-primary overflow-hidden"
    >
      {/* ─── Dithering shader background ─── */}
      <DitherEffect
        src="/pictures/hero/hero-background.jpg"
        alt="Modern architecture"
        className="absolute inset-0"
        darkColor="#1925AA"
        lightColor="#B8B0E0"
        dotSize={4}
        halftoneStrength={0.9}
        brushSize={280}
        trailFade={0.97}
        waveColor="#1925AA"
        waveSpeed={0.25}
        waveOpacity={0.3}
        waveShape="warp"
      />

      {/* ─── Gradient overlay for text legibility ─── */}
      <div className="pointer-events-none absolute inset-0 z-5 bg-linear-to-t from-blue-primary/60 via-blue-primary/20 to-blue-primary/30" />

      {/* ─── Content layer ─── */}
      <div className="pointer-events-none relative z-10 flex min-h-screen flex-col">
        {/* ─── Section marker — aligned with navbar right edge ─── */}
        <span
          ref={markerRef}
          className="absolute right-6 top-20 hidden font-mono text-xs tracking-[0.15em] text-cream-primary md:block"
        >
          [INV.1]
        </span>

        {/* ─── Middle: Description + CTAs ─── */}
        <div className="flex flex-1 flex-col justify-end px-6 pb-8 pt-20 md:flex-row md:items-end md:pb-12">
          {/* Left side — description */}
          <div ref={taglineRef} className="mb-8 max-w-md md:mb-0 md:mr-auto">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-cream-primary">
              Inventory + Extra
            </p>
            <p className="font-sans text-base leading-relaxed text-cream-primary md:text-lg">
              Inventory, sales, warranties, serial tracking, and business analytics. Unified in one system built for tech retail.
            </p>
          </div>

          {/* Right side — CTAs stacked */}
          <div ref={ctaRef} className="flex flex-col gap-3 md:items-end">
            <a
              href="/register"
              className="pointer-events-auto font-mono text-sm uppercase tracking-[0.15em] text-cream-primary/60 transition-colors hover:text-cream-primary"
            >
              [ Get Started &rarr; ]
            </a>
            <a
              href="/login"
              className="pointer-events-auto font-mono text-sm uppercase tracking-[0.15em] text-cream-primary/60 transition-colors hover:text-cream-primary"
            >
              [ Log In &rarr; ]
            </a>
          </div>
        </div>

        {/* ─── Bottom: Massive headline ─── */}
        <div className="overflow-hidden px-6 pb-8 md:pb-10">
          <h1
            ref={headlineRef}
            className="-ml-[0.04em] font-sans text-[clamp(80px,17vw,220px)] font-bold leading-[0.85] tracking-[-0.03em] text-cream-primary"
          >
            Inventra
          </h1>
        </div>
      </div>
    </section>
  );
}
