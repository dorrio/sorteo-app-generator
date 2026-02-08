import { getTranslations } from 'next-intl/server';
import { MainApp } from "@/components/sorteo/main-app";

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params;
  const { template_title, template_color, list } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteopro.com';

  // Viralis: Dynamic Metadata for Custom Giveaways
  const customTitle = typeof template_title === 'string' ? template_title : undefined;
  const customColor = typeof template_color === 'string' ? template_color : undefined;
  const customList = typeof list === 'string' ? list : undefined;

  const displayTitle = customTitle ? `${customTitle} | Sorteo Pro` : t('title');
  const displayDescription = t('description');

  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  // Default type for home is undefined, which defaults to generic in api/og
  if (customTitle) ogImageUrl.searchParams.set('title', customTitle);
  if (customColor) ogImageUrl.searchParams.set('color', customColor);
  if (customList) {
    ogImageUrl.searchParams.set('list', customList);
    // Explicitly set type to 'list' so the OG image renders the list content theme
    ogImageUrl.searchParams.set('type', 'list');
  }

  const shareUrl = new URL(`${baseUrl}/${locale}`);
  if (customTitle) shareUrl.searchParams.set('template_title', customTitle);
  if (customColor) shareUrl.searchParams.set('template_color', customColor);
  if (customList) shareUrl.searchParams.set('list', customList);

  const canonicalUrl =
    customTitle || customColor || customList
      ? shareUrl.toString()
      : `${baseUrl}/${locale}`;

  return {
    title: displayTitle,
    description: displayDescription,
    alternates: {
      canonical: canonicalUrl
    },
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

export default async function SorteoApp({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ?? (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteopro.com');

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
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted schema data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MainApp seoMode="home" />
    </>
  )
}
