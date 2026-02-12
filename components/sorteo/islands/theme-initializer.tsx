"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSorteoStore, ThemeConfig } from "@/lib/sorteo-store"
import { useLocale } from "next-intl"
import { COUNTRIES } from "@/lib/countries"

const CARD_SUITS = ['♠', '♥', '♦', '♣']
const CARD_RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const CARD_DECK = CARD_SUITS.flatMap(suit => CARD_RANKS.map(rank => `${rank}${suit}`))
const BINGO_NUMBERS = Array.from({ length: 75 }, (_, i) => (i + 1).toString())

interface ThemeInitializerProps {
  initialStyle?: string
  initialTitle?: string
  initialSubtitle?: string
  seoMode: string
  initialOptions?: {
    yes: string
    no: string
    heads: string
    tails: string
    rock: string
    paper: string
    scissors: string
  }
}

export function ThemeInitializer({
  initialStyle,
  initialTitle,
  initialSubtitle,
  seoMode,
  initialOptions
}: ThemeInitializerProps) {
  const searchParams = useSearchParams()
  const locale = useLocale()
  const [mounted, setMounted] = useState(false)

  const {
    participants,
    addParticipants,
    clearParticipants,
    activeTool,
    setActiveTool,
    hasHydrated,
    updateTheme
  } = useSorteoStore()

  // 1. Theme Params (Template & Color)
  useEffect(() => {
    const templateTitle = searchParams.get('template_title')
    const templateColor = searchParams.get('template_color')

    const update: Partial<ThemeConfig> = {}
    if (templateTitle) update.customTitle = templateTitle
    if (templateColor) update.primaryColor = templateColor

    // Also apply initial props if provided and not overridden by URL
    if (initialStyle) update.sorteoStyle = initialStyle as any
    if (initialTitle && !update.customTitle) update.customTitle = initialTitle
    if (initialSubtitle) update.customSubtitle = initialSubtitle

    if (Object.keys(update).length > 0) {
      updateTheme(update)
    }
  }, [searchParams, updateTheme, initialStyle, initialTitle, initialSubtitle])

  // 2. List Params (Shared List)
  useEffect(() => {
    if (hasHydrated && participants.length === 0) {
      const listParam = searchParams.get('list')
      if (listParam) {
        try {
          const names = JSON.parse(decodeURIComponent(listParam))
          if (Array.isArray(names) && names.length > 0) {
            addParticipants(names.map((n: string) => ({ name: n })))
          }
        } catch (e) {
          // Silent fail or fallback to simple parse
          try {
             const names = JSON.parse(listParam)
             if (Array.isArray(names) && names.length > 0) {
                addParticipants(names.map((n: string) => ({ name: n })))
             }
          } catch (e2) {
             console.error("Failed to parse shared list", e)
          }
        }
      }
    }
  }, [hasHydrated, searchParams, participants.length, addParticipants])

  // 3. Initial Population Logic
  useEffect(() => {
    setMounted(true)
    if (!mounted || !hasHydrated) return

    const modeChanged = activeTool !== seoMode
    const isEmpty = participants.length === 0
    const isPresetTool = ['card', 'bingo', 'month', 'country', 'rps', 'coin', 'dice', 'letter', 'yes-no'].includes(seoMode)
    const shouldPopulate = isEmpty || (modeChanged && isPresetTool)

    if (shouldPopulate) {
      if (!isEmpty && modeChanged && isPresetTool) {
        clearParticipants()
      }

      if (seoMode === 'yes-no' && initialOptions) {
        addParticipants([{ name: initialOptions.yes }, { name: initialOptions.no }])
      } else if (seoMode === 'coin' && initialOptions) {
        addParticipants([{ name: initialOptions.heads }, { name: initialOptions.tails }])
      } else if (seoMode === 'rps' && initialOptions) {
        addParticipants([{ name: initialOptions.rock }, { name: initialOptions.paper }, { name: initialOptions.scissors }])
      } else if (seoMode === 'letter') {
        const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
        addParticipants(alphabet.map(l => ({ name: l })))
      } else if (seoMode === 'dice') {
        addParticipants(["1", "2", "3", "4", "5", "6"].map(n => ({ name: n })))
      } else if (seoMode === 'month') {
        const months = Array.from({ length: 12 }, (_, i) => {
          return new Date(2024, i, 1).toLocaleString(locale, { month: 'long' })
        })
        const capitalizedMonths = months.map(m => m.charAt(0).toUpperCase() + m.slice(1))
        addParticipants(capitalizedMonths.map(m => ({ name: m })))
      } else if (seoMode === 'country') {
        addParticipants(COUNTRIES.map(c => ({ name: c })))
      } else if (seoMode === 'bingo') {
        addParticipants(BINGO_NUMBERS.map(n => ({ name: n })))
      } else if (seoMode === 'card') {
        addParticipants(CARD_DECK.map(c => ({ name: c })))
      } else if (isEmpty && !isPresetTool) {
        addParticipants([
          { name: "Option 1" }, { name: "Option 2" }, { name: "Option 3" },
          { name: "Option 4" }, { name: "Option 5" }
        ])
      }
    }

    if (modeChanged) {
      setActiveTool(seoMode)
    }
  }, [mounted, hasHydrated, seoMode, initialOptions, activeTool, setActiveTool, locale, addParticipants, clearParticipants, participants.length])

  return null
}
