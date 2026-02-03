import { Variants, Transition, TargetAndTransition } from "framer-motion";

// =============================================================================
// Timing Constants
// =============================================================================

/**
 * Standard duration values for consistent timing across the app.
 * Use these instead of arbitrary numbers for cohesive animation feel.
 */
export const duration = {
  /** Quick micro-interactions: 150ms */
  fast: 0.15,
  /** Standard animations: 300ms */
  normal: 0.3,
  /** Deliberate, attention-drawing: 500ms */
  slow: 0.5,
  /** Page/section transitions: 600ms */
  page: 0.6,
  /** Hero/splash animations: 800ms */
  hero: 0.8,
} as const;

// =============================================================================
// Easing Curves
// =============================================================================

/**
 * Custom easing curves for handcrafted, non-generic motion feel.
 * These curves give animations personality and avoid the "AI slop" feel.
 */
export const easing = {
  /** Smooth, natural deceleration - great for most entrances */
  smooth: [0.16, 1, 0.3, 1] as const,
  /** Playful overshoot - use sparingly for delightful moments */
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  /** Snappy, responsive feel - good for interactions */
  snappy: [0.4, 0, 0.2, 1] as const,
  /** Gentle, organic movement - for subtle shifts */
  gentle: [0.25, 0.46, 0.45, 0.94] as const,
  /** Quick start, slow finish - emphasizes arrival */
  decelerate: [0, 0.55, 0.45, 1] as const,
  /** Slow start, quick finish - emphasizes departure */
  accelerate: [0.55, 0, 1, 0.45] as const,
} as const;

// Legacy TIMING export for backwards compatibility
export const TIMING = {
  pageTransition: { duration: duration.page, ease: easing.snappy },
  sectionReveal: { duration: duration.hero, ease: easing.smooth },
  componentEnter: { duration: duration.normal, ease: "easeOut" as const },
  microInteraction: { duration: duration.fast, ease: "easeInOut" as const },
} as const;

// =============================================================================
// Transition Presets
// =============================================================================

/**
 * Pre-configured transition objects for common use cases.
 */
export const transition = {
  /** Fast micro-interaction */
  fast: {
    duration: duration.fast,
    ease: easing.snappy,
  } satisfies Transition,

  /** Standard smooth transition */
  smooth: {
    duration: duration.normal,
    ease: easing.smooth,
  } satisfies Transition,

  /** Snappy, responsive transition */
  snappy: {
    duration: duration.fast,
    ease: easing.snappy,
  } satisfies Transition,

  /** Spring physics for natural movement */
  spring: {
    type: "spring",
    damping: 25,
    stiffness: 300,
  } satisfies Transition,

  /** Bouncy spring for playful interactions */
  springBouncy: {
    type: "spring",
    damping: 15,
    stiffness: 400,
  } satisfies Transition,

  /** Gentle spring for subtle movements */
  springGentle: {
    type: "spring",
    damping: 30,
    stiffness: 200,
  } satisfies Transition,

  /** Page transition timing */
  page: {
    duration: duration.page,
    ease: easing.smooth,
  } satisfies Transition,
} as const;

// =============================================================================
// Fade Variants
// =============================================================================

/**
 * Simple fade in/out.
 * Use for subtle appearances where movement would be distracting.
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: duration.fast, ease: "easeOut" },
  },
  exit: { opacity: 0, transition: { duration: duration.fast, ease: "easeIn" } },
};

/**
 * Fade in while rising up.
 * The most common entrance animation - feels natural and inviting.
 */
export const fadeInUp: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] // smooth easeOut curve
    }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

/**
 * Fade in while dropping down.
 * Good for dropdowns, tooltips, notifications from top.
 */
export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: easing.smooth },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: duration.fast, ease: easing.accelerate },
  },
};

/**
 * Fade in from the left.
 * Good for sidebar items, list entries, left-anchored content.
 */
export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.normal, ease: easing.smooth },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: duration.fast, ease: easing.accelerate },
  },
};

/**
 * Fade in from the right.
 * Good for action buttons, right-anchored content, notifications.
 */
export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.normal, ease: easing.smooth },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: duration.fast, ease: easing.accelerate },
  },
};

// =============================================================================
// Scale Variants
// =============================================================================

/**
 * Scale up from slightly smaller.
 * Great for modals, dialogs, popovers - feels like content is "arriving".
 */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.fast, ease: easing.smooth },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: duration.fast, ease: easing.accelerate },
  },
};

/**
 * Scale up with slight upward movement.
 * Combines scale and position for extra polish.
 */
export const scaleInUp: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: duration.normal, ease: easing.smooth },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: duration.fast, ease: easing.accelerate },
  },
};

// =============================================================================
// Slide Variants
// =============================================================================

/**
 * Slide in from the right edge.
 * Perfect for side sheets, drawers, slide-over panels.
 */
export const slideInRight: Variants = {
  initial: { x: "100%" },
  animate: {
    x: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: {
    x: "100%",
    transition: { duration: duration.fast, ease: easing.accelerate },
  },
};

/**
 * Slide in from the left edge.
 * Good for sidebars, navigation drawers.
 */
export const slideInLeft: Variants = {
  initial: { x: "-100%" },
  animate: {
    x: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: {
    x: "-100%",
    transition: { duration: duration.fast, ease: easing.accelerate },
  },
};

/**
 * Slide in from the bottom.
 * Perfect for bottom sheets, mobile modals, action sheets.
 */
export const slideInUp: Variants = {
  initial: { y: "100%" },
  animate: {
    y: 0,
    transition: { type: "spring", damping: 28, stiffness: 300 },
  },
  exit: {
    y: "100%",
    transition: { duration: duration.fast, ease: easing.accelerate },
  },
};

/**
 * Slide in from the top.
 * Good for notification banners, alert bars.
 */
export const slideInDown: Variants = {
  initial: { y: "-100%" },
  animate: {
    y: 0,
    transition: { type: "spring", damping: 28, stiffness: 300 },
  },
  exit: {
    y: "-100%",
    transition: { duration: duration.fast, ease: easing.accelerate },
  },
};

// =============================================================================
// Stagger Variants
// =============================================================================

/**
 * Container that staggers its children's animations.
 * Wrap list items, grid items, or sequential content.
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

/**
 * Faster stagger for quick lists.
 */
export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
};

/**
 * Slower stagger for dramatic reveals.
 */
export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

/**
 * Item to use inside a stagger container.
 * Fades and rises into place.
 */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: easing.smooth },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: duration.fast, ease: easing.accelerate },
  },
};

/**
 * Stagger item with scale for grid layouts.
 */
export const staggerItemScale: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: duration.normal, ease: easing.smooth },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: duration.fast, ease: easing.accelerate },
  },
};

/**
 * Horizontal stagger item (fades in from left).
 */
export const staggerItemHorizontal: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.normal, ease: easing.smooth },
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: { duration: duration.fast, ease: easing.accelerate },
  },
};

// =============================================================================
// Interactive Variants (Hover/Tap)
// =============================================================================

/**
 * Lift effect on hover - cards float up slightly.
 * Creates depth and indicates interactivity.
 */
export const hoverLift: TargetAndTransition = {
  y: -4,
  transition: { duration: duration.fast, ease: easing.smooth },
};

export const tapLift: TargetAndTransition = {
  y: 0,
  scale: 0.98,
  transition: { duration: duration.fast, ease: easing.snappy },
};

/**
 * Subtle scale on hover.
 * Good for buttons, icons, interactive elements.
 */
export const hoverScale: TargetAndTransition = {
  scale: 1.02,
  transition: { duration: duration.fast, ease: easing.smooth },
};

export const tapScale: TargetAndTransition = {
  scale: 0.98,
  transition: { duration: duration.fast, ease: easing.snappy },
};

/**
 * More pronounced scale for larger targets.
 */
export const hoverScaleLarge: TargetAndTransition = {
  scale: 1.04,
  transition: { duration: duration.fast, ease: easing.smooth },
};

/**
 * Glow effect using box shadow (warm copper accent).
 */
export const hoverGlow: TargetAndTransition = {
  boxShadow: "0 0 20px rgba(184, 115, 51, 0.3)",
  transition: { duration: duration.fast, ease: easing.smooth },
};

// Legacy hover exports for backwards compatibility
export const cardHover = {
  whileHover: {
    y: -4,
    boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.1)",
  },
  transition: TIMING.microInteraction,
};

export const buttonPress = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 },
};

// =============================================================================
// Special Animations
// =============================================================================

/**
 * Pulsing glow animation for attention states.
 * Apply to elements that need user attention (warm copper color).
 */
export const pulseGlow: Variants = {
  initial: {
    boxShadow: "0 0 0 0 rgba(184, 115, 51, 0)",
  },
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(184, 115, 51, 0.4)",
      "0 0 0 10px rgba(184, 115, 51, 0)",
      "0 0 0 0 rgba(184, 115, 51, 0)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Subtle floating animation.
 * Good for hero elements, featured content.
 */
export const float: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Shimmer/loading animation.
 * Use for skeleton loaders or loading states.
 */
export const shimmer: Variants = {
  initial: { x: "-100%" },
  animate: {
    x: "100%",
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

/**
 * Spin animation.
 * For loading spinners.
 */
export const spin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// =============================================================================
// Number/Counter Animation Config
// =============================================================================

/**
 * Spring config for animated number counting.
 * Use with framer-motion's useSpring hook.
 *
 * @example
 * const springValue = useSpring(0, numberCount.spring);
 * useEffect(() => { springValue.set(targetNumber); }, [targetNumber]);
 */
export const numberCount = {
  /** Spring configuration for smooth counting */
  spring: {
    damping: 30,
    stiffness: 100,
  },
  /** Faster spring for quick updates */
  springFast: {
    damping: 20,
    stiffness: 200,
  },
  /** Slower spring for dramatic reveals */
  springSlow: {
    damping: 40,
    stiffness: 50,
  },
} as const;

// =============================================================================
// Page Transition Variants
// =============================================================================

/**
 * Full page transition - fade with subtle movement.
 * Use for route changes.
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.page, ease: easing.smooth },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: duration.normal, ease: easing.accelerate },
  },
};

/**
 * Section reveal for scroll-triggered animations.
 */
export const sectionReveal: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: easing.smooth },
  },
};

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Creates a delayed version of any variant.
 * Useful for orchestrating complex sequences.
 */
export function withDelay(variants: Variants, delay: number): Variants {
  return {
    ...variants,
    animate: {
      ...(typeof variants.animate === "object" ? variants.animate : {}),
      transition: {
        ...((typeof variants.animate === "object" &&
          variants.animate?.transition) ||
          {}),
        delay,
      },
    },
  };
}

/**
 * Creates stagger children config with custom timing.
 */
export function createStagger(
  staggerChildren: number = 0.05,
  delayChildren: number = 0.1
): Variants {
  return {
    initial: {},
    animate: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
    exit: {
      transition: {
        staggerChildren: staggerChildren / 2,
        staggerDirection: -1,
      },
    },
  };
}
