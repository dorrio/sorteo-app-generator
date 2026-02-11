"use client"

import { useTranslations } from "next-intl"

interface QuickSpecsProps {
  type?: string
  ads?: string
  limit?: string
  fairness?: string
  className?: string
}

export function QuickSpecs({
  type = "type_picker",
  ads = "ads_none",
  limit = "limit_unlimited",
  fairness = "fairness_provably",
  className = ""
}: QuickSpecsProps) {
  const t = useTranslations("QuickSpecs")

  return (
    <div className={`mt-6 border border-border/60 rounded-xl overflow-hidden shadow-sm bg-card/40 max-w-lg ${className}`}>
      <div className="bg-primary/10 px-4 py-2 border-b border-border/60">
        <h3 className="font-semibold text-primary text-sm uppercase tracking-wide">{t("title")}</h3>
      </div>
      <dl className="divide-y divide-border/60">
        <div className="grid grid-cols-2 px-4 py-2 hover:bg-muted/30 transition-colors">
          <dt className="text-sm font-medium text-muted-foreground">{t("type")}</dt>
          <dd className="text-sm font-semibold">{t(type)}</dd>
        </div>
        <div className="grid grid-cols-2 px-4 py-2 bg-muted/20 hover:bg-muted/30 transition-colors">
          <dt className="text-sm font-medium text-muted-foreground">{t("ads")}</dt>
          <dd className="text-sm font-bold text-green-600 dark:text-green-400">{t(ads)}</dd>
        </div>
        <div className="grid grid-cols-2 px-4 py-2 hover:bg-muted/30 transition-colors">
          <dt className="text-sm font-medium text-muted-foreground">{t("limit")}</dt>
          <dd className="text-sm font-semibold">{t(limit)}</dd>
        </div>
        <div className="grid grid-cols-2 px-4 py-2 bg-muted/20 hover:bg-muted/30 transition-colors">
          <dt className="text-sm font-medium text-muted-foreground">{t("fairness")}</dt>
          <dd className="text-sm font-semibold">{t(fairness)}</dd>
        </div>
      </dl>
    </div>
  )
}
