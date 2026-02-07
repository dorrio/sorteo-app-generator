"use client"

import { useSorteoStore } from "@/lib/sorteo-store"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface TryButtonProps {
  label: string
}

export function TryButton({ label }: TryButtonProps) {
  const { updateTheme } = useSorteoStore()

  const handleTryWheel = () => {
    updateTheme({ sorteoStyle: "roulette" })
  }

  return (
    <Button
      asChild
      onClick={handleTryWheel}
      className="gap-2 font-bold text-lg h-12 px-6 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
    >
      <a href="#sorteo-section">
        <Play className="w-5 h-5 fill-current" />
        {label}
      </a>
    </Button>
  )
}
