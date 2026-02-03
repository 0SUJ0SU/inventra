"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  useEffect(() => {
    // Configure GSAP defaults for smooth, organic animations
    gsap.defaults({
      ease: "power2.out",
      duration: 0.8,
    });

    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      toggleActions: "play none none reverse",
      start: "top 80%",
      end: "bottom 20%",
    });

    // Enable smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";

    // Refresh ScrollTrigger on resize for responsive layouts
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      // Clean up all ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Warm textured background layer */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, hsl(var(--accent) / 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, hsl(var(--accent) / 0.02) 0%, transparent 50%)
          `,
        }}
      />

      {/* Main content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}
