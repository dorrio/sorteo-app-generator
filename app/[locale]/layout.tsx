import { getBaseUrl } from "@/lib/config"
import type React from "react"
import { Suspense } from "react"
import type { Metadata, Viewport } from "next"
import {
  Inter,
  Space_Grotesk,
  Geist_Mono
} from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleTagManager } from "@next/third-parties/google"
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { safeJsonLdStringify } from '@/lib/utils';
import { routing } from '../../i18n/routing';
import { ErrorBoundaryWrapper } from '@/components/ui/error-boundary-wrapper';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

const baseUrl = getBaseUrl()
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL(baseUrl),
    title: t('title'),
    description: t('description'),
    icons: {
      icon: '/favicon.ico',
    },
    keywords: ["sorteo", "giveaway", "influencer", "streamer", "creator", "viral", "concurso", "premios", "instagram comment picker", "instagram giveaway", "sorteo instagram gratis", "wheel of names"],
    authors: [{ name: "Sorteo Pro" }],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'es': '/es',
        'en': '/en',
        'pt': '/pt',
      },
    },
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
      url: `${baseUrl}/${locale}`,
      siteName: "Sorteo Pro",
      locale: locale === 'es' ? 'es_ES' : locale === 'pt' ? 'pt_PT' : locale === 'pt' ? 'pt_BR' : 'en_US',
      type: "website",
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Sorteo Pro Preview',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('og_description'),
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
    verification: {
      google: "86JS6H68GGWUr6d4QSWmBzWg1AWU3brNeB52vLZpiFA",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#D4AF37",
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'GlobalSchema' });
  const tHome = await getTranslations({ locale, namespace: 'HomePage' });

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Sorteo Pro',
      applicationCategory: t('applicationCategory'),
      applicationSubCategory: t('applicationSubCategory'),
      operatingSystem: 'Web, iOS, Android',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
      },
      description: t('description'),
      author: {
        '@type': 'Organization',
        name: 'Sorteo Pro',
        url: baseUrl
      },
      inLanguage: locale,
      screenshot: `${baseUrl}/og-image.jpg`,
      featureList: [
        t('feature_1'),
        t('feature_2'),
        t('feature_3'),
        t('feature_4'),
        t('feature_5')
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '12500',
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Sorteo Pro',
      url: baseUrl,
      logo: `${baseUrl}/favicon.ico`,
      sameAs: [
        'https://github.com/sorteopro',
        'https://twitter.com/sorteopro'
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Sorteo Pro',
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    }
  ]

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} font-sans antialiased`}>
        <a href="#sorteo-section" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:p-4 focus:bg-background focus:text-foreground focus:rounded-lg focus:shadow-xl focus:border focus:border-primary">
          {tHome('skip_to_content')}
        </a>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted schema data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <ErrorBoundaryWrapper>
              {children}
            </ErrorBoundaryWrapper>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />

        {process.env.NEXT_PUBLIC_GTM_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        )}
      </body>
    </html>
  )
}
