"use client"

import { useSorteoStore } from "@/lib/sorteo-store"
import { Settings2 } from "lucide-react"
import { useTranslations } from "next-intl"

interface ThemeTitleProps {
  initialTitle?: string
  initialSubtitle?: string
}

export function ThemeTitle({ initialTitle, initialSubtitle }: ThemeTitleProps) {
  const { theme, hasHydrated, setIsEditorOpen } = useSorteoStore()
  const t = useTranslations("HomePage")

  const displayTitle = hasHydrated ? theme.customTitle : (initialTitle || theme.customTitle)
  const displaySubtitle = hasHydrated ? theme.customSubtitle : (initialSubtitle || theme.customSubtitle)

  return (
    <div className="text-center space-y-2">
      <h1
        className="text-4xl md:text-6xl font-bold tracking-tight"
        style={{ color: theme.primaryColor }}
      >
        {displayTitle}
      </h1>
      <p className="text-muted-foreground text-lg">{displaySubtitle}</p>
      <button
        className="inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-full text-sm font-medium transition-all hover:scale-105"
        style={{
          backgroundColor: `${theme.primaryColor}20`,
          color: theme.primaryColor,
          border: `1px solid ${theme.primaryColor}40`
        }}
        onClick={() => setIsEditorOpen(true)}
      >
        <Settings2 className="w-4 h-4" />
        {t("customize")}
      </button>
    </div>
  )
}

export function HeaderTitle({ initialTitle }: { initialTitle?: string }) {
  const { theme, hasHydrated } = useSorteoStore()
  const displayTitle = hasHydrated ? theme.customTitle : (initialTitle || theme.customTitle)

  return <div className="font-bold text-xl tracking-tight">{displayTitle}</div>
}
