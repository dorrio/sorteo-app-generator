import { getBaseUrl } from "@/lib/config"
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing';
import nextDynamic from "next/dynamic";
import { AppSkeleton } from "@/components/sorteo/skeletons";
import { VersusGeo } from "@/components/sorteo/versus-geo";
import { WheelGeo } from "@/components/sorteo/wheel-geo";
import { SiteFooter } from "@/components/sorteo/site-footer";
import { JsonLd } from '@/components/seo/json-ld';
const MainApp = nextDynamic(
  () => import("@/components/sorteo/main-app").then((mod) => mod.MainApp),
  { loading: () => <AppSkeleton /> }
);

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'VersusWheel' });

  const baseUrl = getBaseUrl()
  return {
    title: t('title'),
    description: t('description'),
    keywords: ["wheel of names alternative", "better wheel of names", "free wheel spinner", "ad-free wheel", "sorteo pro vs wheel of names", "ruleta aleatoria sin anuncios", "mejor que wheel of names"],
    alternates: {
      canonical: `/${locale}/versus/wheel-of-names-vs-sorteo-pro`,
      languages: {
        en: `/en/versus/wheel-of-names-vs-sorteo-pro`,
        es: `/es/versus/wheel-of-names-vs-sorteo-pro`,
        pt: `/pt/versus/wheel-of-names-vs-sorteo-pro`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}/versus/wheel-of-names-vs-sorteo-pro`,
      type: "article",
      siteName: "Sorteo Pro",
      locale: locale === 'es' ? 'es_ES' : locale === 'pt' ? 'pt_PT' : 'en_US',
      images: [
        {
          url: `${baseUrl}/api/og?type=wheel`, // Reuse Wheel OG
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
  };
}

export default async function WheelVersusPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'VersusWheel' });
  const tShare = await getTranslations({ locale, namespace: 'ShareContent' });
  const tWinner = await getTranslations({ locale, namespace: 'WinnerCeremony' });
  const tWheel = await getTranslations({ locale, namespace: 'WheelGeoPage' });

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: t('title'),
    description: t('description'),
    author: {
      '@type': 'Organization',
      name: 'Sorteo Pro'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sorteo Pro',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sorteopro.com/logo.png'
      }
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: t('faq.q1'),
        acceptedAnswer: { '@type': 'Answer', text: t.raw('faq.a1') }
      },
      {
        '@type': 'Question',
        name: t('faq.q2'),
        acceptedAnswer: { '@type': 'Answer', text: t.raw('faq.a2') }
      },
      {
        '@type': 'Question',
        name: t('faq.q3'),
        acceptedAnswer: { '@type': 'Answer', text: t.raw('faq.a3') }
      }
    ]
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
      <JsonLd data={[articleSchema, faqSchema]} />
      <MainApp
        initialStyle="roulette"
        seoMode="wheel"
        initialTitle={tWheel('h1')} // Reuse standard wheel title
        initialSubtitle={tWheel('subtitle')}
        shareTitle={tShare('wheel_title')}
        shareText={tShare('wheel_text')}
        customShareTextTemplate={tShare('custom_share_text', { title: '{title}' })}
        shareTranslations={shareTranslations}
        stickyTranslations={stickyTranslations}
        footer={<SiteFooter />}
      >
        <WheelGeo />
        {/* We place VersusGeo inside so it's part of the layout */}
        <VersusGeo sorteoStyle="roulette" />
      </MainApp>
    </>
  );
}
