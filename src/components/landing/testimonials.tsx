"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

// Custom easing
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Testimonial data types
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
}

// Column 1 testimonials
const column1: Testimonial[] = [
  {
    quote:
      "The serial number tracking alone saved us countless hours. We can trace any product's entire journey from purchase to sale instantly.",
    name: "Sarah Chen",
    role: "Operations Manager",
    company: "TechFlow",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote:
      "Finally, an inventory system that understands tech retail. The warranty management feature has reduced our claim processing time by 60%.",
    name: "David Kim",
    role: "Founder",
    company: "CircuitCity",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote:
      "The reporting dashboard gives us insights we never had before. We can now make data-driven decisions about stock levels and pricing.",
    name: "Amanda Foster",
    role: "Business Analyst",
    company: "TechMart",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

// Column 2 testimonials
const column2: Testimonial[] = [
  {
    quote:
      "Switched from spreadsheets to Inventra and never looked back. Our checkout speed doubled and inventory errors dropped to nearly zero.",
    name: "Marcus Rodriguez",
    role: "Owner",
    company: "GadgetHub",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    quote:
      "Managing warranties used to be a nightmare. Now customers get instant warranty status and we handle claims in minutes, not days.",
    name: "Lisa Thompson",
    role: "Retail Director",
    company: "DeviceWorld",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    quote:
      "The POS system is incredibly intuitive. New staff learn it in under an hour, and the serial number picker makes high-value sales foolproof.",
    name: "Ryan Chen",
    role: "Store Owner",
    company: "ComputerZone",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
  },
];

// Column 3 testimonials
const column3: Testimonial[] = [
  {
    quote:
      "What impressed me most is how everything connects. Sell a laptop, and the serial is tracked, warranty starts, and inventory updates automatically.",
    name: "Emily Watson",
    role: "Store Manager",
    company: "ByteShop",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
  },
  {
    quote:
      "We handle hundreds of serialized items daily. Inventra's bulk import and barcode scanning cut our receiving time in half.",
    name: "James Park",
    role: "Inventory Lead",
    company: "MobileMax",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    quote:
      "The low stock alerts and expiring warranty notifications mean nothing falls through the cracks anymore. It's like having an extra team member.",
    name: "Nicole Adams",
    role: "Operations Lead",
    company: "GearPoint",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
  },
];

// Testimonial card component
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm dark:shadow-none">
      {/* Decorative quote mark */}
      <span className="absolute top-4 right-4 font-serif text-6xl text-[#B87333] opacity-20 leading-none select-none">
        "
      </span>

      {/* Quote */}
      <p className="font-body text-base text-[var(--text)] leading-relaxed mb-6 relative z-10">
        "{testimonial.quote}"
      </p>

      {/* Author info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-[var(--border)]"
          loading="lazy"
        />

        {/* Name & Role */}
        <div>
          <p className="font-heading font-semibold text-[var(--text)]">
            {testimonial.name}
          </p>
          <p className="font-body text-sm text-[var(--text-muted)]">
            {testimonial.role} at {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}

// Scrolling column component with pixel-perfect looping
function TestimonialColumn({
  testimonials,
  duration = 25,
  className,
}: {
  testimonials: Testimonial[];
  duration?: number;
  className?: string;
}) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const updateHeight = () => {
      if (columnRef.current) {
        const firstSet = columnRef.current.querySelector(
          '[data-testimonial-set="original"]'
        );
        if (firstSet) {
          setHeight(firstSet.getBoundingClientRect().height);
        }
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [testimonials]);

  return (
    <div className={cn("flex-1 min-w-0 overflow-hidden", className)}>
      <div
        ref={columnRef}
        className="flex flex-col animate-scroll-up"
        style={
          {
            "--scroll-height": `${height}px`,
            "--scroll-duration": `${duration}s`,
            animationPlayState: isPaused ? "paused" : "running",
          } as React.CSSProperties
        }
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Original set */}
        <div data-testimonial-set="original" className="flex flex-col gap-6 pb-6">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard key={`original-${idx}`} testimonial={testimonial} />
          ))}
        </div>
        {/* Duplicate set - identical for seamless loop */}
        <div data-testimonial-set="duplicate" className="flex flex-col gap-6 pb-6">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard key={`duplicate-${idx}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative py-20 md:py-28 overflow-hidden bg-[var(--background)]"
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.12] dark:opacity-[0.03] pointer-events-none mix-blend-multiply dark:mix-blend-normal"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-12 md:mb-16"
        >
          {/* Badge */}
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#B87333]/30 text-[11px] font-heading font-semibold tracking-[0.2em] uppercase text-[#B87333] mb-4">
            Testimonials
          </span>

          {/* Headline */}
          <h2 className="font-display italic text-[var(--text)] text-4xl md:text-5xl leading-[1.1] mb-4">
            Trusted by tech retailers everywhere.
          </h2>

          {/* Subheadline */}
          <p className="font-body text-base md:text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            See what store owners and inventory managers say about transforming
            their operations with Inventra.
          </p>
        </motion.div>

        {/* Scrolling columns with mask */}
        <div
          className="max-h-[600px] overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="flex items-start gap-6">
            {/* Column 1 - Always visible */}
            <TestimonialColumn
              testimonials={column1}
              duration={25}
              className="flex"
            />

            {/* Column 2 - Hidden on mobile */}
            <TestimonialColumn
              testimonials={column2}
              duration={30}
              className="hidden md:flex"
            />

            {/* Column 3 - Hidden on mobile/tablet */}
            <TestimonialColumn
              testimonials={column3}
              duration={22}
              className="hidden lg:flex"
            />
          </div>
        </div>
      </div>
    </section>
  );
}