"use client"

import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ShareButton } from "@/components/ui/share-button"
import { Settings2, ShieldCheck } from "lucide-react"
import { useSorteoStore } from "@/lib/sorteo-store"
import { useTranslations } from "next-intl"

interface HeaderIslandProps {
  shareTitle: string
  shareText: string
  customShareTextTemplate: string
  initialTitle: string
  shareTranslations: {
    share: string
    copy: string
    copied: string
    shareOn: string
  }
}

export function HeaderIsland({
  shareTitle,
  shareText,
  customShareTextTemplate,
  initialTitle,
  shareTranslations
}: HeaderIslandProps) {
  const { theme, participants, setIsVerifyModalOpen, setIsEditorOpen } = useSorteoStore()
  const t = useTranslations("HomePage")

  // Determine share content logic (Copied from MainApp)
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

  return (
    <div className="flex items-center gap-2">
      <LanguageSwitcher />

      <ShareButton
        title={shareContent.title}
        text={shareContent.text}
        url={shareContent.url}
        translations={shareTranslations}
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsVerifyModalOpen(true)}
        title={t("verify_sorteo")}
        aria-label={t("verify_sorteo")}
      >
        <ShieldCheck className="w-5 h-5" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsEditorOpen(true)}
        className="gap-2"
        aria-label={t("customize")}
      >
        <Settings2 className="w-4 h-4" />
        <span className="hidden sm:inline">{t("customize")}</span>
      </Button>
    </div>
  )
}
