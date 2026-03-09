import { getBaseUrl } from "@/lib/config"
import nextDynamic from 'next/dynamic';
import { AppSkeleton } from '@/components/sorteo/skeletons';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { SiteFooter } from '@/components/sorteo/site-footer';
import { BingoGeo } from '@/components/sorteo/bingo-geo';
import { Glossary } from '@/components/sorteo/glossary';

const MainApp = nextDynamic(
  () => import('@/components/sorteo/main-app').then((mod) => mod.MainApp),
  { loading: () => <AppSkeleton /> }
);
import { safeJsonLdStringify } from '@/lib/utils';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BingoPage' });
  const baseUrl = getBaseUrl()
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/bingo-number-generator`
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}/bingo-number-generator`,
      type: "website",
      siteName: "Sorteo Pro",
      locale: locale,
      images: [
        {
          url: `${baseUrl}/api/og?type=bingo`,
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
      images: [`${baseUrl}/api/og?type=bingo`],
    },
  };
}

export default async function BingoNumberGeneratorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BingoPage' });
  const tGeo = await getTranslations({ locale, namespace: 'BingoGeo' });
  const tShare = await getTranslations({ locale, namespace: 'ShareContent' });
  const tWinner = await getTranslations({ locale, namespace: 'WinnerCeremony' });
  const baseUrl = getBaseUrl()
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bingo Number Generator by Sorteo Pro',
    applicationCategory: 'EntertainmentApplication',
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
      "name": t('h1'),
      "item": `${baseUrl}/${locale}/bingo-number-generator`
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify([softwareAppSchema, breadcrumbSchema]) }}
      />
      <MainApp
        seoMode="bingo"
        initialStyle="slot-machine"
        initialTitle={t('h1')}
        initialSubtitle={t('subtitle')}
        shareTitle={tShare('bingo_title')}
        shareText={tShare('bingo_text')}
        customShareTextTemplate={tShare('custom_share_text')}
        shareTranslations={shareTranslations}
        stickyTranslations={stickyTranslations}
        footer={<SiteFooter />}
      >
        <BingoGeo />
        <Glossary seoMode="bingo" />
      </MainApp>
    </>
  );
}
