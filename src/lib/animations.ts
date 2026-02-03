// Framer Motion animation variants
// Following VISION.md motion principles

import { type Variants } from "framer-motion"

// Timing constants (from VISION.md)
export const TIMING = {
  pageTransition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  sectionReveal: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  componentEnter: { duration: 0.4, ease: "easeOut" },
  microInteraction: { duration: 0.2, ease: "easeInOut" },
} as const

// Fade in from bottom
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: TIMING.componentEnter,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
}

// Fade in from top
export const fadeInDown: Variants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: TIMING.componentEnter,
  },
}

// Scale in
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: TIMING.componentEnter,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
}

// Stagger container for children
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

// Stagger item (use with staggerContainer)
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: TIMING.componentEnter,
  },
}

// Slide in from left
export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -40,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: TIMING.sectionReveal,
  },
}

// Slide in from right
export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 40,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: TIMING.sectionReveal,
  },
}

// Page transition variants
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: TIMING.pageTransition,
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
}

// Hover scale effect
export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: TIMING.microInteraction,
}

// Card hover effect
export const cardHover = {
  whileHover: {
    y: -4,
    boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.1)",
  },
  transition: TIMING.microInteraction,
}

// Button press effect
export const buttonPress = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 },
}
