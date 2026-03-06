"use client";

import { useEffect, useRef, useState } from "react";

export function useAnimatedCounter({
  end,
  duration = 1800,
  delay = 0,
  startOnMount = true,
}: {
  end: number;
  duration?: number;
  delay?: number;
  startOnMount?: boolean;
}) {
  const [currentCount, setCurrentCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!startOnMount) return;

    startTimeRef.current = null;

    const timeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic — linear progress looks jarring on counters
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrentCount(Math.round(eased * end));

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

  return currentCount;
}
