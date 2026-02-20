"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!sectionRef.current) return;

    // Set initial hidden state immediately
    gsap.set(paragraphRef.current, { yPercent: 100 });
    gsap.set(col1Ref.current, { yPercent: 100 });
    gsap.set(col2Ref.current, { yPercent: 100 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const tl = gsap.timeline({
          defaults: { ease: "power3.out", force3D: true },
        });

        tl.to(paragraphRef.current, { yPercent: 0, duration: 1 }, 0);
        tl.to(col1Ref.current, { yPercent: 0, duration: 0.8 }, 0.3);
        tl.to(col2Ref.current, { yPercent: 0, duration: 0.8 }, 0.4);

        observer.disconnect();
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      {/* ── ABOUT CONTENT (BLUE BG) ── */}
      <div className="bg-blue-primary text-cream-primary">
        <div className="relative z-10 px-6">
          {/* Section marker */}
          <div className="flex justify-end pt-6">
            <span className="font-mono text-xs tracking-[0.15em] text-cream-primary">
              [INV.2]
            </span>
          </div>

          {/* Main paragraph — large, confident */}
          <div className="pt-16 pb-16 md:pt-20 md:pb-20">
            <div className="overflow-hidden">
              <p
                ref={paragraphRef}
                className="font-sans font-bold text-cream-primary text-[clamp(28px,4.5vw,52px)] leading-[1.15] tracking-[-0.02em] will-change-transform"
              >
                Inventra is a complete inventory and business management
                system built for tech retail. Serial tracking, warranty
                claims, point of sale, stock management, and real time
                analytics. Everything your business needs, designed with
                precision and built to scale.
              </p>
            </div>
          </div>

          {/* Two monospace columns */}
          <div className="pb-16 md:pb-20">
            {/* Thin divider line */}
            <div className="w-full h-px bg-cream-primary/20 mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
              {/* Column 1 */}
              <div className="overflow-hidden">
                <div ref={col1Ref} className="will-change-transform">
                  <p className="font-mono text-[13px] md:text-sm uppercase tracking-[0.1em] leading-[1.8] text-cream-primary/70">
                    FROM SERIAL NUMBER ENTRY TO WARRANTY RESOLUTION,
                    INVENTRA TRACKS EVERY UNIT THROUGH ITS ENTIRE
                    LIFECYCLE. KNOW EXACTLY WHAT YOU HAVE, WHERE IT
                    CAME FROM, AND WHERE IT WENT. AT ANY MOMENT.
                  </p>
                </div>
              </div>

              {/* Column 2 */}
              <div className="overflow-hidden">
                <div ref={col2Ref} className="will-change-transform">
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
      </div>
    </section>
  );
}
