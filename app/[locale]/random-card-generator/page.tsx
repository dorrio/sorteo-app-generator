import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { MainApp } from "@/components/sorteo/main-app";

/**
 * Enumerates all supported locales for static route generation.
 *
 * @returns An array of objects with a `locale` property for each supported locale.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/**
 * Generate locale-aware SEO metadata for the Random Card Generator page, including Open Graph and Twitter data.
 *
 * @param props - An object with `params` and `searchParams`.
 * @param props.params - Resolves to an object containing `locale`, used to select translations and locale-specific values.
 * @param props.searchParams - Resolves to an object that may contain `template_title` and `template_color` to override the page title and OG image color.
 * @returns An object with SEO metadata:
 * - `title`: page title (uses `template_title` when provided)
 * - `description`: page description from translations
 * - `keywords`: array of keywords
 * - `alternates.canonical`: canonical path for the page
 * - `openGraph`: object with `title`, `description`, `url`, `type`, `siteName`, `locale`, and `images` (including a generated OG image URL)
 * - `twitter`: object with `card`, `title`, `description`, and `images`
 */
export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params;
  const { template_title, template_color } = await searchParams;
  const cardT = await getTranslations({ locale, namespace: 'CardPage' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteopro.com';

  // Viralis: Dynamic Metadata for Custom Giveaways
  const customTitle = typeof template_title === 'string' ? template_title : undefined;
  const customColor = typeof template_color === 'string' ? template_color : undefined;

  const displayTitle = customTitle ? `${customTitle} | Sorteo Pro` : cardT('title');
  const displayDescription = cardT('description');

  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  ogImageUrl.searchParams.set('type', 'card');
  if (customTitle) ogImageUrl.searchParams.set('title', customTitle);
  else ogImageUrl.searchParams.set('title', cardT('title'));

  if (customColor) ogImageUrl.searchParams.set('color', customColor);
  else ogImageUrl.searchParams.set('color', '#dc2626'); // Red for cards

  // Construct Canonical/Share URL for OG
  const shareUrl = new URL(`${baseUrl}/${locale}/random-card-generator`);
  if (customTitle) shareUrl.searchParams.set('template_title', customTitle);
  if (customColor) shareUrl.searchParams.set('template_color', customColor);

  return {
    title: displayTitle,
    description: displayDescription,
    keywords: ["random card generator", "draw a card", "pick a card", "playing cards", "deck of cards", "random playing card"],
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

/**
 * Render the locale-aware Random Card Generator page, embedding JSON-LD SEO data and the main application UI.
 *
 * @param params - Promise resolving to an object with a `locale` string used to load translations and build locale-specific URLs
 * @returns A React fragment containing an `application/ld+json` script with SoftwareApplication and BreadcrumbList schemas and the `MainApp` component configured for the card generator
 */
export default async function CardGeneratorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const cardT = await getTranslations({ locale, namespace: 'CardPage' });
  const cardGeoT = await getTranslations({ locale, namespace: 'CardGeo' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteopro.com';

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
    description: cardT('description'),
    featureList: [
      cardGeoT('feature_1_title'),
      cardGeoT('feature_2_title'),
      cardGeoT('feature_3_title'),
      cardGeoT('feature_4_title')
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

  const jsonLd = JSON.stringify([softwareAppSchema, breadcrumbSchema]).replace(/</g, '\\u003c');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <MainApp initialStyle="cards" seoMode="card" />
    </>
  );
}