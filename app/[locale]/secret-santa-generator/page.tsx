import { getBaseUrl } from "@/lib/config"
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import dynamic from "next/dynamic";
import { AppSkeleton } from "@/components/sorteo/skeletons";
import { SecretSantaGeo } from "@/components/sorteo/secret-santa-geo";
import { Glossary } from "@/components/sorteo/glossary";
import { SiteFooter } from "@/components/sorteo/site-footer";

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
  const t = await getTranslations({ locale, namespace: 'SecretSantaPage' });

  const baseUrl = getBaseUrl()
  const customTitle = typeof template_title === 'string' ? template_title : undefined;
  const customColor = typeof template_color === 'string' ? template_color : undefined;
  const customList = typeof list === 'string' ? list : undefined;

  const displayTitle = customTitle ? `${customTitle} | Sorteo Pro` : t('title');
  const displayDescription = t('description');

  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  ogImageUrl.searchParams.set('type', 'list');
  if (customTitle) ogImageUrl.searchParams.set('title', customTitle);
  else ogImageUrl.searchParams.set('title', 'Secret Santa');

  if (customColor) ogImageUrl.searchParams.set('color', customColor);
  if (customList) ogImageUrl.searchParams.set('list', customList);

  const shareUrl = new URL(`${baseUrl}/${locale}/secret-santa-generator`);
  if (customTitle) shareUrl.searchParams.set('template_title', customTitle);
  if (customColor) shareUrl.searchParams.set('template_color', customColor);
  if (customList) shareUrl.searchParams.set('list', customList);

  const canonicalUrl =
    customTitle || customColor || customList
      ? `/${locale}/secret-santa-generator?${shareUrl.searchParams.toString()}`
      : `/${locale}/secret-santa-generator`;

  return {
    title: displayTitle,
    description: displayDescription,
    keywords: ["secret santa generator", "secret santa online", "amigo invisible online", "amigo secreto", "gift exchange generator", "christmas name picker", "secret santa maker", "free secret santa", "no email secret santa"],
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

export default async function SecretSantaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SecretSantaPage' });
  const tGeo = await getTranslations({ locale, namespace: 'SecretSantaGeo' });
  const tShare = await getTranslations({ locale, namespace: 'ShareContent' });
  const tWinner = await getTranslations({ locale, namespace: 'WinnerCeremony' });

  const baseUrl = getBaseUrl()
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Secret Santa Generator by Sorteo Pro',
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
    },{
      "@type": "ListItem",
      "position": 2,
      "name": t('h1'),
      "item": `${baseUrl}/${locale}/secret-santa-generator`
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareAppSchema, breadcrumbSchema]) }}
      />
      <MainApp
        initialStyle="grid"
        seoMode="secret-santa"
        initialTitle={t('h1')}
        initialSubtitle={t('subtitle')}
        shareTitle={tShare('secret_santa_title')}
        shareText={tShare('secret_santa_text')}
        customShareTextTemplate={tShare('custom_share_text')}
        shareTranslations={shareTranslations}
        stickyTranslations={stickyTranslations}
        footer={<SiteFooter />}
      >
        <SecretSantaGeo />
        <Glossary seoMode="secret-santa" />
      </MainApp>
    </>
  );
}
