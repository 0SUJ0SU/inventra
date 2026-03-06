import type { Metadata } from "next";
import { Sidebar } from "@/components/app/sidebar";
import { AppHeader } from "@/components/app/app-header";
import { AppContentClient } from "@/components/app/app-content-client";
import { AuthGuard } from "@/components/app/auth-guard";

export const metadata: Metadata = {
  title: {
    template: "%s | Inventra",
    default: "Dashboard | Inventra",
  },
  description: "Inventra inventory management system.",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="relative min-h-screen bg-cream-primary">
        <Sidebar />

        <AppContentClient>
          <AppHeader />
          <main className="px-4 py-6 lg:px-6 lg:py-8">
            {children}
          </main>
        </AppContentClient>
      </div>
    </AuthGuard>
  );
}
