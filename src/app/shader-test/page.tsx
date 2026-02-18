import { DitherEffect } from "@/components/shaders";

export default function TestPage() {
  return (
    <main>
      {/* ─── Hero-style: full viewport ─── */}
      <section className="relative h-screen w-full overflow-hidden">
        <DitherEffect
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
          alt="Modern office architecture"
          className="absolute inset-0"
          darkColor="#1925AA"
          lightColor="#B8B0E0"
          dotSize={5}
          halftoneStrength={0.7}
          brushSize={280}
          trailFade={0.97}
          waveColor="#1925AA"
          waveSpeed={0.3}
          waveOpacity={0.35}
          waveShape="warp"
        />
        <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center gap-6">
          <h1
            className="text-center font-sans text-[clamp(48px,10vw,150px)] font-black leading-[0.9] tracking-[-0.02em]"
            style={{ color: "var(--cream-primary)" }}
          >
            Inventra
          </h1>
          <p
            className="font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: "var(--cream-dark)" }}
          >
            Duotone + Halftone + Dithering Wave
          </p>
        </div>
      </section>

      {/* ─── Contained image ─── */}
      <section
        className="relative w-full px-8 py-24"
        style={{ backgroundColor: "var(--cream-primary)" }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-baseline justify-between">
            <p
              className="font-mono text-xs uppercase tracking-[0.3em]"
              style={{ color: "var(--blue-primary)" }}
            >
              Dither Effect
            </p>
            <p className="section-marker" style={{ color: "var(--blue-primary)" }}>
              [INV.2]
            </p>
          </div>

          <div
            className="w-full overflow-hidden"
            style={{
              borderTop: "1px solid var(--blue-primary)",
              borderBottom: "1px solid var(--blue-primary)",
              height: "500px",
            }}
          >
            <DitherEffect
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80"
              alt="Tech workspace"
              className="h-full w-full"
              dotSize={5}
              halftoneStrength={0.7}
              brushSize={210}
              trailFade={0.96}
              waveColor="#1925AA"
              waveSpeed={0.2}
              waveOpacity={0.3}
              waveShape="warp"
            />
          </div>

          <p
            className="mt-4 font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: "var(--blue-primary)", opacity: 0.6 }}
          >
            Move cursor to reveal original color
          </p>
        </div>
      </section>
    </main>
  );
}
