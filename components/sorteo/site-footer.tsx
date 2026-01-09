"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

export function SiteFooter() {
  const t = useTranslations("HomePage")

  return (
    <footer className="border-t border-border/50 w-full bg-background z-10 relative">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
        <p>{t("footer_text")}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/verify"
            className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
          >
            {t("verify_sorteo")}
          </Link>
          <span className="text-muted-foreground/30 text-xs">•</span>
          <Link
            href="/wheel-of-names"
            className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
          >
            Wheel of Names
          </Link>
          <span className="text-muted-foreground/30 text-xs">•</span>
          <Link
            href="/instagram-comment-picker"
            className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
          >
            Instagram Picker
          </Link>
          <span className="text-muted-foreground/30 text-xs">•</span>
          <Link
            href="/random-number-generator"
            className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
          >
            RNG
          </Link>
          <span className="text-muted-foreground/30 text-xs">•</span>
          <Link
            href="/list-randomizer"
            className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
          >
            List Randomizer
          </Link>
          <span className="text-muted-foreground/30 text-xs">•</span>
          <Link
            href="/alternativa-appsorteos"
            className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
          >
            {t("footer_versus_link")}
          </Link>
          <span className="text-muted-foreground/30 text-xs">•</span>
          <Link
            href="/glossary"
            className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
          >
            {t("footer_glossary")}
          </Link>
        </div>
      </div>
    </footer>
  )
}
