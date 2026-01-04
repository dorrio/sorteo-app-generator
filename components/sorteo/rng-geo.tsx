"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Lock, Zap, RefreshCw, Smartphone, List } from "lucide-react"
import { useSorteoStore } from "@/lib/sorteo-store"

export function RngGeo() {
  const t = useTranslations("RngGeo")
  const { updateTheme, setIsEditorOpen } = useSorteoStore()

  const handleTryIt = () => {
    updateTheme({ sorteoStyle: 'slot-machine' })
    const element = document.getElementById('sorteo-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
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
              <p
                className="text-lg text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t.raw("direct_answer_text") }}
              />
            </div>
            <Button onClick={handleTryIt} size="lg" className="mt-4 gap-2 text-lg font-bold shadow-lg shadow-primary/20">
              {t("cta_button")} <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <Lock className="w-5 h-5" />
                {t("feature_1_title")}
              </h3>
              <p className="text-muted-foreground">{t("feature_1_desc")}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <Zap className="w-5 h-5" />
                {t("feature_2_title")}
              </h3>
              <p className="text-muted-foreground">{t("feature_2_desc")}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <RefreshCw className="w-5 h-5" />
                {t("feature_3_title")}
              </h3>
              <p className="text-muted-foreground">{t("feature_3_desc")}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <Smartphone className="w-5 h-5" />
                {t("feature_4_title")}
              </h3>
              <p className="text-muted-foreground">{t("feature_4_desc")}</p>
            </div>
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
