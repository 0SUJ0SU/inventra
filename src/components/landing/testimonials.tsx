"use client";

import { useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUp, ArrowDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────────────────
   Testimonial data
──────────────────────────────────────────────────────────── */
const testimonials = [
  {
    company: "Nexgen\nElectronics",
    quote:
      "\u201CWe used to lose track of serial numbers the moment they left the warehouse. Inventra changed that overnight. Every unit, every claim, every return, fully accounted for.\u201D",
    name: "R. HARTONO",
    title: "OPERATIONS DIRECTOR",
    companyShort: "NEXGEN ELECTRONICS",
  },
  {
    company: "Circuit\nHub",
    quote:
      "\u201CThe warranty claims system alone saved us 20 hours a week. No more spreadsheets, no more guessing which supplier to contact. It just works.\u201D",
    name: "D. PRATAMA",
    title: "STORE MANAGER",
    companyShort: "CIRCUIT HUB",
  },
  {
    company: "TeknoPoint\nRetail",
    quote:
      "\u201CFrom purchase orders to point of sale, everything connects. We finally have real time visibility into what we own, what we sold, and what needs attention.\u201D",
    name: "A. WIJAYA",
    title: "FOUNDER & CEO",
    companyShort: "TEKNOPOINT RETAIL",
  },
];

/* ────────────────────────────────────────────────────────────
   Testimonials Section
──────────────────────────────────────────────────────────── */
export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimating = useRef(false);

  const navigateTo = useCallback(
    (direction: "prev" | "next") => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const newIndex =
        direction === "next"
          ? (activeIndex + 1) % testimonials.length
          : (activeIndex - 1 + testimonials.length) % testimonials.length;

      const slideDir = direction === "next" ? -1 : 1;
      const targets = [companyRef.current, quoteRef.current, metaRef.current];

      // Phase 1: Slide out
      const tlOut = gsap.timeline({
        onComplete: () => {
          // Immediately position elements off-screen in entrance direction
          targets.forEach((el) => {
            if (el) gsap.set(el, { yPercent: slideDir * 100 });
          });

          // Update React state
          setActiveIndex(newIndex);

          // Phase 2: Slide in (next frame so React has rendered new content)
          requestAnimationFrame(() => {
            const tlIn = gsap.timeline({
              onComplete: () => {
                isAnimating.current = false;
              },
            });

            tlIn
              .to(companyRef.current, {
                yPercent: 0,
                duration: 0.5,
                ease: "power3.out",
              })
              .to(
                quoteRef.current,
                { yPercent: 0, duration: 0.5, ease: "power3.out" },
                "<0.06"
              )
              .to(
                metaRef.current,
                { yPercent: 0, duration: 0.45, ease: "power3.out" },
                "<0.06"
              );
          });
        },
      });

      tlOut
        .to(companyRef.current, {
          yPercent: slideDir * -100,
          duration: 0.4,
          ease: "power3.in",
        })
        .to(
          quoteRef.current,
          { yPercent: slideDir * -100, duration: 0.4, ease: "power3.in" },
          "<0.05"
        )
        .to(
          metaRef.current,
          { yPercent: slideDir * -100, duration: 0.35, ease: "power3.in" },
          "<0.05"
        );
    },
    [activeIndex]
  );

  /* Entrance animations */
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Section labels
      if (labelsRef.current) {
        gsap.fromTo(
          labelsRef.current.querySelector(".label-left"),
          { x: -30, clipPath: "inset(0 100% 0 0)" },
          {
            x: 0,
            clipPath: "inset(0 0% 0 0)",
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
          }
        );
        gsap.fromTo(
          labelsRef.current.querySelector(".label-right"),
          { x: 30, clipPath: "inset(0 0 0 100%)" },
          {
            x: 0,
            clipPath: "inset(0 0 0 0%)",
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
          }
        );
      }

      // Content area slides up
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { y: 60, clipPath: "inset(100% 0 0 0)" },
          {
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  const current = testimonials[activeIndex];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative z-[3] bg-[#FFFFFF]"
      style={{ clipPath: "inset(0 0 0 0)" }}
    >

      <div className="relative z-10 px-6">
        {/* Section labels */}
        <div
          ref={labelsRef}
          className="flex items-baseline justify-between pt-6 pb-4"
          style={{ borderTop: "1px solid rgba(25, 37, 170, 0.12)" }}
        >
          <span
            className="label-left font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ color: "#1925AA" }}
          >
            TESTIMONIALS
          </span>
          <span
            className="label-right font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ color: "rgba(25, 37, 170, 0.5)" }}
          >
            [INV.6]
          </span>
        </div>

        {/* ── Main content area ── */}
        <div ref={contentRef} className="pt-10 md:pt-20 pb-10 md:pb-16">
          {/* Split layout: company left | vertical line | quote right */}
          <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-0 md:min-h-[280px]">
            {/* Company name — left 1/3 */}
            <div className="md:w-[33.333%] md:pr-10 overflow-hidden">
              <div ref={companyRef}>
                <h3
                  className="font-sans font-bold leading-[0.95] tracking-tight whitespace-pre-line"
                  style={{
                    color: "#1925AA",
                    fontSize: "clamp(40px, 5.5vw, 80px)",
                  }}
                >
                  {current.company}
                </h3>
              </div>
            </div>

            {/* Vertical divider — hidden on mobile */}
            <div
              className="hidden md:block self-stretch w-px flex-shrink-0"
              style={{ backgroundColor: "rgba(25, 37, 170, 0.12)" }}
            />

            {/* Quote — right 2/3 */}
            <div className="md:flex-1 md:pl-10 lg:pl-16 overflow-hidden">
              <div ref={quoteRef}>
                <p
                  className="font-sans font-medium leading-[1.2] tracking-tight"
                  style={{
                    color: "#1925AA",
                    fontSize: "clamp(22px, 3vw, 42px)",
                  }}
                >
                  {current.quote}
                </p>
              </div>
            </div>
          </div>

          {/* ── Navigation + meta ── */}
          <div
            className="flex flex-col md:flex-row md:items-end gap-8 md:gap-0 mt-12 md:mt-20"
          >
            {/* Left column: arrows + counter — aligns under company */}
            <div className="md:w-[33.333%] flex items-center gap-6">
              {/* Up arrow */}
              <button
                onClick={() => navigateTo("prev")}
                className="flex items-center justify-center w-12 h-12 rounded-full border transition-colors duration-200"
                style={{
                  borderColor: "rgba(25, 37, 170, 0.25)",
                  color: "#1925AA",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1925AA";
                  e.currentTarget.style.color = "#E8E4DD";
                  e.currentTarget.style.borderColor = "#1925AA";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#1925AA";
                  e.currentTarget.style.borderColor = "rgba(25, 37, 170, 0.25)";
                }}
                aria-label="Previous testimonial"
              >
                <ArrowUp size={18} />
              </button>

              {/* Down arrow */}
              <button
                onClick={() => navigateTo("next")}
                className="flex items-center justify-center w-12 h-12 rounded-full border transition-colors duration-200"
                style={{
                  borderColor: "rgba(25, 37, 170, 0.25)",
                  color: "#1925AA",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1925AA";
                  e.currentTarget.style.color = "#E8E4DD";
                  e.currentTarget.style.borderColor = "#1925AA";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#1925AA";
                  e.currentTarget.style.borderColor = "rgba(25, 37, 170, 0.25)";
                }}
                aria-label="Next testimonial"
              >
                <ArrowDown size={18} />
              </button>

              {/* Counter */}
              <div className="flex items-baseline gap-3 ml-2">
                <span
                  className="font-mono text-[13px] tracking-[0.1em]"
                  style={{ color: "#1925AA" }}
                >
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span
                  className="font-mono text-[11px]"
                  style={{ color: "rgba(25, 37, 170, 0.25)" }}
                >
                  /
                </span>
                <span
                  className="font-mono text-[13px] tracking-[0.1em]"
                  style={{ color: "rgba(25, 37, 170, 0.35)" }}
                >
                  {String(testimonials.length).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Right column: person name + title — aligns under quote */}
            <div className="md:flex-1 md:pl-10 lg:pl-16 overflow-hidden" style={{ marginLeft: "1px" }}>
              <div ref={metaRef}>
                <div
                  className="font-mono text-[11px] uppercase tracking-[0.2em]"
                  style={{ color: "#1925AA" }}
                >
                  {current.name}
                </div>
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.15em] mt-1"
                  style={{ color: "rgba(25, 37, 170, 0.4)" }}
                >
                  {current.title}
                </div>
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.15em] mt-0.5"
                  style={{ color: "rgba(25, 37, 170, 0.3)" }}
                >
                  {current.companyShort}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-8 md:h-12" />
      </div>
    </section>
  );
}
