import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sorteopro.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Sorteo Pro | Sorteos Premium para Influencers",
  description:
    "La herramienta definitiva para crear sorteos virales. Diseñada para creadores de contenido e influencers que quieren impresionar a su audiencia.",
  keywords: ["sorteo", "giveaway", "influencer", "streamer", "creator", "viral", "concurso", "premios"],
  authors: [{ name: "Sorteo Pro" }],
  alternates: {
    canonical: '/',
    languages: {
      'es-ES': '/es-ES',
      'es-MX': '/es-MX',
    },
  },
  openGraph: {
    title: "Sorteo Pro | Sorteos Premium para Influencers",
    description: "Crea sorteos épicos con animaciones cinematográficas",
    url: baseUrl,
    siteName: "Sorteo Pro",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: '/og-image.jpg', // Ensure this image exists or is generated
        width: 1200,
        height: 630,
        alt: 'Sorteo Pro Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sorteo Pro | Sorteos Premium para Influencers",
    description: "Crea sorteos épicos con animaciones cinematográficas",
  },
  generator: 'v0.app',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sorteo Pro',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    description: 'La herramienta definitiva para crear sorteos virales.',
    author: {
      '@type': 'Organization',
      name: 'Sorteo Pro',
    },
  }

  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
