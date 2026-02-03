import { Fraunces, Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google"

// Display/Headlines - italic for hero sections
export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
})

// Geometric sans-serif for bold headlines
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
})

// Warm, readable body text (Satoshi alternative from Google Fonts)
export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
})

// Monospace for data tables and code
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
})

// Combined font variables for className
export const fontVariables = `${fraunces.variable} ${spaceGrotesk.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`
