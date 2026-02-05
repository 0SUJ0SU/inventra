"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";

// Footer navigation data
const navigation = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

const socialLinks = [
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="relative bg-[var(--background)] dark:bg-[#141113] overflow-hidden">
      {/* Light mode: Textured gradient background with dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none dark:opacity-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 70% at 0% 0%, rgba(184, 115, 51, 0.18) 0%, rgba(184, 115, 51, 0.06) 40%, transparent 70%),
            radial-gradient(circle, rgba(120, 80, 40, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 4px 4px",
        }}
      />
      {/* Dark mode: Textured gradient background with dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-100"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 70% at 0% 0%, rgba(184, 115, 51, 0.22) 0%, rgba(184, 115, 51, 0.08) 40%, transparent 70%),
            radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 4px 4px",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        {/* ROW 1 - Main Content: Brand | Navigation | Who We Are | Socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pt-16 md:pt-20 pb-8"
        >
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Brand Column - Larger, more prominent */}
            <div className="col-span-2 lg:col-span-4">
              <Link href="/" className="inline-block mb-3">
                <span className="font-heading font-bold text-4xl lg:text-5xl text-[var(--text)]">
                  Invent
                </span>
                <span className="font-heading font-bold text-4xl lg:text-5xl text-[#B87333]">
                  ra
                </span>
              </Link>
              <p className="text-base text-[var(--text-muted)]">
                Smart Inventory Management
              </p>
            </div>

            {/* Navigation Column */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--text-muted)] mb-5">
                Navigation
              </h3>
              <ul className="space-y-3">
                {navigation.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-base text-[var(--text-secondary)] hover:text-[#B87333] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who We Are Column */}
            <div className="lg:col-span-3">
              <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--text-muted)] mb-5">
                Who We Are
              </h3>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                A modern inventory system built for tech retailers who care
                about every detail.
              </p>
            </div>

            {/* Socials Column */}
            <div className="lg:col-span-3">
              <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--text-muted)] mb-5">
                Socials
              </h3>
              <div className="flex items-start gap-5">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-[var(--text-secondary)] hover:text-[#B87333] transition-colors duration-200"
                  >
                    <social.icon className="w-5 h-5" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ROW 2 - Bottom Bar: Newsletter (right on desktop, first on mobile) | Copyright (left on desktop, last on mobile) */}
        <div className="pb-8">
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-6 lg:gap-12 items-start">
            {/* Copyright & Legal - appears last on mobile, left on desktop */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              <span className="text-sm text-[var(--text-secondary)]">
                &copy; {new Date().getFullYear()} Inventra. All rights reserved.
              </span>
              <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                <Link
                  href="#"
                  className="hover:text-[#B87333] transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link
                  href="#"
                  className="hover:text-[#B87333] transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </div>
            </div>

            {/* Newsletter - appears first on mobile, right on desktop */}
            <div className="lg:col-span-8 flex flex-col gap-3">
              <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--text-muted)]">
                Get Updates
              </h3>
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail"
                  required
                  className="flex-1 h-12 px-6 text-sm bg-transparent border border-[var(--border)] dark:border-[#3A3537] rounded-full text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#B87333]/50 transition-colors"
                />
                <button
                  type="submit"
                  className="h-12 px-8 text-xs font-semibold tracking-[0.15em] uppercase bg-transparent border border-[var(--border)] dark:border-[#3A3537] rounded-full text-[var(--text)] hover:border-[#B87333] hover:text-[#B87333] transition-colors duration-200 whitespace-nowrap"
                >
                  Get Updates
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
