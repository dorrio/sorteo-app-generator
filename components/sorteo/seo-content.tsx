"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Shield, Wand2, Zap, HelpCircle } from "lucide-react"

export function SeoContent() {
  const t = useTranslations("SEOContent")

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: t("feature_1_title"),
      desc: t("feature_1_desc"),
    },
    {
      icon: <Wand2 className="w-6 h-6 text-primary" />,
      title: t("feature_2_title"),
      desc: t("feature_2_desc"),
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: t("feature_3_title"),
      desc: t("feature_3_desc"),
    },
  ]

  const faqs = [
    {
      question: t("faq_1_question"),
      answer: t("faq_1_answer"),
    },
    {
      question: t("faq_2_question"),
      answer: t("faq_2_answer"),
    },
  ]

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

  return (
    <section className="w-full py-16 px-4 bg-card/30 backdrop-blur-sm border-t border-border/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Direct Answer Block (ChatGPT Bait) */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">{t("what_is_title")}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {t("what_is_text")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">{t("features_title")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors"
              >
                <div className="mb-4 p-3 bg-primary/10 rounded-xl w-fit">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How To / Steps */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">{t("how_to_title")}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {step}
                </div>
                <p className="text-muted-foreground pt-1">{t(`step_${step}`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            {t("faq_title")}
          </h2>
          <div className="grid gap-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-card/50 border border-border/50">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
