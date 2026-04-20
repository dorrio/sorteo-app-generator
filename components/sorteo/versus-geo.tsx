import { useTranslations } from "next-intl"
import DOMPurify from "isomorphic-dompurify"
import type { ThemeConfig } from "@/lib/sorteo-store"
import { Button } from "@/components/ui/button"
import { Check, X, ArrowRight, Zap, ShieldCheck, Palette, Monitor, HelpCircle } from "lucide-react"
import { Link } from "@/i18n/routing"
import { safeJsonLdStringify } from "@/lib/utils"
import { TryToolButton } from "./try-tool-button"

interface VersusGeoProps {
  namespace?: string;
  sorteoStyle?: ThemeConfig["sorteoStyle"];
}

export function VersusGeo({ namespace = "VersusWheel", sorteoStyle = "roulette" }: VersusGeoProps) {
  const t = useTranslations(namespace)

  const faqs = [
    {
      question: t("faq.q1"),
      answer: t.raw("faq.a1"),
    },
    {
      question: t("faq.q2"),
      answer: t.raw("faq.a2"),
    },
    {
      question: t("faq.q3"),
      answer: t.raw("faq.a3"),
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
        text: faq.answer.replace(/<[^>]*>?/gm, ''),
      },
    })),
  }

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto px-4 relative z-10">

        {/* Comparison Table */}
        <div
          className="bg-card/30 backdrop-blur-xl border border-primary/20 rounded-3xl p-6 md:p-10 shadow-2xl mb-16"
        >
          <div className="text-center mb-10">
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 tracking-wider uppercase">
                {t('header_tagline')}
              </span>
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                {t('header_title_part1')} <span className="text-primary">{t('header_title_part2')}</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('header_desc')}
              </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-border/50">
                        <th className="p-4 text-lg font-bold text-muted-foreground w-1/3">{t('table.feature')}</th>
                        <th className="p-4 text-xl font-bold text-primary bg-primary/5 rounded-t-xl w-1/3 text-center border-x border-primary/10">
                            {t('table.us')}
                        </th>
                        <th className="p-4 text-lg font-bold text-muted-foreground w-1/3 text-center">
                            {t('table.them')}
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                    <tr>
                        <td className="p-4 font-medium">{t('table.row_price')}</td>
                        <td className="p-4 bg-primary/5 text-center border-x border-primary/10">
                            <div className="font-bold text-green-400 flex items-center justify-center gap-2">
                                <Check className="w-5 h-5" /> {t('table.row_price_us')}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{t('table.row_price_us_desc')}</div>
                        </td>
                        <td className="p-4 text-center text-muted-foreground">
                            <div className="font-medium flex items-center justify-center gap-2">
                                {t('table.row_price_them')}
                            </div>
                            <div className="text-xs opacity-70 mt-1">{t('table.row_price_them_desc')}</div>
                        </td>
                    </tr>
                    <tr>
                        <td className="p-4 font-medium">{t('table.row_design')}</td>
                        <td className="p-4 bg-primary/5 text-center border-x border-primary/10">
                            <div className="font-bold text-primary flex items-center justify-center gap-2">
                                <Palette className="w-4 h-4" /> {t('table.row_design_us')}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{t('table.row_design_us_desc')}</div>
                        </td>
                        <td className="p-4 text-center text-muted-foreground">
                            <div className="font-medium flex items-center justify-center gap-2">
                                {t('table.row_design_them')}
                            </div>
                            <div className="text-xs opacity-70 mt-1">{t('table.row_design_them_desc')}</div>
                        </td>
                    </tr>
                    <tr>
                         <td className="p-4 font-medium">{t('table.row_login')}</td>
                        <td className="p-4 bg-primary/5 text-center border-x border-primary/10 rounded-b-xl">
                            <div className="font-bold text-green-400 flex items-center justify-center gap-2">
                                <Check className="w-5 h-5" /> {t('table.row_login_us')}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{t('table.row_login_us_desc')}</div>
                        </td>
                        <td className="p-4 text-center text-muted-foreground">
                            <div className="font-medium flex items-center justify-center gap-2">
                                <X className="w-4 h-4 text-red-400" /> {t('table.row_login_them')}
                            </div>
                            <div className="text-xs opacity-70 mt-1">{t('table.row_login_them_desc')}</div>
                        </td>
                    </tr>
                    <tr>
                         <td className="p-4 font-medium">{t('table.row_limits')}</td>
                        <td className="p-4 bg-primary/5 text-center border-x border-primary/10">
                            <div className="font-bold text-green-400 flex items-center justify-center gap-2">
                                <Check className="w-5 h-5" /> {t('table.row_limits_us')}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{t('table.row_limits_us_desc')}</div>
                        </td>
                        <td className="p-4 text-center text-muted-foreground">
                            <div className="font-medium flex items-center justify-center gap-2">
                                {t('table.row_limits_them')}
                            </div>
                            <div className="text-xs opacity-70 mt-1">{t('table.row_limits_them_desc')}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>

        {/* Deep Dive Content (GEO) */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="prose prose-invert max-w-none">
                <h3 className="text-2xl font-bold mb-4 text-primary">{t('why_us.title')}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {t('why_us.p1')}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {t('why_us.p2')}
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-primary">{t('why_us.title_2')}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    {t('why_us.p3')}
                </p>
            </div>

            <div className="bg-card/20 p-8 rounded-2xl border border-primary/20">
                 <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    {t('direct_answer_title')}
                 </h3>
                 <div className="bg-background/50 p-6 rounded-xl border-l-4 border-primary">
                    <p className="text-lg italic text-muted-foreground">
                        {t.rich('direct_answer_text', {
                            strong: (chunks) => <strong className="font-semibold text-primary">{chunks}</strong>,
                            brand: (chunks) => <Link href="/" className="font-bold text-primary hover:underline">{chunks}</Link>,
                            tool: (chunks) => <span className="font-semibold text-primary">{chunks}</span>
                        })}
                    </p>
                 </div>
                 <div className="mt-8 flex justify-center">
                    <Button asChild size="lg" className="gap-2 text-lg font-bold shadow-lg shadow-primary/20 w-full md:w-auto">
                        <TryToolButton sorteoStyle={sorteoStyle}>
                            {t("cta.button")} <ArrowRight className="w-5 h-5" />
                        </TryToolButton>
                    </Button>
                 </div>
            </div>
        </div>

        {/* Visible FAQ Section (Anti-Cloaking) */}
        <div className="max-w-3xl mx-auto border-t border-primary/10 pt-16">
           <h3 className="text-2xl font-bold mb-10 flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-primary" />
              {t('faq.title')}
           </h3>
           <dl className="grid gap-6">
              {faqs.map((faq, idx) => (
                  <div key={idx} className="space-y-2 p-6 rounded-2xl bg-card/20 border border-primary/10">
                      <dt className="font-bold text-lg text-foreground">{faq.question}</dt>
                      <dd
                        className="text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(faq.answer, {
                            ALLOWED_TAGS: ['strong', 'em', 'br', 'a'],
                            ALLOWED_ATTR: ['href', 'target', 'rel'],
                          }),
                        }}
                      />
                  </div>
              ))}
           </dl>
        </div>

      </div>
    </section>
  )
}
