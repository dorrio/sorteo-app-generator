"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { HelpCircle, Check, X, ShieldCheck, Play, CheckCircle, Flame, BookOpen } from "lucide-react"
import { useSorteoStore } from "@/lib/sorteo-store"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"

interface Feature {
  icon: JSX.Element;
  text: string;
  desc: string;
}

interface Faq {
  question: string;
  answer: string;
}

interface HowToStep {
  name: string;
}

type JsonLd = Record<string, unknown>;

export function TruthDareGeo(): JSX.Element {
  const t = useTranslations("TruthDareGeo")
  const tSpecs = useTranslations("QuickSpecs")
  const { updateTheme } = useSorteoStore()

  const handleTryTool = (): void => {
    updateTheme({ sorteoStyle: "roulette" })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const features: Feature[] = [
    {
      icon: <HelpCircle className="w-5 h-5 text-primary" />,
      text: t("feature_1_title"),
      desc: t("feature_1_desc"),
    },
    {
      icon: <Flame className="w-5 h-5 text-primary" />,
      text: t("feature_2_title"),
      desc: t("feature_2_desc"),
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
      text: t("feature_3_title"),
      desc: t("feature_3_desc"),
    },
    {
      icon: <Check className="w-5 h-5 text-primary" />,
      text: t("feature_4_title"),
      desc: t("feature_4_desc"),
    },
  ]

  const faqs: Faq[] = [
    {
      question: t('direct_answer_title'),
      answer: t('direct_answer_text'),
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

  const howToSteps: HowToStep[] = [
    { name: t('how_to_step_1') },
    { name: t('how_to_step_2') },
    { name: t('how_to_step_3') },
    { name: t('how_to_step_4') },
  ]

  const jsonLd: JsonLd[] = [
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
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Truth or Dare Generator',
      applicationCategory: 'GameApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      description: t('direct_answer_text').replace(/<[^>]*>?/gm, ''),
    }
  ]

  return (
    <section className="w-full py-12 px-4 border-t border-border/30 bg-card/20">
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted schema data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">

        {/* Left: Content & SEO Text */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            {t('direct_answer_title')}
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {t('direct_answer_title')}
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.rich("direct_answer_text", {
              tool: (chunks) => <strong className="text-foreground font-semibold">{chunks}</strong>,
              brand: (chunks) => <strong className="text-primary font-semibold">{chunks}</strong>
            })}
          </p>

          {/* Quick Specs Table */}
          <div className="mt-6 border border-border/60 rounded-xl overflow-hidden shadow-sm bg-card/40">
            <div className="bg-primary/10 px-4 py-2 border-b border-border/60">
              <h3 className="font-semibold text-primary text-sm uppercase tracking-wide">{tSpecs("title")}</h3>
            </div>
            <dl className="divide-y divide-border/60">
              <div className="grid grid-cols-2 px-4 py-2 hover:bg-muted/30 transition-colors">
                <dt className="text-sm font-medium text-muted-foreground">{tSpecs("type")}</dt>
                <dd className="text-sm font-semibold">{tSpecs("type_web")}</dd>
              </div>
              <div className="grid grid-cols-2 px-4 py-2 bg-muted/20 hover:bg-muted/30 transition-colors">
                <dt className="text-sm font-medium text-muted-foreground">{tSpecs("price")}</dt>
                <dd className="text-sm font-bold text-green-600 dark:text-green-400">{tSpecs("price_free")}</dd>
              </div>
              <div className="grid grid-cols-2 px-4 py-2 hover:bg-muted/30 transition-colors">
                <dt className="text-sm font-medium text-muted-foreground">{tSpecs("limit")}</dt>
                <dd className="text-sm font-semibold">{tSpecs("limit_unlimited")}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {t('feature_1_title')}
            </h3>
            <ul className="space-y-3" role="list">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-foreground/90">
                  <div className="p-1.5 rounded-full bg-primary/20 text-primary">
                    {feature.icon}
                  </div>
                  <span>
                    <span className="font-semibold">{feature.text}:</span> {feature.desc}
                  </span>
                </li>
              ))}
            </ul>

            {/* Trust Signal */}
            <div className="pt-2">
              <Link href="/glossary#rng" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                {t('cta_button')}
              </Link>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleTryTool}
                className="gap-2 font-bold text-lg h-12 px-6 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                <Play className="w-5 h-5 fill-current" />
                {t('cta_button')}
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
              {t('faq_title')}
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
          <button
            type="button"
            className="relative w-64 h-64 rounded-full border-4 border-primary/20 flex items-center justify-center bg-card/50 backdrop-blur-sm cursor-pointer hover:scale-105 transition-transform"
            onClick={handleTryTool}
            aria-label={t('cta_button')}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-t-4 border-primary"
            />
            <Flame className="w-24 h-24 text-primary/50" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-background/50 rounded-full">
              <Play className="w-12 h-12 text-primary fill-current" />
            </div>
          </button>
        </div>

      </div>
    </section>
  )
}
