"use client"

import dynamic from "next/dynamic"
import { useCallback } from "react"
import { useSorteoStore } from "@/lib/sorteo-store"

const CountdownAnimation = dynamic(
  () => import("@/components/sorteo/countdown-animation").then((mod) => mod.CountdownAnimation),
  { ssr: false }
)
const WinnerCeremony = dynamic(
  () => import("@/components/sorteo/winner-ceremony").then((mod) => mod.WinnerCeremony),
  { ssr: false }
)
const VisualEditor = dynamic(
  () => import("@/components/sorteo/visual-editor").then((mod) => mod.VisualEditor),
  { ssr: false }
)
const VerificationModal = dynamic(
  () => import("@/components/sorteo/verification-modal").then((mod) => mod.VerificationModal),
  { ssr: false }
)

interface OverlaysProps {
  seoMode?: string
}

export function Overlays({ seoMode = 'home' }: OverlaysProps) {
  const {
    isVerifyModalOpen,
    setIsVerifyModalOpen,
    showWinnerCeremony,
    setShowWinnerCeremony,
    showCountdown,
    setShowCountdown,
    setIsSpinning,
    setWinner
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
      {showCountdown && <CountdownAnimation onComplete={handleCountdownComplete} />}
      {showWinnerCeremony && (
        <WinnerCeremony
          onClose={handleCloseCeremony}
          onNewSorteo={handleNewSorteo}
          seoMode={seoMode}
        />
      )}
      <VisualEditor />
      <VerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />
    </>
  )
}
