"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/landing/loading-screen";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { Services } from "@/components/landing/services";

export default function LandingPage() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <>
      <LoadingScreen onComplete={() => setLoadingComplete(true)} />
      <Navbar />
      <Hero />

      <About />

      <Services />
    </>
  );
}
