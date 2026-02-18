"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const bgRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find the actual navbar logo position
    const navbarLogo = document.querySelector("[data-navbar-logo]");
    if (!navbarLogo || !logoRef.current) return;

    const targetRect = navbarLogo.getBoundingClientRect();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = "none";
          }
          onComplete();
        },
      });

      // Phase 1: Hold centered logo
      tl.to({}, { duration: 1.2 });

      // Phase 2: Move logo to exact navbar logo position
      tl.to(
        logoRef.current,
        {
          top: targetRect.top,
          left: targetRect.left,
          transform: "translate(0, 0)",
          duration: 1,
          ease: "expo.out",
        },
        1.2
      );

      tl.to(
        iconRef.current,
        {
          width: 28,
          height: 28,
          duration: 1,
          ease: "expo.out",
        },
        1.2
      );

      tl.to(
        textRef.current,
        {
          fontSize: "12px",
          letterSpacing: "0.25em",
          duration: 1,
          ease: "expo.out",
        },
        1.2
      );

      // Phase 3: Blue background slides up
      tl.to(
        bgRef.current,
        {
          yPercent: -100,
          duration: 0.8,
          ease: "expo.out",
        },
        2.0
      );
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-100 pointer-events-none">
      <div ref={bgRef} className="absolute inset-0 bg-blue-primary" />

      <div
        ref={logoRef}
        className="absolute flex items-center gap-3 bg-blue-primary px-4 py-2.5 z-10"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <svg
          ref={iconRef}
          width="48"
          height="48"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="20" stroke="var(--color-cream-primary)" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="8" stroke="var(--color-cream-primary)" strokeWidth="2" />
          <line x1="32" y1="4" x2="32" y2="18" stroke="var(--color-cream-primary)" strokeWidth="1.5" />
          <line x1="32" y1="46" x2="32" y2="60" stroke="var(--color-cream-primary)" strokeWidth="1.5" />
          <line x1="4" y1="32" x2="18" y2="32" stroke="var(--color-cream-primary)" strokeWidth="1.5" />
          <line x1="46" y1="32" x2="60" y2="32" stroke="var(--color-cream-primary)" strokeWidth="1.5" />
        </svg>

        <span
          ref={textRef}
          className="font-mono uppercase text-cream-primary"
          style={{ fontSize: "16px", letterSpacing: "0.35em" }}
        >
          Inventra
        </span>
      </div>
    </div>
  );
}
