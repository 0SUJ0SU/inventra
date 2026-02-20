"use client";
import { Suspense, lazy, useRef, useState, useEffect } from "react";
import { DitherImage } from "./dither-image";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
);

interface DitherEffectProps {
  src: string;
  alt?: string;
  className?: string;
  darkColor?: string;
  lightColor?: string;
  dotSize?: number;
  halftoneStrength?: number;
  brushSize?: number;
  trailFade?: number;
  hoverReveal?: boolean;
  waveColor?: string;
  waveSpeed?: number;
  waveOpacity?: number;
  waveShape?: "warp" | "wave" | "none";
  style?: React.CSSProperties;
}

export function DitherEffect({
  src,
  alt = "",
  className = "",
  darkColor = "#1925AA",
  lightColor = "#B8B0E0",
  dotSize = 5.0,
  halftoneStrength = 0.7,
  brushSize = 140,
  trailFade = 0.97,
  hoverReveal = true,
  waveColor = "#1925AA",
  waveSpeed = 0.3,
  waveOpacity = 0.35,
  waveShape = "warp",
  style,
}: DitherEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "200px" }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className} style={style}>
      <div className="relative w-full h-full overflow-hidden">
        {/* Layer 1: Duotone halftone image with trail reveal (bottom) */}
        <DitherImage
          src={src}
          alt={alt}
          darkColor={darkColor}
          lightColor={lightColor}
          dotSize={dotSize}
          halftoneStrength={halftoneStrength}
          brushSize={brushSize}
          trailFade={trailFade}
          hoverReveal={hoverReveal}
          className="absolute inset-0"
          paused={!isVisible}
        />
        {/* Layer 2: Animated dithering wave overlay (top, blended) */}
        <Suspense fallback={null}>
          <div
            className="absolute inset-0 z-[1] pointer-events-none mix-blend-multiply"
            style={{ opacity: waveOpacity }}
          >
            <Dithering
              colorBack="#00000000"
              colorFront={waveColor}
              shape={waveShape}
              type="8x8"
              speed={isVisible ? waveSpeed : 0}
              className="size-full"
              minPixelRatio={1}
            />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
