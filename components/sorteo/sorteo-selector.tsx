"use client"

import dynamic from "next/dynamic"
import { useSorteoStore } from "@/lib/sorteo-store"
import {
  WheelSkeleton,
  SlotSkeleton,
  BoxSkeleton,
  GridSkeleton,
  CardsSkeleton
} from "@/components/sorteo/skeletons"

const SlotMachine = dynamic(() => import("./slot-machine").then((mod) => mod.SlotMachine), {
  ssr: false,
  loading: SlotSkeleton,
})
const SorteoRoulette = dynamic(() => import("./sorteo-roulette").then((mod) => mod.SorteoRoulette), {
  ssr: false,
  loading: WheelSkeleton,
})
const SorteoCascade = dynamic(() => import("./sorteo-cascade").then((mod) => mod.SorteoCascade), {
  ssr: false,
  loading: BoxSkeleton,
})
const SorteoCards = dynamic(() => import("./sorteo-cards").then((mod) => mod.SorteoCards), {
  ssr: false,
  loading: CardsSkeleton,
})
const SorteoMatrix = dynamic(() => import("./sorteo-matrix").then((mod) => mod.SorteoMatrix), {
  ssr: false,
  loading: BoxSkeleton,
})
const SorteoGrid = dynamic(() => import("./sorteo-grid").then((mod) => mod.SorteoGrid), {
  ssr: false,
  loading: GridSkeleton,
})

interface SorteoSelectorProps {
  onWinnerSelected: () => void
  initialStyle?: string
}

export function SorteoSelector({ onWinnerSelected, initialStyle }: SorteoSelectorProps) {
  const { theme } = useSorteoStore()

  // Prioritize initialStyle if provided (used during SSR and pre-hydration sync)
  // Fallback to theme.sorteoStyle (user preference/persisted state)
  const sorteoStyle = initialStyle ?? theme.sorteoStyle ?? "slot-machine"

  switch (sorteoStyle) {
    case "roulette":
      return <SorteoRoulette onWinnerSelected={onWinnerSelected} />
    case "cascade":
      return <SorteoCascade onWinnerSelected={onWinnerSelected} />
    case "cards":
      return <SorteoCards onWinnerSelected={onWinnerSelected} />
    case "matrix":
      return <SorteoMatrix onWinnerSelected={onWinnerSelected} />
    case "grid":
      return <SorteoGrid onWinnerSelected={onWinnerSelected} />
    case "slot-machine":
    default:
      return <SlotMachine onWinnerSelected={onWinnerSelected} />
  }
}
