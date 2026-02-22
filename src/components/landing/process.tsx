"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────────────
   Process steps
──────────────────────────────────────────────────────── */
const steps = [
  {
    id: "01",
    title: "Setup & Configuration",
    description:
      "CONFIGURE YOUR STORE PROFILE, SET TAX RATES, DEFINE PRODUCT CATEGORIES, AND CUSTOMIZE YOUR RECEIPT TEMPLATES. READY IN MINUTES.",
  },
  {
    id: "02",
    title: "Import & Organize",
    description:
      "BULK IMPORT YOUR PRODUCT CATALOG WITH SERIAL NUMBERS. ASSIGN CATEGORIES, SET PRICING, AND ESTABLISH MINIMUM STOCK THRESHOLDS.",
  },
  {
    id: "03",
    title: "Track & Manage",
    description:
      "EVERY SALE, RETURN, AND WARRANTY CLAIM IS TRACKED AUTOMATICALLY. SERIAL NUMBERS FOLLOW EACH UNIT FROM SHELF TO CUSTOMER.",
  },
  {
    id: "04",
    title: "Analyze & Grow",
    description:
      "REAL-TIME REPORTS ON SALES, STOCK LEVELS, WARRANTY CLAIMS, AND PROFIT MARGINS. DATA-DRIVEN DECISIONS FOR SMARTER GROWTH.",
  },
];

const STEP_COUNT = steps.length;

/* ────────────────────────────────────────────────────────
   Process Section — Scroll-pinned step machine
──────────────────────────────────────────────────────── */
export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const numberTrackRef = useRef<HTMLDivElement>(null);
  const contentTrackRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const stepIndicatorsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !pinRef.current) return;

      const numberTrack = numberTrackRef.current;
      const contentTrack = contentTrackRef.current;
      const progressLine = progressLineRef.current;
      const stepIndicators = stepIndicatorsRef.current;

      if (
        !numberTrack ||
        !contentTrack ||
        !progressLine ||
        !stepIndicators
      )
        return;

      const indicators = stepIndicators.querySelectorAll(".step-tick");

      // Total scroll = 4 screen-heights.
      // 3 transitions between 4 steps, plus hold time at start and end.
      // Timeline: 0-1 hold step1, 1-2 transition to step2, 2-3 hold step2,
      //           3-4 transition to step3, 4-5 hold step3,
      //           5-6 transition to step4, 6-7 hold step4
      // Simplified: each step gets 1 unit. Transition happens in first 0.4 of each unit (except step 1).

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${STEP_COUNT * 100}%`,
          pin: pinRef.current,
          scrub: 0.4,
          anticipatePin: 1,
        },
      });

      // Each step occupies 1 unit of timeline time (total = STEP_COUNT)
      for (let i = 0; i < STEP_COUNT; i++) {
        const t = i; // start time for this step's segment

        // ── Progress bar grows linearly across each segment ──
        tl.fromTo(
          progressLine,
          { width: `${(i / STEP_COUNT) * 100}%` },
          {
            width: `${((i + 1) / STEP_COUNT) * 100}%`,
            duration: 1,
            ease: "none",
          },
          t
        );

        // ── Highlight current step indicator, dim previous ──
        if (indicators[i]) {
          tl.to(
            indicators[i],
            { color: "#1400FF", duration: 0.3 },
            t
          );
        }
        if (i > 0 && indicators[i - 1]) {
          tl.to(
            indicators[i - 1],
            { color: "rgba(20, 0, 255, 0.2)", duration: 0.3 },
            t
          );
        }

        // ── Slide tracks upward to reveal next step ──
        if (i > 0) {
          // Each item is (100 / STEP_COUNT)% of the track height
          // To show item i, translate track up by i * (100 / STEP_COUNT)%
          const targetY = -i * (100 / STEP_COUNT);

          tl.to(
            numberTrack,
            {
              yPercent: targetY,
              duration: 0.5,
              ease: "power3.out",
            },
            t
          );

          tl.to(
            contentTrack,
            {
              yPercent: targetY,
              duration: 0.5,
              ease: "power3.out",
            },
            t + 0.05 // slight delay for content — feels mechanical
          );
        }
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative z-1 bg-cream-primary">
      <div ref={pinRef} className="relative h-screen overflow-hidden will-change-transform">
        {/* ── Blueprint grid lines ── */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[35%] top-0 bottom-0 w-px bg-blue-primary/10" />
          <div className="absolute left-[90%] top-0 bottom-0 w-px bg-blue-primary/10" />
        </div>

        {/* ── Section labels ── */}
        <div className="absolute top-0 left-0 right-0 z-10 px-6">
          <div className="flex justify-between items-center pt-6 pb-4 border-t border-blue-primary/15">
            <span className="font-mono text-xs text-blue-primary uppercase tracking-[0.15em]">
              PROCESS
            </span>
            <span className="font-mono text-xs text-blue-primary uppercase tracking-[0.15em]">
              [INV.4]
            </span>
          </div>
        </div>

        {/* ── Main content area ── */}
        <div className="absolute top-16 bottom-24 left-0 right-0 flex px-6">
          {/* LEFT — Number counter */}
          <div className="relative w-[35%] overflow-hidden">
            <div
              ref={numberTrackRef}
              className="absolute top-0 left-0 w-full will-change-transform"
              style={{ height: `${STEP_COUNT * 100}%` }}
            >
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center justify-center"
                  style={{ height: `${100 / STEP_COUNT}%` }}
                >
                  <span
                    className="font-sans font-black text-blue-primary select-none"
                    style={{
                      fontSize: "clamp(150px, 22vw, 340px)",
                      lineHeight: 0.85,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {step.id}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER — Vertical divider */}
          <div className="mx-4 md:mx-8 w-px bg-blue-primary/20 shrink-0" />

          {/* RIGHT — Content slides */}
          <div className="relative flex-1 overflow-hidden">
            <div
              ref={contentTrackRef}
              className="absolute top-0 left-0 w-full will-change-transform"
              style={{ height: `${STEP_COUNT * 100}%` }}
            >
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col justify-center px-2 md:px-8"
                  style={{ height: `${100 / STEP_COUNT}%` }}
                >
                  <h3 className="font-sans font-bold text-blue-primary text-[clamp(28px,4vw,56px)] leading-[1.05] tracking-tight mb-6 md:mb-8">
                    {step.title}
                  </h3>
                  <div className="w-16 h-px bg-blue-primary/30 mb-6 md:mb-8" />
                  <p className="font-mono text-[11px] md:text-xs text-blue-primary/60 uppercase tracking-[0.1em] leading-[1.8] max-w-[520px]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom progress track ── */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
          {/* Step tick labels */}
          <div
            ref={stepIndicatorsRef}
            className="relative flex mb-4"
          >
            {steps.map((step, i) => (
              <div
                key={step.id}
                className="step-tick font-mono text-[10px] md:text-xs uppercase tracking-[0.12em] text-center"
                style={{
                  color: i === 0 ? "#1400FF" : "rgba(20, 0, 255, 0.2)",
                  width: `${100 / STEP_COUNT}%`,
                }}
              >
                {step.title}
              </div>
            ))}
          </div>

          {/* Track rail */}
          <div className="relative h-px bg-blue-primary/15 w-full">
            {/* Hitmarker ticks at each step boundary */}
            {Array.from({ length: STEP_COUNT + 1 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${(i / STEP_COUNT) * 100}%` }}
              >
                {/* Vertical line */}
                <div className="absolute left-1/2 -translate-x-1/2 w-px h-3 bg-blue-primary/30" />
                {/* Horizontal line */}
                <div className="absolute top-1/2 -translate-y-1/2 h-px w-3 bg-blue-primary/30" />
              </div>
            ))}

            {/* Active progress line */}
            <div
              ref={progressLineRef}
              className="absolute top-0 left-0 h-full bg-blue-primary"
              style={{ width: "0%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
