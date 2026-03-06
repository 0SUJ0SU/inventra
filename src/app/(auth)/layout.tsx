import type { Metadata } from "next";
import { AuthBrandingPanel } from "@/components/auth/auth-branding-panel";
import { Navbar } from "@/components/landing/navbar";

export const metadata: Metadata = {
  title: "Inventra — Access Portal",
  description: "Sign in or create an account to access the Inventra platform.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-cream-primary">
      <div className="lg:hidden">
        <Navbar />
      </div>

      <AuthBrandingPanel />

      <div className="relative lg:ml-[45%] min-h-screen bg-cream-primary">
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-blue-primary opacity-15" />

        {/* pt-24 on mobile accounts for the fixed navbar height */}
        <div className="relative z-10 flex min-h-screen items-center px-6 pt-24 pb-16 sm:px-10 lg:pt-16 lg:px-16 xl:px-24">
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
