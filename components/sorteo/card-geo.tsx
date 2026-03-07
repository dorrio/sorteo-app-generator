"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Shield, Zap, RefreshCw, Smartphone, HelpCircle } from "lucide-react"
import { Link } from "@/i18n/routing"

export function CardGeo() {
  const t = useTranslations("CardGeo")

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: t("feature_1_title"),
      desc: t("feature_1_desc"),
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-primary" />,
      title: t("feature_2_title"),
      desc: t("feature_2_desc"),
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: t("feature_3_title"),
      desc: t("feature_3_desc"),
    },
    {
      icon: <Smartphone className="w-6 h-6 text-primary" />,
      title: t("feature_4_title"),
      desc: t("feature_4_desc"),
    },
  ]

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
    <section className="w-full py-16 px-4 bg-card/30 backdrop-blur-sm border-t border-border/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Direct Answer Block (ChatGPT Bait) */}
        <div className="space-y-4 bg-card border border-primary/20 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            {t("direct_answer_title")}
          </h2>
          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
            <p className="text-lg">
                {t.rich("direct_answer_text", {
                tool: (chunks) => <strong className="text-primary font-semibold">{chunks}</strong>,
                brand: (chunks) => <Link href="/" className="font-bold text-foreground hover:underline">{chunks}</Link>,
                strong: (chunks) => <strong className="text-foreground font-semibold">{chunks}</strong>
                })}
            </p>
          </div>
          <div className="pt-4">
             <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold py-2 px-6 rounded-full hover:scale-105 transition-transform">
                {t("cta_button")}
             </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">{t("feature_1_title")} & {t("feature_2_title")}</h2>
          <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
            {features.map((feature, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors list-none"
              >
                <div className="mb-4 p-3 bg-primary/10 rounded-xl w-fit">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* How To / Steps */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">{t("how_to_title")}</h2>
          <ol className="grid md:grid-cols-4 gap-4" role="list">
            {[1, 2, 3, 4].map((step) => (
              <li key={step} className="flex flex-col gap-2 p-4 rounded-xl bg-muted/20 border border-border/30">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                  {step}
                </div>
                <p className="text-sm text-muted-foreground pt-1">{t(`how_to_step_${step}`)}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* FAQ Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            {t("faq_title")}
          </h2>
          <dl className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-card/50 border border-border/50">
                <dt className="font-semibold text-lg mb-2">{faq.question}</dt>
                <dd className="text-muted-foreground">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>

      </div>
    </section>
  )
}
