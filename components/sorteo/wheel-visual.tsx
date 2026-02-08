"use client"

import { useSorteoStore } from "@/lib/sorteo-store"
import { motion, useReducedMotion } from "framer-motion"
import { Disc, Play } from "lucide-react"

export function WheelVisual({ title = "Try Wheel" }: { title?: string }) {
  const { updateTheme } = useSorteoStore()
  const shouldReduceMotion = useReducedMotion()

  const handleTryIt = () => {
    updateTheme({ sorteoStyle: "roulette" })
    const element = document.getElementById("sorteo-section")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="hidden md:flex justify-center items-center sticky top-24">
      <div
        className="relative w-64 h-64 rounded-full border-4 border-primary/20 flex items-center justify-center bg-card/50 backdrop-blur-sm cursor-pointer hover:scale-105 transition-transform"
        onClick={handleTryIt}
      >
        <span className="sr-only">{title}</span>
        <motion.div
            animate={shouldReduceMotion ? {} : { rotate: 360 }}
            transition={shouldReduceMotion ? {} : { duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-4 border-primary"
        />
        <Disc className="w-24 h-24 text-primary/50" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-background/50 rounded-full">
            <Play className="w-12 h-12 text-primary fill-current" />
        </div>
      </div>
    </div>
  )
}
