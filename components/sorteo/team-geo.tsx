"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Grid, Share2, HelpCircle, CheckCircle, GraduationCap, Gamepad2, Briefcase } from "lucide-react"
import { useSorteoStore } from "@/lib/sorteo-store"
import { Link } from "@/i18n/routing"
import { safeJsonLdStringify } from "@/lib/utils"

export function TeamGeo() {
  const t = useTranslations("TeamGeo")
  // We can reuse FAQ from ListRandomizer as it is similar, or create new ones.
  // For now let's reuse generic ones if needed or just use TeamGeo specific strings if I added them (which I did not add separate FAQ keys for TeamPage, only TeamGeneratorPage metadata)
  // Actually I added TeamGeneratorPage namespace but it only had title/desc/h1/subtitle.
  // I should use generic FAQs or hardcode/translate specific ones if I had added them.
  // Wait, I didn't add FAQs to TeamGeneratorPage in my JSON update.
  // I will use "ListRandomizerPage" FAQs as fallback since they are relevant, or better, skip FAQs here and rely on the Direct Answer + Features + How To + Use Cases which are the strong GEO signals.
  // Or I can use t.rich for FAQs if I added them to TeamGeo... I didn't add FAQ array to TeamGeo.
  // I'll stick to what I added in TeamGeo: features, how_to, uses, direct_answer.
  const { updateTheme } = useSorteoStore()

  const handleTryIt = () => {
    updateTheme({ sorteoStyle: 'grid' })
  }

  const howToSteps = [
    { name: t('how_to_step_1') },
    { name: t('how_to_step_2') },
    { name: t('how_to_step_3') },
    { name: t('how_to_step_4') },
  ]

  const jsonLd = [
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
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div
          className="bg-card/30 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          {/* Direct Answer Block (GEO) */}
          <div className="mb-10 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
              {t("direct_answer_title")}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.rich("direct_answer_text", {
                  strong: (chunks) => <strong className="font-semibold text-foreground">{chunks}</strong>,
                  tool: (chunks) => <Link href="/team-generator" className="font-semibold text-primary hover:underline">{chunks}</Link>,
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

          {/* Features Grid */}
          <ul className="grid md:grid-cols-2 gap-8 mt-12 mb-16" role="list">
            <li className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <Users className="w-5 h-5" />
                {t("feature_1_title")}
              </h3>
              <p className="text-muted-foreground">{t("feature_1_desc")}</p>
            </li>

            <li className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <Grid className="w-5 h-5" />
                {t("feature_2_title")}
              </h3>
              <p className="text-muted-foreground">{t("feature_2_desc")}</p>
            </li>

            <li className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                {t("feature_3_title")}
              </h3>
              <p className="text-muted-foreground">{t("feature_3_desc")}</p>
            </li>

            <li className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <Share2 className="w-5 h-5" />
                {t("feature_4_title")}
              </h3>
              <p className="text-muted-foreground">{t("feature_4_desc")}</p>
            </li>
          </ul>

          {/* Popular Uses Section (Targeting Niche Keywords) */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">{t("uses_title")}</h3>
            <ul className="grid md:grid-cols-3 gap-6" role="list">
                <li className="bg-background/40 p-6 rounded-2xl border border-primary/10 hover:border-primary/30 transition-colors">
                    <GraduationCap className="w-8 h-8 text-primary mb-4" />
                    <h4 className="font-bold text-lg mb-2">{t("use_1_title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("use_1_desc")}</p>
                </li>
                <li className="bg-background/40 p-6 rounded-2xl border border-primary/10 hover:border-primary/30 transition-colors">
                    <Gamepad2 className="w-8 h-8 text-primary mb-4" />
                    <h4 className="font-bold text-lg mb-2">{t("use_2_title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("use_2_desc")}</p>
                </li>
                 <li className="bg-background/40 p-6 rounded-2xl border border-primary/10 hover:border-primary/30 transition-colors">
                    <Briefcase className="w-8 h-8 text-primary mb-4" />
                    <h4 className="font-bold text-lg mb-2">{t("use_3_title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("use_3_desc")}</p>
                </li>
            </ul>
          </div>

          {/* How To Section */}
          <div className="pt-10 border-t border-primary/10">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                 <HelpCircle className="w-6 h-6 text-primary" />
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

        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl delay-1000" />
      </div>
    </section>
  )
}
