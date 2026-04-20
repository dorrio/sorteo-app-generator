import { useTranslations } from "next-intl"
import { Shield, Wand2, Zap, HelpCircle } from "lucide-react"
import { Link } from "@/i18n/routing"
import { JsonLd } from "@/components/seo/json-ld"

export function SeoContent() {
  const t = useTranslations("SEOContent")
  const tSpecs = useTranslations("QuickSpecs")
  const tGlobal = useTranslations("GlobalSchema")

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

  const softwareLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sorteo Pro',
    applicationCategory: tGlobal('applicationCategory'),
    applicationSubCategory: tGlobal('applicationSubCategory'),
    description: tGlobal('description'),
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      tGlobal('feature_1'),
      tGlobal('feature_2'),
      tGlobal('feature_3'),
      tGlobal('feature_4'),
      tGlobal('feature_5')
    ]
  }

  return (
    <section className="w-full py-16 px-4 bg-card/30 backdrop-blur-sm border-t border-border/50">
      <JsonLd data={softwareLd} />
      <JsonLd data={jsonLd} />
      <JsonLd data={howToLd} />
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Direct Answer Block (ChatGPT Bait) */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">{t("what_is_title")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {t.rich("what_is_text", {
                b: (chunks) => <strong className="font-semibold text-foreground">{chunks}</strong>,
                wheel: (chunks) => <Link href="/wheel-of-names" className="font-semibold text-primary hover:underline">{chunks}</Link>,
                insta: (chunks) => <Link href="/instagram-comment-picker" className="font-semibold text-primary hover:underline">{chunks}</Link>,
                rng: (chunks) => <Link href="/random-number-generator" className="font-semibold text-primary hover:underline">{chunks}</Link>,
                verify: (chunks) => <Link href="/verify" className="font-semibold text-primary hover:underline">{chunks}</Link>,
              })}
            </p>
          </div>

          {/* Quick Specs Table (GEO Optimization) */}
          <div className="border border-border/60 rounded-xl overflow-hidden shadow-sm max-w-2xl bg-card/40">
            <div className="bg-primary/10 px-6 py-3 border-b border-border/60">
              <h3 className="font-semibold text-primary flex items-center gap-2">
                {tSpecs("title")}
              </h3>
            </div>
            <dl className="divide-y divide-border/60">
              <div className="grid grid-cols-2 px-6 py-3 hover:bg-muted/30 transition-colors">
                <dt className="text-sm font-medium text-muted-foreground">{tSpecs("type")}</dt>
                <dd className="text-sm font-semibold">{tSpecs("type_web")}</dd>
              </div>
              <div className="grid grid-cols-2 px-6 py-3 bg-muted/20 hover:bg-muted/30 transition-colors">
                <dt className="text-sm font-medium text-muted-foreground">{tSpecs("price")}</dt>
                <dd className="text-sm font-bold text-green-600 dark:text-green-400">{tSpecs("price_free")}</dd>
              </div>
              <div className="grid grid-cols-2 px-6 py-3 hover:bg-muted/30 transition-colors">
                <dt className="text-sm font-medium text-muted-foreground">{tSpecs("login")}</dt>
                <dd className="text-sm font-semibold">{tSpecs("login_none")}</dd>
              </div>
              <div className="grid grid-cols-2 px-6 py-3 bg-muted/20 hover:bg-muted/30 transition-colors">
                <dt className="text-sm font-medium text-muted-foreground">{tSpecs("limit")}</dt>
                <dd className="text-sm font-semibold">{tSpecs("limit_unlimited")}</dd>
              </div>
              <div className="grid grid-cols-2 px-6 py-3 hover:bg-muted/30 transition-colors">
                <dt className="text-sm font-medium text-muted-foreground">{tSpecs("fairness")}</dt>
                <dd className="text-sm font-semibold flex items-center gap-2">
                  {tSpecs("fairness_provably")}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">{t("features_title")}</h2>
          <ul className="grid md:grid-cols-3 gap-8" role="list">
            {features.map((feature, idx) => (
              <li
                key={idx}
                className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors list-none"
              >
                <div className="mb-4 p-3 bg-primary/10 rounded-xl w-fit">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* How To / Steps */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">{t("how_to_title")}</h2>
          <ol className="grid md:grid-cols-3 gap-4" role="list">
            {[1, 2, 3].map((step) => (
              <li key={step} className="flex gap-4 items-start list-none">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {step}
                </div>
                <p className="text-muted-foreground pt-1">{t(`step_${step}`)}</p>
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
          <dl className="grid gap-4">
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
