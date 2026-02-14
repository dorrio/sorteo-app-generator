"use client"

import { useEffect, useRef } from "react"
import { useSorteoStore } from "@/lib/sorteo-store"

interface ContentWrapperIslandProps {
  children: React.ReactNode
}

export function ContentWrapperIsland({ children }: ContentWrapperIslandProps) {
  const { theme, isVerifyModalOpen, showWinnerCeremony, isEditorOpen, showCountdown } = useSorteoStore()
  const contentRef = useRef<HTMLDivElement>(null)

  const isOverlayOpen = isVerifyModalOpen || showWinnerCeremony || isEditorOpen || showCountdown

  useEffect(() => {
    if (contentRef.current) {
      if (isOverlayOpen) {
        contentRef.current.setAttribute('inert', '')
        // @ts-ignore - inert property exists in modern browsers
        contentRef.current.inert = true
      } else {
        contentRef.current.removeAttribute('inert')
        // @ts-ignore
        contentRef.current.inert = false
      }
    }
  }, [isOverlayOpen])

  return (
    <div
      ref={contentRef}
      className="relative z-10"
      style={{
        fontFamily:
          theme.fontFamily === "Inter" ? "var(--font-inter)" :
            theme.fontFamily === "Space Grotesk" ? "var(--font-display)" :
              theme.fontFamily === "Roboto" ? "system-ui, sans-serif" :
                theme.fontFamily === "Montserrat" ? "system-ui, sans-serif" :
                  theme.fontFamily === "Open Sans" ? "system-ui, sans-serif" :
                    theme.fontFamily === "Lato" ? "system-ui, sans-serif" :
                      theme.fontFamily === "Poppins" ? "system-ui, sans-serif" :
                        theme.fontFamily === "system-ui" ? "system-ui, sans-serif" :
                          "var(--font-display)"
      }}
    >
      {children}
    </div>
  )
}
