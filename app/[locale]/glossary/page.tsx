import { getBaseUrl } from "@/lib/config"
import { getTranslations, setRequestLocale } from 'next-intl/server';
import DOMPurify from 'isomorphic-dompurify';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { BookOpen, ShieldCheck, Dice5, Instagram, HelpCircle, ListOrdered, GraduationCap, Type, Gift, Coins, Scissors, Users, Globe, Calendar, Layers, Flame } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'GlossaryPage' });
  const baseUrl = getBaseUrl();

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/glossary`,
      languages: {
        en: `/en/glossary`,
        es: `/es/glossary`,
        pt: `/pt/glossary`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}/glossary`,
      type: "article",
    }
  };
}

export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'GlossaryPage' });
  const tGlossary = await getTranslations({ locale, namespace: 'Glossary' }); // Reuse existing glossary strings

  const terms = [
    {
      id: "rng",
      term: tGlossary('term_1'),
      def: tGlossary('def_1'),
      icon: <Dice5 className="w-6 h-6 text-primary" />,
      link: "/random-number-generator"
    },
    {
      id: "provably-fair",
      term: tGlossary('term_2'),
      def: tGlossary('def_2'),
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      link: null
    },
    {
      id: "instagram-picker",
      term: tGlossary('term_3'),
      def: tGlossary('def_3'),
      icon: <Instagram className="w-6 h-6 text-primary" />,
      link: "/instagram-comment-picker"
    },
    {
      id: "list-randomizer",
      term: tGlossary('term_4'),
      def: tGlossary('def_4'),
      icon: <ListOrdered className="w-6 h-6 text-primary" />,
      link: "/list-randomizer"
    },
    {
      id: "wheel",
      term: tGlossary('term_5'),
      def: tGlossary('def_5'),
      icon: <HelpCircle className="w-6 h-6 text-primary" />,
      link: "/wheel-of-names"
    },
    {
      id: "yes-no",
      term: tGlossary('term_6'),
      def: tGlossary('def_6'),
      icon: <HelpCircle className="w-6 h-6 text-primary" />,
      link: "/yes-or-no-wheel"
    },
    {
      id: "letter",
      term: tGlossary('term_7'),
      def: tGlossary('def_7'),
      icon: <Type className="w-6 h-6 text-primary" />,
      link: "/random-letter-generator"
    },
    {
      id: "secret-santa",
      term: tGlossary('term_8'),
      def: tGlossary('def_8'),
      icon: <Gift className="w-6 h-6 text-primary" />,
      link: "/secret-santa-generator"
    },
    {
      id: "dice",
      term: tGlossary('term_9'),
      def: tGlossary('def_9'),
      icon: <Dice5 className="w-6 h-6 text-primary" />,
      link: "/dice-roller"
    },
    {
      id: "coin",
      term: tGlossary('term_10'),
      def: tGlossary('def_10'),
      icon: <Coins className="w-6 h-6 text-primary" />,
      link: "/coin-flip"
    },
    {
      id: "rps",
      term: tGlossary('term_11'),
      def: tGlossary('def_11'),
      icon: <Scissors className="w-6 h-6 text-primary" />,
      link: "/rock-paper-scissors"
    },
    {
      id: "team",
      term: tGlossary('term_12'),
      def: tGlossary('def_12'),
      icon: <Users className="w-6 h-6 text-primary" />,
      link: "/team-generator"
    },
    {
      id: "country",
      term: tGlossary('term_13'),
      def: tGlossary('def_13'),
      icon: <Globe className="w-6 h-6 text-primary" />,
      link: "/random-country-generator"
    },
    {
      id: "month",
      term: tGlossary('term_14'),
      def: tGlossary('def_14'),
      icon: <Calendar className="w-6 h-6 text-primary" />,
      link: "/random-month-generator"
    },
    {
      id: "card",
      term: tGlossary('term_15'),
      def: tGlossary('def_15'),
      icon: <Layers className="w-6 h-6 text-primary" />,
      link: "/random-card-generator"
    },
    {
      id: "truth-or-dare",
      term: tGlossary('term_17'),
      def: tGlossary('def_17'),
      icon: <Flame className="w-6 h-6 text-primary" />,
      link: "/truth-or-dare-generator"
    }
  ];

  // Schema: CollectionPage + DefinedTermSet
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('title'),
    description: t('description'),
    url: 'https://sorteopro.com/glossary',
    mainEntity: {
      '@type': 'DefinedTermSet',
      name: t('title'),
      description: t('description'),
      definedTerm: terms.map(term => ({
        '@type': 'DefinedTerm',
        name: term.term,
        description: term.def
      }))
    }
  };

  // Schema: BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Sorteo Pro",
      "item": "https://sorteopro.com"
    }, {
      "@type": "ListItem",
      "position": 2,
      "name": t('h1'),
      "item": "https://sorteopro.com/glossary"
    }]
  };

  // Schema: FAQPage (New Pattern)
  // Converting definitions into Questions for AI
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: terms.map(term => ({
      '@type': 'Question',
      name: `What is a ${term.term}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: term.def
      }
    }))
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <JsonLd data={[collectionSchema, breadcrumbSchema, faqSchema]} />

      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent -z-10" />

      <section className="pt-24 pb-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <BookOpen className="w-4 h-4" />
            {t('tagline')}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            {t('h1')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* New: Direct Answer Block (GEO) */}
      <section className="py-8 px-4 max-w-3xl mx-auto -mt-6">
        <div className="bg-card/50 border border-primary/20 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            {t('direct_answer_title')}
          </h2>
          <div
            className="prose prose-invert max-w-none text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(t.raw('direct_answer_text') as string, {
                ALLOWED_TAGS: ['strong', 'em', 'br', 'a'],
                ALLOWED_ATTR: ['href', 'target', 'rel'],
              }),
            }}
          />
        </div>
      </section>

      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="grid gap-6">
          {terms.map((item, idx) => (
            <div key={idx} id={item.id} className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl mt-1">
                  {item.icon}
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-foreground">
                    {item.term}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {item.def}
                  </p>
                  {item.link && (
                    <Link href={item.link} className="inline-flex items-center text-primary hover:underline font-medium mt-2">
                      {t('learn_more', { tool: item.term })} →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-8">{t('cta_title')}</h2>
        <Link href="/" className="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform">
          {t('cta_button')}
        </Link>
      </section>
    </main>
  );
}
