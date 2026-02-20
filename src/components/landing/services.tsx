"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Plus, ArrowRight } from "lucide-react";
import { DitherEffect } from "@/components/shaders";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────────────
   Service data
──────────────────────────────────────────────────────── */
const services = [
  {
    id: "01",
    title: "Serial Tracking & Management",
    description:
      "TRACK EVERY UNIT FROM PURCHASE TO SALE WITH UNIQUE SERIAL NUMBERS. FULL LIFECYCLE VISIBILITY — KNOW WHERE EVERY ITEM IS, WHO BOUGHT IT, AND ITS COMPLETE HISTORY.",
    image: "/pictures/services/4.jpg",
  },
  {
    id: "02",
    title: "Warranty Claims Processing",
    description:
      "END-TO-END WARRANTY WORKFLOW. CUSTOMER CLAIMS, SUPPLIER RETURNS, REPAIR TRACKING, AND REPLACEMENT MANAGEMENT — ALL IN ONE STREAMLINED SYSTEM.",
    image: "/pictures/services/2.jpg",
  },
  {
    id: "03",
    title: "Point of Sale System",
    description:
      "FAST, INTUITIVE CHECKOUT WITH SERIAL NUMBER SELECTION, MULTIPLE PAYMENT METHODS, AND INSTANT RECEIPT GENERATION. BUILT FOR SPEED AT THE COUNTER.",
    image: "/pictures/services/3.jpg",
  },
  {
    id: "04",
    title: "Stock & Inventory Management",
    description:
      "REAL-TIME STOCK LEVELS, LOW-STOCK ALERTS, PURCHASE ORDER MANAGEMENT, AND AUTOMATED RESTOCK TRACKING. NEVER MISS A SALE DUE TO EMPTY SHELVES.",
    image: "/pictures/services/7.jpg",
  },
  {
    id: "05",
    title: "Reports & Analytics",
    description:
      "SALES TRENDS, PROFIT MARGINS, WARRANTY CLAIM RATES, AND INVENTORY TURNOVER — ALL VISUALIZED. DATA-DRIVEN DECISIONS FOR GROWING BUSINESSES.",
    image: "/pictures/services/6.jpg",
  },
  {
    id: "06",
    title: "Customer & Supplier Portal",
    description:
      "CENTRALIZED DATABASE FOR ALL YOUR BUSINESS RELATIONSHIPS. PURCHASE HISTORIES, CONTACT MANAGEMENT, TRANSACTION RECORDS, AND WARRANTY TRACKING PER CUSTOMER.",
    image: "/pictures/services/5.jpg",
  },
];

/* ────────────────────────────────────────────────────────
   Accordion Item
──────────────────────────────────────────────────────── */
function AccordionItem({
  service,
  isOpen,
  onToggle,
}: {
  service: (typeof services)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!contentRef.current || !innerRef.current) return;

    if (isOpen) {
      const height = innerRef.current.scrollHeight;
      gsap.to(contentRef.current, {
        height,
        duration: 0.5,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
      });
      gsap.fromTo(
        innerRef.current,
        { y: -10 },
        { y: 0, duration: 0.4, delay: 0.1, ease: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        duration: 0.4,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)",
      });
    }
  }, [isOpen]);

  return (
    <div className="border-b border-blue-primary/15">
      {/* Accordion trigger */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 md:py-6 group cursor-pointer text-left"
      >
        <div className="flex items-baseline gap-4 md:gap-6">
          <span className="font-mono text-xs md:text-sm text-blue-primary/40 tracking-[0.1em]">
            {service.id}
          </span>
          <h3 className="font-sans text-xl sm:text-2xl md:text-[28px] lg:text-[32px] font-semibold text-blue-primary tracking-tight leading-tight">
            {service.title}
          </h3>
        </div>
        <div className="ml-4 shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
          <Plus
            className="w-5 h-5 md:w-6 md:h-6 text-blue-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            strokeWidth={1.5}
            style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
          />
        </div>
      </button>

      {/* Accordion content */}
      <div ref={contentRef} className="h-0 overflow-hidden">
        <div ref={innerRef} className="pb-6 md:pb-8 pl-8 md:pl-[calc(theme(spacing.6)+theme(fontSize.sm))]">
          <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.08em] leading-relaxed text-blue-primary/60 max-w-xl mb-4">
            {service.description}
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 font-mono text-[11px] md:text-xs uppercase tracking-[0.1em] text-blue-primary group/link"
          >
            <span className="text-blue-primary/40">[</span>
            <span className="group-hover/link:tracking-[0.15em] transition-all duration-300">
              LEARN MORE
            </span>
            <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
            <span className="text-blue-primary/40">]</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Services Section
──────────────────────────────────────────────────────── */
export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineLeftRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  // Pause shader when offscreen
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ── Scroll animations ── */
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none none",
        },
      });

      if (headlineLeftRef.current) {
        tl.fromTo(
          headlineLeftRef.current,
          { x: -120, clipPath: "inset(0 100% 0 0)" },
          { x: 0, clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "cubic-bezier(0.16, 1, 0.3, 1)" },
          0
        );
      }

      if (imageRef.current) {
        tl.fromTo(
          imageRef.current,
          { y: 80 },
          { y: 0, duration: 0.8, ease: "cubic-bezier(0.16, 1, 0.3, 1)" },
          0.2
        );
      }

      if (accordionRef.current) {
        const items = accordionRef.current.querySelectorAll(":scope > div");
        tl.fromTo(
          items,
          { y: 40 },
          {
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "cubic-bezier(0.16, 1, 0.3, 1)",
          },
          0.3
        );
      }

      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { y: 40 },
          { y: 0, duration: 0.6, ease: "cubic-bezier(0.16, 1, 0.3, 1)" },
          0.5
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative bg-cream-primary overflow-hidden"
    >
      <div className="relative z-10 px-6">
        {/* ── Section labels ── */}
        <div className="flex justify-between items-center pt-8 md:pt-12 pb-6 md:pb-8">
          <span className="label-mono text-blue-primary/50">SERVICES</span>
          <span className="section-marker text-blue-primary/50">[INV.3]</span>
        </div>

        {/* ── Section headline ── */}
        <div ref={headlineLeftRef} className="mb-12 md:mb-16 lg:mb-20">
          <h2 className="font-sans font-bold text-blue-primary text-[clamp(56px,10vw,140px)] leading-[0.95] tracking-tight pb-3">
            Built for every step
          </h2>
        </div>

        {/* ── Content: Image + Accordion ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
          {/* Left: Single persistent DitherEffect — fixed height, never resizes */}
          <div ref={imageRef} className="relative lg:pr-8 self-start">
            <div className="relative h-[498px] md:h-[663px] overflow-hidden">
              <DitherEffect
                src={services[openIndex].image}
                alt={services[openIndex].title}
                className="w-full h-full object-cover"
                darkColor="#1925AA"
                lightColor="#B8B0E0"
                dotSize={4}
                halftoneStrength={0.9}
                brushSize={280}
                trailFade={0.97}
                paused={!isVisible}
                waveColor="#1925AA"
                waveSpeed={0.25}
                waveOpacity={0.3}
                waveShape="warp"
              />
            </div>
          </div>

          {/* Right: Accordion list */}
          <div ref={accordionRef} className="lg:pl-8">
            <div className="border-t border-blue-primary/15" />
            {services.map((service, i) => (
              <AccordionItem
                key={service.id}
                service={service}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(i)}
              />
            ))}
          </div>
        </div>

        {/* ── CTA Button ── */}
        <div ref={ctaRef} className="mt-12 md:mt-16 pb-16 md:pb-20">
          <a
            href="#"
            className="block w-full bg-blue-primary text-cream-primary py-5 md:py-6 text-center font-mono text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-blue-dark transition-colors duration-300"
          >
            VIEW ALL SERVICES
          </a>
        </div>
      </div>
    </section>
  );
}
