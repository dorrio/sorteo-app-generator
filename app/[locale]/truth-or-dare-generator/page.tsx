import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { MainApp } from "@/components/sorteo/main-app";
import { TruthDareGeo } from "@/components/sorteo/truth-dare-geo";
import { Glossary } from "@/components/sorteo/glossary";
import { SiteFooter } from "@/components/sorteo/site-footer";
import { safeJsonLdStringify } from "@/lib/utils";

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
  const t = await getTranslations({ locale, namespace: 'TruthDarePage' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteopro.com';

  const customTitle = typeof template_title === 'string' ? template_title : undefined;
  const customColor = typeof template_color === 'string' ? template_color : undefined;
  const customList = typeof list === 'string' ? list : undefined;

  const displayTitle = customTitle ? `${customTitle} | Sorteo Pro` : t('title');
  const displayDescription = t('description');

  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  // If customList is present, switch to 'list' type to render the list content theme
  ogImageUrl.searchParams.set('type', customList ? 'list' : 'wheel'); // Wheel branding by default
  if (customTitle) ogImageUrl.searchParams.set('title', customTitle);
  if (customColor) ogImageUrl.searchParams.set('color', customColor);
  if (customList) ogImageUrl.searchParams.set('list', customList);

  const shareUrl = new URL(`${baseUrl}/${locale}/truth-or-dare-generator`);
  if (customTitle) shareUrl.searchParams.set('template_title', customTitle);
  if (customColor) shareUrl.searchParams.set('template_color', customColor);
  if (customList) shareUrl.searchParams.set('list', customList);

  const canonicalUrl =
    customTitle || customColor || customList
      ? `/${locale}/truth-or-dare-generator?${shareUrl.searchParams.toString()}`
      : `/${locale}/truth-or-dare-generator`;

  return {
    title: displayTitle,
    description: displayDescription,
    keywords: ["truth or dare", "truth or dare generator", "party game", "random questions", "verdad o reto", "verdade ou desafio", "spin the bottle"],
    alternates: {
      canonical: canonicalUrl
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

export default async function TruthDarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TruthDarePage' });
  const tGeo = await getTranslations({ locale, namespace: 'TruthDareGeo' });
  const tShare = await getTranslations({ locale, namespace: 'ShareContent' });
  const tWinner = await getTranslations({ locale, namespace: 'WinnerCeremony' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteopro.com';

  const truths = Array.from({ length: 20 }, (_, i) => t(`truths.${i}`));
  const dares = Array.from({ length: 20 }, (_, i) => t(`dares.${i}`));

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Truth or Dare Generator by Sorteo Pro',
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
      "name": "Truth or Dare",
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

  return (
    <>
      <script
        type="application/ld+json"
        /* biome-ignore lint/security/noDangerouslySetInnerHtml: Validated JSON-LD */
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify([softwareAppSchema, breadcrumbSchema]) }}
      />
      <MainApp
        initialStyle="roulette"
        seoMode="truth-or-dare"
        initialTitle={t('h1')}
        initialSubtitle={t('subtitle')}
        initialOptions={{ truths, dares, yes: "", no: "", heads: "", tails: "", rock: "", paper: "", scissors: "" }}
        shareTitle={tShare('truth_title')}
        shareText={tShare('truth_text')}
        customShareTextTemplate={tShare('custom_share_text')}
        shareTranslations={shareTranslations}
        stickyTranslations={stickyTranslations}
        footer={<SiteFooter />}
      >
        <TruthDareGeo />
        <Glossary seoMode="truth-or-dare" />
      </MainApp>
    </>
  );
}
