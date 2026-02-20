import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { HelpCircle, Sparkles, Zap, ShieldCheck, FileText } from "lucide-react"

export function TruthGeo() {
  const t = useTranslations("TruthGeo")
  const tSpecs = useTranslations("QuickSpecs")

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 py-12">
      {/* Direct Answer Block (GEO) */}
      <section className="bg-card/50 border border-primary/20 rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary" />
          {t('direct_answer_title')}
        </h2>
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
          <p>
            {t.rich('direct_answer_text', {
              tool: (chunks) => <strong className="text-foreground">{chunks}</strong>,
              brand: (chunks) => <Link href="/" className="font-bold text-primary hover:underline">{chunks}</Link>,
              strong: (chunks) => <strong className="font-semibold text-foreground">{chunks}</strong>
            })}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-card border border-border/50">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xl mb-2">{t('feature_1_title')}</h3>
            <p className="text-muted-foreground">{t('feature_1_desc')}</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border/50">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xl mb-2">{t('feature_2_title')}</h3>
            <p className="text-muted-foreground">{t('feature_2_desc')}</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border/50">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xl mb-2">{t('feature_3_title')}</h3>
            <p className="text-muted-foreground">{t('feature_3_desc')}</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border/50">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xl mb-2">{t('feature_4_title')}</h3>
            <p className="text-muted-foreground">{t('feature_4_desc')}</p>
          </div>
        </div>
      </section>

      {/* Quick Specs (Inline) */}
      <section className="bg-card/50 border border-border/50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            {tSpecs('title')}
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
                <dt className="text-sm text-muted-foreground mb-1">{tSpecs('type')}</dt>
                <dd className="font-semibold">{tSpecs('type_picker')}</dd>
            </div>
            <div>
                <dt className="text-sm text-muted-foreground mb-1">{tSpecs('price')}</dt>
                <dd className="font-semibold">{tSpecs('price_free')}</dd>
            </div>
            <div>
                <dt className="text-sm text-muted-foreground mb-1">{tSpecs('limit')}</dt>
                <dd className="font-semibold">{tSpecs('limit_unlimited')}</dd>
            </div>
            <div>
                <dt className="text-sm text-muted-foreground mb-1">{tSpecs('fairness')}</dt>
                <dd className="font-semibold">{tSpecs('fairness_provably')}</dd>
            </div>
        </dl>
      </section>

      {/* How To */}
      <section className="bg-muted/30 rounded-2xl p-8 border border-border/50">
        <h2 className="text-2xl font-bold mb-6">{t('how_to_title')}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
            <li><span className="text-foreground font-medium">{t('how_to_step_1')}</span></li>
            <li><span className="text-foreground font-medium">{t('how_to_step_2')}</span></li>
            <li><span className="text-foreground font-medium">{t('how_to_step_3')}</span></li>
            <li><span className="text-foreground font-medium">{t('how_to_step_4')}</span></li>
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-bold mb-6">{t('faq_title')}</h2>
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-card border border-border/50">
            <h3 className="font-bold text-lg mb-2">{t('faq_1_q')}</h3>
            <p className="text-muted-foreground">{t('faq_1_a')}</p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border/50">
            <h3 className="font-bold text-lg mb-2">{t('faq_2_q')}</h3>
            <p className="text-muted-foreground">{t('faq_2_a')}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
