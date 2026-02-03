import type { Metadata } from "next"
import { fontVariables, plusJakartaSans } from "@/styles/fonts"
import { ThemeProvider } from "@/components/shared/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Inventra | Smart Inventory & Business Management",
  description:
    "A modern inventory and business management system designed for tech/gadget retail businesses. Powerful inventory tracking, point-of-sale, and comprehensive analytics.",
  keywords: [
    "inventory management",
    "business management",
    "POS",
    "point of sale",
    "retail",
    "tech retail",
    "gadget store",
    "stock management",
    "serial tracking",
    "warranty management",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontVariables} ${plusJakartaSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
