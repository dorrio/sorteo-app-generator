"use client"

import { useSorteoStore } from "@/lib/sorteo-store"
import { StickyShareFooter } from "@/components/sorteo/sticky-share-footer"

interface SmartStickyFooterProps {
  shareTitle: string
  shareText: string
  customShareTextTemplate: string
  initialTitle: string
  stickyTranslations: {
    share_cta: string
    start_cta: string
  }
  shareTranslations: {
    share: string
    copy: string
    copied: string
    shareOn: string
  }
}

export function SmartStickyFooter({
  shareTitle,
  shareText,
  customShareTextTemplate,
  initialTitle,
  stickyTranslations,
  shareTranslations
}: SmartStickyFooterProps) {
  const { theme, participants } = useSorteoStore()

  const getShareContent = () => {
    let finalShareText = shareText
    let url = typeof window !== "undefined" ? window.location.href : ""

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

        // 2. Content: Shareable Participant List (Deep Linking)
        if (participants.length > 0 && participants.length <= 100) {
          const names = participants.map(p => p.name)
          const encoded = encodeURIComponent(JSON.stringify(names))
          if (encoded.length < 1500) {
            urlObj.searchParams.set('list', encoded)
          }
        }

        return {
          title: shareTitle,
          text: finalShareText,
          url: urlObj.toString()
        }
      } catch (e) {
        // Fallback
      }
    }

    return {
      title: shareTitle,
      text: shareText,
      url: url
    }
  }

  const shareContent = getShareContent()
  const fullStickyTranslations = {
    ...stickyTranslations,
    share_button: shareTranslations
  }

  return <StickyShareFooter shareContent={shareContent} translations={fullStickyTranslations} />
}
