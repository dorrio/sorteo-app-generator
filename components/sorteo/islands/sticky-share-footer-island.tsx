"use client"

import { useTranslations } from "next-intl"
import { useSorteoStore } from "@/lib/sorteo-store"
import { StickyShareFooter } from "@/components/sorteo/sticky-share-footer"

interface StickyShareFooterIslandProps {
  initialTitle?: string
  seoMode?: string
  shareTitle?: string
  shareText?: string
  customShareTextTemplate?: string
  translations: {
    share_cta: string
    start_cta: string
    share_button: {
      share: string
      copy: string
      copied: string
      shareOn: string
    }
  }
}

export function StickyShareFooterIsland({
  initialTitle,
  seoMode = 'home',
  shareTitle = "Sorteo Pro",
  shareText = "Sorteo Pro",
  customShareTextTemplate = "🔥 Join my giveaway: *{title}*! Created with Sorteo Pro. Free & Unlimited. 👇",
  translations
}: StickyShareFooterIslandProps) {
  const tShare = useTranslations("ShareContent")
  const { theme, participants } = useSorteoStore()

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
          const encoded = encodeURIComponent(JSON.stringify(names))
          if (encoded.length < 1500) {
            urlObj.searchParams.set('list', encoded)
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
    <StickyShareFooter
        shareContent={shareContent}
        translations={translations}
        seoMode={seoMode}
    />
  )
}
