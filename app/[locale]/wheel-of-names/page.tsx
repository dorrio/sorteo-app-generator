import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import { Check, Shield, Zap, Users, HelpCircle, Trophy } from 'lucide-react';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'WheelGeoPage' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteopro.com';

  return {
    title: t('title'),
    description: t('description'),
    keywords: ["wheel of names", "random picker wheel", "spin the wheel", "wheel decider", "ruleta aleatoria", "ruleta de nombres", "roleta de nomes", "random name picker", "wheel generator"],
    alternates: {
      canonical: `/${locale}/wheel-of-names`
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}/wheel-of-names`,
      type: "website",
      siteName: "Sorteo Pro",
      locale: locale === 'es' ? 'es_ES' : locale === 'pt' ? 'pt_PT' : 'en_US',
      images: [
        {
          url: '/og-image.jpg',
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
      images: ['/og-image.jpg'],
    },
  };
}

export default function WheelOfNamesPage() {
  const t = useTranslations('WheelGeoPage');

  const jsonLd = {
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
      "Customizable Wheel",
      "Random Result",
      "No Ads",
      "Free Forever"
    ]
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: t('faq_1_q'),
        acceptedAnswer: { '@type': 'Answer', text: t('faq_1_a') }
      },
      {
        '@type': 'Question',
        name: t('faq_2_q'),
        acceptedAnswer: { '@type': 'Answer', text: t('faq_2_a') }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-yellow-500/10 to-transparent -z-10" />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 text-sm font-semibold text-yellow-500 mb-4">
            <Trophy className="w-4 h-4" />
            {t('h1')}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
            {t('h1')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>

          <div className="pt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/25"
            >
              <Zap className="w-5 h-5" />
              {t('cta_button')}
            </Link>
          </div>
        </div>
      </section>

      {/* Direct Answer Block (GEO) */}
      <section className="py-16 px-4 bg-card/30 border-y border-border/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <span className="bg-primary/20 p-2 rounded-lg">
              <HelpCircle className="w-6 h-6 text-primary" />
            </span>
            {t('direct_answer_title')}
          </h2>
          <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed p-6 bg-background/50 rounded-2xl border border-border/50">
            {t.rich('direct_answer_text', {
              strong: (chunks: any) => <strong className="text-foreground font-semibold bg-primary/10 px-1 rounded">{chunks}</strong>
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t('faq_title')}</h2>
          <dl className="grid gap-4">
            <div className="p-6 rounded-2xl bg-card/50 border border-border">
              <dt className="font-semibold text-lg mb-2 text-foreground">{t('faq_1_q')}</dt>
              <dd className="text-muted-foreground">{t('faq_1_a')}</dd>
            </div>
            <div className="p-6 rounded-2xl bg-card/50 border border-border">
              <dt className="font-semibold text-lg mb-2 text-foreground">{t('faq_2_q')}</dt>
              <dd className="text-muted-foreground">{t('faq_2_a')}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
