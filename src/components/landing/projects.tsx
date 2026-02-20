"use client";

import { useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUp, ArrowDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────────────
   Module definitions
──────────────────────────────────────────────────────── */
const modules = [
  { id: "dashboard", label: "/001", title: "DASHBOARD", name: "System Overview" },
  { id: "serial", label: "/002", title: "SERIAL INVENTORY", name: "Unit Tracking" },
  { id: "pos", label: "/003", title: "POINT OF SALE", name: "Transactions" },
  { id: "analytics", label: "/004", title: "ANALYTICS", name: "Reporting" },
];

/* ────────────────────────────────────────────────────────
   CSS Mockup: Dashboard
──────────────────────────────────────────────────────── */
function DashboardMockup() {
  return (
    <div className="h-full w-full p-5 md:p-8 flex flex-col gap-4">
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-3">
        {["REVENUE", "ORDERS", "UNITS", "ALERTS"].map((label, i) => (
          <div
            key={label}
            className="border px-3 py-3"
            style={{ borderColor: "rgba(25, 37, 170, 0.15)" }}
          >
            <div
              className="font-mono text-[9px] uppercase tracking-[0.15em] mb-2"
              style={{ color: "rgba(25, 37, 170, 0.4)" }}
            >
              {label}
            </div>
            <div
              className="font-sans font-bold text-xl leading-none"
              style={{ color: "#1925AA" }}
            >
              {["24.8K", "1,847", "3,291", "12"][i]}
            </div>
            <div
              className="font-mono text-[8px] mt-1"
              style={{ color: "rgba(25, 37, 170, 0.35)" }}
            >
              {["+12.4%", "+8.2%", "+15.7%", "-3"][i]}
            </div>
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div
        className="flex-1 border relative overflow-hidden min-h-[100px]"
        style={{ borderColor: "rgba(25, 37, 170, 0.12)" }}
      >
        <div
          className="absolute top-3 left-4 font-mono text-[9px] uppercase tracking-[0.15em]"
          style={{ color: "rgba(25, 37, 170, 0.4)" }}
        >
          SALES TREND — 30D
        </div>
        <svg
          className="absolute bottom-0 left-0 w-full"
          style={{ height: "65%" }}
          viewBox="0 0 400 100"
          preserveAspectRatio="none"
        >
          <polyline
            points="0,80 30,75 60,60 90,65 120,45 150,50 180,30 210,35 240,20 270,25 300,15 330,22 360,10 400,18"
            fill="none"
            stroke="#1925AA"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <polyline
            points="0,80 30,75 60,60 90,65 120,45 150,50 180,30 210,35 240,20 270,25 300,15 330,22 360,10 400,18 400,100 0,100"
            fill="rgba(25, 37, 170, 0.05)"
            stroke="none"
          />
        </svg>
      </div>

      {/* Activity rows */}
      <div className="flex flex-col">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2"
            style={{ borderBottom: "1px solid rgba(25, 37, 170, 0.06)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: i === 0 ? "#1925AA" : "rgba(25,37,170,0.2)" }}
              />
              <span
                className="font-mono text-[8px] uppercase tracking-[0.1em]"
                style={{ color: "rgba(25, 37, 170, 0.5)" }}
              >
                {["SALE COMPLETED #1847", "STOCK IN — 24 UNITS", "WARRANTY CLAIM #WC-0042"][i]}
              </span>
            </div>
            <span
              className="font-mono text-[8px]"
              style={{ color: "rgba(25, 37, 170, 0.3)" }}
            >
              {["2M AGO", "15M AGO", "1H AGO"][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   CSS Mockup: Serial Inventory
──────────────────────────────────────────────────────── */
function SerialMockup() {
  const rows = [
    { serial: "SN-2024-00847", product: "IPHONE 15 PRO", status: "IN STOCK", condition: "NEW" },
    { serial: "SN-2024-00848", product: "MACBOOK AIR M3", status: "SOLD", condition: "NEW" },
    { serial: "SN-2024-00612", product: "GALAXY S24 ULTRA", status: "IN REPAIR", condition: "DEFECTIVE" },
    { serial: "SN-2024-00419", product: "IPAD PRO 12.9", status: "IN STOCK", condition: "GOOD" },
    { serial: "SN-2024-00733", product: "AIRPODS PRO 2", status: "SOLD", condition: "NEW" },
    { serial: "SN-2024-00291", product: "PIXEL 8 PRO", status: "SCRAPPED", condition: "DAMAGED" },
  ];

  return (
    <div className="h-full w-full p-5 md:p-8 flex flex-col">
      <div
        className="flex items-center justify-between pb-3 mb-4"
        style={{ borderBottom: "1px solid rgba(25, 37, 170, 0.15)" }}
      >
        <span
          className="font-mono text-[10px] uppercase tracking-[0.2em]"
          style={{ color: "#1925AA" }}
        >
          SERIAL INVENTORY
        </span>
        <span
          className="font-mono text-[9px]"
          style={{ color: "rgba(25, 37, 170, 0.4)" }}
        >
          847 UNITS TRACKED
        </span>
      </div>

      <div
        className="grid gap-2 pb-2 mb-2"
        style={{
          gridTemplateColumns: "2fr 2fr 1.2fr 1fr",
          borderBottom: "1px solid rgba(25, 37, 170, 0.1)",
        }}
      >
        {["SERIAL", "PRODUCT", "STATUS", "CONDITION"].map((h) => (
          <span
            key={h}
            className="font-mono text-[8px] uppercase tracking-[0.15em]"
            style={{ color: "rgba(25, 37, 170, 0.35)" }}
          >
            {h}
          </span>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid gap-2 py-2 items-center"
            style={{
              gridTemplateColumns: "2fr 2fr 1.2fr 1fr",
              borderBottom: "1px solid rgba(25, 37, 170, 0.05)",
            }}
          >
            <span className="font-mono text-[9px]" style={{ color: "#1925AA" }}>
              {row.serial}
            </span>
            <span
              className="font-mono text-[8px] uppercase tracking-[0.05em]"
              style={{ color: "rgba(25, 37, 170, 0.6)" }}
            >
              {row.product}
            </span>
            <span
              className="font-mono text-[8px] uppercase tracking-[0.1em]"
              style={{
                color:
                  row.status === "IN STOCK" || row.status === "IN REPAIR"
                    ? "#1925AA"
                    : "rgba(25,37,170,0.35)",
              }}
            >
              {row.status}
            </span>
            <span
              className="font-mono text-[8px] uppercase"
              style={{ color: "rgba(25, 37, 170, 0.4)" }}
            >
              {row.condition}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   CSS Mockup: Point of Sale
──────────────────────────────────────────────────────── */
function POSMockup() {
  return (
    <div className="h-full w-full flex">
      <div
        className="flex-1 p-5"
        style={{ borderRight: "1px solid rgba(25, 37, 170, 0.1)" }}
      >
        <div
          className="font-mono text-[9px] uppercase tracking-[0.2em] mb-4"
          style={{ color: "rgba(25, 37, 170, 0.4)" }}
        >
          PRODUCTS
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["IPHONE 15", "GALAXY S24", "MACBOOK", "IPAD PRO", "AIRPODS", "PIXEL 8"].map(
            (name, i) => (
              <div
                key={name}
                className="border p-2.5 flex flex-col items-center gap-2"
                style={{
                  borderColor: i === 0 ? "#1925AA" : "rgba(25, 37, 170, 0.1)",
                  backgroundColor: i === 0 ? "rgba(25, 37, 170, 0.03)" : "transparent",
                }}
              >
                <div
                  className="w-8 h-8 border"
                  style={{ borderColor: "rgba(25, 37, 170, 0.12)" }}
                />
                <span
                  className="font-mono text-[7px] uppercase tracking-[0.05em] text-center"
                  style={{ color: "rgba(25, 37, 170, 0.5)" }}
                >
                  {name}
                </span>
                <span
                  className="font-mono text-[8px] font-bold"
                  style={{ color: "#1925AA" }}
                >
                  {["$999", "$899", "$1,299", "$1,099", "$249", "$699"][i]}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      <div className="w-[35%] p-5 flex flex-col">
        <div
          className="font-mono text-[9px] uppercase tracking-[0.2em] mb-4"
          style={{ color: "rgba(25, 37, 170, 0.4)" }}
        >
          CART — 2 ITEMS
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {["IPHONE 15 PRO", "AIRPODS PRO 2"].map((item, i) => (
            <div
              key={item}
              className="flex justify-between items-start py-2"
              style={{ borderBottom: "1px solid rgba(25, 37, 170, 0.06)" }}
            >
              <div>
                <div
                  className="font-mono text-[8px] uppercase"
                  style={{ color: "rgba(25, 37, 170, 0.6)" }}
                >
                  {item}
                </div>
                <div
                  className="font-mono text-[7px] mt-0.5"
                  style={{ color: "rgba(25, 37, 170, 0.3)" }}
                >
                  SN-2024-{["00847", "00733"][i]}
                </div>
              </div>
              <span className="font-mono text-[9px] font-bold" style={{ color: "#1925AA" }}>
                {["$999", "$249"][i]}
              </span>
            </div>
          ))}
        </div>
        <div className="pt-3 mt-auto" style={{ borderTop: "1px solid rgba(25, 37, 170, 0.12)" }}>
          <div className="flex justify-between items-baseline">
            <span
              className="font-mono text-[9px] uppercase tracking-[0.1em]"
              style={{ color: "rgba(25, 37, 170, 0.4)" }}
            >
              TOTAL
            </span>
            <span className="font-sans font-bold text-base" style={{ color: "#1925AA" }}>
              $1,248
            </span>
          </div>
          <div
            className="mt-3 py-2.5 text-center font-mono text-[9px] uppercase tracking-[0.2em]"
            style={{ backgroundColor: "#1925AA", color: "#E8E4DD" }}
          >
            COMPLETE SALE
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   CSS Mockup: Analytics
──────────────────────────────────────────────────────── */
function AnalyticsMockup() {
  return (
    <div className="h-full w-full p-5 md:p-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.2em]"
          style={{ color: "#1925AA" }}
        >
          PROFIT & LOSS
        </span>
        <span className="font-mono text-[9px]" style={{ color: "rgba(25, 37, 170, 0.4)" }}>
          FEB 2025
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "REVENUE", value: "$48.2K", sub: "+18.4%" },
          { label: "EXPENSES", value: "$31.7K", sub: "+5.2%" },
          { label: "NET PROFIT", value: "$16.5K", sub: "+42.1%" },
        ].map((m) => (
          <div key={m.label}>
            <div
              className="font-mono text-[8px] uppercase tracking-[0.15em] mb-1"
              style={{ color: "rgba(25, 37, 170, 0.35)" }}
            >
              {m.label}
            </div>
            <div className="font-sans font-bold text-xl leading-none" style={{ color: "#1925AA" }}>
              {m.value}
            </div>
            <div className="font-mono text-[8px] mt-1" style={{ color: "rgba(25, 37, 170, 0.4)" }}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      <div
        className="flex-1 border relative min-h-[80px]"
        style={{ borderColor: "rgba(25, 37, 170, 0.08)" }}
      >
        <div className="absolute inset-3 flex items-end gap-[3%]">
          {[45, 62, 38, 71, 55, 80, 68, 90, 75, 85, 60, 95].map((h, i) => (
            <div
              key={i}
              className="flex-1"
              style={{
                height: `${h}%`,
                backgroundColor: i === 11 ? "#1925AA" : "rgba(25, 37, 170, 0.1)",
              }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "PHONES", pct: "42%" },
          { label: "LAPTOPS", pct: "28%" },
          { label: "TABLETS", pct: "18%" },
          { label: "ACCESSORIES", pct: "12%" },
        ].map((c) => (
          <div key={c.label}>
            <div
              className="font-mono text-[7px] uppercase tracking-[0.1em]"
              style={{ color: "rgba(25, 37, 170, 0.35)" }}
            >
              {c.label}
            </div>
            <div className="font-mono text-[10px] font-bold" style={{ color: "#1925AA" }}>
              {c.pct}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Blueprint Frame
──────────────────────────────────────────────────────── */
function BlueprintFrame({
  children,
  label,
  title,
  active,
}: {
  children: React.ReactNode;
  label: string;
  title: string;
  active: boolean;
}) {
  const bSize = active ? "20px" : "14px";
  const bColor = active ? "rgba(25, 37, 170, 0.35)" : "rgba(25, 37, 170, 0.12)";

  return (
    <div className="relative w-full h-full">
      {/* Corner brackets */}
      <div
        className="absolute top-0 left-0"
        style={{ width: bSize, height: bSize, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: bColor, borderLeftWidth: 1, borderLeftStyle: "solid", borderLeftColor: bColor }}
      />
      <div
        className="absolute top-0 right-0"
        style={{ width: bSize, height: bSize, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: bColor, borderRightWidth: 1, borderRightStyle: "solid", borderRightColor: bColor }}
      />
      <div
        className="absolute bottom-0 left-0"
        style={{ width: bSize, height: bSize, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: bColor, borderLeftWidth: 1, borderLeftStyle: "solid", borderLeftColor: bColor }}
      />
      <div
        className="absolute bottom-0 right-0"
        style={{ width: bSize, height: bSize, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: bColor, borderRightWidth: 1, borderRightStyle: "solid", borderRightColor: bColor }}
      />

      {/* Labels */}
      {active && (
        <>
          <div
            className="absolute -top-7 left-0 font-mono text-[10px] tracking-[0.15em]"
            style={{ color: "rgba(25, 37, 170, 0.6)" }}
          >
            {label}
          </div>
          <div
            className="absolute -top-7 right-0 font-mono text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "rgba(25, 37, 170, 0.4)" }}
          >
            {title}
          </div>
        </>
      )}

      {/* Content */}
      <div
        className="w-full h-full overflow-hidden"
        style={{
          border: `1px solid rgba(25, 37, 170, ${active ? "0.12" : "0.06"})`,
          backgroundColor: active ? "#E8E4DD" : "rgba(232, 228, 221, 0.7)",
        }}
      >
        {children}
      </div>

      {/* Blue wash overlay on inactive cards */}
      {!active && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: "rgba(25, 37, 170, 0.06)" }}
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Carousel position calculator
──────────────────────────────────────────────────────── */
type CarouselSlot = "center" | "right" | "back" | "left";

function getSlot(index: number, activeIndex: number, total: number): CarouselSlot {
  const diff = ((index - activeIndex) % total + total) % total;
  if (diff === 0) return "center";
  if (diff === 1) return "right";
  if (diff === total - 1) return "left";
  return "back";
}

const slotStyles: Record<
  CarouselSlot,
  { x: string; z: number; scale: number; rotateY: number; opacity: number; zIndex: number }
> = {
  center: { x: "0%", z: 0, scale: 1, rotateY: 0, opacity: 1, zIndex: 30 },
  right: { x: "58%", z: -180, scale: 0.72, rotateY: -18, opacity: 1, zIndex: 20 },
  left: { x: "-58%", z: -180, scale: 0.72, rotateY: 18, opacity: 1, zIndex: 20 },
  back: { x: "0%", z: -350, scale: 0.5, rotateY: 0, opacity: 0, zIndex: 10 },
};

/* ────────────────────────────────────────────────────────
   Projects Section
──────────────────────────────────────────────────────── */
const mockupComponents = [DashboardMockup, SerialMockup, POSMockup, AnalyticsMockup];

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimating = useRef(false);

  const navigateTo = useCallback(
    (direction: "prev" | "next") => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const newIndex =
        direction === "next"
          ? (activeIndex + 1) % modules.length
          : (activeIndex - 1 + modules.length) % modules.length;

      // Animate all cards to their new positions
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const slot = getSlot(i, newIndex, modules.length);
        const style = slotStyles[slot];

        gsap.to(card, {
          xPercent: parseFloat(style.x),
          z: style.z,
          scale: style.scale,
          rotateY: style.rotateY,
          autoAlpha: style.opacity,
          zIndex: style.zIndex,
          duration: 0.7,
          ease: "power3.inOut",
          onComplete: () => {
            if (i === 0) isAnimating.current = false;
          },
        });
      });

      setActiveIndex(newIndex);
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

      // Headline slides up
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { yPercent: 80, clipPath: "inset(100% 0 0 0)" },
          {
            yPercent: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          }
        );
      }

      // Cards: set initial positions, then stagger in from below
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const slot = getSlot(i, 0, modules.length);
        const style = slotStyles[slot];

        gsap.set(card, {
          xPercent: parseFloat(style.x),
          z: style.z,
          scale: style.scale,
          rotateY: style.rotateY,
          autoAlpha: style.opacity,
          zIndex: style.zIndex,
        });

        // Entrance: slide up from below
        gsap.fromTo(
          card,
          { y: 120 + i * 30 },
          {
            y: 0,
            duration: 0.9,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: carouselRef.current, start: "top 80%" },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative z-[2] bg-[#E8E4DD]"
      style={{ clipPath: "inset(0 0 0 0)" }}
    >
      {/* Blueprint grid */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute top-0 bottom-0 left-1/3 w-px"
          style={{ backgroundColor: "rgba(25, 37, 170, 0.06)" }}
        />
        <div
          className="absolute top-0 bottom-0 left-2/3 w-px"
          style={{ backgroundColor: "rgba(25, 37, 170, 0.06)" }}
        />
      </div>

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
            PREVIEW
          </span>
          <span
            className="label-right font-mono text-[11px] uppercase tracking-[0.2em]"
            style={{ color: "rgba(25, 37, 170, 0.5)" }}
          >
            [INV.5]
          </span>
        </div>

        {/* Headline */}
        <div className="overflow-hidden pt-4 md:pt-10 pb-4 md:pb-6">
          <h2
            ref={headlineRef}
            className="font-sans font-bold text-center leading-[0.9] tracking-tight"
            style={{ color: "#1925AA", fontSize: "clamp(44px, 9vw, 140px)", paddingBottom: "0.15em" }}
          >
            Inside The
            <br />
            System
          </h2>
        </div>
        <p
          className="text-center font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] pb-10 md:pb-16"
          style={{ color: "rgba(25, 37, 170, 0.4)" }}
        >
          THE COMPLETE PLATFORM. INSPECT EACH LAYER.
        </p>

        {/* ── 3D Carousel ── */}
        <div
          ref={carouselRef}
          className="relative mx-auto"
          style={{
            height: "min(55vh, 440px)",
            maxWidth: "1000px",
            perspective: "1200px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
            {modules.map((mod, i) => {
              const Mockup = mockupComponents[i];
              const isActive = i === activeIndex;

              return (
                <div
                  key={mod.id}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="absolute"
                  style={{
                    width: "65%",
                    height: "90%",
                    left: "17.5%",
                    top: "5%",
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
                  }}
                >
                  <BlueprintFrame label={mod.label} title={mod.title} active={isActive}>
                    <Mockup />
                  </BlueprintFrame>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Navigation controls ── */}
        <div className="flex items-center justify-center gap-8 pt-8 md:pt-12">
          {/* Left arrow */}
          <button
            onClick={() => navigateTo("prev")}
            className="group flex items-center justify-center w-12 h-12 rounded-full border transition-colors duration-200"
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
            aria-label="Previous module"
          >
            <ArrowUp size={18} style={{ transform: "rotate(-90deg)" }} />
          </button>

          {/* Counter */}
          <div className="flex items-baseline gap-3">
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
              {String(modules.length).padStart(2, "0")}
            </span>
          </div>

          {/* Right arrow */}
          <button
            onClick={() => navigateTo("next")}
            className="group flex items-center justify-center w-12 h-12 rounded-full border transition-colors duration-200"
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
            aria-label="Next module"
          >
            <ArrowDown size={18} style={{ transform: "rotate(-90deg)" }} />
          </button>
        </div>

        <div className="h-16 md:h-24" />
      </div>
    </section>
  );
}
