"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Trophy } from "lucide-react"

export function SiteFooter() {
  const t = useTranslations("Footer")

  return (
    <footer className="border-t border-border/50 w-full bg-background z-10 relative">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-28 md:pb-16">
        <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12" aria-label={t("nav_label")}>

          {/* Brand Column */}
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-primary-foreground">
                  <Trophy className="w-4 h-4" />
                </div>
                <span className="font-bold text-xl">Sorteo Pro</span>
             </div>
             <p className="text-muted-foreground text-sm">
               {t("text")}
             </p>
          </div>

          {/* Tools Column 1 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">{t("sections.tools")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/wheel-of-names" className="hover:text-primary transition-colors">
                  {t("links.wheel")}
                </Link>
              </li>
              <li>
                <Link href="/instagram-comment-picker" className="hover:text-primary transition-colors">
                  {t("links.instagram")}
                </Link>
              </li>
              <li>
                <Link href="/random-number-generator" className="hover:text-primary transition-colors">
                  {t("links.rng")}
                </Link>
              </li>
              <li>
                <Link href="/list-randomizer" className="hover:text-primary transition-colors">
                  {t("links.list")}
                </Link>
              </li>
              <li>
                 <Link href="/yes-or-no-wheel" className="hover:text-primary transition-colors">
                  {t("links.yesno")}
                </Link>
              </li>
               <li>
                 <Link href="/random-letter-generator" className="hover:text-primary transition-colors">
                  {t("links.letter")}
                </Link>
              </li>
              <li>
                 <Link href="/random-card-generator" className="hover:text-primary transition-colors">
                  {t("links.card")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools Column 2 & Resources */}
          <div className="flex flex-col gap-4">
             {/* Extended Tools - Hidden title on desktop for alignment if we want 2 cols of tools, but here I'll just list them */}
             <h3 className="sr-only">{t("sections.tools")}</h3>
             <h3 aria-hidden="true" className="font-semibold text-foreground hidden lg:block invisible select-none">
                {t("sections.tools")}
             </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
               <li>
                 <Link href="/secret-santa-generator" className="hover:text-primary transition-colors">
                  {t("links.secret_santa")}
                </Link>
              </li>
               <li>
                 <Link href="/team-generator" className="hover:text-primary transition-colors">
                  {t("links.team")}
                </Link>
              </li>
               <li>
                 <Link href="/dice-roller" className="hover:text-primary transition-colors">
                  {t("links.dice")}
                </Link>
              </li>
               <li>
                 <Link href="/coin-flip" className="hover:text-primary transition-colors">
                  {t("links.coin")}
                </Link>
              </li>
               <li>
                 <Link href="/rock-paper-scissors" className="hover:text-primary transition-colors">
                  {t("links.rps")}
                </Link>
              </li>
               <li>
                 <Link href="/random-country-generator" className="hover:text-primary transition-colors">
                  {t("links.country")}
                </Link>
              </li>
               <li>
                 <Link href="/random-month-generator" className="hover:text-primary transition-colors">
                  {t("links.month")}
                </Link>
              </li>
              <li>
                 <Link href="/bingo-number-generator" className="hover:text-primary transition-colors">
                  {t("links.bingo")}
                </Link>
              </li>
              <li>
                 <Link href="/truth-or-dare-generator" className="hover:text-primary transition-colors">
                  {t("links.truth")}
                </Link>
              </li>
            </ul>

            {/* Resources */}
            <h3 className="font-semibold text-foreground mt-4">{t("sections.resources")}</h3>
             <ul className="space-y-2 text-sm text-muted-foreground">
               <li>
                <Link href="/verify" className="hover:text-primary transition-colors">
                  {t("links.verify")}
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:text-primary transition-colors">
                  {t("links.glossary")}
                </Link>
              </li>
             </ul>
          </div>

          {/* Comparisons Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">{t("sections.comparisons")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/alternativa-appsorteos" className="hover:text-primary transition-colors">
                  {t("links.versus_appsorteos")}
                </Link>
              </li>
              <li>
                <Link href="/alternativa-wheel-of-names" className="hover:text-primary transition-colors">
                  {t("links.versus_wheel")}
                </Link>
              </li>
              <li>
                <Link href="/versus/random-org-vs-sorteo-pro" className="hover:text-primary transition-colors">
                  {t("links.versus_random")}
                </Link>
              </li>
            </ul>
          </div>

        </nav>

        <div className="mt-12 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sorteo Pro. {t("text")}
        </div>
      </div>
    </footer>
  )
}
