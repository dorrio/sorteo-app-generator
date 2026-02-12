"use client"

import { useSorteoStore } from "@/lib/sorteo-store"
import { useEffect, useState } from "react"
import { Settings2 } from "lucide-react"

interface TitleIslandProps {
  initialTitle: string
  initialSubtitle?: string
  customizeText: string
}

export function TitleIsland({ initialTitle, initialSubtitle, customizeText }: TitleIslandProps) {
  const { theme, hasHydrated, setIsEditorOpen } = useSorteoStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prioritize initial SSR content until fully hydrated to avoid mismatches
  // But if we have hydration and a custom title in store, show that.
  const displayTitle = (mounted && hasHydrated && theme.customTitle) ? theme.customTitle : initialTitle
  const displaySubtitle = (mounted && hasHydrated && theme.customSubtitle) ? theme.customSubtitle : initialSubtitle

  return (
    <div className="text-center space-y-2">
      <h1
        className="text-4xl md:text-6xl font-bold tracking-tight"
        style={{ color: hasHydrated ? theme.primaryColor : undefined }} // Delay color hydration to avoid mismatch if possible, or accept it
      >
        {displayTitle}
      </h1>
      <p className="text-muted-foreground text-lg">{displaySubtitle}</p>
      <button
        className="inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-full text-sm font-medium transition-all hover:scale-105"
        style={hasHydrated ? {
          backgroundColor: `${theme.primaryColor}20`,
          color: theme.primaryColor,
          border: `1px solid ${theme.primaryColor}40`
        } : undefined}
        onClick={() => setIsEditorOpen(true)}
      >
        <Settings2 className="w-4 h-4" />
        {customizeText}
      </button>
    </div>
  )
}
