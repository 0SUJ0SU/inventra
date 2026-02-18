import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventra — Inventory + Extra",
  description:
    "Modern inventory and business management system for tech retail businesses.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-blue-primary">
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute top-0 bottom-0 w-px left-[33.333%] bg-cream-primary opacity-6" />
        <div className="absolute top-0 bottom-0 w-px left-[50%] bg-cream-primary opacity-6" />
        <div className="absolute top-0 bottom-0 w-px left-[66.666%] bg-cream-primary opacity-6" />
      </div>
      {children}
    </div>
  );
}
