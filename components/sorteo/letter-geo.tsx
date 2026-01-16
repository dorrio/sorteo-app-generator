"use client"

import { useTranslations } from "next-intl"
<<<<<<< HEAD
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Type, Zap, RefreshCw, Smartphone, HelpCircle, CheckCircle } from "lucide-react"
import { useSorteoStore } from "@/lib/sorteo-store"

export function LetterGeo() {
  const t = useTranslations("LetterGeo")
  const tFaq = useTranslations("LetterGeoPage")
  const { updateTheme } = useSorteoStore()

  const handleTryIt = () => {
    updateTheme({ sorteoStyle: 'roulette' })
  }

  const faqs = [
    {
      question: tFaq("faq_1_q"),
      answer: tFaq("faq_1_a"),
    },
    {
      question: tFaq("faq_2_q"),
      answer: tFaq("faq_2_a"),
    },
  ]

  const howToSteps = [
    { name: t('how_to_step_1') },
    { name: t('how_to_step_2') },
    { name: t('how_to_step_3') },
    { name: t('how_to_step_4') },
  ]

  const jsonLd = [
    {
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
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: t('how_to_title'),
      step: howToSteps.map((step, idx) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        name: step.name,
        text: step.name
      }))
    }
  ]

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card/30 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          {/* Direct Answer Block (GEO) */}
          <div className="mb-10 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-200">
              {t("direct_answer_title")}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p
                className="text-lg text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t.raw("direct_answer_text") }}
              />
            </div>
            <Button asChild size="lg" className="mt-4 gap-2 text-lg font-bold shadow-lg shadow-primary/20" onClick={handleTryIt}>
              <a href="#sorteo-section">
                {t("cta_button")} <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>

          {/* Features Grid */}
          <ul className="grid md:grid-cols-2 gap-8 mt-12 mb-16" role="list">
            <li className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <Type className="w-5 h-5" />
                {t("feature_1_title")}
              </h3>
              <p className="text-muted-foreground">{t("feature_1_desc")}</p>
            </li>

            <li className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <Zap className="w-5 h-5" />
                {t("feature_2_title")}
              </h3>
              <p className="text-muted-foreground">{t("feature_2_desc")}</p>
            </li>

            <li className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <RefreshCw className="w-5 h-5" />
                {t("feature_3_title")}
              </h3>
              <p className="text-muted-foreground">{t("feature_3_desc")}</p>
            </li>

            <li className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <Smartphone className="w-5 h-5" />
                {t("feature_4_title")}
              </h3>
              <p className="text-muted-foreground">{t("feature_4_desc")}</p>
            </li>
          </ul>

          {/* How To Section (New) */}
          <div className="mb-16 border-t border-primary/10 pt-10">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                 <CheckCircle className="w-6 h-6 text-primary" />
                 {t('how_to_title')}
              </h3>
              <ol className="relative border-l border-primary/20 ml-3 space-y-8">
                 {howToSteps.map((step, idx) => (
                     <li key={idx} className="ml-8">
                        <span className="absolute flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full -left-4 ring-4 ring-background text-sm font-bold text-primary">
                            {idx + 1}
                        </span>
                        <p className="text-lg text-foreground/90 font-medium">{step.name}</p>
                     </li>
                 ))}
              </ol>
           </div>

          {/* Visible FAQ Section (Anti-Cloaking) */}
          <div className="pt-10 border-t border-primary/10">
             <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-primary" />
                FAQ
             </h3>
             <dl className="grid gap-6">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="space-y-2">
                        <dt className="font-bold text-lg text-foreground">{faq.question}</dt>
                        <dd className="text-muted-foreground leading-relaxed">{faq.answer}</dd>
                    </div>
                ))}
             </dl>
          </div>

        </motion.div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </section>
=======
import { Check, Shield, Gamepad2, Zap, HelpCircle, Type } from "lucide-react"

export function LetterGeo() {
  const t = useTranslations("LetterGeo")

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
    step: [1, 2, 3, 4].map(step => ({
      '@type': 'HowToStep',
      position: step,
      name: t(`how_to_step_${step}`),
      text: t(`how_to_step_${step}`),
    })),
  }

  return (
    <div className="w-full">
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
        />

      {/* Direct Answer Block (GEO) */}
      <section className="py-12 px-4 bg-card/20 border-t border-border/30">
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
                 <div className="p-2 rounded-lg bg-indigo-500/10">
                    <Type className="w-6 h-6 text-indigo-500" />
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
                <Zap className="w-6 h-6 text-primary" />
                {t('feature_1_title')}
            </h2>
            <ul className="grid md:grid-cols-4 gap-6" role="list">
                {/* Feature 1 */}
                <li className="p-6 rounded-2xl bg-card/40 border border-border/50 hover:border-indigo-500/50 transition-colors list-none">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4">
                        <Type className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{t('feature_1_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('feature_1_desc')}</p>
                </li>
                 {/* Feature 2 */}
                 <li className="p-6 rounded-2xl bg-card/40 border border-border/50 hover:border-blue-500/50 transition-colors list-none">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                        <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{t('feature_2_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('feature_2_desc')}</p>
                </li>
                 {/* Feature 3 */}
                 <li className="p-6 rounded-2xl bg-card/40 border border-border/50 hover:border-green-500/50 transition-colors list-none">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                        <Gamepad2 className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{t('feature_3_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('feature_3_desc')}</p>
                </li>
                 {/* Feature 4 */}
                 <li className="p-6 rounded-2xl bg-card/40 border border-border/50 hover:border-orange-500/50 transition-colors list-none">
                    <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                        <Zap className="w-5 h-5 text-orange-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{t('feature_4_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('feature_4_desc')}</p>
                </li>
            </ul>
        </div>
      </section>

      {/* How To Steps */}
      <section className="py-16 px-4 bg-muted/5">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10">{t('how_to_title')}</h2>
            <ol className="space-y-4" role="list">
                {[1, 2, 3, 4].map((step) => (
                    <li key={step} className="flex gap-4 items-start p-5 bg-card/60 rounded-xl border border-border/50 list-none">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-900/20">
                            {step}
                        </div>
                        <p className="text-base pt-1">{t(`how_to_step_${step}`)}</p>
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
>>>>>>> main
  )
}
