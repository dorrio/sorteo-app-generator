"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { useSorteoStore } from "@/lib/sorteo-store"

interface CountdownAnimationProps {
  onComplete: () => void
}

export function CountdownAnimation({ onComplete }: CountdownAnimationProps) {
  const { theme, showCountdown } = useSorteoStore()
  const t = useTranslations("Countdown")
  const [count, setCount] = useState(theme.countdownDuration)

  useEffect(() => {
    if (!showCountdown) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting the visible counter when the parent closes the countdown overlay is the intended sync
      setCount(theme.countdownDuration)
      return
    }

    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(onComplete, 500)
      return () => clearTimeout(timer)
    }
  }, [count, showCountdown, theme.countdownDuration, onComplete])

  if (!showCountdown) return null

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-background/95 backdrop-blur-xl"
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative">
        {/* Pulsing rings */}
        <motion.div
          className="absolute inset-0 -m-20 rounded-full border-2 border-primary/30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute inset-0 -m-32 rounded-full border border-primary/20"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
        />

        <AnimatePresence mode="wait">
          {count > 0 ? (
            <motion.div
              key={count}
              initial={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 2, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <span className="text-[200px] font-display font-bold tabular-nums" style={{ color: theme.primaryColor }}>
                {count}
              </span>

              {/* Glow effect */}
              <div className="absolute inset-0 blur-3xl opacity-50" style={{ backgroundColor: theme.primaryColor }} />
            </motion.div>
          ) : (
            <motion.div
              key="go"
              initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="relative"
            >
              <span
                className="text-[120px] font-display font-bold tracking-wider"
                style={{ color: theme.primaryColor }}
              >
                {t("go")}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtitle */}
        <motion.p
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-muted-foreground text-xl font-medium whitespace-nowrap"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          {theme.customSubtitle}
        </motion.p>
      </div>
    </motion.div>
  )
}
