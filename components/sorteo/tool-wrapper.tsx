"use client"

import { useCallback } from "react"
import { useSorteoStore } from "@/lib/sorteo-store"
import { SorteoSelector } from "@/components/sorteo/sorteo-selector"

export function ToolWrapper() {
  const { setShowWinnerCeremony, setIsSpinning } = useSorteoStore()

  const handleWinnerSelected = useCallback(() => {
    setIsSpinning(false)
    setShowWinnerCeremony(true)
  }, [setShowWinnerCeremony, setIsSpinning])

  return <SorteoSelector onWinnerSelected={handleWinnerSelected} />
}
