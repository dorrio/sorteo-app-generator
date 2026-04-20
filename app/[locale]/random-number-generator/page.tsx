import { getBaseUrl } from "@/lib/config"
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing';
import dynamic from "next/dynamic";
import { AppSkeleton } from "@/components/sorteo/skeletons";
import { RngGeo } from "@/components/sorteo/rng-geo";
import { Glossary } from "@/components/sorteo/glossary";
import { SiteFooter } from "@/components/sorteo/site-footer";
import { JsonLd } from '@/components/seo/json-ld';
const MainApp = dynamic(
  () => import("@/components/sorteo/main-app").then((mod) => mod.MainApp),
  { loading: () => <AppSkeleton /> }
);

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
  const t = await getTranslations({ locale, namespace: 'RngPage' });

  const baseUrl = getBaseUrl()
  const customTitle = typeof template_title === 'string' ? template_title : undefined;
  const customColor = typeof template_color === 'string' ? template_color : undefined;
  const customList = typeof list === 'string' ? list : undefined;

  const displayTitle = customTitle ? `${customTitle} | Sorteo Pro` : t('title');
  const displayDescription = t('description');

  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  // If customList is present, switch to 'list' type to render the list content theme
  ogImageUrl.searchParams.set('type', customList ? 'list' : 'rng');
  if (customTitle) ogImageUrl.searchParams.set('title', customTitle);
  if (customColor) ogImageUrl.searchParams.set('color', customColor);
  if (customList) ogImageUrl.searchParams.set('list', customList);

  const shareUrl = new URL(`${baseUrl}/${locale}/random-number-generator`);
  if (customTitle) shareUrl.searchParams.set('template_title', customTitle);
  if (customColor) shareUrl.searchParams.set('template_color', customColor);
  if (customList) shareUrl.searchParams.set('list', customList);

  const canonicalUrl =
    customTitle || customColor || customList
      ? `/${locale}/random-number-generator?${shareUrl.searchParams.toString()}`
      : `/${locale}/random-number-generator`;

  return {
    title: displayTitle,
    description: displayDescription,
    keywords: ["random number generator", "RNG", "number picker", "randomizer", "generador de numeros", "numero aleatorio", "gerador de numeros", "dice roller", "roll a dice", "online dice"],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `/en/random-number-generator`,
        es: `/es/random-number-generator`,
        pt: `/pt/random-number-generator`,
      },
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

export default async function RngPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'RngPage' });
  const tGeo = await getTranslations({ locale, namespace: 'RngGeo' });
  const tShare = await getTranslations({ locale, namespace: 'ShareContent' });
  const tWinner = await getTranslations({ locale, namespace: 'WinnerCeremony' });

  const baseUrl = getBaseUrl()
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Random Number Generator by Sorteo Pro',
    applicationCategory: 'UtilitiesApplication',
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
    }, {
      "@type": "ListItem",
      "position": 2,
      "name": "RNG",
      "item": `${baseUrl}/${locale}/random-number-generator`
    }]
  };

  const shareTranslations = {
    share: tWinner('share_menu'),
    copy: tWinner('copy_text'),
    copied: tWinner('copied'),
    shareOn: tWinner('share_on')
  }

  const stickyTranslations = {
    share_cta: tShare('cta_share'),
    start_cta: tShare('cta_start')
  }

  return (
    <>
      <JsonLd data={[softwareAppSchema, breadcrumbSchema]} />
      <MainApp
        initialStyle="slot-machine"
        seoMode="rng"
        initialTitle={t('h1')}
        initialSubtitle={t('subtitle')}
        shareTitle={tShare('rng_title')}
        shareText={tShare('rng_text')}
        customShareTextTemplate={tShare('custom_share_text', { title: '{title}' })}
        shareTranslations={shareTranslations}
        stickyTranslations={stickyTranslations}
        footer={<SiteFooter />}
      >
        <RngGeo />
        <Glossary seoMode="rng" />
      </MainApp>
    </>
  );
}
