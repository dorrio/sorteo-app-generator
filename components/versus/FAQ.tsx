import { useTranslations } from 'next-intl';
import DOMPurify from 'isomorphic-dompurify';
import { safeJsonLdStringify } from '@/lib/utils';

const INLINE_HTML_CONFIG = {
  ALLOWED_TAGS: ['strong', 'em', 'br', 'a'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
};

interface VersusFAQProps {
  namespace?: string;
}

export const VersusFAQ = ({ namespace = 'Versus.faq' }: VersusFAQProps) => {
  const t = useTranslations(namespace);

  const faqData = [
    {
      question: t('q1'),
      answer: t('a1')
    },
    {
      question: t('q2'),
      answer: t('a2')
    },
    {
      question: t('q3'),
      answer: t('a3')
    }
  ];

  // Prepare Schema.org JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer.replace(/\*\*(.*?)\*\*/g, '$1')
      }
    }))
  };

  return (
    <section className="max-w-3xl mx-auto my-12 px-4">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
      />
      <h2 className="text-3xl font-bold text-center text-foreground mb-8">{t('title')}</h2>
      <dl className="space-y-6">
        {faqData.map((item, index) => (
          <div key={index} className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <dt className="text-xl font-bold text-foreground mb-2">{item.question}</dt>
            <dd
              className="text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  item.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                  INLINE_HTML_CONFIG,
                ),
              }}
            />
          </div>
        ))}
      </dl>
    </section>
  );
};
