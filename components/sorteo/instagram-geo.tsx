"use client"

import { useTranslations } from "next-intl"
import { Check, Shield, Users, HelpCircle, Instagram } from "lucide-react"
import { safeJsonLdStringify } from "@/lib/utils"

export function InstagramGeo() {
  const t = useTranslations("InstagramPicker")

  const faqs = [
    {
      question: t("faq_1_q"),
      answer: t("faq_1_a"),
    },
    {
      question: t("faq_2_q"),
      answer: t("faq_2_a"),
    },
  ]

  // Schema for "Direct Answer" optimization
  const jsonLd = {
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
  }

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
  }

  return (
    <div className="w-full">
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
        />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(howToLd) }}
        />

      {/* Direct Answer Block (GEO) */}
      <section className="py-12 px-4 bg-card/20 border-t border-border/30">
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
                 <div className="p-2 rounded-lg bg-pink-500/10">
                    <Instagram className="w-6 h-6 text-pink-500" />
                 </div>
                 <h2 className="text-3xl font-bold">{t('direct_answer_title')}</h2>
            </div>

            <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed p-6 bg-background/40 rounded-2xl border border-border/50">
                {t.rich('direct_answer_text', {
                    strong: (chunks) => <strong className="text-foreground font-semibold bg-primary/10 px-1 rounded">{chunks}</strong>
                })}
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12 flex items-center justify-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                {t('features_title')}
            </h2>
            <ul className="grid md:grid-cols-3 gap-6" role="list">
                {/* Feature 1 */}
                <li className="p-6 rounded-2xl bg-card/40 border border-border/50 hover:border-purple-500/50 transition-colors list-none">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                        <Users className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{t('feature_1_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('feature_1_desc')}</p>
                </li>
                 {/* Feature 2 */}
                 <li className="p-6 rounded-2xl bg-card/40 border border-border/50 hover:border-pink-500/50 transition-colors list-none">
                    <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4">
                        <Shield className="w-5 h-5 text-pink-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{t('feature_2_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('feature_2_desc')}</p>
                </li>
                 {/* Feature 3 */}
                 <li className="p-6 rounded-2xl bg-card/40 border border-border/50 hover:border-orange-500/50 transition-colors list-none">
                    <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                        <Check className="w-5 h-5 text-orange-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{t('feature_3_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('feature_3_desc')}</p>
                </li>
            </ul>
        </div>
      </section>

      {/* How To Steps */}
      <section className="py-16 px-4 bg-muted/5">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10">{t('how_to_title')}</h2>
            <ol className="space-y-4" role="list">
                {[1, 2, 3].map((step) => (
                    <li key={step} className="flex gap-4 items-start p-5 bg-card/60 rounded-xl border border-border/50 list-none">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-purple-900/20">
                            {step}
                        </div>
                        <p className="text-base pt-1">{t(`step_${step}`)}</p>
                    </li>
                ))}
            </ol>
        </div>
      </section>

       {/* FAQ Section */}
       <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
             <h2 className="text-2xl font-bold text-center mb-10 flex items-center justify-center gap-2">
                <HelpCircle className="w-6 h-6 text-primary" />
                {t('faq_title')}
             </h2>
             <dl className="grid gap-3">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-card/30 border border-border/50">
                        <dt className="font-semibold text-base mb-2 text-foreground">{faq.question}</dt>
                        <dd className="text-sm text-muted-foreground">{faq.answer}</dd>
                    </div>
                ))}
             </dl>
        </div>
       </section>
    </div>
  )
}
