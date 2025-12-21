import type React from "react"
import type { Metadata, Viewport } from "next"
import {
  Inter,
  Space_Grotesk,
  Geist_Mono,
  Roboto,
  Montserrat,
  Open_Sans,
  Lato,
  Poppins
} from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import "../globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })
const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-roboto" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" })
const lato = Lato({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-lato" })
const poppins = Poppins({ weight: ["400", "600", "700"], subsets: ["latin"], variable: "--font-poppins" })

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://sorteopro.com'

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
    keywords: ["sorteo", "giveaway", "influencer", "streamer", "creator", "viral", "concurso", "premios"],
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sorteo Pro',
    applicationCategory: 'MultimediaApplication',
    applicationSubCategory: 'Social Media Tool',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    description: 'The ultimate tool for viral giveaways.',
    author: {
      '@type': 'Organization',
      name: 'Sorteo Pro',
      url: baseUrl
    },
    inLanguage: locale,
    screenshot: `${baseUrl}/og-image.jpg`,
    featureList: [
      "Random Winner Picker",
      "Wheel of Names",
      "Instagram Giveaway Tool",
      "Instant Verification",
      "Provably Fair RNG"
    ]
  }

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} ${roboto.variable} ${montserrat.variable} ${openSans.variable} ${lato.variable} ${poppins.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />

        {/* Manual GTM Implementation */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID || 'GTM-TVTR2LQC'}');
        `}
        </Script>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID || 'GTM-TVTR2LQC'}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
      </body>
    </html>
  )
}
