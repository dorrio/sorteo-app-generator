import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { MainApp } from "@/components/sorteo/main-app";
import { WheelGeoServer } from "@/components/sorteo/wheel-geo-server";
import { Glossary } from "@/components/sorteo/glossary";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params;
  const { template_title, template_color, list } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'WheelGeoPage' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteopro.com';

  // Viralis: Dynamic Metadata for Custom Giveaways
  const customTitle = typeof template_title === 'string' ? template_title : undefined;
  const customColor = typeof template_color === 'string' ? template_color : undefined;
  const listParam = typeof list === 'string' ? list : undefined;

  const displayTitle = customTitle ? `${customTitle} | Sorteo Pro` : t('title');
  const displayDescription = t('description');

  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  ogImageUrl.searchParams.set('type', 'wheel');
  if (customTitle) ogImageUrl.searchParams.set('title', customTitle);
  if (customColor) ogImageUrl.searchParams.set('color', customColor);
  if (listParam) ogImageUrl.searchParams.set('list', listParam);

  // Construct Canonical/Share URL for OG
  // This must include params so social bots scrape this specific dynamic version
  const shareUrl = new URL(`${baseUrl}/${locale}/wheel-of-names`);
  if (customTitle) shareUrl.searchParams.set('template_title', customTitle);
  if (customColor) shareUrl.searchParams.set('template_color', customColor);
  if (listParam) shareUrl.searchParams.set('list', listParam);

  return {
    title: displayTitle,
    description: displayDescription,
    keywords: ["wheel of names", "random picker wheel", "spin the wheel", "wheel decider", "ruleta aleatoria", "ruleta de nombres", "roleta de nomes", "random name picker", "wheel generator"],
    alternates: {
      canonical: `/${locale}/wheel-of-names`
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

export default async function WheelOfNamesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'WheelGeoPage' });
  const tGeo = await getTranslations({ locale, namespace: 'WheelGeo' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteopro.com';

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Wheel of Names by Sorteo Pro',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: t('description'),
    featureList: [
      tGeo('feature_1'),
      tGeo('feature_2'),
      tGeo('feature_3'),
      tGeo('feature_4')
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
      "name": t('h1'),
      "item": `${baseUrl}/${locale}/wheel-of-names`
    }]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareAppSchema, breadcrumbSchema]) }}
      />
      <MainApp initialStyle="roulette" seoMode="wheel">
        <WheelGeoServer />
        <Glossary seoMode="wheel" />
      </MainApp>
    </>
  );
}
