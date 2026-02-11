"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Play } from "lucide-react"
import { useTranslations } from "next-intl"
import { useSorteoStore } from "@/lib/sorteo-store"

export function Controls() {
  const t = useTranslations("HomePage")
  const {
    participants,
    isSpinning,
    setShowCountdown,
    theme
  } = useSorteoStore()

  const startSorteo = () => {
    if (participants.length < 2) return
    setShowCountdown(true)
  }

  return (
    <div className="space-y-4 pt-8">
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
    </div>
  )
}
