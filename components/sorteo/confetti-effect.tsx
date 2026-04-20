"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  rotation: number
  size: number
  isCircle: boolean
}

interface ConfettiEffectProps {
  isActive: boolean
  colors?: string[]
  count?: number
}

export function ConfettiEffect({
  isActive,
  colors = ["#D4AF37", "#FFD700", "#FFA500", "#FF6347", "#FF1493", "#00CED1"],
  count = 150,
}: ConfettiEffectProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- generating a fresh random pieces batch each time isActive flips on is the point of this effect
    setConfetti(
      isActive
        ? Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: Math.random() * 2,
            duration: 3 + Math.random() * 3,
            rotation: Math.random() * 720,
            size: 8 + Math.random() * 12,
            isCircle: Math.random() > 0.5,
          }))
        : [],
    )
  }, [isActive, colors, count])

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute"
              style={{
                left: `${piece.x}%`,
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: piece.isCircle ? "50%" : "0%",
              }}
              initial={{
                y: -50,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: "100vh",
                rotate: piece.rotation,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
