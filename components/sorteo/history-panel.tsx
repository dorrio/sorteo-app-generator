"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { useSorteoStore, type Participant } from "@/lib/sorteo-store"
import { Trophy, Clock, Trash2, Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

// Extracted component to handle local "copied" state
function HistoryItem({
  winner,
  index,
  totalCount,
  theme
}: {
  winner: Participant
  index: number
  totalCount: number
  theme: any
}) {
  const t = useTranslations("HistoryPanel")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (winner.verificationId) {
      navigator.clipboard.writeText(winner.verificationId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.li
      layout
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
            {t("giveaway_number", { number: totalCount - index })}
          </span>
        </div>
        {winner.verificationId && (
          <button
            type="button"
            className="flex items-center gap-1.5 mt-1 cursor-pointer group bg-transparent border-0 p-0 hover:bg-transparent text-left w-full"
            onClick={handleCopy}
            title={copied ? t("copied") : t("copy_id")}
            aria-label={`${t("copy_id")}: ${winner.verificationId}`}
          >
            <code className="text-[10px] font-mono bg-muted/50 px-1.5 py-0.5 rounded text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              {winner.verificationId}
              {copied ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </code>
            {copied && <span className="text-[10px] text-green-500 font-medium">{t("copied")}</span>}
          </button>
        )}
      </div>
    </motion.li>
  )
}

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
            <HistoryItem
              key={`${winner.id}-${index}`}
              winner={winner}
              index={index}
              totalCount={pastWinners.length}
              theme={theme}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
