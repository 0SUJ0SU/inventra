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
      {children}
    </div>
  );
}
