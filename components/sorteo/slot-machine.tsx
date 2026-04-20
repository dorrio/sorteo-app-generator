"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { useSorteoStore, selectSecureWinner } from "@/lib/sorteo-store"
import { cryptoShuffle } from "@/lib/utils"

interface SlotMachineProps {
  onWinnerSelected: () => void
}

export function SlotMachine({ onWinnerSelected }: SlotMachineProps) {
  const { participants, isSpinning, setIsSpinning, setWinner, addToPastWinners, theme } = useSorteoStore()
  const tCommon = useTranslations("SorteoComponents")

  const [displayedNames, setDisplayedNames] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [finalWinner, setFinalWinner] = useState<string | null>(null)

  const selectWinner = useCallback(() => {
    return selectSecureWinner(participants)
  }, [participants])

  useEffect(() => {
    if (!isSpinning || participants.length === 0) return

    // Determine winner at start
    const winner = selectWinner()
    if (!winner) return

    const spinDuration = theme.spinDuration * 1000
    const startTime = Date.now()

    // Create shuffled names for animation
    const shuffled = cryptoShuffle(participants)
    setDisplayedNames(shuffled.map((p) => p.name))

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / spinDuration

      if (progress < 1) {
        // Slow down as we approach the end
        const speed = Math.max(50, 300 * (1 - progress * progress))
        setCurrentIndex((prev) => (prev + 1) % shuffled.length)
        setTimeout(() => requestAnimationFrame(animate), speed)
      } else {
        // Animation complete - show winner
        setFinalWinner(winner.name)
        setWinner(winner)
        addToPastWinners(winner)
        setIsSpinning(false)

        setTimeout(() => {
          onWinnerSelected()
        }, 500)
      }
    }

    requestAnimationFrame(animate)
  }, [
    isSpinning,
    participants,
    theme.spinDuration,
    selectWinner,
    setWinner,
    addToPastWinners,
    setIsSpinning,
    onWinnerSelected,
  ])

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🎰</div>
        <p className="text-muted-foreground text-lg">{tCommon("add_participants_warning")}</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Slot window */}
      <motion.div
        className="relative overflow-hidden rounded-2xl border-4 bg-card/50 backdrop-blur-sm"
        style={{
          borderColor: theme.primaryColor,
          boxShadow: isSpinning ? `0 0 60px ${theme.primaryColor}40` : `0 0 30px ${theme.primaryColor}20`,
        }}
        animate={
          isSpinning
            ? {
              boxShadow: [
                `0 0 30px ${theme.primaryColor}20`,
                `0 0 60px ${theme.primaryColor}60`,
                `0 0 30px ${theme.primaryColor}20`,
              ],
            }
            : {}
        }
        transition={{ duration: 0.5, repeat: isSpinning ? Number.POSITIVE_INFINITY : 0 }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

        {/* Names container */}
        <div className="h-[300px] flex items-center justify-center px-8 py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSpinning ? currentIndex : finalWinner || "empty"}
              initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -50, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: isSpinning ? 0.1 : 0.3 }}
              className="text-center"
            >
              <span
                className="text-4xl md:text-6xl font-display font-bold tracking-wide"
                style={{ color: isSpinning ? theme.textColor : theme.primaryColor }}
              >
                {isSpinning
                  ? displayedNames[currentIndex] || participants[0].name
                  : finalWinner || participants[0].name}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Center highlight line */}
        <div
          className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-24 border-y-2 pointer-events-none"
          style={{ borderColor: `${theme.primaryColor}40` }}
        />
      </motion.div>

      {/* Participant count */}
      <motion.div className="mt-6 text-center text-muted-foreground" animate={{ opacity: isSpinning ? 0.5 : 1 }}>
        <span className="text-lg">{tCommon("participants_count", { count: participants.length })}</span>
      </motion.div>
    </div>
  )
}
