"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { useSorteoStore, selectSecureWinner } from "@/lib/sorteo-store"
import { useShallow } from "zustand/react/shallow"

interface SorteoRouletteProps {
  onWinnerSelected: () => void
}

export function SorteoRoulette({ onWinnerSelected }: SorteoRouletteProps) {
  const { participants, isSpinning, setIsSpinning, setWinner, addToPastWinners, theme } = useSorteoStore(
    useShallow((state) => ({
      participants: state.participants,
      isSpinning: state.isSpinning,
      setIsSpinning: state.setIsSpinning,
      setWinner: state.setWinner,
      addToPastWinners: state.addToPastWinners,
      theme: state.theme,
    })),
  )
  const t = useTranslations("Roulette")
  const [rotation, setRotation] = useState(0)
  const rotationRef = useRef(0)
  const wheelRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  const selectWinner = useCallback(() => {
    const winner = selectSecureWinner(participants)
    if (!winner) return null

    const index = participants.findIndex(p => p.id === winner.id)
    return { participant: winner, index }
  }, [participants])

  useEffect(() => {
    if (!isSpinning || participants.length === 0) return

    const result = selectWinner()
    if (!result) return

    const spinDuration = theme.spinDuration * 1000
    const startTime = Date.now()
    const startRotation = rotationRef.current
    const segmentAngle = 360 / participants.length

    // The pointer is at the TOP (0 degrees visual position)
    // Participant at index i is visually positioned at: (i * segmentAngle + segmentAngle/2 - 90) degrees
    // But when displayed on screen, this becomes: (i * segmentAngle + segmentAngle/2) degrees
    // So to align winner to top, we rotate wheel by: -(winner_visual_angle)

    const winnerVisualAngle = result.index * segmentAngle + segmentAngle / 2
    const fullSpins = 360 * 5
    const targetRotation = fullSpins - winnerVisualAngle

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / spinDuration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 4)
      const currentRotation = startRotation + (targetRotation - startRotation) * easeOut

      // Write straight to the DOM each frame: a state update here re-rendered every segment ~60 times per second
      rotationRef.current = currentRotation
      if (wheelRef.current) wheelRef.current.style.transform = `rotate(${currentRotation}deg)`

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        rotationRef.current = targetRotation % 360
        setRotation(rotationRef.current)
        setWinner(result.participant)
        addToPastWinners(result.participant)
        setIsSpinning(false)
        setTimeout(() => onWinnerSelected(), 1500)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- listed deps are stable store setters + callbacks; including them would re-enter the animation every render
  }, [isSpinning])

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🎡</div>
        <p className="text-muted-foreground text-lg">{t("add_participants_warning")}</p>
      </div>
    )
  }

  const segmentAngle = 360 / participants.length
  const radius = 140

  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center" aria-hidden="true">
        <div
          className="w-0 h-0 relative"
          style={{
            borderLeft: "20px solid transparent",
            borderRight: "20px solid transparent",
            borderTop: `35px solid ${theme.primaryColor}`,
            filter: `drop-shadow(0 0 15px ${theme.primaryColor}) drop-shadow(0 0 25px ${theme.primaryColor})`,
          }}
        />
        {/* Pointer line indicator */}
        <div
          className="w-1 h-4 -mt-1"
          style={{
            backgroundColor: theme.primaryColor,
            boxShadow: `0 0 10px ${theme.primaryColor}`,
          }}
        />
      </div>

      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 z-10 w-0.5 h-12 opacity-50"
        style={{
          background: `linear-gradient(to bottom, ${theme.primaryColor}, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* Roulette wheel */}
      <div
        ref={wheelRef}
        className="relative w-[320px] h-[320px] rounded-full border-4 mt-2"
        style={{
          borderColor: theme.primaryColor,
          boxShadow: `0 0 40px ${theme.primaryColor}30, inset 0 0 60px ${theme.primaryColor}10`,
          transform: `rotate(${rotation}deg)`,
        }}
        role="list"
      >
        <div
          className="absolute -inset-2 rounded-full pointer-events-none"
          style={{
            border: `2px solid ${theme.primaryColor}40`,
            boxShadow: `0 0 20px ${theme.primaryColor}20`,
          }}
          aria-hidden="true"
        />

        {/* Center circle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full z-10 flex items-center justify-center"
          style={{
            backgroundColor: theme.primaryColor,
            boxShadow: `0 0 30px ${theme.primaryColor}60`,
          }}
          aria-hidden="true"
        >
          <span className="text-3xl">🎰</span>
        </div>

        {/* Segment divider lines - lines start from segment boundaries */}
        {participants.map((_, index) => {
          const angle = index * segmentAngle - 90
          return (
            <div
              key={`line-${index}`}
              className="absolute top-1/2 left-1/2 origin-left h-0.5 w-[140px]"
              style={{
                transform: `rotate(${angle}deg)`,
                background: `linear-gradient(to right, transparent 40px, ${theme.primaryColor}30 40px, ${theme.primaryColor}30)`,
              }}
              aria-hidden="true"
            />
          )
        })}

        {/* Participant names - positioned at segment centers */}
        {participants.map((participant, index) => {
          const angle = index * segmentAngle + segmentAngle / 2 - 90
          const radians = (angle * Math.PI) / 180
          const x = Math.cos(radians) * radius + 160
          const y = Math.sin(radians) * radius + 160

          return (
            <div
              key={participant.id}
              className="absolute flex items-center justify-center"
              style={{
                left: x,
                top: y,
                transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
              }}
              role="listitem"
            >
              <div
                className="px-3 py-1.5 rounded-full text-sm font-medium max-w-[100px] truncate text-center"
                style={{
                  backgroundColor: `${theme.primaryColor}20`,
                  color: theme.textColor,
                  border: `1px solid ${theme.primaryColor}40`,
                }}
              >
                {participant.name.length > 10 ? participant.name.slice(0, 10) + "..." : participant.name}
              </div>
            </div>
          )
        })}
      </div>

      <motion.div className="mt-4 text-center text-muted-foreground" animate={{ opacity: isSpinning ? 0.5 : 1 }}>
        <span className="text-sm">{t("participants_count", { count: participants.length })}</span>
      </motion.div>
    </div>
  )
}
