"use client"

import { useEffect, useRef } from "react"
import { useSorteoStore } from "@/lib/sorteo-store"

interface ContentWrapperIslandProps {
  children: React.ReactNode
}

export function ContentWrapperIsland({ children }: ContentWrapperIslandProps) {
  const {
    isVerifyModalOpen,
    showWinnerCeremony,
    isEditorOpen,
    showCountdown
  } = useSorteoStore()

  const contentRef = useRef<HTMLDivElement>(null)

  // Calculated state for inert
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
    <div ref={contentRef} className="relative z-10">
      {children}
    </div>
  )
}
