"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { useSorteoStore, selectSecureWinner } from "@/lib/sorteo-store"

interface SorteoMatrixProps {
  onWinnerSelected: () => void
}

interface MatrixColumn {
  id: string
  x: number
  names: string[]
  speed: number
  offset: number
}

export function SorteoMatrix({ onWinnerSelected }: SorteoMatrixProps) {
  const { participants, isSpinning, setIsSpinning, setWinner, addToPastWinners, theme } = useSorteoStore()
  const t = useTranslations("SorteoMatrix")
  const tCommon = useTranslations("SorteoComponents")
  const [columns, setColumns] = useState<MatrixColumn[]>([])
  const [finalWinner, setFinalWinner] = useState<string | null>(null)
  const [showWinner, setShowWinner] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectWinner = useCallback(() => {
    return selectSecureWinner(participants)
  }, [participants])

  useEffect(() => {
    if (!isSpinning || participants.length === 0) return

    const winner = selectWinner()
    if (!winner) return

    setShowWinner(false)
    setFinalWinner(null)

    // Create matrix columns
    const numColumns = 8
    const newColumns: MatrixColumn[] = Array.from({ length: numColumns }, (_, i) => ({
      id: `col-${i}`,
      x: (i / numColumns) * 100 + 5,
      names: [...participants].sort(() => Math.random() - 0.5).map((p) => p.name),
      speed: 1 + Math.random() * 2,
      offset: Math.random() * 100,
    }))
    setColumns(newColumns)

    const spinDuration = theme.spinDuration * 1000

    setTimeout(() => {
      setColumns([])
      setFinalWinner(winner.name)
      setShowWinner(true)
      setWinner(winner)
      addToPastWinners(winner)
      setIsSpinning(false)
      setTimeout(() => onWinnerSelected(), 500)
    }, spinDuration)
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
        <div className="text-6xl mb-4">💻</div>
        <p className="text-muted-foreground text-lg">{tCommon("add_participants_warning")}</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative h-[350px] rounded-2xl border-2 overflow-hidden"
        style={{
          borderColor: theme.primaryColor,
          boxShadow: `0 0 40px ${theme.primaryColor}20`,
          backgroundColor: `${theme.backgroundColor}f0`,
        }}
      >
        {/* Matrix rain effect */}
        {columns.map((column) => (
          <motion.div
            key={column.id}
            className="absolute top-0 flex flex-col gap-4"
            style={{ left: `${column.x}%` }}
            initial={{ y: -500 }}
            animate={{ y: 500 }}
            transition={{
              duration: column.speed,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {column.names.map((name, i) => (
              <span
                key={`${column.id}-${i}`}
                className="text-sm font-mono whitespace-nowrap"
                style={{
                  color: theme.primaryColor,
                  opacity: 0.3 + (i % 3) * 0.2,
                  textShadow: `0 0 10px ${theme.primaryColor}`,
                }}
              >
                {name}
              </span>
            ))}
          </motion.div>
        ))}

        {/* Scan lines effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              ${theme.backgroundColor}20 2px,
              ${theme.backgroundColor}20 4px
            )`,
          }}
        />

        {/* Winner reveal */}
        <AnimatePresence>
          {showWinner && finalWinner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: `${theme.backgroundColor}f5` }}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="text-center"
              >
                <motion.div
                  className="text-xs font-mono mb-2 tracking-widest"
                  style={{ color: theme.primaryColor }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0.5, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  {">"} {t("winner_selected")}
                </motion.div>
                <motion.div
                  className="text-4xl md:text-5xl font-bold font-mono"
                  style={{
                    color: theme.primaryColor,
                    textShadow: `0 0 30px ${theme.primaryColor}80, 0 0 60px ${theme.primaryColor}40`,
                  }}
                  animate={{
                    textShadow: [
                      `0 0 30px ${theme.primaryColor}80`,
                      `0 0 50px ${theme.primaryColor}`,
                      `0 0 30px ${theme.primaryColor}80`,
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  {finalWinner}
                </motion.div>
                <motion.div
                  className="mt-2 text-xs font-mono"
                  style={{ color: `${theme.primaryColor}80` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {t("verified")}
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
