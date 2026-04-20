import { getBaseUrl } from "@/lib/config"
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import nextDynamic from "next/dynamic";
import { AppSkeleton } from "@/components/sorteo/skeletons";
import { VersusGeo } from "@/components/sorteo/versus-geo";
import { RngGeo } from "@/components/sorteo/rng-geo";
import { SiteFooter } from "@/components/sorteo/site-footer";
import { safeJsonLdStringify } from "@/lib/utils";


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
  const t = await getTranslations({ locale, namespace: 'VersusRandom' });

  const baseUrl = getBaseUrl()
  return {
    title: t('title'),
    description: t('description'),
    keywords: ["random.org alternative", "better random number generator", "free rng", "true randomness", "sorteo pro vs random.org", "generador de numeros aleatorios sin anuncios"],
    alternates: {
      canonical: `/${locale}/versus/random-org-vs-sorteo-pro`
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}/versus/random-org-vs-sorteo-pro`,
      type: "article",
      siteName: "Sorteo Pro",
      locale: locale === 'es' ? 'es_ES' : locale === 'pt' ? 'pt_PT' : 'en_US',
      images: [
        {
          url: `${baseUrl}/api/og?type=rng`, // Use RNG OG
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
  };
}

export default async function RandomVersusPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'VersusRandom' });
  const tShare = await getTranslations({ locale, namespace: 'ShareContent' });
  const tWinner = await getTranslations({ locale, namespace: 'WinnerCeremony' });
  const tRng = await getTranslations({ locale, namespace: 'RngPage' });

  // Schema: Article + FAQ
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
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is safe and necessary for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify([articleSchema, faqSchema]) }}
      />
      <MainApp
        initialStyle="slot-machine"
        seoMode="rng"
        initialTitle={tRng('h1')}
        initialSubtitle={tRng('subtitle')}
        shareTitle={tShare('rng_title')}
        shareText={tShare('rng_text')}
        customShareTextTemplate={tShare('custom_share_text', { title: '{title}' })}
        shareTranslations={shareTranslations}
        stickyTranslations={stickyTranslations}
        footer={<SiteFooter />}
      >
        <RngGeo />
        <VersusGeo namespace="VersusRandom" sorteoStyle="slot-machine" />
      </MainApp>
    </>
  );
}
