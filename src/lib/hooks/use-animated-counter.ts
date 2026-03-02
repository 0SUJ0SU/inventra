// src/lib/hooks/use-animated-counter.ts
"use client";

import { useEffect, useRef, useState } from "react";

interface UseAnimatedCounterOptions {
  end: number;
  duration?: number; // ms
  delay?: number; // ms
  startOnMount?: boolean;
}

export function useAnimatedCounter({
  end,
  duration = 1800,
  delay = 0,
  startOnMount = true,
}: UseAnimatedCounterOptions) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!startOnMount) return;

    const timeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic for a satisfying deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * end));

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, delay, startOnMount]);

  return value;
}
