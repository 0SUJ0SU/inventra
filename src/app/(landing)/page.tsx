import { LoadingScreen } from "@/components/landing/loading-screen";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { Services } from "@/components/landing/services";
import { Process } from "@/components/landing/process";
import { Projects } from "@/components/landing/projects";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import Footer from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <Hero />

      <About />

      <Services />

      <Process />

      <Projects />

      <Testimonials />

      <FAQ />

      <Footer />
    </>
  );
}
