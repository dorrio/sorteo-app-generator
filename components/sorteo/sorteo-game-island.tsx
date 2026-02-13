"use client"

import { useCallback } from "react"
import { motion } from "framer-motion"
import { useSorteoStore } from "@/lib/sorteo-store"
import { SorteoSelector } from "@/components/sorteo/sorteo-selector"
import { Button } from "@/components/ui/button"
import { Sparkles, Play } from "lucide-react"
import { useTranslations } from "next-intl"

interface SorteoGameIslandProps {
  initialStyle?: string
}

export function SorteoGameIsland({ initialStyle }: SorteoGameIslandProps) {
  const t = useTranslations("HomePage")
  const {
    participants,
    theme,
    isSpinning,
    setShowCountdown,
    setShowWinnerCeremony
  } = useSorteoStore()

  const startSorteo = () => {
    if (participants.length < 2) return
    setShowCountdown(true)
  }

  const handleWinnerSelected = useCallback(() => {
    setShowWinnerCeremony(true)
  }, [setShowWinnerCeremony])

  // Default colors if store not ready
  const primaryColor = theme.primaryColor || "#D4AF37"
  const backgroundColor = theme.backgroundColor || "#000000"

  return (
    <div className="space-y-8">
       <SorteoSelector onWinnerSelected={handleWinnerSelected} forcedStyle={initialStyle} />

       <div className="flex justify-center">
         <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
           <Button
             size="lg"
             onClick={startSorteo}
             disabled={participants.length < 2 || isSpinning}
             className="h-16 px-12 text-xl font-bold gap-3 rounded-2xl transition-all"
             style={{
               backgroundColor: primaryColor,
               color: backgroundColor,
               boxShadow: `0 0 40px ${primaryColor}40`,
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
    </div>
  )
}
