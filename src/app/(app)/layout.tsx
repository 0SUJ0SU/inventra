import type { Metadata } from "next"
import { Sidebar } from "@/components/app/sidebar"
import { AppHeader } from "@/components/app/app-header"
import { AppContentWrapper } from "@/components/app/app-content-wrapper"

export const metadata: Metadata = {
  title: {
    template: "%s | Inventra",
    default: "Dashboard | Inventra",
  },
  description: "Inventra inventory management system.",
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-cream-primary">
      <Sidebar />

      <div className="lg:hidden">
        <AppHeader />
        <main className="px-4 py-6">{children}</main>
      </div>

      <div className="hidden lg:block">
        <AppContentWrapper>
          <AppHeader />
          <main className="px-6 py-8">{children}</main>
        </AppContentWrapper>
      </div>
    </div>
  )
}
