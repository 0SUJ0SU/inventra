"use client";

import Link from "next/link";
import { DitherEffect } from "@/components/shaders/dither-effect";

export function AuthBrandingPanel() {
  return (
    <div className="hidden lg:block fixed top-0 left-0 w-[45%] h-screen bg-blue-primary overflow-hidden z-20">
      <DitherEffect
        src="/pictures/auth/auth-image.jpg"
        alt="Tech workspace"
        className="absolute inset-0 w-full h-full"
        darkColor="#1925AA"
        lightColor="#8888CC"
        dotSize={4.0}
        halftoneStrength={0.8}
        brushSize={280}
        trailFade={0.95}
        hoverReveal={true}
        waveColor="#1925AA"
        waveSpeed={0.25}
        waveOpacity={0.3}
        waveShape="warp"
      />

      <div className="relative z-10 p-4">
        <Link
          href="/"
          className="relative inline-flex items-center gap-3 px-4 h-11 bg-blue-dark/80 backdrop-blur-sm"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="32" cy="32" r="20" stroke="var(--color-cream-primary)" strokeWidth="3" />
            <circle cx="32" cy="32" r="8" stroke="var(--color-cream-primary)" strokeWidth="2.5" />
            <line x1="32" y1="4" x2="32" y2="18" stroke="var(--color-cream-primary)" strokeWidth="2" />
            <line x1="32" y1="46" x2="32" y2="60" stroke="var(--color-cream-primary)" strokeWidth="2" />
            <line x1="4" y1="32" x2="18" y2="32" stroke="var(--color-cream-primary)" strokeWidth="2" />
            <line x1="46" y1="32" x2="60" y2="32" stroke="var(--color-cream-primary)" strokeWidth="2" />
          </svg>
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-cream-primary">
            Inventra
          </span>
        </Link>
      </div>
    </div>
  );
}
