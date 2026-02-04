"use client";

// ============================================
// DARK BAND SECTION
// This ticker intentionally stays dark in both light and dark modes.
// All colors are hardcoded hex values - do NOT use CSS variables or dark: prefixes.
// ============================================

// ============================================
// TICKER CONTENT
// ============================================

const tickerItems = [
  "Serial Tracking",
  "Warranty Management",
  "Real-time Inventory",
  "Smart POS",
  "Business Reports",
  "Built for Tech Retail",
];

// Decorative separator
function Separator() {
  return (
    <span className="mx-4 text-[#B87333]/40 select-none" aria-hidden="true">
      •
    </span>
  );
}

// Single set of ticker items
function TickerContent() {
  return (
    <>
      {tickerItems.map((item, index) => (
        <span key={index} className="flex items-center">
          <span className="whitespace-nowrap">{item}</span>
          <Separator />
        </span>
      ))}
    </>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function MarqueeTicker() {
  return (
    <div className="relative bg-[#141113] py-3 overflow-hidden">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#141113] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#141113] to-transparent z-10 pointer-events-none" />

      {/* Scrolling content */}
      <div className="flex animate-marquee hover:[animation-play-state:paused]">
        {/* First set */}
        <div className="flex items-center text-[#B87333] font-heading font-medium text-sm uppercase tracking-widest shrink-0">
          <TickerContent />
        </div>

        {/* Duplicate for seamless loop */}
        <div className="flex items-center text-[#B87333] font-heading font-medium text-sm uppercase tracking-widest shrink-0">
          <TickerContent />
        </div>
      </div>
    </div>
  );
}
