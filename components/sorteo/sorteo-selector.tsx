"use client"

import { useSorteoStore } from "@/lib/sorteo-store"
import { SlotMachine } from "./slot-machine"
import { SorteoRoulette } from "./sorteo-roulette"
import { SorteoCascade } from "./sorteo-cascade"
import { SorteoCards } from "./sorteo-cards"
import { SorteoMatrix } from "./sorteo-matrix"

interface SorteoSelectorProps {
  onWinnerSelected: () => void
}

export function SorteoSelector({ onWinnerSelected }: SorteoSelectorProps) {
  const { theme } = useSorteoStore()
  const sorteoStyle = theme.sorteoStyle ?? "slot-machine"

  switch (sorteoStyle) {
    case "roulette":
      return <SorteoRoulette onWinnerSelected={onWinnerSelected} />
    case "cascade":
      return <SorteoCascade onWinnerSelected={onWinnerSelected} />
    case "cards":
      return <SorteoCards onWinnerSelected={onWinnerSelected} />
    case "matrix":
      return <SorteoMatrix onWinnerSelected={onWinnerSelected} />
    case "slot-machine":
    default:
      return <SlotMachine onWinnerSelected={onWinnerSelected} />
  }
}
