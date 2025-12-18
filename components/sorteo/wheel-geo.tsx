"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Disc, Palette, ShieldCheck } from "lucide-react"

export function WheelGeo() {
  const t = useTranslations("WheelGeo")

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
  ]

  // Schema for "Direct Answer" optimization
  // Using FAQPage schema specifically for the "What is..." question
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: t('what_is_wheel'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('what_is_wheel_answer').replace(/\*\*(.*?)\*\*/g, '$1'), // Strip markdown for schema
        },
      }
    ]
  }

  return (
    <section className="w-full py-12 px-4 border-t border-border/30 bg-card/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">

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
                b: (chunks) => <strong className="text-foreground font-semibold">{chunks}</strong>
             })}
           </p>

           <div className="space-y-4 pt-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {t('features_list')}
              </h3>
              <ul className="space-y-3">
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
        </div>

        {/* Right: Visual Abstract (Placeholder or Icon Graphic) */}
        <div className="hidden md:flex justify-center items-center">
           <div className="relative w-64 h-64 rounded-full border-4 border-primary/20 flex items-center justify-center bg-card/50 backdrop-blur-sm">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-t-4 border-primary"
                />
                <Disc className="w-24 h-24 text-primary/50" />
           </div>
        </div>

      </div>
    </section>
  )
}
