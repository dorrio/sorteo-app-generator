"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { useSorteoStore } from "@/lib/sorteo-store"

interface SorteoGridProps {
    onWinnerSelected: () => void
}

export function SorteoGrid({ onWinnerSelected }: SorteoGridProps) {
    const { participants, isSpinning, setIsSpinning, setWinner, addToPastWinners, theme } = useSorteoStore()
    const t = useTranslations("SorteoMatrix") // Reusing Matrix translations or generic ones
    const tCommon = useTranslations("SorteoComponents")
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
    const [finalWinnerIndex, setFinalWinnerIndex] = useState<number | null>(null)

    const selectRandomWinnerIndex = useCallback(() => {
        if (participants.length === 0) return null
        return Math.floor(Math.random() * participants.length)
    }, [participants])

    useEffect(() => {
        if (!isSpinning || participants.length === 0) return

        setHighlightedIndex(null)
        setFinalWinnerIndex(null)

        const spinDuration = theme.spinDuration * 1000
        const intervalTime = 100 // Speed of flickering
        const startTime = Date.now()

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime

            if (elapsed >= spinDuration) {
                clearInterval(interval)
                const winnerIndex = selectRandomWinnerIndex()

                if (winnerIndex !== null) {
                    setHighlightedIndex(winnerIndex)
                    setFinalWinnerIndex(winnerIndex)

                    const winner = participants[winnerIndex]
                    setWinner(winner)
                    addToPastWinners(winner)
                    setIsSpinning(false)

                    setTimeout(() => onWinnerSelected(), 1000)
                }
            } else {
                // Random highlight effect
                setHighlightedIndex(Math.floor(Math.random() * participants.length))
            }
        }, intervalTime)

        return () => clearInterval(interval)
    }, [
        isSpinning,
        participants,
        theme.spinDuration,
        selectRandomWinnerIndex,
        setWinner,
        addToPastWinners,
        setIsSpinning,
        onWinnerSelected,
    ])

    if (participants.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-muted-foreground text-lg">{tCommon("add_participants_warning")}</p>
            </div>
        )
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {participants.map((participant, index) => {
                    const isHighlighted = highlightedIndex === index
                    const isWinner = finalWinnerIndex === index

                    return (
                        <motion.div
                            key={participant.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{
                                opacity: 1,
                                scale: isWinner ? 1.1 : 1,
                                borderColor: isHighlighted || isWinner ? theme.primaryColor : `${theme.primaryColor}20`,
                                backgroundColor: isWinner
                                    ? `${theme.primaryColor}30`
                                    : (isHighlighted ? `${theme.primaryColor}10` : `${theme.backgroundColor}60`)
                            }}
                            className="relative p-4 rounded-xl border-2 backdrop-blur-sm flex items-center justify-center text-center h-20 shadow-lg transition-colors duration-200"
                            style={{
                                boxShadow: isWinner ? `0 0 30px ${theme.primaryColor}40` : 'none'
                            }}
                        >
                            <span
                                className={`font-medium truncate w-full px-2 ${isWinner ? 'text-lg font-bold' : 'text-sm'}`}
                                style={{ color: isWinner || isHighlighted ? theme.primaryColor : theme.textColor }}
                            >
                                {participant.name}
                            </span>

                            {isWinner && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-3 -right-3 bg-background rounded-full p-1 border shadow-sm"
                                    style={{ borderColor: theme.primaryColor }}
                                >
                                    <span className="text-xl">🏆</span>
                                </motion.div>
                            )}
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
