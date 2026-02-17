export default function Home() {
  return (
    <main className="min-h-screen bg-cream-primary text-blue-primary">
      {/* Blueprint grid lines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute left-1/3 top-0 bottom-0 w-px line-blueprint" />
        <div className="absolute left-2/3 top-0 bottom-0 w-px line-blueprint" />
        <div className="absolute top-1/3 left-0 right-0 h-px line-blueprint" />
        <div className="absolute top-2/3 left-0 right-0 h-px line-blueprint" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 py-16">
        {/* Section label */}
        <div className="flex justify-between items-center mb-16">
          <span className="label-mono text-blue-primary">SYSTEM CHECK</span>
          <span className="section-marker text-blue-primary">[INV.0]</span>
        </div>

        {/* Massive headline — Space Grotesk */}
        <h1 className="headline-massive text-[clamp(80px,12vw,180px)] text-blue-primary mb-12">
          Inventra
        </h1>

        {/* Mono body — JetBrains Mono */}
        <p className="font-mono text-sm uppercase tracking-[0.12em] text-blue-primary/70 max-w-md mb-16">
          INVENTORY + EXTRA. A MODERN BUSINESS MANAGEMENT SYSTEM FOR TECH RETAIL. BLUEPRINT AESTHETIC CONFIRMED.
        </p>

        {/* Color swatches */}
        <div className="flex gap-4 mb-16">
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 bg-blue-primary" />
            <span className="font-mono text-xs uppercase tracking-wider">#1400FF</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 bg-blue-dark" />
            <span className="font-mono text-xs uppercase tracking-wider">#0F00CC</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 bg-blue-light" />
            <span className="font-mono text-xs uppercase tracking-wider">#3D2FFF</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 bg-cream-primary border border-blue-primary/20" />
            <span className="font-mono text-xs uppercase tracking-wider">#E8E4DD</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 bg-cream-dark" />
            <span className="font-mono text-xs uppercase tracking-wider">#D9D4CC</span>
          </div>
        </div>

        {/* Blue section test */}
        <div className="bg-blue-primary text-cream-primary p-12 -mx-8">
          <div className="flex justify-between items-center mb-8">
            <span className="label-mono text-cream-primary/60">BLUE SECTION TEST</span>
            <span className="section-marker text-cream-primary/60">[INV.1]</span>
          </div>
          <h2 className="headline-massive text-[clamp(48px,8vw,120px)] text-cream-primary mb-6">
            Blueprint
          </h2>
          <p className="font-mono text-sm uppercase tracking-[0.12em] text-cream-primary/70 max-w-lg">
            CREAM TEXT ON BLUE. THIN LINES CREATING STRUCTURE. HALFTONE IMAGES CREATING TEXTURE. ANIMATED GRAIN CREATING LIFE.
          </p>
        </div>

        {/* Typography scale */}
        <div className="py-16">
          <span className="label-mono text-blue-primary/60 block mb-8">TYPOGRAPHY SCALE</span>
          <div className="space-y-4">
            <p className="font-sans text-7xl font-bold tracking-tight text-blue-primary">Space Grotesk Bold</p>
            <p className="font-sans text-4xl font-semibold text-blue-primary">Space Grotesk Semibold</p>
            <p className="font-sans text-xl text-blue-primary">Space Grotesk Regular</p>
            <p className="font-mono text-sm uppercase tracking-[0.12em] text-blue-primary">JetBrains Mono — Labels & Body</p>
            <p className="font-mono text-4xl font-bold text-blue-primary">01 / 02 / 03</p>
          </div>
        </div>
      </div>
    </main>
  );
}
