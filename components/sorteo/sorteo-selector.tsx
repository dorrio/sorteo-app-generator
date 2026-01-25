"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import { useSorteoStore } from "@/lib/sorteo-store"

const LoadingFallback = () => (
  <div className="h-[300px] flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
  </div>
)

const SlotMachine = dynamic(() => import("./slot-machine").then((mod) => mod.SlotMachine), {
  ssr: false,
  loading: LoadingFallback,
})
const SorteoRoulette = dynamic(() => import("./sorteo-roulette").then((mod) => mod.SorteoRoulette), {
  ssr: false,
  loading: LoadingFallback,
})
const SorteoCascade = dynamic(() => import("./sorteo-cascade").then((mod) => mod.SorteoCascade), {
  ssr: false,
  loading: LoadingFallback,
})
const SorteoCards = dynamic(() => import("./sorteo-cards").then((mod) => mod.SorteoCards), {
  ssr: false,
  loading: LoadingFallback,
})
const SorteoMatrix = dynamic(() => import("./sorteo-matrix").then((mod) => mod.SorteoMatrix), {
  ssr: false,
  loading: LoadingFallback,
})
const SorteoGrid = dynamic(() => import("./sorteo-grid").then((mod) => mod.SorteoGrid), {
  ssr: false,
  loading: LoadingFallback,
})

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
    case "grid":
      return <SorteoGrid onWinnerSelected={onWinnerSelected} />
    case "slot-machine":
    default:
      return <SlotMachine onWinnerSelected={onWinnerSelected} />
  }
}
