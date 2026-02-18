import { MainApp } from '@/components/sorteo/main-app';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { SiteFooter } from '@/components/sorteo/site-footer';
import { TruthGeo } from '@/components/sorteo/truth-dare-geo';
import { Glossary } from '@/components/sorteo/glossary';
import { safeJsonLdStringify } from '@/lib/utils';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TruthPage' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? (process.env.VERCEL_URL.startsWith('http') ? process.env.VERCEL_URL : `https://${process.env.VERCEL_URL}`)
      : 'https://sorteopro.com';

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/truth-or-dare-generator`
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}/truth-or-dare-generator`,
      type: "website",
      siteName: "Sorteo Pro",
      locale: locale,
      images: [
        {
          url: `${baseUrl}/api/og?type=truth-or-dare`,
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
      images: [`${baseUrl}/api/og?type=truth-or-dare`],
    },
  };
}

export default async function TruthOrDarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TruthPage' });
  const tGeo = await getTranslations({ locale, namespace: 'TruthGeo' });
  const tShare = await getTranslations({ locale, namespace: 'ShareContent' });
  const tWinner = await getTranslations({ locale, namespace: 'WinnerCeremony' });
  const tData = await getTranslations({ locale, namespace: 'TruthData' });

  const truths = Array.from({ length: 20 }, (_, i) => tData(`truth_${i}`));
  const dares = Array.from({ length: 20 }, (_, i) => tData(`dare_${i}`));

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? (process.env.VERCEL_URL.startsWith('http') ? process.env.VERCEL_URL : `https://${process.env.VERCEL_URL}`)
      : 'https://sorteopro.com';

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Truth or Dare Generator by Sorteo Pro',
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
      "item": `${baseUrl}/${locale}/truth-or-dare-generator`
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

  // Pass rock, paper, scissors empty strings as they are required by interface but unused here
  const initialOptions = {
    yes: "", no: "", heads: "", tails: "", rock: "", paper: "", scissors: "",
    truths,
    dares
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify([softwareAppSchema, breadcrumbSchema]) }}
      />
      <MainApp
        seoMode="truth-or-dare"
        initialStyle="cards"
        initialTitle={t('h1')}
        initialSubtitle={t('subtitle')}
        shareTitle={tShare('truth_title')}
        shareText={tShare('truth_text')}
        customShareTextTemplate={tShare('custom_share_text')}
        shareTranslations={shareTranslations}
        stickyTranslations={stickyTranslations}
        initialOptions={initialOptions}
        footer={<SiteFooter />}
      >
        <TruthGeo />
        <Glossary seoMode="truth-or-dare" />
      </MainApp>
    </>
  );
}
