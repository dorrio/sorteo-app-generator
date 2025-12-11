"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSorteoStore } from "@/lib/sorteo-store"

interface SorteoCardsProps {
  onWinnerSelected: () => void
}

export function SorteoCards({ onWinnerSelected }: SorteoCardsProps) {
  const { participants, isSpinning, setIsSpinning, setWinner, addToPastWinners, theme } = useSorteoStore()
  const [shuffledCards, setShuffledCards] = useState<typeof participants>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [finalWinner, setFinalWinner] = useState<string | null>(null)
  const [showFinal, setShowFinal] = useState(false)

  const selectRandomWinner = useCallback(() => {
    if (participants.length === 0) return null
    const randomIndex = Math.floor(Math.random() * participants.length)
    return participants[randomIndex]
  }, [participants])

  useEffect(() => {
    if (!isSpinning || participants.length === 0) return

    const winner = selectRandomWinner()
    if (!winner) return

    // Shuffle cards
    const shuffled = [...participants].sort(() => Math.random() - 0.5)
    setShuffledCards(shuffled)
    setCurrentCardIndex(0)
    setShowFinal(false)

    const spinDuration = theme.spinDuration * 1000
    const cardFlipInterval = spinDuration / Math.min(participants.length * 2, 20)
    let flipCount = 0
    const maxFlips = Math.min(participants.length * 2, 20)

    const flipInterval = setInterval(() => {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentCardIndex((prev) => (prev + 1) % shuffled.length)
        setIsFlipping(false)
      }, 150)
      flipCount++

      if (flipCount >= maxFlips) {
        clearInterval(flipInterval)
        // Final reveal
        setTimeout(() => {
          setFinalWinner(winner.name)
          setShowFinal(true)
          setWinner(winner)
          addToPastWinners(winner)
          setIsSpinning(false)
          setTimeout(() => onWinnerSelected(), 500)
        }, 300)
      }
    }, cardFlipInterval)

    return () => clearInterval(flipInterval)
  }, [
    isSpinning,
    participants,
    theme.spinDuration,
    selectRandomWinner,
    setWinner,
    addToPastWinners,
    setIsSpinning,
    onWinnerSelected,
  ])

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🃏</div>
        <p className="text-muted-foreground text-lg">Añade participantes para iniciar el sorteo</p>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Card stack */}
      <div className="relative w-64 h-80 perspective-1000">
        {/* Background cards */}
        {[2, 1].map((offset) => (
          <div
            key={offset}
            className="absolute inset-0 rounded-2xl border-2"
            style={{
              borderColor: `${theme.primaryColor}40`,
              backgroundColor: `${theme.primaryColor}10`,
              transform: `translateX(${offset * 8}px) translateY(${offset * 8}px) rotate(${offset * 2}deg)`,
            }}
          />
        ))}

        {/* Main card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={showFinal ? "winner" : currentCardIndex}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 rounded-2xl border-4 flex items-center justify-center p-6 backdrop-blur-sm"
            style={{
              borderColor: showFinal ? theme.primaryColor : `${theme.primaryColor}80`,
              backgroundColor: showFinal ? `${theme.primaryColor}20` : `${theme.backgroundColor}90`,
              boxShadow: showFinal
                ? `0 0 60px ${theme.primaryColor}40, 0 20px 40px rgba(0,0,0,0.3)`
                : `0 10px 30px rgba(0,0,0,0.2)`,
            }}
          >
            {/* Card pattern */}
            <div
              className="absolute inset-4 rounded-xl border opacity-20"
              style={{ borderColor: theme.primaryColor }}
            />

            {/* Card content */}
            <div className="text-center z-10">
              {showFinal && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-4xl mb-4">
                  👑
                </motion.div>
              )}
              <motion.p
                className={`font-bold ${showFinal ? "text-3xl" : "text-2xl"}`}
                style={{ color: showFinal ? theme.primaryColor : theme.textColor }}
                animate={
                  showFinal
                    ? {
                        textShadow: [
                          `0 0 10px ${theme.primaryColor}40`,
                          `0 0 30px ${theme.primaryColor}60`,
                          `0 0 10px ${theme.primaryColor}40`,
                        ],
                      }
                    : {}
                }
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                {showFinal ? finalWinner : shuffledCards[currentCardIndex]?.name || participants[0].name}
              </motion.p>
              {showFinal && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-muted-foreground mt-2"
                >
                  ¡Ganador!
                </motion.p>
              )}
            </div>

            {/* Corner decorations */}
            {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos, i) => (
              <div key={i} className={`absolute ${pos} text-lg`} style={{ color: theme.primaryColor, opacity: 0.6 }}>
                ✦
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div className="mt-8 text-center text-muted-foreground" animate={{ opacity: isSpinning ? 0.5 : 1 }}>
        <span className="text-lg">{participants.length} participantes en el sorteo</span>
      </motion.div>
    </div>
  )
}
