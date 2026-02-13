"use client"

import dynamic from "next/dynamic"
import { useCallback } from "react"
import { useSorteoStore } from "@/lib/sorteo-store"

const VisualEditor = dynamic(
  () => import("@/components/sorteo/visual-editor").then((mod) => mod.VisualEditor),
  { ssr: false }
)
const VerificationModal = dynamic(
  () => import("@/components/sorteo/verification-modal").then((mod) => mod.VerificationModal),
  { ssr: false }
)
const WinnerCeremony = dynamic(
  () => import("@/components/sorteo/winner-ceremony").then((mod) => mod.WinnerCeremony),
  { ssr: false }
)
const CountdownAnimation = dynamic(
  () => import("@/components/sorteo/countdown-animation").then((mod) => mod.CountdownAnimation),
  { ssr: false }
)

interface OverlaysIslandProps {
  seoMode?: string
}

export function OverlaysIsland({ seoMode }: OverlaysIslandProps) {
  const {
    isVerifyModalOpen,
    setIsVerifyModalOpen,
    setShowWinnerCeremony,
    setWinner,
    setIsSpinning,
    setShowCountdown
  } = useSorteoStore()

  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false)
    setIsSpinning(true)
  }, [setShowCountdown, setIsSpinning])

  const handleCloseCeremony = () => {
    setShowWinnerCeremony(false)
  }

  const handleNewSorteo = () => {
    setShowWinnerCeremony(false)
    setWinner(null)
  }

  return (
    <>
      <CountdownAnimation onComplete={handleCountdownComplete} />
      <WinnerCeremony onClose={handleCloseCeremony} onNewSorteo={handleNewSorteo} seoMode={seoMode} />
      <VisualEditor />
      <VerificationModal isOpen={isVerifyModalOpen} onClose={() => setIsVerifyModalOpen(false)} />
    </>
  )
}
