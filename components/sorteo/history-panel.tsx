"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { useSorteoStore } from "@/lib/sorteo-store"
import { Trophy, Clock, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HistoryPanel() {
  const { pastWinners, clearHistory, theme } = useSorteoStore()
  const t = useTranslations("HistoryPanel")

  if (pastWinners.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">{t("empty")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {t("title")} ({pastWinners.length})
        </h3>
        <Button variant="ghost" size="sm" onClick={clearHistory} className="text-destructive hover:text-destructive">
          <Trash2 className="w-4 h-4 mr-1" />
          {t("clear")}
        </Button>
      </div>

      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        <AnimatePresence>
          {pastWinners.map((winner, index) => (
            <motion.div
              key={`${winner.id}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border/50"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${theme.primaryColor}20`,
                  color: theme.primaryColor,
                }}
              >
                <Trophy className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{winner.name}</div>
                <div className="text-xs text-muted-foreground">{t("giveaway_number", { number: pastWinners.length - index })}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
