"use client"

import { motion } from "framer-motion"
import { Disc, Play } from "lucide-react"
import { useSorteoStore } from "@/lib/sorteo-store"

interface WheelVisualProps {
  label: string
}

export function WheelVisual({ label }: WheelVisualProps) {
  const { updateTheme } = useSorteoStore()

  const handleTryWheel = () => {
    updateTheme({ sorteoStyle: "roulette" })
  }

  return (
    <a
      href="#sorteo-section"
      className="relative w-64 h-64 rounded-full border-4 border-primary/20 flex items-center justify-center bg-card/50 backdrop-blur-sm cursor-pointer hover:scale-105 transition-transform"
      onClick={handleTryWheel}
    >
      <span className="sr-only">{label}</span>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border-t-4 border-primary"
      />
      <Disc className="w-24 h-24 text-primary/50" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-background/50 rounded-full">
        <Play className="w-12 h-12 text-primary fill-current" />
      </div>
    </a>
  )
}
