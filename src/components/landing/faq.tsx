"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────────────────────
   FAQ data
──────────────────────────────────────────────────────────────── */
const categories = ["GENERAL", "FEATURES", "PRICING"] as const;
type Category = (typeof categories)[number];

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: Category;
}

const faqItems: FaqItem[] = [
  {
    id: 1,
    question: "What is Inventra?",
    answer:
      "INVENTRA IS A COMPLETE INVENTORY AND BUSINESS MANAGEMENT SYSTEM BUILT FOR TECH RETAIL. IT COMBINES SERIAL TRACKING, WARRANTY CLAIMS, POINT OF SALE, STOCK MANAGEMENT, AND REAL TIME ANALYTICS IN ONE UNIFIED PLATFORM.",
    category: "GENERAL",
  },
  {
    id: 2,
    question: "Who is Inventra built for?",
    answer:
      "TECH AND GADGET RETAIL BUSINESSES. WHETHER YOU RUN A SINGLE STORE OR MANAGE MULTIPLE LOCATIONS, INVENTRA SCALES WITH YOUR OPERATION. BUILT BY RETAILERS, FOR RETAILERS.",
    category: "GENERAL",
  },
  {
    id: 3,
    question: "What does deployment look like?",
    answer:
      "INVENTRA RUNS AS A WEB APPLICATION DEPLOYED ON YOUR INFRASTRUCTURE OR OURS. SETUP TAKES MINUTES: CONFIGURE YOUR STORE PROFILE, IMPORT PRODUCTS, AND START OPERATING. WE ALSO OFFER A DESKTOP VERSION VIA TAURI FOR LOCAL-FIRST BUSINESSES.",
    category: "GENERAL",
  },
  {
    id: 4,
    question: "How does serial number tracking work?",
    answer:
      "EVERY UNIT RECEIVES A UNIQUE SERIAL IDENTIFIER AT PURCHASE. FROM THAT MOMENT, INVENTRA TRACKS ITS COMPLETE LIFECYCLE: STOCK ENTRY, SALE, RETURN, WARRANTY CLAIM, REPAIR, AND FINAL DISPOSITION. FULL VISIBILITY AT EVERY STAGE.",
    category: "FEATURES",
  },
  {
    id: 5,
    question: "Can I manage warranty claims?",
    answer:
      "YES. INVENTRA HANDLES THE FULL WARRANTY WORKFLOW: CUSTOMER TO STORE, STORE TO SUPPLIER, AND SUPPLIER RETURNS. EACH CLAIM IS TRACKED WITH STATUS UPDATES, NOTES, TIMESTAMPS, AND LINKED SERIAL NUMBERS.",
    category: "FEATURES",
  },
  {
    id: 6,
    question: "Does the system work offline?",
    answer:
      "THE POINT OF SALE MODULE QUEUES TRANSACTIONS LOCALLY WHEN CONNECTIVITY DROPS. ONCE RESTORED, EVERYTHING SYNCS AUTOMATICALLY. YOUR SALES FLOOR NEVER STOPS.",
    category: "FEATURES",
  },
  {
    id: 7,
    question: "Can I export my data?",
    answer:
      "EVERYTHING EXPORTS. SALES REPORTS, STOCK LEVELS, WARRANTY HISTORIES, SERIAL INVENTORIES. FORMATS INCLUDE XLSX, PDF, AND CSV. YOUR DATA IS ALWAYS YOURS.",
    category: "FEATURES",
  },
  {
    id: 8,
    question: "Is there a free tier?",
    answer:
      "INVENTRA OFFERS A DEMO ENVIRONMENT WITH FULL FUNCTIONALITY AND SAMPLE DATA. EXPLORE EVERY FEATURE BEFORE COMMITTING. NO CREDIT CARD REQUIRED, NO TIME LIMIT ON THE DEMO.",
    category: "PRICING",
  },
  {
    id: 9,
    question: "How is pricing structured?",
    answer:
      "SIMPLE AND TRANSPARENT. PAY PER STORE LOCATION, NOT PER USER. EVERY PLAN INCLUDES SERIAL TRACKING, WARRANTY MANAGEMENT, AND UNLIMITED TRANSACTIONS. NO HIDDEN FEES, NO PER-SEAT CHARGES.",
    category: "PRICING",
  },
  {
    id: 10,
    question: "Can I upgrade or downgrade anytime?",
    answer:
      "YES. SWITCH PLANS INSTANTLY FROM YOUR SETTINGS. UPGRADES TAKE EFFECT IMMEDIATELY. DOWNGRADES APPLY AT THE NEXT BILLING CYCLE. ALL YOUR DATA STAYS INTACT REGARDLESS OF PLAN CHANGES.",
    category: "PRICING",
  },
];

/* ────────────────────────────────────────────────────────────────
   Accordion Item
──────────────────────────────────────────────────────────────── */
function AccordionItem({
  item,
  displayIndex,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  displayIndex: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const prevOpen = useRef(false);

  useEffect(() => {
    if (!contentRef.current || !measureRef.current || !iconRef.current) return;

    // Skip initial render
    if (prevOpen.current === isOpen && !isOpen) {
      prevOpen.current = isOpen;
      return;
    }

    if (isOpen && !prevOpen.current) {
      // Opening
      const height = measureRef.current.scrollHeight;
      gsap.killTweensOf(contentRef.current);
      gsap.fromTo(
        contentRef.current,
        { height: 0 },
        { height, duration: 0.55, ease: "power3.out" }
      );
      gsap.fromTo(
        measureRef.current,
        { y: 15 },
        { y: 0, duration: 0.5, ease: "power3.out", delay: 0.05 }
      );
      // Icon: rotate to 135deg (plus becomes X)
      gsap.to(iconRef.current, {
        rotation: 135,
        duration: 0.4,
        ease: "power3.out",
      });
    } else if (!isOpen && prevOpen.current) {
      // Closing
      gsap.killTweensOf(contentRef.current);
      gsap.to(contentRef.current, {
        height: 0,
        duration: 0.4,
        ease: "power3.inOut",
      });
      // Icon: rotate back
      gsap.to(iconRef.current, {
        rotation: 0,
        duration: 0.4,
        ease: "power3.out",
      });
    }

    prevOpen.current = isOpen;
  }, [isOpen]);

  return (
    <div
      className="faq-item"
      style={{ borderBottom: "1px solid rgba(232, 228, 221, 0.1)" }}
    >
      {/* Question row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 md:gap-6 py-5 md:py-6 text-left group cursor-pointer"
      >
        {/* Number */}
        <span
          className="font-mono text-[13px] tracking-[0.1em] flex-shrink-0 w-8 transition-all duration-500"
          style={{
            color: isOpen ? "#E8E4DD" : "rgba(232, 228, 221, 0.3)",
          }}
        >
          {String(displayIndex + 1).padStart(2, "0")}
        </span>

        {/* Question text */}
        <span
          className="font-sans font-medium leading-[1.25] tracking-tight flex-1 transition-colors duration-500"
          style={{
            color: isOpen ? "#E8E4DD" : "rgba(232, 228, 221, 0.75)",
            fontSize: "clamp(17px, 1.8vw, 24px)",
          }}
        >
          {item.question}
        </span>

        {/* Toggle icon — single Plus that rotates to X */}
        <div
          ref={iconRef}
          className="flex items-center justify-center w-8 h-8 flex-shrink-0 transition-colors duration-500"
          style={{
            color: isOpen ? "#E8E4DD" : "rgba(232, 228, 221, 0.4)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="8" y1="2" x2="8" y2="14" />
            <line x1="2" y1="8" x2="14" y2="8" />
          </svg>
        </div>
      </button>

      {/* Answer — height animated via GSAP */}
      <div ref={contentRef} className="overflow-hidden" style={{ height: 0 }}>
        <div ref={measureRef} className="pb-6 md:pb-8 pl-12 md:pl-14 pr-8 md:pr-14">
          <p
            className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.12em] leading-[1.7]"
            style={{ color: "rgba(232, 228, 221, 0.55)" }}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   FAQ Section
──────────────────────────────────────────────────────────────── */
export function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("GENERAL");
  const [openId, setOpenId] = useState<number | null>(null);

  const filteredItems = faqItems.filter(
    (item) => item.category === activeCategory
  );

  const handleToggle = useCallback((id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  /* Category switch animation */
  const handleCategorySwitch = useCallback(
    (cat: Category) => {
      if (cat === activeCategory) return;
      if (!listRef.current) {
        setActiveCategory(cat);
        setOpenId(null);
        return;
      }

      const items = listRef.current.querySelectorAll(".faq-item");

      // Slide items out
      gsap.to(items, {
        x: -30,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        stagger: 0.03,
        onComplete: () => {
          setActiveCategory(cat);
          setOpenId(null);

          // Wait for React to render new items, then slide them in
          requestAnimationFrame(() => {
            if (!listRef.current) return;
            const newItems = listRef.current.querySelectorAll(".faq-item");
            gsap.fromTo(
              newItems,
              { x: 30, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 0.4,
                ease: "power3.out",
                stagger: 0.05,
              }
            );
          });
        },
      });
    },
    [activeCategory]
  );

  /* Entrance animations */
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Left panel slides from left
      if (leftRef.current) {
        gsap.fromTo(
          leftRef.current,
          { x: -50, clipPath: "inset(0 100% 0 0)" },
          {
            x: 0,
            clipPath: "inset(0 0% 0 0)",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          }
        );
      }

      // Right panel filters
      if (rightRef.current) {
        const filters = rightRef.current.querySelector(".faq-filters");
        if (filters) {
          gsap.fromTo(
            filters,
            { y: 20, clipPath: "inset(100% 0 0 0)" },
            {
              y: 0,
              clipPath: "inset(0% 0 0 0)",
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
              },
            }
          );
        }
      }

      // FAQ items stagger in
      if (listRef.current) {
        const items = listRef.current.querySelectorAll(".faq-item");
        gsap.fromTo(
          items,
          { x: 40, clipPath: "inset(0 0 0 100%)" },
          {
            x: 0,
            clipPath: "inset(0 0 0 0%)",
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative bg-blue-primary overflow-hidden"
    >
      {/* Blueprint grid line — cream on blue */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute top-0 h-full w-px"
          style={{
            left: "33.333%",
            backgroundColor: "rgba(232, 228, 221, 0.06)",
          }}
        />
      </div>

      <div className="relative z-10 px-6">
        {/* Section labels — FAQ left, [INV.7] right */}
        <div
          className="flex items-baseline justify-between pt-6 pb-4"
          style={{ borderTop: "1px solid rgba(232, 228, 221, 0.1)" }}
        >
          <span
            className="font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ color: "rgba(232, 228, 221, 0.5)" }}
          >
            FAQ
          </span>
          <span
            className="font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ color: "rgba(232, 228, 221, 0.25)" }}
          >
            [INV.7]
          </span>
        </div>

        {/* ── Split layout: left panel + right panel ── */}
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* ── Left panel: headline + CTA ── */}
          <div
            ref={leftRef}
            className="lg:w-[33.333%] flex flex-col justify-between py-8 lg:py-16 lg:pr-12 lg:sticky lg:top-24 lg:self-start"
            style={{
              borderRight: "1px solid rgba(232, 228, 221, 0.08)",
            }}
          >
            {/* Headline */}
            <div>
              <h2
                className="font-sans font-bold leading-[0.95] tracking-tight"
                style={{
                  color: "#E8E4DD",
                  fontSize: "clamp(36px, 4.5vw, 64px)",
                }}
              >
                Common
                <br />
                Questions
              </h2>
            </div>

            {/* CTA */}
            <div className="mt-10 lg:mt-[calc(7vh-7px)]">
              <a
                href="#contact"
                className="inline-block font-mono text-[11px] uppercase tracking-[0.2em] transition-transform duration-300 hover:scale-110 origin-left"
                style={{ color: "#E8E4DD" }}
              >
                [ CONTACT US &rarr; ]
              </a>
            </div>
          </div>

          {/* ── Right panel: filters + accordion ── */}
          <div ref={rightRef} className="lg:flex-1 lg:pl-12 py-8 lg:py-16">
            {/* Category filters */}
            <div className="faq-filters flex items-center gap-6 md:gap-8 mb-10 md:mb-14 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySwitch(cat)}
                  className="font-mono text-[11px] uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer pb-1"
                  style={{
                    color:
                      activeCategory === cat
                        ? "#E8E4DD"
                        : "rgba(232, 228, 221, 0.25)",
                    borderBottom:
                      activeCategory === cat
                        ? "1px solid rgba(232, 228, 221, 0.4)"
                        : "1px solid transparent",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Accordion items */}
            <div ref={listRef}>
              {/* Top border */}
              <div
                style={{
                  borderTop: "1px solid rgba(232, 228, 221, 0.1)",
                }}
              />

              {filteredItems.map((item, i) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  displayIndex={i}
                  isOpen={openId === item.id}
                  onToggle={() => handleToggle(item.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
