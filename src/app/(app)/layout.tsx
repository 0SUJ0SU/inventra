// src/app/(app)/layout.tsx
import type { Metadata } from "next";
import { Sidebar } from "@/components/app/sidebar";
import { AppHeader } from "@/components/app/app-header";
import { AppContentClient } from "@/components/app/app-content-client";

export const metadata: Metadata = {
  title: "Inventra — Dashboard",
  description: "Inventra inventory management system.",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-cream-primary">
      {/* ─── Sidebar ─── */}
      <Sidebar />

      {/* ─── Main content area ─── */}
      <AppContentClient>
        <AppHeader />
        <main className="px-4 py-6 lg:px-6 lg:py-8">
          {children}
        </main>
      </AppContentClient>
    </div>
  );
}
