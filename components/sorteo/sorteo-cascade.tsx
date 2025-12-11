"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { useSorteoStore } from "@/lib/sorteo-store"

interface SorteoCascadeProps {
  onWinnerSelected: () => void
}

interface FallingName {
  id: string
  name: string
  x: number
  delay: number
}

export function SorteoCascade({ onWinnerSelected }: SorteoCascadeProps) {
  const { participants, isSpinning, setIsSpinning, setWinner, addToPastWinners, theme } = useSorteoStore()
  const tCommon = useTranslations("SorteoComponents")
  const [fallingNames, setFallingNames] = useState<FallingName[]>([])
  const [finalWinner, setFinalWinner] = useState<string | null>(null)
  const [showWinner, setShowWinner] = useState(false)

  const selectRandomWinner = useCallback(() => {
    if (participants.length === 0) return null
    const randomIndex = Math.floor(Math.random() * participants.length)
    return participants[randomIndex]
  }, [participants])

  useEffect(() => {
    if (!isSpinning || participants.length === 0) return

    const winner = selectRandomWinner()
    if (!winner) return

    const spinDuration = theme.spinDuration * 1000
    let nameIndex = 0

    // Generate falling names continuously
    const interval = setInterval(() => {
      const participant = participants[nameIndex % participants.length]
      const newFallingName: FallingName = {
        id: `${participant.id}-${Date.now()}-${Math.random()}`,
        name: participant.name,
        x: 10 + Math.random() * 80,
        delay: 0,
      }
      setFallingNames((prev) => [...prev.slice(-20), newFallingName])
      nameIndex++
    }, 150)

    // End animation
    setTimeout(() => {
      clearInterval(interval)
      setFallingNames([])
      setFinalWinner(winner.name)
      setShowWinner(true)
      setWinner(winner)
      addToPastWinners(winner)
      setIsSpinning(false)
      setTimeout(() => onWinnerSelected(), 500)
    }, spinDuration)

    return () => clearInterval(interval)
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

  // Reset winner display when starting new spin
  useEffect(() => {
    if (isSpinning) {
      setShowWinner(false)
      setFinalWinner(null)
    }
  }, [isSpinning])

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🌊</div>
        <p className="text-muted-foreground text-lg">{tCommon("add_participants_warning")}</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        className="relative h-[350px] rounded-2xl border-2 overflow-hidden"
        style={{
          borderColor: theme.primaryColor,
          boxShadow: `0 0 40px ${theme.primaryColor}20`,
          background: `linear-gradient(180deg, ${theme.backgroundColor}00 0%, ${theme.primaryColor}10 100%)`,
        }}
      >
        {/* Falling names */}
        <AnimatePresence>
          {fallingNames.map((item) => (
            <motion.div
              key={item.id}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 400, opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2,
                ease: "easeIn",
              }}
              className="absolute text-lg font-medium whitespace-nowrap"
              style={{
                left: `${item.x}%`,
                color: theme.textColor,
                textShadow: `0 0 10px ${theme.primaryColor}60`,
              }}
            >
              {item.name}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Winner reveal */}
        <AnimatePresence>
          {showWinner && finalWinner && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: `${theme.backgroundColor}e0` }}
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    textShadow: [
                      `0 0 20px ${theme.primaryColor}60`,
                      `0 0 40px ${theme.primaryColor}80`,
                      `0 0 20px ${theme.primaryColor}60`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="text-4xl md:text-5xl font-bold"
                  style={{ color: theme.primaryColor }}
                >
                  {finalWinner}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div className="mt-6 text-center text-muted-foreground" animate={{ opacity: isSpinning ? 0.5 : 1 }}>
        <span className="text-lg">{tCommon("participants_count", { count: participants.length })}</span>
      </motion.div>
    </div>
  )
}
