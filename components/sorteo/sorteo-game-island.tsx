"use client"

import { useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SorteoSelector } from "@/components/sorteo/sorteo-selector"
import { Sparkles, Settings2, Play } from "lucide-react"
import { useSorteoStore } from "@/lib/sorteo-store"
import { useTranslations } from "next-intl"

interface SorteoGameIslandProps {
  initialTitle: string
  initialSubtitle: string
  initialStyle?: string
}

export function SorteoGameIsland({
  initialTitle,
  initialSubtitle,
  initialStyle
}: SorteoGameIslandProps) {
  const {
    theme,
    participants,
    isSpinning,
    setIsEditorOpen,
    setShowCountdown,
    setShowWinnerCeremony,
    hasHydrated
  } = useSorteoStore()

  const t = useTranslations("HomePage")

  const displayTitle = hasHydrated ? theme.customTitle : initialTitle
  const displaySubtitle = hasHydrated ? theme.customSubtitle : initialSubtitle

  const startSorteo = () => {
    if (participants.length < 2) return
    setShowCountdown(true)
  }

  const handleWinnerSelected = useCallback(() => {
    setShowWinnerCeremony(true)
  }, [setShowWinnerCeremony])

  return (
    <section
      className="space-y-8"
      aria-label="Main Tool Area"
    >
      {/* Title */}
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

      {/* Slot machine */}
      <SorteoSelector onWinnerSelected={handleWinnerSelected} forcedStyle={initialStyle} />

      {/* Start button */}
      <div className="flex justify-center">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            size="lg"
            onClick={startSorteo}
            disabled={participants.length < 2 || isSpinning}
            className="h-16 px-12 text-xl font-bold gap-3 rounded-2xl transition-all"
            style={{
              backgroundColor: theme.primaryColor,
              color: theme.backgroundColor,
              boxShadow: `0 0 40px ${theme.primaryColor}40`,
            }}
          >
            {isSpinning ? (
              <>
                <Sparkles className="w-6 h-6 animate-spin" />
                {t("spinning")}
              </>
            ) : (
              <>
                <Play className="w-6 h-6" />
                {t("start_button")}
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {participants.length < 2 && participants.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">{t("min_participants_warning")}</p>
      )}
    </section>
  )
}
