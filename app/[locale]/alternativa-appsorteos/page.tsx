import { getBaseUrl } from "@/lib/config"
import { ComparisonTable } from '@/components/versus/ComparisonTable';
import { VersusFAQ } from '@/components/versus/FAQ';
import { SiteFooter } from '@/components/sorteo/site-footer';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { routing } from '@/i18n/routing';
import { HelpCircle } from 'lucide-react';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Versus' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
        canonical: `/alternativa-appsorteos`
    }
  };
}

export default function VersusPage() {
  const t = useTranslations('Versus');
  const tSchema = useTranslations('Schema');
  const locale = useLocale();
  const baseUrl = getBaseUrl();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": `${baseUrl}/${locale}`
    }, {
      "@type": "ListItem",
      "position": 2,
      "name": t('header_tagline'),
      "item": `${baseUrl}/${locale}/alternativa-appsorteos`
    }]
  };

  const softwareApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Sorteo Pro - Free AppSorteos Alternative",
    "applicationCategory": "SocialNetworkingApplication",
    "operatingSystem": "Web, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": t('description'),
    "featureList": [
      tSchema('versus_features.unlimited'),
      tSchema('versus_features.no_login'),
      tSchema('versus_features.free'),
      tSchema('versus_features.fair_rng')
    ]
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
      />
      {/* Pattern 2: The SEO Header Injection */}
      <header className="bg-background border-b border-border/50 py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/40 text-xs font-bold uppercase tracking-wider mb-4">
                {t('header_tagline')}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                {t('header_title_part1')} <span className="text-primary">{t('header_title_part2')}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('header_desc')}
            </p>
        </div>
      </header>

      {/* Direct Answer Block (GEO) */}
      <section className="bg-background relative z-20 -mt-10 mb-16 px-4">
        <div className="max-w-3xl mx-auto bg-card border border-border/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-primary/20 p-2 rounded-lg">
                    <HelpCircle className="w-5 h-5 text-primary" />
                </span>
                {t('direct_answer_title')}
            </h2>
            <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed">
                {t.rich('direct_answer_text', {
                    strong: (chunks) => <strong className="text-foreground font-semibold bg-primary/10 px-1 rounded">{chunks}</strong>
                })}
            </div>
        </div>
      </section>

      {/* Pattern 1: The Comparison Table */}
      <section className="bg-background relative z-10">
        <ComparisonTable />
      </section>

      {/* Persuasion Layer */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
            {/* Direct Answer Block (GEO) */}
            <div className="mb-16 bg-card/50 border border-primary/20 rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                   {t('why_us.direct_answer_title')}
                </h2>
                <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed">
                     {t.rich('why_us.direct_answer_text', {
                        strong: (chunks) => <strong className="text-primary font-semibold">{chunks}</strong>
                    })}
                </div>
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-6">
                {t('why_us.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t('why_us.p1')}
            </p>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed font-medium">
                {t('why_us.p2')}
            </p>

             <h2 className="text-3xl font-bold text-foreground mb-6">
                {t('why_us.title_2')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t('why_us.p3')}
            </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-background to-secondary/50 border-t border-border text-center">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-foreground">{t('cta.title')}</h2>
            <p className="text-2xl text-muted-foreground mb-8">{t('cta.subtitle')}</p>
            <Link
                href="/"
                className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-10 rounded-full text-xl transition-all transform hover:scale-105 shadow-lg shadow-primary/20"
            >
                {t('cta.button')}
            </Link>
         </div>
      </section>

      {/* Pattern 3: The Objection Handler FAQ */}
      <section className="py-16 bg-background">
        <VersusFAQ />
      </section>

      {/* Footer */}
      <SiteFooter />
    </main>
  );
}
