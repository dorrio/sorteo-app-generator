"use client"

import { useEffect, useState } from "react"
import { useSorteoStore } from "@/lib/sorteo-store"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ShareButton } from "@/components/ui/share-button"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Settings2, Trophy } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

interface HeaderIslandProps {
  displayTitle: string
  shareContent: {
    title: string
    text: string
    url: string
  }
  shareTranslations: {
    share: string
    copy: string
    copied: string
    shareOn: string
  }
}

export function HeaderIsland({ displayTitle, shareContent: initialShareContent, shareTranslations }: HeaderIslandProps) {
  const { theme, setIsVerifyModalOpen, setIsEditorOpen, hasHydrated, participants } = useSorteoStore()
  const t = useTranslations("HomePage")

  // Use store title if hydrated, otherwise initial prop
  const title = hasHydrated ? theme.customTitle : displayTitle

  // Compute dynamic share content
  const [shareContent, setShareContent] = useState(initialShareContent)

  useEffect(() => {
    if (typeof window !== "undefined") {
      let finalShareText = initialShareContent.text
      let finalShareTitle = initialShareContent.title
      let url = window.location.href

      try {
        const urlObj = new URL(window.location.href)
        const isCustomTitle = theme.customTitle && theme.customTitle !== "Sorteo Pro"

        if (isCustomTitle) {
          // Note: customShareTextTemplate is not passed to HeaderIsland currently.
          // Should we pass it? Or just rely on default text update?
          // MainApp updated text based on template.
          // For now, let's keep text static or update minimal if needed.
          // Actually, Header ShareButton is usually generic share.

          urlObj.searchParams.set('template_title', theme.customTitle)
          if (theme.primaryColor) {
            urlObj.searchParams.set('template_color', theme.primaryColor)
          }
        }

        if (participants.length > 0 && participants.length <= 100) {
           const names = participants.map(p => p.name)
           const encoded = encodeURIComponent(JSON.stringify(names))
           if (encoded.length < 1500) {
             urlObj.searchParams.set('list', encoded)
           }
        }

        url = urlObj.toString()
      } catch (e) {
          // Fallback
      }

      setShareContent({
          title: finalShareTitle,
          text: finalShareText,
          url: url
      })
    }
  }, [hasHydrated, theme.customTitle, theme.primaryColor, participants, initialShareContent])

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
              <div className="font-bold text-xl tracking-tight">{title}</div>
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

          <Button variant="ghost" size="icon" onClick={() => setIsVerifyModalOpen(true)} title="Verificar Sorteo" aria-label={t("verify_sorteo")}>
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
