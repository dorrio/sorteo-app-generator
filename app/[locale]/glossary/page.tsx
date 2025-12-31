import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { BookOpen, ShieldCheck, Dice5, Instagram, HelpCircle } from 'lucide-react';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'GlossaryPage' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sorteo-app-generator.vercel.app";

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
        canonical: `/${locale}/glossary`
    },
    openGraph: {
        title: t('title'),
        description: t('description'),
        url: `${baseUrl}/${locale}/glossary`,
        type: "article",
    }
  };
}

export default function GlossaryPage() {
  const t = useTranslations('GlossaryPage');
  const tGlossary = useTranslations('Glossary'); // Reuse existing glossary strings

  const terms = [
    {
      id: "rng",
      term: tGlossary('term_1'),
      def: tGlossary('def_1'),
      icon: <Dice5 className="w-6 h-6 text-primary" />,
      link: null
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
        id: "wheel",
        term: t('term_wheel'),
        def: t('def_wheel'),
        icon: <HelpCircle className="w-6 h-6 text-primary" />,
        link: "/wheel-of-names"
    }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: t('title'),
    description: t('description'),
    definedTerm: terms.map(term => ({
        '@type': 'DefinedTerm',
        name: term.term,
        description: term.def
    }))
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
                                    {t('learn_more')} →
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
