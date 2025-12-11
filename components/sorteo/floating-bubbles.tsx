"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { useSorteoStore } from "@/lib/sorteo-store"

interface Bubble {
  id: string
  name: string
  x: number
  y: number
  size: number
  delay: number
  duration: number
  opacity: number
}

export function FloatingBubbles() {
  const { participants, theme } = useSorteoStore()
  const t = useTranslations("FloatingBubbles")
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Generate bubbles from participants
  useEffect(() => {
    if (participants.length === 0 || dimensions.width === 0) {
      setBubbles([])
      return
    }

    const generateBubbles = () => {
      const newBubbles: Bubble[] = participants.map((p, index) => {
        const nameLength = p.name.length
        const baseSize = Math.min(Math.max(nameLength * 8 + 40, 60), 120)

        return {
          id: `${p.id}-${Date.now()}-${index}`,
          name: p.name,
          x: Math.random() * (dimensions.width - baseSize),
          y: dimensions.height + 50,
          size: baseSize,
          delay: index * 0.8 + Math.random() * 0.5,
          duration: 8 + Math.random() * 4,
          opacity: 0.7 + Math.random() * 0.3,
        }
      })
      setBubbles(newBubbles)
    }

    generateBubbles()
    const interval = setInterval(generateBubbles, 12000)
    return () => clearInterval(interval)
  }, [participants, dimensions])

  if (participants.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
        {t("placeholder")}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative h-72 overflow-hidden rounded-xl"
      style={{
        background: `linear-gradient(180deg, ${theme.backgroundColor}00 0%, ${theme.backgroundColor}40 100%)`,
      }}
    >
      <AnimatePresence mode="popLayout">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            initial={{
              x: bubble.x,
              y: bubble.y,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              y: -bubble.size - 20,
              scale: 1,
              opacity: [0, bubble.opacity, bubble.opacity, 0],
              x: [
                bubble.x,
                bubble.x + Math.sin(bubble.delay) * 30,
                bubble.x - Math.sin(bubble.delay) * 20,
                bubble.x + Math.sin(bubble.delay) * 15,
              ],
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
            }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              ease: "easeOut",
              x: {
                duration: bubble.duration,
                ease: "easeInOut",
              },
              opacity: {
                times: [0, 0.1, 0.85, 1],
                duration: bubble.duration,
              },
            }}
            className="absolute flex items-center justify-center"
            style={{
              width: bubble.size,
              height: bubble.size,
            }}
          >
            {/* Bubble container with glass effect */}
            <div
              className="w-full h-full rounded-full flex items-center justify-center p-2 backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}25, ${theme.secondaryColor}15)`,
                border: `1px solid ${theme.primaryColor}30`,
                boxShadow: `
                  inset 0 2px 10px ${theme.primaryColor}10,
                  0 4px 20px ${theme.primaryColor}15
                `,
              }}
            >
              {/* Inner glow */}
              <div
                className="absolute inset-1 rounded-full opacity-30"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${theme.primaryColor}40, transparent 60%)`,
                }}
              />

              {/* Name */}
              <span
                className="text-center font-medium z-10 px-2 truncate"
                style={{
                  fontSize: `${Math.max(10, Math.min(14, bubble.size / 7))}px`,
                  color: theme.textColor,
                  textShadow: `0 1px 2px ${theme.backgroundColor}80`,
                }}
              >
                {bubble.name}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Subtle gradient overlay at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: `linear-gradient(0deg, ${theme.backgroundColor}80, transparent)`,
        }}
      />

      {/* Participant count */}
      <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
        {t("count", { count: participants.length })}
      </div>
    </div>
  )
}
