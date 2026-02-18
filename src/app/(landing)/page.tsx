"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/landing/loading-screen";
import { Navbar } from "@/components/landing/navbar";

export default function LandingPage() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <>
      <LoadingScreen onComplete={() => setLoadingComplete(true)} />

      <Navbar />

      {/* Hero placeholder */}
      <section className="relative min-h-screen flex flex-col justify-end px-4 pb-16 bg-blue-primary">
        <h1
          className="font-sans font-black leading-[0.85] tracking-tight text-cream-primary"
          style={{ fontSize: "clamp(80px, 15vw, 200px)" }}
        >
          Inventra
        </h1>
        <p className="font-mono text-xs tracking-[0.3em] uppercase mt-6 max-w-md text-cream-primary opacity-60">
          Answering all of your inventory management needs.
        </p>
      </section>

      {/* Cream test section */}
      <section className="min-h-screen px-4 py-24 bg-cream-primary">
        <div className="flex justify-between">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-blue-primary">
            SERVICES
          </span>
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-blue-primary">
            [INV.1]
          </span>
        </div>
        <div className="mt-24 flex items-end gap-8">
          <h2
            className="font-sans font-black leading-[0.85] tracking-tight text-blue-primary"
            style={{ fontSize: "clamp(60px, 12vw, 160px)" }}
          >
            Our
          </h2>
          <div className="h-32 w-px hidden lg:block bg-blue-primary opacity-20" />
          <h2
            className="font-sans font-black leading-[0.85] tracking-tight text-blue-primary"
            style={{ fontSize: "clamp(60px, 12vw, 160px)" }}
          >
            Services
          </h2>
        </div>
      </section>

      <section className="min-h-[50vh] px-4 py-24 bg-blue-primary">
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-cream-primary opacity-40">
          MORE SECTIONS COMING IN M4+
        </span>
      </section>
    </>
  );
}
