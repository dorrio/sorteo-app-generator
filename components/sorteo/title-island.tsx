"use client"

import { useSorteoStore } from "@/lib/sorteo-store"
import { Settings2 } from "lucide-react"
import { useTranslations } from "next-intl"

interface TitleIslandProps {
  initialTitle: string
  initialSubtitle: string
}

export function TitleIsland({ initialTitle, initialSubtitle }: TitleIslandProps) {
  const t = useTranslations("HomePage")
  const { theme, hasHydrated, setIsEditorOpen } = useSorteoStore()

  // Prioritize store value after hydration, fall back to props for SSR/initial render
  const displayTitle = hasHydrated && theme.customTitle ? theme.customTitle : initialTitle
  const displaySubtitle = hasHydrated && theme.customSubtitle ? theme.customSubtitle : initialSubtitle
  const primaryColor = theme.primaryColor || "#D4AF37" // Default gold if missing

  return (
    <div className="text-center space-y-2">
      <h1
        className="text-4xl md:text-6xl font-bold tracking-tight"
        style={{ color: primaryColor }}
      >
        {displayTitle}
      </h1>
      <p className="text-muted-foreground text-lg">{displaySubtitle}</p>
      <button
        className="inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-full text-sm font-medium transition-all hover:scale-105"
        style={{
          backgroundColor: `${primaryColor}20`,
          color: primaryColor,
          border: `1px solid ${primaryColor}40`
        }}
        onClick={() => setIsEditorOpen(true)}
      >
        <Settings2 className="w-4 h-4" />
        {t("customize")}
      </button>
    </div>
  )
}
