import { useTranslations } from "next-intl"
import { Disc, Check, X, ShieldCheck, Play, CheckCircle, HelpCircle, BookOpen, ToggleLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { JsonLd } from '@/components/seo/json-ld'
import { TryToolButton } from "./try-tool-button"

export function YesNoGeo() {
  const t = useTranslations("YesNoGeo")

  const features = [
    {
      icon: <Check className="w-5 h-5 text-primary" />,
      text: t("feature_1"),
    },
    {
      icon: <X className="w-5 h-5 text-primary" />,
      text: t("feature_2"),
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
      text: t("feature_3"),
    },
    {
      icon: <Disc className="w-5 h-5 text-primary" />,
      text: t("feature_4"),
    },
    {
      icon: <ToggleLeft className="w-5 h-5 text-primary" />,
      text: t("feature_5"),
    },
  ]

  const faqs = [
    {
      question: t('what_is_title'),
      answer: t('what_is_answer'),
    },
    {
      question: t('faq_1_q'),
      answer: t('faq_1_a'),
    },
    {
      question: t('faq_2_q'),
      answer: t('faq_2_a'),
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
            text: faq.answer.replace(/<[^>]*>?/gm, ''),
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
<JsonLd data={jsonLd} />
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">

        {/* Left: Content & SEO Text */}
        <div className="space-y-6">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <ToggleLeft className="w-4 h-4" />
              {t('title')}
           </div>

           <h2 className="text-3xl font-bold tracking-tight text-foreground">
             {t('what_is_title')}
           </h2>

           <p className="text-lg text-muted-foreground leading-relaxed">
             {t.rich("what_is_answer", {
                b: (chunks) => <strong className="text-foreground font-semibold">{chunks}</strong>
             })}
           </p>

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
                  <Button
                    asChild
                    className="gap-2 font-bold text-lg h-12 px-6 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                  >
                    <TryToolButton sorteoStyle="roulette">
                      <Play className="w-5 h-5 fill-current" />
                      {t('cta_button')}
                    </TryToolButton>
                  </Button>
              </div>
           </div>

           {/* How To Section */}
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

           {/* Visible FAQ Section */}
           <div className="pt-8 border-t border-primary/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <HelpCircle className="w-5 h-5 text-primary" />
                 FAQ
              </h3>
              <dl className="grid gap-6">
                 {faqs.slice(1).map((faq, idx) => (
                     <div key={idx} className="space-y-2">
                         <dt className="font-bold text-base text-foreground">{faq.question}</dt>
                         <dd className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</dd>
                     </div>
                 ))}
              </dl>
           </div>
        </div>

        {/* Right: Visual Abstract */}
        <div className="hidden md:flex justify-center items-center sticky top-24">
           <TryToolButton
             sorteoStyle="roulette"
             className="relative w-64 h-64 rounded-full border-4 border-primary/20 flex items-center justify-center bg-card/50 backdrop-blur-sm cursor-pointer hover:scale-105 transition-transform"
             aria-label={t('cta_button')}
           >
                <div
                    className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin"
                    style={{ animationDuration: '20s' }}
                />
                <ToggleLeft className="w-24 h-24 text-primary/50" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-background/50 rounded-full">
                    <Play className="w-12 h-12 text-primary fill-current" />
                </div>
           </TryToolButton>
        </div>

      </div>
    </section>
  )
}
