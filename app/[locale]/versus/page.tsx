import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { Swords, Trophy, Zap, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'VersusHubPage' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sorteopro.com";

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
        canonical: `/${locale}/versus`
    },
    openGraph: {
        title: t('title'),
        description: t('description'),
        url: `${baseUrl}/${locale}/versus`,
        type: "website",
    }
  };
}

export default function VersusHubPage() {
  const t = useTranslations('VersusHubPage');

  const comparisons = [
    {
      id: "wheel-vs-sorteo",
      title: t('comp_1_title'),
      desc: t('comp_1_desc'),
      link: "/versus/wheel-of-names-vs-sorteo-pro"
    },
    {
      id: "appsorteos-vs-sorteo",
      title: t('comp_2_title'),
      desc: t('comp_2_desc'),
      link: "/alternativa-appsorteos" // Existing route
    }
  ];

  // Schema: CollectionPage
  const collectionSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: t('title'),
      description: t('description'),
      url: 'https://sorteopro.com/versus',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: comparisons.map((comp, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: comp.title,
            url: `https://sorteopro.com${comp.link}`
        }))
      }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/10 to-transparent -z-10" />

      <section className="pt-24 pb-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
             <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                <Swords className="w-4 h-4" />
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

      {/* Direct Answer Block (GEO) */}
      <section className="py-8 px-4 max-w-3xl mx-auto -mt-6">
         <div className="bg-card/50 border border-primary/20 rounded-2xl p-8 shadow-sm">
             <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                 <Trophy className="w-6 h-6 text-primary" />
                 {t('direct_answer_title')}
             </h2>
             <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t.raw('direct_answer_text') }}
             />
         </div>
      </section>

      <section className="py-12 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">{t('comparisons_title')}</h2>
        <div className="grid md:grid-cols-2 gap-6">
            {comparisons.map((item, idx) => (
                <Link key={idx} href={item.link} className="block group">
                    <div className="h-full p-8 rounded-2xl bg-card border border-border/50 group-hover:border-primary/50 transition-all shadow-sm group-hover:shadow-md group-hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Swords className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">
                                {t('read_comparison')} →
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-3">
                            {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {item.desc}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/20">
         <div className="max-w-4xl mx-auto text-center">
             <h2 className="text-2xl font-bold mb-12">{t('why_switch_title')}</h2>
             <div className="grid md:grid-cols-3 gap-8">
                 <div className="space-y-4">
                     <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                         <Zap className="w-6 h-6" />
                     </div>
                     <h3 className="font-bold text-lg">{t('feature_1_title')}</h3>
                     <p className="text-sm text-muted-foreground">{t('feature_1_desc')}</p>
                 </div>
                 <div className="space-y-4">
                     <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                         <ShieldCheck className="w-6 h-6" />
                     </div>
                     <h3 className="font-bold text-lg">{t('feature_2_title')}</h3>
                     <p className="text-sm text-muted-foreground">{t('feature_2_desc')}</p>
                 </div>
                 <div className="space-y-4">
                     <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                         <Trophy className="w-6 h-6" />
                     </div>
                     <h3 className="font-bold text-lg">{t('feature_3_title')}</h3>
                     <p className="text-sm text-muted-foreground">{t('feature_3_desc')}</p>
                 </div>
             </div>
         </div>
      </section>
    </main>
  );
}
