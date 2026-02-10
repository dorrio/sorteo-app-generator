import { getTranslations } from "next-intl/server"
import { Disc, Palette, ShieldCheck, Play, Music, CheckCircle, HelpCircle, BookOpen } from "lucide-react"
import { TryToolButton } from "@/components/sorteo/try-tool-button"
import { WheelGeoVisual } from "@/components/sorteo/wheel-geo-visual"
import { Link } from "@/i18n/routing"

export async function WheelGeoServer() {
  const t = await getTranslations("WheelGeo")
  const tSpecs = await getTranslations("QuickSpecs")
  const tFaq = await getTranslations("WheelGeoPage")

  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
      text: t("feature_1"),
    },
    {
      icon: <Palette className="w-5 h-5 text-primary" />,
      text: t("feature_2"),
    },
    {
      icon: <Disc className="w-5 h-5 text-primary" />,
      text: t("feature_3"),
    },
    {
      icon: <Music className="w-5 h-5 text-primary" />,
      text: t("feature_4"),
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-primary" />,
      text: t("feature_5"),
    },
  ]

  // Consolidate all FAQs into one list
  const faqs = [
    {
      question: t('what_is_wheel'),
      answer: t.raw('what_is_wheel_answer') as string,
    },
    {
      question: tFaq('faq_1_q'),
      answer: tFaq('faq_1_a'),
    },
    {
      question: tFaq('faq_2_q'),
      answer: tFaq('faq_2_a'),
    },
  ]

  const howToSteps = [
    { name: t('how_to_step_1') },
    { name: t('how_to_step_2') },
    { name: t('how_to_step_3') },
    { name: t('how_to_step_4') },
  ]

  // Schema for "Direct Answer" optimization
  const jsonLd: Array<Record<string, unknown>> = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer.replace(/<[^>]*>?/gm, ''), // Strip HTML tags for schema
        },
      }))
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
    <section className="w-full py-12 px-4 border-t border-border/30 bg-card/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">

        {/* Left: Content & SEO Text */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Disc className="w-4 h-4" />
            {t('title')}
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {t('what_is_wheel')}
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.rich("what_is_wheel_answer", {
              b: (chunks) => <strong className="text-foreground font-semibold">{chunks}</strong>,
              rng: (chunks) => <Link href="/random-number-generator" className="font-semibold text-primary hover:underline">{chunks}</Link>
            })}
          </p>

          {/* Quick Specs Table (GEO Optimization) */}
          <div className="mt-6 border border-border/60 rounded-xl overflow-hidden shadow-sm bg-card/40">
            <div className="bg-primary/10 px-4 py-2 border-b border-border/60">
              <h3 className="font-semibold text-primary text-sm uppercase tracking-wide">{tSpecs("title")}</h3>
            </div>
            <dl className="divide-y divide-border/60">
              <div className="grid grid-cols-2 px-4 py-2 hover:bg-muted/30 transition-colors">
                <dt className="text-sm font-medium text-muted-foreground">{tSpecs("type")}</dt>
                <dd className="text-sm font-semibold">{tSpecs("type_picker")}</dd>
              </div>
              <div className="grid grid-cols-2 px-4 py-2 bg-muted/20 hover:bg-muted/30 transition-colors">
                <dt className="text-sm font-medium text-muted-foreground">{tSpecs("ads")}</dt>
                <dd className="text-sm font-bold text-green-600 dark:text-green-400">{tSpecs("ads_none")}</dd>
              </div>
              <div className="grid grid-cols-2 px-4 py-2 hover:bg-muted/30 transition-colors">
                <dt className="text-sm font-medium text-muted-foreground">{tSpecs("limit")}</dt>
                <dd className="text-sm font-semibold">{tSpecs("limit_unlimited")}</dd>
              </div>
              <div className="grid grid-cols-2 px-4 py-2 bg-muted/20 hover:bg-muted/30 transition-colors">
                <dt className="text-sm font-medium text-muted-foreground">{tSpecs("fairness")}</dt>
                <dd className="text-sm font-semibold">{tSpecs("fairness_provably")}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {t('features_list')}
            </h3>
            <ul className="space-y-3" role="list">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-foreground/90">
                  <div className="p-1.5 rounded-full bg-primary/20 text-primary">
                    {feature.icon}
                  </div>
                  {feature.text}
                </li>
              ))}
            </ul>

            {/* Trust Signal */}
            <div className="pt-2">
              <Link href="/glossary#rng" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {t('trust_link_text')}
              </Link>
            </div>

            <div className="pt-4">
              <TryToolButton
                targetStyle="roulette"
                className="gap-2 font-bold text-lg h-12 px-6 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                {t('cta_button')}
              </TryToolButton>
            </div>
          </div>

          {/* How To Section (New) */}
          <div className="pt-8 border-t border-primary/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              {t('how_to_title')}
            </h3>
            <ol className="relative border-l border-primary/20 ml-3 space-y-6">
              {howToSteps.map((step, idx) => (
                <li key={idx} className="ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full -left-3 ring-4 ring-background text-xs font-bold text-primary">
                    {idx + 1}
                  </span>
                  <p className="text-base text-muted-foreground">{step.name}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Visible FAQ Section (Anti-Cloaking) */}
          <div className="pt-8 border-t border-primary/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              FAQ
            </h3>
            <dl className="grid gap-6">
              {/* Skip the first one as it is the "What is" section above */}
              {faqs.slice(1).map((faq, idx) => (
                <div key={idx} className="space-y-2">
                  <dt className="font-bold text-base text-foreground">{faq.question}</dt>
                  <dd className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Right: Visual Abstract (Placeholder or Icon Graphic) */}
        <WheelGeoVisual ctaText={t('cta_button')} />

      </div >
    </section >
  )
}
