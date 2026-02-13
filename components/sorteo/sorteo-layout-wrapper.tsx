"use client"

import { useEffect, useRef } from "react"
import { useSorteoStore } from "@/lib/sorteo-store"

interface SorteoLayoutWrapperProps {
  children: React.ReactNode
}

export function SorteoLayoutWrapper({ children }: SorteoLayoutWrapperProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  const {
    isVerifyModalOpen,
    showWinnerCeremony,
    isEditorOpen,
    showCountdown,
    theme
  } = useSorteoStore()

  const isOverlayOpen = isVerifyModalOpen || showWinnerCeremony || isEditorOpen || showCountdown

  useEffect(() => {
    if (contentRef.current) {
      if (isOverlayOpen) {
        contentRef.current.setAttribute('inert', '')
        // @ts-ignore - inert is standard now but TS might complain
        contentRef.current.inert = true
      } else {
        contentRef.current.removeAttribute('inert')
        // @ts-ignore
        contentRef.current.inert = false
      }
    }
  }, [isOverlayOpen])

  const getFontFamily = () => {
    const font = theme.fontFamily
    if (font === "Inter") return "var(--font-inter)"
    if (font === "Space Grotesk") return "var(--font-display)"
    if (font === "Roboto") return "system-ui, sans-serif"
    if (font === "Montserrat") return "system-ui, sans-serif"
    if (font === "Open Sans") return "system-ui, sans-serif"
    if (font === "Lato") return "system-ui, sans-serif"
    if (font === "Poppins") return "system-ui, sans-serif"
    if (font === "system-ui") return "system-ui, sans-serif"
    return "var(--font-display)"
  }

  return (
    <div
      ref={contentRef}
      className="relative z-10"
      style={{
        fontFamily: getFontFamily()
      }}
    >
      {children}
    </div>
  )
}
