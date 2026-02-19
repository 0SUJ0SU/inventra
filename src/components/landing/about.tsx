"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);


  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // --- Main paragraph slides up ---
      if (paragraphRef.current) {
        gsap.fromTo(
          paragraphRef.current,
          { y: 80, clipPath: "inset(100% 0 0 0)" },
          {
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: paragraphRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // --- Column 1 slides up ---
      if (col1Ref.current) {
        gsap.fromTo(
          col1Ref.current,
          { y: 60, clipPath: "inset(100% 0 0 0)" },
          {
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: col1Ref.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // --- Column 2 slides up (staggered) ---
      if (col2Ref.current) {
        gsap.fromTo(
          col2Ref.current,
          { y: 60, clipPath: "inset(100% 0 0 0)" },
          {
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 1,
            delay: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: col2Ref.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }


    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative">
      {/* ── ABOUT CONTENT (BLUE BG) ── */}
      <div className="bg-blue-primary text-cream-primary">
        <div className="relative z-10 px-6">
          {/* Main paragraph — large, confident */}
          <div className="pt-16 pb-16 md:pt-20 md:pb-20">
            <p
              ref={paragraphRef}
              className="font-sans font-bold text-cream-primary text-[clamp(28px,4.5vw,52px)] leading-[1.15] tracking-[-0.02em]"
            >
              Inventra is a complete inventory and business management
              system built for tech retail. Serial tracking, warranty
              claims, point of sale, stock management, and real time
              analytics. Everything your business needs, designed with
              precision and built to scale.
            </p>
          </div>

          {/* Two monospace columns */}
          <div className="pb-16 md:pb-20">
            {/* Thin divider line */}
            <div className="w-full h-px bg-cream-primary/20 mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
              {/* Column 1 */}
              <div ref={col1Ref}>
                <p className="font-mono text-[13px] md:text-sm uppercase tracking-[0.1em] leading-[1.8] text-cream-primary/70">
                  FROM SERIAL NUMBER ENTRY TO WARRANTY RESOLUTION,
                  INVENTRA TRACKS EVERY UNIT THROUGH ITS ENTIRE
                  LIFECYCLE. KNOW EXACTLY WHAT YOU HAVE, WHERE IT
                  CAME FROM, AND WHERE IT WENT. AT ANY MOMENT.
                </p>
              </div>

              {/* Column 2 */}
              <div ref={col2Ref}>
                <p className="font-mono text-[13px] md:text-sm uppercase tracking-[0.1em] leading-[1.8] text-cream-primary/70">
                  BUILT FOR TECH RETAILERS WHO DEMAND MORE THAN
                  A SPREADSHEET. POINT OF SALE, PURCHASE ORDERS,
                  CUSTOMER MANAGEMENT, EXPENSE TRACKING, AND
                  COMPREHENSIVE REPORTING. ALL IN ONE SYSTEM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
