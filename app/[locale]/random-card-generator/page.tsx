import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { MainApp } from "@/components/sorteo/main-app";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params;
  const { template_title, template_color } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'CardPage' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteo-app-generator.vercel.app';

  // Viralis: Dynamic Metadata for Custom Giveaways
  const customTitle = typeof template_title === 'string' ? template_title : undefined;
  const customColor = typeof template_color === 'string' ? template_color : undefined;

  const displayTitle = customTitle ? `${customTitle} | Sorteo Pro` : t('title');
  const displayDescription = t('description');

  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  // For now, fallback to generic as 'card' might not be in og API yet, or use generic
  // But let's set type=card if supported or fallback to generic text
  ogImageUrl.searchParams.set('type', 'generic');
  if (customTitle) ogImageUrl.searchParams.set('title', customTitle);
  if (customColor) ogImageUrl.searchParams.set('color', customColor);

  // Construct Canonical/Share URL for OG
  const shareUrl = new URL(`${baseUrl}/${locale}/random-card-generator`);
  if (customTitle) shareUrl.searchParams.set('template_title', customTitle);
  if (customColor) shareUrl.searchParams.set('template_color', customColor);

  return {
    title: displayTitle,
    description: displayDescription,
    keywords: ["random card generator", "pick a card", "draw a card", "playing cards online", "card generator", "random card", "spanish deck", "poker cards"],
    alternates: {
      canonical: `/${locale}/random-card-generator`
    },
    openGraph: {
      title: displayTitle,
      description: displayDescription,
      url: shareUrl.toString(),
      type: "website",
      siteName: "Sorteo Pro",
      locale: locale === 'es' ? 'es_ES' : locale === 'pt' ? 'pt_PT' : 'en_US',
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: displayTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: displayTitle,
      description: displayDescription,
      images: [ogImageUrl.toString()],
    },
  };
}

export default async function CardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'CardPage' });
  const tGeo = await getTranslations({ locale, namespace: 'CardGeo' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteo-app-generator.vercel.app';

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Random Card Generator by Sorteo Pro',
    applicationCategory: 'UtilityApplication',
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
      tGeo('feature_4_title')
    ]
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
      "name": "Random Card Generator",
      "item": `${baseUrl}/${locale}/random-card-generator`
    }]
  };

  // Helper to safely escape JSON-LD
  const safeJsonLd = (data: unknown) => {
    return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd([softwareAppSchema, breadcrumbSchema]) }}
      />
      {/*
          initialStyle="cards" - Specific visualization for cards
          seoMode="card" - Triggers CardGeo and logic
      */}
      <MainApp initialStyle="cards" seoMode="card" />
    </>
  );
}
