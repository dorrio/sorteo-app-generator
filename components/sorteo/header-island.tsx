"use client"

import { useSorteoStore } from "@/lib/sorteo-store"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Trophy, ShieldCheck, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/ui/share-button"
import { LanguageSwitcher } from "@/components/language-switcher"

interface HeaderIslandProps {
  initialTitle: string
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

export function HeaderIsland({ initialTitle, shareContent, shareTranslations }: HeaderIslandProps) {
  const t = useTranslations("HomePage")
  const { theme, hasHydrated, setIsVerifyModalOpen, setIsEditorOpen } = useSorteoStore()

  // Default values if store is not yet hydrated or missing values
  const primaryColor = theme.primaryColor || "#D4AF37"
  const secondaryColor = theme.secondaryColor || "#FFD700"

  // Reactive title from store
  const displayTitle = hasHydrated && theme.customTitle ? theme.customTitle : initialTitle

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
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
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

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVerifyModalOpen(true)}
            title="Verificar Sorteo"
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
      </div>
    </header>
  )
}
