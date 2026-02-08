import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { MainApp } from "@/components/sorteo/main-app";
import { VersusGeo } from "@/components/sorteo/versus-geo";

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'VersusRandom' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteopro.com';

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

  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted schema data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, faqSchema]) }}
      />
      {/*
         Strategy: Use the functional MainApp (RNG mode) at the top so users can try it immediately.
         "seoMode='rng'" ensures correct branding (titles) for RNG context.
      */}
      <MainApp initialStyle="slot_machine" seoMode="rng" />

      {/* The Comparison Content (Random namespace) */}
      <VersusGeo namespace="VersusRandom" />
    </>
  );
}
