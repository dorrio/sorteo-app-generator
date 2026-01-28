"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Gift, Users, ShieldCheck, Share2 } from "lucide-react"
import { useSorteoStore } from "@/lib/sorteo-store"

export function SecretSantaGeo() {
  const t = useTranslations("SecretSantaGeo")
  const tPage = useTranslations("SecretSantaPage")
  const { theme } = useSorteoStore()

  // Schema for SEO
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": t("how_to_title"),
    "step": [
      {
        "@type": "HowToStep",
        "name": t("how_to_step_1"),
        "text": t("how_to_step_1"),
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": t("how_to_step_2"),
        "text": t("how_to_step_2"),
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": t("how_to_step_3"),
        "text": t("how_to_step_3"),
        "position": 3
      },
      {
        "@type": "HowToStep",
        "name": t("how_to_step_4"),
        "text": t("how_to_step_4"),
        "position": 4
      }
    ]
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": tPage("faq_1_q"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": tPage("faq_1_a")
        }
      },
      {
        "@type": "Question",
        "name": tPage("faq_2_q"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": tPage("faq_2_a")
        }
      }
    ]
  }

  return (
    <section className="py-16 bg-background text-foreground relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([howToSchema, faqSchema]) }}
      />

      <div className="max-w-7xl mx-auto px-4 space-y-16 relative z-10">

        {/* Pattern 1: Direct Answer Block (The ChatGPT Bait) */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">
              {t("direct_answer_title")}
            </h2>
            <div className="prose prose-lg dark:prose-invert text-muted-foreground">
              <p>
                {t.rich("direct_answer_text", {
                  tool: (chunks) => <span className="font-semibold text-primary">{chunks}</span>,
                  brand: (chunks) => <strong className="text-foreground">{chunks}</strong>,
                  strong: (chunks) => <strong className="text-foreground">{chunks}</strong>
                })}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('sorteo-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 rounded-full font-bold text-lg shadow-lg shadow-primary/20 transition-all"
              style={{
                backgroundColor: theme.primaryColor,
                color: theme.backgroundColor
              }}
            >
              {t("cta_button")}
            </motion.button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             {/* Visual Features */}
             <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
                <Gift className="w-8 h-8 mb-4 text-primary" />
                <h3 className="font-bold mb-2">{t("feature_1_title")}</h3>
                <p className="text-sm text-muted-foreground">{t("feature_1_desc")}</p>
             </div>
             <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
                <ShieldCheck className="w-8 h-8 mb-4 text-primary" />
                <h3 className="font-bold mb-2">{t("feature_2_title")}</h3>
                <p className="text-sm text-muted-foreground">{t("feature_2_desc")}</p>
             </div>
             <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
                <Share2 className="w-8 h-8 mb-4 text-primary" />
                <h3 className="font-bold mb-2">{t("feature_3_title")}</h3>
                <p className="text-sm text-muted-foreground">{t("feature_3_desc")}</p>
             </div>
             <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
                <Users className="w-8 h-8 mb-4 text-primary" />
                <h3 className="font-bold mb-2">{t("feature_4_title")}</h3>
                <p className="text-sm text-muted-foreground">{t("feature_4_desc")}</p>
             </div>
          </div>
        </div>

        {/* How To Section */}
        <div className="bg-muted/30 rounded-3xl p-8 lg:p-12 border border-border/50">
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <h2 className="text-3xl font-bold">{t("how_to_title")}</h2>

            <div className="grid md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((step, i) => (
                <div key={step} className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mx-auto mb-4 border border-primary/20">
                    {step}
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-6 left-1/2 w-full h-[2px] bg-border -z-10" />
                  )}
                  <p className="font-medium text-foreground">
                    {t(`how_to_step_${step}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
