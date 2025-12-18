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
        <h2 className="font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {t("title")} ({pastWinners.length})
        </h2>
        <Button variant="ghost" size="sm" onClick={clearHistory} className="text-destructive hover:text-destructive">
          <Trash2 className="w-4 h-4 mr-1" />
          {t("clear")}
        </Button>
      </div>

      <ul className="space-y-2 max-h-[200px] overflow-y-auto" role="list">
        <AnimatePresence>
          {pastWinners.map((winner, index) => (
            <motion.li
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
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">{winner.name}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {t("giveaway_number", { number: pastWinners.length - index })}
                  </span>
                </div>
                {winner.verificationId && (
                  <div
                    className="flex items-center gap-1.5 mt-1 cursor-pointer group"
                    onClick={() => {
                      navigator.clipboard.writeText(winner.verificationId!)
                    }}
                    title="Copiar ID"
                  >
                    <code className="text-[10px] font-mono bg-muted/50 px-1.5 py-0.5 rounded text-muted-foreground group-hover:text-primary transition-colors">
                      {winner.verificationId}
                    </code>
                  </div>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
