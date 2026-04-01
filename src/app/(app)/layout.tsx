import type { Metadata } from "next"

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
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-[240px] bg-blue-primary z-40">
        <div className="absolute right-0 top-0 bottom-0 w-px bg-cream-primary/15" />
        <div className="flex items-center h-16 px-4 border-b border-cream-primary/15">
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-cream-primary">
            Inventra
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="label-mono text-cream-primary/30">[Sidebar]</p>
        </div>
      </aside>

      <div className="lg:pl-[240px]">
        <header className="sticky top-0 z-30 bg-cream-primary border-b border-blue-primary/10">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <span className="label-mono text-blue-primary/40">
              [Header]
            </span>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
