"use client"

import { motion } from "framer-motion"
import { useSorteoStore } from "@/lib/sorteo-store"
import { ParticipantManager } from "@/components/sorteo/participant-manager"
import { HistoryPanel } from "@/components/sorteo/history-panel"
import { FloatingBubbles } from "@/components/sorteo/floating-bubbles"
import { Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"

export function SidebarIsland() {
  const { theme } = useSorteoStore()
  const t = useTranslations("HomePage")
  const participantDisplay = theme.participantDisplay ?? "list"

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      {/* Participants card */}
      <section
        className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6"
        aria-labelledby="participants-title"
      >
        <h2
          id="participants-title"
          className="font-bold text-lg mb-4 flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" style={{ color: theme.primaryColor }} />
          {t("participants_title")}
        </h2>

        {participantDisplay === "bubbles" ? <FloatingBubbles /> : <ParticipantManager />}

        {participantDisplay === "bubbles" && (
          <div className="mt-4 pt-4 border-t border-border">
            <ParticipantManager showOnlyInput />
          </div>
        )}
      </section>

      {/* History card */}
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6">
        <HistoryPanel />
      </div>
    </motion.aside>
  )
}
