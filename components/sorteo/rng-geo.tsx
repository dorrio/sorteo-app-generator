"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Lock, Zap, RefreshCw, Smartphone, HelpCircle, CheckCircle } from "lucide-react"
import { useSorteoStore } from "@/lib/sorteo-store"
import { Link } from "@/i18n/routing"
import { safeJsonLdStringify } from "@/lib/utils";
import { QuickSpecs } from "./quick-specs"

export function RngGeo() {
  const t = useTranslations("RngGeo")
  const tFaq = useTranslations("RngPage")
  const { updateTheme } = useSorteoStore()

  const handleTryIt = () => {
    updateTheme({ sorteoStyle: 'slot-machine' })
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
        /* biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted schema data */
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
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
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.rich("direct_answer_text", {
                  strong: (chunks) => <strong className="font-semibold text-foreground">{chunks}</strong>,
                  tool: (chunks) => <Link href="/random-number-generator" className="font-semibold text-primary hover:underline">{chunks}</Link>,
                  brand: (chunks) => <Link href="/" className="font-semibold text-primary hover:underline">{chunks}</Link>
                })}
              </p>
            </div>
            <Button asChild size="lg" className="mt-4 gap-2 text-lg font-bold shadow-lg shadow-primary/20" onClick={handleTryIt}>
              <a href="#sorteo-section">
                {t("cta_button")} <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>

          {/* Quick Specs Table (GEO Optimization) */}
          <QuickSpecs className="mb-12" />

          {/* Features Grid */}
          <ul className="grid md:grid-cols-2 gap-8 mt-12 mb-16" role="list">
            <li className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <Lock className="w-5 h-5" />
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
  )
}
