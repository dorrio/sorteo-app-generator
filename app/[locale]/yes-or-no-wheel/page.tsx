import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import dynamic from 'next/dynamic';
import { AppSkeleton } from "@/components/sorteo/skeletons";
import { YesNoGeo } from "@/components/sorteo/yes-no-geo";
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
  const { template_title, template_color } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'YesNoPage' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteopro.com';

  const customTitle = typeof template_title === 'string' ? template_title : undefined;
  const customColor = typeof template_color === 'string' ? template_color : undefined;

  const displayTitle = customTitle ? `${customTitle} | Sorteo Pro` : t('title');
  const displayDescription = t('description');

  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  ogImageUrl.searchParams.set('type', 'yes-no');
  if (customTitle) ogImageUrl.searchParams.set('title', customTitle);
  if (customColor) ogImageUrl.searchParams.set('color', customColor);

  const shareUrl = new URL(`${baseUrl}/${locale}/yes-or-no-wheel`);
  if (customTitle) shareUrl.searchParams.set('template_title', customTitle);
  if (customColor) shareUrl.searchParams.set('template_color', customColor);

  return {
    title: displayTitle,
    description: displayDescription,
    keywords: ["yes or no wheel", "yes no picker", "decision wheel", "spin the wheel yes or no", "ruleta si o no", "roleta sim ou nao", "decision maker", "flip a coin", "heads or tails", "cara o cruz", "flip coin online"],
    alternates: {
      canonical: `/${locale}/yes-or-no-wheel`
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

export default async function YesNoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'YesNoPage' });
  const tGeo = await getTranslations({ locale, namespace: 'YesNoGeo' });
  const tShare = await getTranslations({ locale, namespace: 'ShareContent' });
  const tWinner = await getTranslations({ locale, namespace: 'WinnerCeremony' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteopro.com';

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Yes or No Wheel by Sorteo Pro',
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
      "item": `${baseUrl}/${locale}/yes-or-no-wheel`
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

  const initialOptions = {
      yes: t('option_yes'),
      no: t('option_no'),
      heads: "",
      tails: "",
      rock: "",
      paper: "",
      scissors: ""
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareAppSchema, breadcrumbSchema]) }}
      />
      <MainApp
        initialStyle="roulette"
        seoMode="yes-no"
        initialTitle={t('h1')}
        initialSubtitle={t('subtitle')}
        shareTitle={tShare('yes_no_title')}
        shareText={tShare('yes_no_text')}
        customShareTextTemplate={tShare('custom_share_text')}
        shareTranslations={shareTranslations}
        stickyTranslations={stickyTranslations}
        initialOptions={initialOptions}
        footer={<SiteFooter />}
      >
        <YesNoGeo />
        <Glossary seoMode="yes-no" />
      </MainApp>
    </>
  );
}
