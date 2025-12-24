import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import { Check, Shield, Zap, Users, HelpCircle, Instagram } from 'lucide-react';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'InstagramPicker' });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://sorteopro.com';

  return {
    title: t('title'),
    description: t('description'),
    keywords: ["instagram comment picker", "free instagram giveaway", "instagram winner picker", "instagram giveaway tool", "sorteo instagram gratis", "no login giveaway"],
    alternates: {
        canonical: `/${locale}/instagram-comment-picker`
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}/instagram-comment-picker`,
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

export default function InstagramPickerPage({ params }: { params: Promise<{ locale: string }> }) {
  const t = useTranslations('InstagramPicker');

  const faqs = [
    {
      question: t("faq_1_q"),
      answer: t("faq_1_a"),
    },
    {
      question: t("faq_2_q"),
      answer: t("faq_2_a"),
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Instagram Comment Picker by Sorteo Pro',
    applicationCategory: 'SocialNetworkingApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: t('description'),
    featureList: [
      "Unlimited Comments",
      "No Login Required",
      "Free Forever",
      "Secure RNG"
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '8300',
    },
  };

  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('how_to_title'),
    step: [1, 2, 3].map(step => ({
      '@type': 'HowToStep',
      position: step,
      name: t(`step_${step}`),
      text: t(`step_${step}`),
    })),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />

        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent -z-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[100px] -z-10" />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-sm font-semibold text-purple-400 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Instagram className="w-4 h-4" />
                {t('h1')}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                {t('h1')}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                {t('subtitle')}
            </p>

            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
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
                    strong: (chunks) => <strong className="text-foreground font-semibold bg-primary/10 px-1 rounded">{chunks}</strong>
                })}
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{t('features_title')}</h2>
            <ul className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <li className="p-8 rounded-2xl bg-card border border-border/50 hover:border-purple-500/50 transition-colors group list-none">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{t('feature_1_title')}</h3>
                    <p className="text-muted-foreground">{t('feature_1_desc')}</p>
                </li>
                 {/* Feature 2 */}
                 <li className="p-8 rounded-2xl bg-card border border-border/50 hover:border-pink-500/50 transition-colors group list-none">
                    <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Shield className="w-6 h-6 text-pink-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{t('feature_2_title')}</h3>
                    <p className="text-muted-foreground">{t('feature_2_desc')}</p>
                </li>
                 {/* Feature 3 */}
                 <li className="p-8 rounded-2xl bg-card border border-border/50 hover:border-orange-500/50 transition-colors group list-none">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Check className="w-6 h-6 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{t('feature_3_title')}</h3>
                    <p className="text-muted-foreground">{t('feature_3_desc')}</p>
                </li>
            </ul>
        </div>
      </section>

      {/* How To Steps */}
      <section className="py-16 px-4 bg-muted/10">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{t('how_to_title')}</h2>
            <ol className="space-y-6">
                {[1, 2, 3].map((step) => (
                    <li key={step} className="flex gap-6 items-start p-6 bg-card rounded-xl border border-border/50 list-none">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-purple-900/20">
                            {step}
                        </div>
                        <p className="text-lg pt-1.5">{t(`step_${step}`)}</p>
                    </li>
                ))}
            </ol>
             <div className="mt-12 text-center">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-3 px-8 rounded-full transition-all"
                >
                    {t('cta_button')}
                </Link>
            </div>
        </div>
      </section>

       {/* FAQ Section */}
       <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
             <h2 className="text-3xl font-bold text-center mb-12">{t('faq_title')}</h2>
             <dl className="grid gap-4">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-card/50 border border-border">
                        <dt className="font-semibold text-lg mb-2 text-foreground">{faq.question}</dt>
                        <dd className="text-muted-foreground">{faq.answer}</dd>
                    </div>
                ))}
             </dl>
        </div>
       </section>

    </main>
  );
}
