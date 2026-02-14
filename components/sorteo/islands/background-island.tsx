"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { useSorteoStore } from "@/lib/sorteo-store"

const ParticleBackground = dynamic(
  () => import("@/components/sorteo/particle-background").then((mod) => mod.ParticleBackground),
  { ssr: false }
)

export function BackgroundIsland() {
  const { theme } = useSorteoStore()

  const bgOpacity = theme.backgroundOpacity ?? 30
  const bgBlur = theme.backgroundBlur ?? 0

  return (
    <>
      {theme.backgroundImage && (
        <div className="fixed inset-0 z-0">
          <Image
            src={theme.backgroundImage}
            alt="Custom Background"
            fill
            priority
            className="object-cover"
            unoptimized
            style={{
              opacity: bgOpacity / 100,
              filter: `blur(${bgBlur}px)`,
            }}
          />
        </div>
      )}
      <ParticleBackground />
    </>
  )
}
