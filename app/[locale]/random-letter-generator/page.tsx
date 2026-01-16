<<<<<<< HEAD
import { MainApp } from "@/components/sorteo/main-app"
import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "LetterGeoPage" })

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
        canonical: `https://sorteo-app-generator.vercel.app/${locale}/random-letter-generator`,
        languages: {
            'en': 'https://sorteo-app-generator.vercel.app/en/random-letter-generator',
            'es': 'https://sorteo-app-generator.vercel.app/es/random-letter-generator',
            'pt': 'https://sorteo-app-generator.vercel.app/pt/random-letter-generator',
        }
    },
    openGraph: {
        title: t("title"),
        description: t("description"),
        type: "website",
        images: [
            {
                url: `/api/og?type=letter`,
                width: 1200,
                height: 630,
                alt: t("title"),
            },
        ],
    },
  }
}

export default function LetterGeneratorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Sorteo Pro Random Letter Generator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web, iOS, Android",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "A free online random letter generator. Pick a random letter from the alphabet instantly."
    }

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://sorteo-app-generator.vercel.app"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Random Letter Generator",
            "item": "https://sorteo-app-generator.vercel.app/random-letter-generator"
          }
        ]
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <MainApp initialStyle="roulette" seoMode="letter" />
        </>
    )
}

// Force static rendering for GEO speed
export const dynamic = 'force-static'
=======
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { MainApp } from "@/components/sorteo/main-app";

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'LetterGeneratorPage' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteopro.com';

  return {
    title: t('title'),
    description: t('description'),
    keywords: ["random letter generator", "letter picker", "alphabet spinner", "random letter wheel", "scattergories generator", "stop game letter"],
    alternates: {
        canonical: `/${locale}/random-letter-generator`
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}/random-letter-generator`,
      type: "website",
      siteName: "Sorteo Pro",
      locale: locale === 'es' ? 'es_ES' : locale === 'pt' ? 'pt_PT' : 'en_US',
      images: [
        {
          url: `${baseUrl}/api/og?type=wheel`, // Reusing wheel image as it's similar
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`${baseUrl}/api/og?type=wheel`],
    },
  };
}

export default async function LetterGeneratorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'LetterGeneratorPage' });
  const tGeo = await getTranslations({ locale, namespace: 'LetterGeo' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteopro.com';

  // Schema Injection for SEO
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Random Letter Generator by Sorteo Pro',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: t('description'),
    featureList: [
      tGeo('feature_1_title'),
      tGeo('feature_2_title'),
      tGeo('feature_3_title'),
      "Secure RNG"
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1200',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Sorteo Pro",
      "item": `${baseUrl}/${locale}`
    },{
      "@type": "ListItem",
      "position": 2,
      "name": t('h1'),
      "item": `${baseUrl}/${locale}/random-letter-generator`
    }]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareAppSchema, breadcrumbSchema]) }}
      />
      <MainApp initialStyle="roulette" seoMode="letter" />
    </>
  );
}
>>>>>>> main
