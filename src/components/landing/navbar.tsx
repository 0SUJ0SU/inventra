"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS_LEFT = [
  { label: "ABOUT", href: "#about" },
  { label: "SERVICES", href: "#services" },
  { label: "PROJECTS", href: "#projects" },
  { label: "CLIENTS", href: "#clients" },
];

const NAV_LINKS_RIGHT = [
  { label: "CULTURE & CAREERS", href: "#culture" },
  { label: "BLOG", href: "#blog" },
  { label: "CONTACT", href: "#contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="flex items-start justify-between w-full px-4 pt-4">
          {/* LEFT — Wordmark with blue block */}
          <Link
            href="/"
            data-navbar-logo
            className="relative flex items-center gap-3 px-4 py-2.5 shrink-0 bg-blue-primary"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="32" cy="32" r="20" stroke="var(--color-cream-primary)" strokeWidth="3" />
              <circle cx="32" cy="32" r="8" stroke="var(--color-cream-primary)" strokeWidth="2.5" />
              <line x1="32" y1="4" x2="32" y2="18" stroke="var(--color-cream-primary)" strokeWidth="2" />
              <line x1="32" y1="46" x2="32" y2="60" stroke="var(--color-cream-primary)" strokeWidth="2" />
              <line x1="4" y1="32" x2="18" y2="32" stroke="var(--color-cream-primary)" strokeWidth="2" />
              <line x1="46" y1="32" x2="60" y2="32" stroke="var(--color-cream-primary)" strokeWidth="2" />
            </svg>
            <span className="font-mono text-xs tracking-[0.25em] uppercase text-cream-primary">
              Inventra
            </span>
          </Link>

          {/* RIGHT — MENU button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="shrink-0 font-mono text-xs tracking-[0.25em] uppercase px-5 py-2.5 bg-cream-primary text-blue-primary transition-colors hover:bg-cream-dark"
          >
            {menuOpen ? "CLOSE" : "MENU"}
          </button>
        </div>

      </nav>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-blue-primary"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-cream-primary opacity-8" />
              <div className="absolute left-2/3 top-0 bottom-0 w-px bg-cream-primary opacity-8" />
              <div className="absolute top-1/3 left-0 right-0 h-px bg-cream-primary opacity-8" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-cream-primary opacity-8" />
            </div>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
              <div className="flex flex-col gap-4">
                {NAV_LINKS_LEFT.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-sans text-4xl lg:text-6xl font-bold tracking-tight text-cream-primary transition-opacity hover:opacity-60"
                    initial={{ x: -60 }}
                    animate={{ x: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + i * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                {NAV_LINKS_RIGHT.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-sans text-4xl lg:text-6xl font-bold tracking-tight text-cream-primary transition-opacity hover:opacity-60"
                    initial={{ x: -60 }}
                    animate={{ x: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + i * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="absolute bottom-8 left-4 md:left-6 lg:left-8">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-cream-primary opacity-40">
                [INV.NAV]
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
