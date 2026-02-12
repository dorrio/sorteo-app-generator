"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Disc, Play } from "lucide-react"

export function WheelVisual() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <>
      <motion.div
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear", repeatType: "loop" }}
        style={{ willChange: "transform" }}
        className="absolute inset-0 rounded-full border-t-4 border-primary"
      />
      <Disc className="w-24 h-24 text-primary/50" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-background/50 rounded-full">
        <Play className="w-12 h-12 text-primary fill-current" />
      </div>
    </>
  )
}
