"use client"

import { useTranslations } from "next-intl"
import { Trophy, ShieldCheck, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ShareButton } from "@/components/ui/share-button"
import { Link } from "@/i18n/routing"
import { useSorteoStore } from "@/lib/sorteo-store"

interface HeaderIslandProps {
  initialTitle?: string
  seoMode?: string
  shareTitle?: string
  shareText?: string
  customShareTextTemplate?: string
  shareTranslations: {
    share: string
    copy: string
    copied: string
    shareOn: string
  }
}

export function HeaderIsland({
  initialTitle,
  seoMode = 'home',
  shareTitle = "Sorteo Pro",
  shareText = "Sorteo Pro",
  customShareTextTemplate = "🔥 Join my giveaway: *{title}*! Created with Sorteo Pro. Free & Unlimited. 👇",
  shareTranslations
}: HeaderIslandProps) {
  const t = useTranslations("HomePage")
  const tShare = useTranslations("ShareContent")
  const { theme, hasHydrated, setIsVerifyModalOpen, setIsEditorOpen, participants } = useSorteoStore()

  const displayTitle = hasHydrated ? theme.customTitle : (initialTitle || theme.customTitle)

  // Determine share content
  const getShareContent = () => {
    let finalShareText = shareText
    let finalShareTitle = shareTitle
    let url = typeof window !== "undefined" ? window.location.href : ""

    if (shareTitle === "Sorteo Pro" && seoMode) {
      if (seoMode === 'wheel') { finalShareTitle = tShare('wheel_title'); finalShareText = tShare('wheel_text'); }
      else if (seoMode === 'instagram') { finalShareTitle = tShare('instagram_title'); finalShareText = tShare('instagram_text'); }
      else if (seoMode === 'rng') { finalShareTitle = tShare('rng_title'); finalShareText = tShare('rng_text'); }
      else if (seoMode === 'list-randomizer') { finalShareTitle = tShare('list_title'); finalShareText = tShare('list_text'); }
      else if (seoMode === 'team') { finalShareTitle = tShare('list_title'); finalShareText = tShare('list_text'); }
      else if (seoMode === 'secret-santa') { finalShareTitle = tShare('secret_santa_title'); finalShareText = tShare('secret_santa_text'); }
      else if (seoMode === 'yes-no') { finalShareTitle = tShare('yes_no_title'); finalShareText = tShare('yes_no_text'); }
      else if (seoMode === 'letter') { finalShareTitle = tShare('letter_title'); finalShareText = tShare('letter_text'); }
      else if (seoMode === 'dice') { finalShareTitle = tShare('dice_title'); finalShareText = tShare('dice_text'); }
      else if (seoMode === 'coin') { finalShareTitle = tShare('coin_title'); finalShareText = tShare('coin_text'); }
      else if (seoMode === 'rps') { finalShareTitle = tShare('rps_title'); finalShareText = tShare('rps_text'); }
      else if (seoMode === 'country') { finalShareTitle = tShare('country_title'); finalShareText = tShare('country_text'); }
      else if (seoMode === 'month') { finalShareTitle = tShare('month_title'); finalShareText = tShare('month_text'); }
      else if (seoMode === 'card') { finalShareTitle = tShare('card_title'); finalShareText = tShare('card_text'); }
    }

    const defaultTitle = initialTitle || "Sorteo Pro"
    const isCustomTitle = theme.customTitle && theme.customTitle !== defaultTitle

    if (typeof window !== "undefined") {
      try {
        const urlObj = new URL(window.location.href)

        // Explicitly clear stale params
        urlObj.searchParams.delete('template_title')
        urlObj.searchParams.delete('template_color')
        urlObj.searchParams.delete('list')

        // 1. Branding: Custom Title & Color
        if (isCustomTitle && theme.customTitle) {
          finalShareText = customShareTextTemplate.replace('{title}', theme.customTitle)

          urlObj.searchParams.set('template_title', theme.customTitle)
          if (theme.primaryColor) {
            urlObj.searchParams.set('template_color', theme.primaryColor)
          }
        }

        // 2. Content: Shareable Participant List
        if (participants.length > 0 && participants.length <= 100) {
          const names = participants.map(p => p.name)
          const jsonString = JSON.stringify(names)
          urlObj.searchParams.set('list', jsonString)

          if (urlObj.toString().length >= 1500) {
            urlObj.searchParams.delete('list')
          }
        }

        return {
          title: finalShareTitle,
          text: finalShareText,
          url: urlObj.toString()
        }
      } catch (e) {
        // Fallback
      }
    }

    return {
      title: finalShareTitle,
      text: finalShareText,
      url: url
    }
  }

  const shareContent = getShareContent()

  return (
    <header className="border-b border-border/50 backdrop-blur-sm bg-background/50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Sorteo Pro Home"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
              }}
            >
              <Trophy className="w-5 h-5 text-background" />
            </div>
            <div>
              <div className="font-bold text-xl tracking-tight">{displayTitle}</div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <ShareButton
            title={shareContent.title}
            text={shareContent.text}
            url={shareContent.url}
            translations={shareTranslations}
          />

          <Button variant="ghost" size="icon" onClick={() => setIsVerifyModalOpen(true)} title={t("verify_sorteo")} aria-label={t("verify_sorteo")}>
            <ShieldCheck className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsEditorOpen(true)} className="gap-2" aria-label={t("customize")}>
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t("customize")}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
