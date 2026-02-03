"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "About" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b border-border/20 dark:border-border-dark/20 bg-[rgba(252,250,245,0.75)] dark:bg-[rgba(28,25,23,0.75)]"
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 items-center h-16">
          {/* Left: Wordmark */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="justify-self-start"
          >
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <span className="text-xl font-bold tracking-tight text-text dark:text-text-dark font-space-grotesk">
                Inventra
              </span>
            </Link>
          </motion.div>

          {/* Center: Nav Links (Desktop) - page centered */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:flex items-center justify-self-center gap-1"
          >
            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                className={cn(
                  "relative px-4 py-2 text-sm font-semibold transition-colors",
                  "text-text dark:text-text-dark",
                  "hover:text-accent-600 dark:hover:text-accent-400",
                  "group"
                )}
              >
                {link.label}
                {/* Hover underline indicator */}
                <span
                  className="absolute bottom-1 left-4 right-4 h-px bg-accent-500 origin-left scale-x-0 group-hover:scale-x-100"
                  style={{
                    transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'transform'
                  }}
                />
              </motion.a>
            ))}
          </motion.div>

          {/* Right: Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="justify-self-end flex items-center gap-2"
          >
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-4 text-sm font-medium"
                asChild
              >
                <Link href="/login">Log In</Link>
              </Button>
              <Button
                size="sm"
                className="h-9 px-4 text-sm font-medium"
                asChild
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-80 bg-surface dark:bg-surface-dark border-border dark:border-border-dark"
              >
                <SheetHeader className="text-left">
                  <SheetTitle className="text-xl font-bold font-space-grotesk text-text dark:text-text-dark">
                    Inventra
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Nav Links */}
                <div className="flex flex-col gap-1 mt-8">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={cn(
                        "flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors",
                        "text-text-secondary dark:text-text-secondary-dark",
                        "hover:text-text dark:hover:text-text-dark",
                        "hover:bg-background-alt dark:hover:bg-background-alt-dark"
                      )}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>

                {/* Mobile CTA Buttons */}
                <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-border dark:border-border-dark">
                  <Button
                    variant="outline"
                    className="w-full justify-center h-11"
                    asChild
                  >
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button
                    className="w-full justify-center h-11"
                    asChild
                  >
                    <Link href="/register">Get Started</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>
        </div>
      </nav>
    </motion.header>
  );
}
