"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

const navColumns = [
  {
    title: "PRODUCT",
    links: [
      { label: "FEATURES", href: "#services" },
      { label: "PROCESS", href: "#process" },
      { label: "PREVIEW", href: "#projects" },
      { label: "PRICING", href: "#pricing" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "DOCUMENTATION", href: "#" },
      { label: "FAQ", href: "#faq" },
      { label: "CHANGELOG", href: "#" },
      { label: "STATUS", href: "#" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "ABOUT", href: "#about" },
      { label: "CONTACT", href: "#" },
      { label: "CAREERS", href: "#" },
      { label: "LEGAL", href: "#" },
    ],
  },
];

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const s = sectionRef.current;

      const dividers = s.querySelectorAll(".line-extend");
      gsap.fromTo(
        dividers,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: s, start: "top 75%" },
        }
      );

      const cols = s.querySelectorAll(".nav-col");
      gsap.fromTo(
        cols,
        { y: 30, clipPath: "inset(100% 0 0 0)" },
        {
          y: 0,
          clipPath: "inset(0% 0 0 0)",
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: s, start: "top 65%" },
        }
      );

      const bottom = s.querySelector(".footer-bottom");
      if (bottom) {
        gsap.fromTo(
          bottom,
          { y: 15, clipPath: "inset(100% 0 0 0)" },
          {
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: s, start: "top 55%" },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <footer
      id="footer"
      ref={sectionRef}
      className="relative bg-blue-primary overflow-hidden"
    >
      {/* ── Blueprint grid lines ── */}
      <div className="pointer-events-none absolute inset-0 z-2">
        <div
          className="absolute top-0 h-full w-px"
          style={{ left: "33.333%", backgroundColor: "rgba(232,228,221,0.05)" }}
        />
        <div
          className="absolute top-0 h-full w-px"
          style={{ left: "66.666%", backgroundColor: "rgba(232,228,221,0.05)" }}
        />
      </div>

      {/* ═══════════════════ Content ═══════════════════ */}
      <div className="relative z-10 px-6">
        {/* ── Navigation columns ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-0 py-12 md:py-16">
          {navColumns.map((col, i) => (
            <div
              key={col.title}
              className="nav-col"
              style={{
                borderLeft:
                  i > 0 ? "1px solid rgba(232,228,221,0.06)" : "none",
                paddingLeft: i > 0 ? "2rem" : "0",
              }}
            >
              <span
                className="block font-mono text-[13px] uppercase tracking-[0.3em] mb-5"
                style={{ color: "#E8E4DD" }}
              >
                {col.title}
              </span>
              <div className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="font-mono text-[11px] uppercase tracking-[0.15em] transition-all duration-300 hover:translate-x-1"
                    style={{ color: "rgba(232,228,221,0.45)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#E8E4DD")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(232,228,221,0.45)")
                    }
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div
          className="line-extend h-px w-full origin-center"
          style={{ backgroundColor: "rgba(232,228,221,0.08)" }}
        />

        {/* ── Bottom strip ── */}
        <div className="footer-bottom flex flex-col md:flex-row items-start md:items-baseline justify-between gap-3 py-6">
          <span
            className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.15em]"
            style={{ color: "rgba(232, 228, 221, 0.15)" }}
          >
            &copy; {new Date().getFullYear()} INVENTRA. ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  );
}
