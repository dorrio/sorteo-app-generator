import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Sorteo Pro | Sorteos Premium para Influencers",
  description:
    "La herramienta definitiva para crear sorteos virales. Diseñada para creadores de contenido e influencers que quieren impresionar a su audiencia.",
  keywords: ["sorteo", "giveaway", "influencer", "streamer", "creator", "viral"],
  authors: [{ name: "Sorteo Pro" }],
  openGraph: {
    title: "Sorteo Pro | Sorteos Premium para Influencers",
    description: "Crea sorteos épicos con animaciones cinematográficas",
    type: "website",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#D4AF37",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
