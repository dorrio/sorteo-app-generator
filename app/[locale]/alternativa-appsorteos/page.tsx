import { ComparisonTable } from '@/components/versus/ComparisonTable';
import { VersusFAQ } from '@/components/versus/FAQ';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

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

  return (
    <main className="min-h-screen bg-white">
      {/* Pattern 2: The SEO Header Injection */}
      <header className="bg-slate-900 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
                {t('header_tagline')}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                {t('header_title_part1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">{t('header_title_part2')}</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                {t('header_desc')}
            </p>
        </div>
      </header>

      {/* Pattern 1: The Comparison Table */}
      <section className="bg-white -mt-10 relative z-10">
        <ComparisonTable />
      </section>

      {/* Persuasion Layer */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('why_us.title')}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t('why_us.p1')}
            </p>
            <p className="text-lg text-gray-600 mb-12 leading-relaxed font-medium">
                {t('why_us.p2')}
            </p>

             <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('why_us.title_2')}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t('why_us.p3')}
            </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-900 to-slate-900 text-white text-center">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">{t('cta.title')}</h2>
            <p className="text-2xl text-indigo-200 mb-8">{t('cta.subtitle')}</p>
            <Link
                href="/"
                className="inline-block bg-green-500 hover:bg-green-400 text-white font-bold py-4 px-10 rounded-full text-xl transition-all transform hover:scale-105 shadow-lg shadow-green-500/30"
            >
                {t('cta.button')}
            </Link>
         </div>
      </section>

      {/* Pattern 3: The Objection Handler FAQ */}
      <section className="py-16 bg-white">
        <VersusFAQ />
      </section>
    </main>
  );
}
