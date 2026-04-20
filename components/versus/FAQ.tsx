import { useTranslations } from 'next-intl';
import { JsonLd } from '@/components/seo/json-ld';

interface VersusFAQProps {
  namespace?: string;
}

export const VersusFAQ = ({ namespace = 'Versus.faq' }: VersusFAQProps) => {
  const t = useTranslations(namespace);

  const keys = ['1', '2', '3'] as const;

  // JSON-LD requires plain text. Answers may embed <strong> for emphasis,
  // so read via t.raw (which doesn't try to parse tags) and strip them.
  const stripTags = (s: string) => s.replace(/<\/?strong>/g, '');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: keys.map((k) => ({
      '@type': 'Question',
      name: t(`q${k}`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripTags(t.raw(`a${k}`) as string),
      },
    })),
  };

  return (
    <section className="max-w-3xl mx-auto my-12 px-4">
      <JsonLd data={jsonLd} />
      <h2 className="text-3xl font-bold text-center text-foreground mb-8">{t('title')}</h2>
      <dl className="space-y-6">
        {keys.map((k) => (
          <div key={k} className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <dt className="text-xl font-bold text-foreground mb-2">{t(`q${k}`)}</dt>
            <dd className="text-muted-foreground">
              {t.rich(`a${k}`, {
                strong: (chunks) => <strong className="text-foreground">{chunks}</strong>,
              })}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
