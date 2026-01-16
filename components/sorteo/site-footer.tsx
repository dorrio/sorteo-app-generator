"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

export function SiteFooter() {
  const t = useTranslations("HomePage")

  return (
    <footer className="border-t border-border/50 w-full bg-background z-10 relative">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
        <p>{t("footer_text")}</p>
        <nav
          className="flex flex-wrap justify-center gap-4"
          aria-label={t("footer_nav_label")}
        >
          <Link
            href="/verify"
            className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
          >
            {t("footer_link_verify")}
          </Link>
          <span className="text-muted-foreground/30 text-xs" aria-hidden="true">•</span>
          <Link
            href="/wheel-of-names"
            className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
          >
            {t("footer_link_wheel")}
          </Link>
          <span className="text-muted-foreground/30 text-xs" aria-hidden="true">•</span>
          <Link
            href="/instagram-comment-picker"
            className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
          >
            {t("footer_link_instagram")}
          </Link>
          <span className="text-muted-foreground/30 text-xs" aria-hidden="true">•</span>
          <Link
            href="/random-number-generator"
            className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
          >
            {t("footer_link_rng")}
          </Link>
          <span className="text-muted-foreground/30 text-xs" aria-hidden="true">•</span>
          <Link
            href="/list-randomizer"
            className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
          >
            {t("footer_link_list")}
          </Link>
          <span className="text-muted-foreground/30 text-xs" aria-hidden="true">•</span>
          <Link
            href="/yes-or-no-wheel"
            className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
          >
            {t("footer_link_yesno")}
          </Link>
          <span className="text-muted-foreground/30 text-xs" aria-hidden="true">•</span>
          <Link
            href="/random-letter-generator"
            className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
          >
            {t("footer_link_letter")}
          </Link>
          <span className="text-muted-foreground/30 text-xs" aria-hidden="true">•</span>
          <Link
            href="/alternativa-appsorteos"
            className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
          >
            {t("footer_versus_link")}
          </Link>
          <span className="text-muted-foreground/30 text-xs" aria-hidden="true">•</span>
          <Link
            href="/glossary"
            className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
          >
            {t("footer_glossary")}
          </Link>
        </nav>
      </div>
    </footer>
  )
}
