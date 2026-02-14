"use client"

import { useCallback } from "react"
import { useTranslations } from "next-intl"
import { useSorteoStore } from "@/lib/sorteo-store"
import { SorteoSelector } from "@/components/sorteo/sorteo-selector"
import { Button } from "@/components/ui/button"
import { Settings2, Sparkles, Play } from "lucide-react"
import { motion } from "framer-motion"

interface SorteoGameIslandProps {
  initialTitle?: string;
  initialSubtitle?: string;
  initialStyle?: string;
  seoMode?: string;
}

export function SorteoGameIsland({
  initialTitle,
  initialSubtitle,
  initialStyle,
  seoMode = 'home'
}: SorteoGameIslandProps) {
  const t = useTranslations("HomePage")

  // Translations needed for fallback titles
  const tYesNo = useTranslations("YesNoPage")
  const tLetter = useTranslations("LetterGeneratorPage")
  const tDice = useTranslations("DicePage")
  const tCoin = useTranslations("CoinPage")
  const tRps = useTranslations("RpsPage")
  const tCountry = useTranslations("CountryPage")
  const tMonth = useTranslations("MonthPage")
  const tCard = useTranslations("CardPage")
  const tRng = useTranslations("RngPage")
  const tList = useTranslations("ListRandomizerPage")
  const tSecret = useTranslations("SecretSantaPage")
  const tTeam = useTranslations("TeamGeneratorPage")
  const tInsta = useTranslations("InstagramPicker")
  const tWheel = useTranslations("WheelGeoPage")

  const {
    theme,
    participants,
    isSpinning,
    setShowCountdown,
    setShowWinnerCeremony,
    setIsEditorOpen,
    hasHydrated
  } = useSorteoStore()

  // Display Title Logic
  let displayTitle = hasHydrated ? theme.customTitle : (initialTitle || theme.customTitle)
  let displaySubtitle = hasHydrated ? theme.customSubtitle : (initialSubtitle || theme.customSubtitle)

  if (!hasHydrated && !initialTitle) {
    if (seoMode === 'wheel') { displayTitle = tWheel('h1'); displaySubtitle = tWheel('subtitle'); }
    else if (seoMode === 'instagram') { displayTitle = tInsta('h1'); displaySubtitle = tInsta('subtitle'); }
    else if (seoMode === 'rng') { displayTitle = tRng('h1'); displaySubtitle = tRng('subtitle'); }
    else if (seoMode === 'list-randomizer') { displayTitle = tList('h1'); displaySubtitle = tList('subtitle'); }
    else if (seoMode === 'team') { displayTitle = tTeam('h1'); displaySubtitle = tTeam('subtitle'); }
    else if (seoMode === 'secret-santa') { displayTitle = tSecret('h1'); displaySubtitle = tSecret('subtitle'); }
    else if (seoMode === 'yes-no') { displayTitle = tYesNo('h1'); displaySubtitle = tYesNo('subtitle'); }
    else if (seoMode === 'letter') { displayTitle = tLetter('h1'); displaySubtitle = tLetter('subtitle'); }
    else if (seoMode === 'dice') { displayTitle = tDice('h1'); displaySubtitle = tDice('subtitle'); }
    else if (seoMode === 'coin') { displayTitle = tCoin('h1'); displaySubtitle = tCoin('subtitle'); }
    else if (seoMode === 'rps') { displayTitle = tRps('h1'); displaySubtitle = tRps('subtitle'); }
    else if (seoMode === 'country') { displayTitle = tCountry('h1'); displaySubtitle = tCountry('subtitle'); }
    else if (seoMode === 'month') { displayTitle = tMonth('h1'); displaySubtitle = tMonth('subtitle'); }
    else if (seoMode === 'card') { displayTitle = tCard('h1'); displaySubtitle = tCard('subtitle'); }
  }

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

      {/* Slot machine / Selector */}
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
