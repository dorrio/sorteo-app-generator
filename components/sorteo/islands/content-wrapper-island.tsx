"use client"

import { useEffect, useRef } from "react"
import { useSorteoStore } from "@/lib/sorteo-store"

interface ContentWrapperIslandProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function ContentWrapperIsland({ children, className, style }: ContentWrapperIslandProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const {
    isVerifyModalOpen,
    showWinnerCeremony,
    isEditorOpen,
    showCountdown,
    theme
  } = useSorteoStore()

  // Calculated state for inert
  const isOverlayOpen = isVerifyModalOpen || showWinnerCeremony || isEditorOpen || showCountdown

  useEffect(() => {
    if (contentRef.current) {
      if (isOverlayOpen) {
        contentRef.current.setAttribute('inert', '')
        contentRef.current.inert = true
      } else {
        contentRef.current.removeAttribute('inert')
        contentRef.current.inert = false
      }
    }
  }, [isOverlayOpen])

  const getFontFamily = () => {
    switch (theme.fontFamily) {
      case "Inter": return "var(--font-inter)"
      case "Space Grotesk": return "var(--font-display)"
      case "Roboto": return "system-ui, sans-serif"
      case "Montserrat": return "system-ui, sans-serif"
      case "Open Sans": return "system-ui, sans-serif"
      case "Lato": return "system-ui, sans-serif"
      case "Poppins": return "system-ui, sans-serif"
      case "system-ui": return "system-ui, sans-serif"
      default: return "var(--font-display)"
    }
  }

  return (
    <div
      ref={contentRef}
      className={className}
      style={{
        ...style,
        fontFamily: getFontFamily()
      }}
    >
      {children}
    </div>
  )
}
