"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { ShieldCheck, Settings2 } from "lucide-react"
import { useSorteoStore } from "@/lib/sorteo-store"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ShareButton } from "@/components/ui/share-button"

interface HeaderLogicProps {
  initialTitle?: string
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

export function HeaderLogic({
  initialTitle,
  shareTitle = "Sorteo Pro",
  shareText = "Sorteo Pro",
  customShareTextTemplate = "🔥 Join my giveaway: *{title}*! Created with Sorteo Pro. Free & Unlimited. 👇",
  shareTranslations
}: HeaderLogicProps) {
  const t = useTranslations("HomePage")
  const { setIsVerifyModalOpen, setIsEditorOpen, theme, participants } = useSorteoStore()
  const [shareContent, setShareContent] = useState({ title: shareTitle, text: shareText, url: "" })

  useEffect(() => {
    // Calculate Share Content on client
    let finalShareText = shareText
    let url = typeof window !== "undefined" ? window.location.href : ""
    const defaultTitle = initialTitle || "Sorteo Pro"
    const isCustomTitle = theme.customTitle && theme.customTitle !== defaultTitle

    if (typeof window !== "undefined") {
      try {
        const urlObj = new URL(window.location.href)
        if (isCustomTitle && theme.customTitle) {
          finalShareText = customShareTextTemplate.replace('{title}', theme.customTitle)
          urlObj.searchParams.set('template_title', theme.customTitle)
          if (theme.primaryColor) urlObj.searchParams.set('template_color', theme.primaryColor)
        }
        if (participants.length > 0 && participants.length <= 100) {
          const names = participants.map(p => p.name)
          const encoded = encodeURIComponent(JSON.stringify(names))
          // Safety limit for URL length (browser limits usually ~2000)
          if (encoded.length < 1500) {
            urlObj.searchParams.set('list', encoded)
          }
        }
        url = urlObj.toString()
      } catch (e) {
        // Fallback
      }
    }
    setShareContent({ title: shareTitle, text: finalShareText, url })
  }, [theme, participants, shareText, customShareTextTemplate, initialTitle, shareTitle])

  return (
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
  )
}
