import { useTranslations } from 'next-intl';

export const VersusFAQ = () => {
  const t = useTranslations('Versus.faq');

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
        "text": item.answer
      }
    }))
  };

  return (
    <div className="max-w-3xl mx-auto my-12 px-4">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">{t('title')}</h2>
      <div className="space-y-6">
        {faqData.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.question}</h3>
            {/* Dangerously setting inner HTML to allow bolding from translation strings if needed,
                though in this specific case simple text would suffice.
                Using a safe render method is preferred usually. */}
            <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: item.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
          </div>
        ))}
      </div>
    </div>
  );
};
