import { getTranslations } from 'next-intl/server';
import { MainApp } from "@/components/sorteo/main-app";

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/**
 * Builds page metadata (title, description, Open Graph and Twitter data) based on locale and optional template query parameters.
 *
 * @param params - A promise resolving to route parameters containing `locale`.
 * @param searchParams - A promise resolving to query parameters; may include `template_title` and `template_color` to customize title and OG image.
 * @returns The metadata object with:
 *  - `title` and `description` for the page,
 *  - `openGraph` containing `title`, `description`, `url`, and an `images` array (OG image URL includes `title`/`color` query params when provided),
 *  - `twitter` metadata including card type and image URL.
 */
export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params;
  const { template_title, template_color } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteopro.com';

  // Viralis: Dynamic Metadata for Custom Giveaways
  const customTitle = typeof template_title === 'string' ? template_title : undefined;
  const customColor = typeof template_color === 'string' ? template_color : undefined;

  const displayTitle = customTitle ? `${customTitle} | Sorteo Pro` : t('title');
  const displayDescription = t('description');

  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  // Default type for home is undefined, which defaults to generic in api/og
  if (customTitle) ogImageUrl.searchParams.set('title', customTitle);
  if (customColor) ogImageUrl.searchParams.set('color', customColor);

  const shareUrl = new URL(`${baseUrl}/${locale}`);
  if (customTitle) shareUrl.searchParams.set('template_title', customTitle);
  if (customColor) shareUrl.searchParams.set('template_color', customColor);

  return {
    title: displayTitle,
    description: displayDescription,
    openGraph: {
      title: displayTitle,
      description: displayDescription,
      url: shareUrl.toString(),
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
 * Renders the home app with a locale-aware JSON-LD breadcrumb and the main application component.
 *
 * @param params - A promise resolving to an object with a `locale` string used to build the breadcrumb URL
 * @returns A React fragment containing an embedded BreadcrumbList JSON-LD script and the main app component
 */
export default async function SorteoApp({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sorteopro.com';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Sorteo Pro",
      "item": `${baseUrl}/${locale}`
    }]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MainApp seoMode="home" />
    </>
  )
}