import { useTranslations } from "next-intl"
import { Coins, ShieldCheck, Zap, Smartphone, HelpCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { JsonLd } from '@/components/seo/json-ld'
export function CoinGeo() {
  const t = useTranslations("CoinGeo")
  const tFaq = useTranslations("CoinPage")

  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
      text: t("feature_1"),
    },
    {
      icon: <Coins className="w-5 h-5 text-primary" />,
      text: t("feature_2"),
    },
    {
      icon: <Zap className="w-5 h-5 text-primary" />,
      text: t("feature_3"),
    },
    {
      icon: <Smartphone className="w-5 h-5 text-primary" />,
      text: t("feature_4"),
    },
  ]

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
    { name: t("how_to_step_1") },
    { name: t("how_to_step_2") },
    { name: t("how_to_step_3") },
    { name: t("how_to_step_4") },
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
      }))
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: t("how_to_title"),
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
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Coins className="w-4 h-4" />
            {t("title")}
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {t("direct_answer_title")}
          </h2>

          <div className="prose prose-lg text-muted-foreground leading-relaxed">
            <p>
              {t.rich("direct_answer_text", {
                strong: (chunks) => <strong className="font-semibold text-foreground">{chunks}</strong>,
                tool: (chunks) => <Link href="/coin-flip" className="font-semibold text-primary hover:underline">{chunks}</Link>,
                brand: (chunks) => <Link href="/" className="font-semibold text-primary hover:underline">{chunks}</Link>
              })}
            </p>
          </div>

          <div className="space-y-4 pt-4">
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
          </div>

          {/* How To Section */}
          <div className="pt-8 border-t border-primary/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              {t("how_to_title")}
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

          {/* FAQ Section */}
          <div className="pt-8 border-t border-primary/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              FAQ
            </h3>
            <dl className="grid gap-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="space-y-2">
                  <dt className="font-bold text-base text-foreground">{faq.question}</dt>
                  <dd className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="hidden md:flex justify-center items-center sticky top-24">
          <div className="relative w-64 h-64 rounded-full border-4 border-primary/20 flex items-center justify-center bg-card/50 backdrop-blur-sm">
            <Coins className="w-32 h-32 text-primary/50" />
            <div className="absolute -bottom-10 text-center w-full">
                <Button asChild className="rounded-full font-bold shadow-lg shadow-primary/20">
                    <a href="#sorteo-section">{t("cta_button")}</a>
                </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
