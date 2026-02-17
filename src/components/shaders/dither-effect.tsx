"use client";

import { Suspense, lazy } from "react";
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
  /** Dithering wave color. Default matches blue-primary */
  waveColor?: string;
  /** Dithering wave speed. Default 0.3 */
  waveSpeed?: number;
  /** Dithering wave opacity. Default 0.35 */
  waveOpacity?: number;
  /** Dithering shape. Default "warp" */
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
  return (
    <div className={className} style={style}>
      <div className="relative w-full h-full overflow-hidden">
        {/* Layer 1: Animated dithering wave (bottom) */}
        <Suspense fallback={null}>
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ opacity: waveOpacity }}
          >
            <Dithering
              colorBack="#00000000"
              colorFront={waveColor}
              shape={waveShape}
              type="8x8"
              speed={waveSpeed}
              className="size-full"
              minPixelRatio={1}
            />
          </div>
        </Suspense>

        {/* Layer 2: Duotone halftone image with trail reveal (top) */}
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
          className="absolute inset-0 z-1"
        />
      </div>
    </div>
  );
}
