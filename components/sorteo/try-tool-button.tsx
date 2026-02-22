"use client"

import type React from "react"
import { useSorteoStore, type ThemeConfig } from "@/lib/sorteo-store"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TryToolButtonProps {
  children: React.ReactNode
  className?: string
  targetStyle?: ThemeConfig["sorteoStyle"]
  onClick?: () => void
}

export function TryToolButton({
  children,
  className,
  targetStyle = "roulette",
  onClick
}: TryToolButtonProps) {
  const { updateTheme } = useSorteoStore()

  const handleTry = (e: React.MouseEvent) => {
    updateTheme({ sorteoStyle: targetStyle })
    if (onClick) onClick()
  }

  return (
    <Button
      asChild
      className={className}
    >
      <a href="#sorteo-section" onClick={handleTry}>
        <Play className="w-5 h-5 fill-current" />
        {children}
      </a>
    </Button>
  )
}
