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
