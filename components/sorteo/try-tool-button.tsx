"use client"

import { useSorteoStore } from "@/lib/sorteo-store"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

type SorteoStyle = "slot-machine" | "roulette" | "cascade" | "cards" | "matrix" | "grid"

interface TryToolButtonProps {
  style: SorteoStyle
  children: React.ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

export function TryToolButton({ style, children, className, variant = "default", size = "default", asChild = false }: TryToolButtonProps) {
  const { updateTheme } = useSorteoStore()

  const handleTryIt = () => {
    updateTheme({ sorteoStyle: style })
    // Scroll to tool area
    const element = document.getElementById("sorteo-section")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleTryIt}
      asChild={asChild}
    >
      {asChild ? (
        children
      ) : (
        <span className="flex items-center gap-2">
            <Play className="w-5 h-5 fill-current" />
            {children}
        </span>
      )}
    </Button>
  )
}
