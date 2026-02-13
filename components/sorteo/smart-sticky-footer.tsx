"use client"

import { useSorteoStore } from "@/lib/sorteo-store"
import { StickyShareFooter } from "@/components/sorteo/sticky-share-footer"

interface SmartStickyFooterProps {
  shareTitle: string
  shareText: string
  customShareTextTemplate: string
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

export function SmartStickyFooter({
  shareTitle,
  shareText,
  customShareTextTemplate,
  translations
}: SmartStickyFooterProps) {
  const { participants, theme } = useSorteoStore()

  // Logic to calculate share content
  const getShareContent = () => {
    let finalShareText = shareText
    let finalShareTitle = shareTitle
    let url = typeof window !== "undefined" ? window.location.href : ""

    const isCustomTitle = theme.customTitle && theme.customTitle !== "Sorteo Pro"

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
          // We only share the list if it fits within URL limits
          const names = participants.map(p => p.name)
          const encoded = encodeURIComponent(JSON.stringify(names))
          // Safety limit for URL length (browser limits usually ~2000)
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
        // Fallback to current url if parsing fails
      }
    }

    return {
      title: finalShareTitle,
      text: finalShareText,
      url: url
    }
  }

  const shareContent = getShareContent()

  return <StickyShareFooter shareContent={shareContent} translations={translations} />
}
