"use client"

import Image from "next/image"
import { useSorteoStore } from "@/lib/sorteo-store"

export function BackgroundLayer() {
  const { theme, hasHydrated } = useSorteoStore()

  if (!hasHydrated || !theme.backgroundImage) return null

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Image
        src={theme.backgroundImage}
        alt="Custom Background"
        fill
        priority
        className="object-cover"
        unoptimized
        style={{
          opacity: (theme.backgroundOpacity ?? 30) / 100,
          filter: `blur(${theme.backgroundBlur ?? 0}px)`,
        }}
      />
    </div>
  )
}
