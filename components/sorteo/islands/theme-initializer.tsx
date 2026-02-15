"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { useSorteoStore, type ThemeConfig } from "@/lib/sorteo-store"
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
    yes: string;
    no: string;
    heads: string;
    tails: string;
    rock: string;
    paper: string;
    scissors: string;
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

  // Hooks for translations needed for default population
  const tYesNo = useTranslations("YesNoPage")
  const tCoin = useTranslations("CoinPage")
  const tRps = useTranslations("RpsPage")
  const tYesNoTitle = useTranslations("YesNoPage")
  const tLetter = useTranslations("LetterGeneratorPage")
  const tRng = useTranslations("RngPage")
  const tList = useTranslations("ListRandomizerPage")
  const tSecret = useTranslations("SecretSantaPage")
  const tTeam = useTranslations("TeamGeneratorPage")
  const tDice = useTranslations("DicePage")
  const tCountry = useTranslations("CountryPage")
  const tMonth = useTranslations("MonthPage")
  const tCard = useTranslations("CardPage")
  const tInsta = useTranslations("InstagramPicker")
  const tWheel = useTranslations("WheelGeoPage")

  const {
    updateTheme,
    participants,
    addParticipants,
    clearParticipants,
    hasHydrated,
    activeTool,
    setActiveTool
  } = useSorteoStore()

  const [mounted, setMounted] = useState(false)

  // 1. Theme Params Handler
  useEffect(() => {
    const templateTitle = searchParams.get('template_title')
    const templateColor = searchParams.get('template_color')

    const update: Partial<ThemeConfig> = {}
    if (templateTitle) update.customTitle = templateTitle
    if (templateColor) update.primaryColor = templateColor

    if (Object.keys(update).length > 0) {
      updateTheme(update)
    }
  }, [searchParams, updateTheme])

  // 2. List Params Handler
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
          console.error("Failed to parse shared list", e)
        }
      }
    }
  }, [hasHydrated, searchParams, participants.length, addParticipants])

  // 3. Main Initialization Logic
  useEffect(() => {
    setMounted(true)

    // Theme Update Logic
    const update: Partial<ThemeConfig> = {}

    if (initialStyle) {
      update.sorteoStyle = initialStyle as ThemeConfig["sorteoStyle"]
    }

    // Initialize custom title
    if (initialTitle) {
      update.customTitle = initialTitle
    } else if (seoMode) {
      if (seoMode === 'yes-no') update.customTitle = tYesNoTitle('h1')
      else if (seoMode === 'letter') update.customTitle = tLetter('h1')
      else if (seoMode === 'rng') update.customTitle = tRng('h1')
      else if (seoMode === 'list-randomizer') update.customTitle = tList('h1')
      else if (seoMode === 'secret-santa') update.customTitle = tSecret('h1')
      else if (seoMode === 'team') update.customTitle = tTeam('h1')
      else if (seoMode === 'dice') update.customTitle = tDice('h1')
      else if (seoMode === 'coin') update.customTitle = tCoin('h1')
      else if (seoMode === 'rps') update.customTitle = tRps('h1')
      else if (seoMode === 'country') update.customTitle = tCountry('h1')
      else if (seoMode === 'month') update.customTitle = tMonth('h1')
      else if (seoMode === 'card') update.customTitle = tCard('h1')
      else if (seoMode === 'instagram') update.customTitle = tInsta('h1')
      else if (seoMode === 'wheel') update.customTitle = tWheel('h1')
    }

    if (initialSubtitle) {
      update.customSubtitle = initialSubtitle
    } else if (seoMode) {
      if (seoMode === 'yes-no') update.customSubtitle = tYesNoTitle('subtitle')
      else if (seoMode === 'letter') update.customSubtitle = tLetter('subtitle')
      else if (seoMode === 'rng') update.customSubtitle = tRng('subtitle')
      else if (seoMode === 'list-randomizer') update.customSubtitle = tList('subtitle')
      else if (seoMode === 'secret-santa') update.customSubtitle = tSecret('subtitle')
      else if (seoMode === 'team') update.customSubtitle = tTeam('subtitle')
      else if (seoMode === 'dice') update.customSubtitle = tDice('subtitle')
      else if (seoMode === 'coin') update.customSubtitle = tCoin('subtitle')
      else if (seoMode === 'rps') update.customSubtitle = tRps('subtitle')
      else if (seoMode === 'country') update.customSubtitle = tCountry('subtitle')
      else if (seoMode === 'month') update.customSubtitle = tMonth('subtitle')
      else if (seoMode === 'card') update.customSubtitle = tCard('subtitle')
      else if (seoMode === 'instagram') update.customSubtitle = tInsta('subtitle')
      else if (seoMode === 'wheel') update.customSubtitle = tWheel('subtitle')
    }

    if (Object.keys(update).length > 0) {
      updateTheme(update)
    }
  }, [initialStyle, updateTheme, initialTitle, initialSubtitle, seoMode])

  // 4. Population Logic
  useEffect(() => {
    if (!mounted || !hasHydrated) return

    const modeChanged = activeTool !== seoMode
    const isEmpty = participants.length === 0
    const isPresetTool = ['card', 'bingo', 'month', 'country', 'rps', 'coin', 'dice', 'letter', 'yes-no'].includes(seoMode)

    const shouldPopulate = isEmpty || (modeChanged && isPresetTool)

    if (shouldPopulate) {
      if (!isEmpty && modeChanged && isPresetTool) {
        clearParticipants()
      }

      if (seoMode === 'yes-no') {
        addParticipants([
          { name: initialOptions?.yes || tYesNo('option_yes') },
          { name: initialOptions?.no || tYesNo('option_no') }
        ])
      } else if (seoMode === 'coin') {
        addParticipants([
          { name: initialOptions?.heads || tCoin('option_heads') },
          { name: initialOptions?.tails || tCoin('option_tails') }
        ])
      } else if (seoMode === 'rps') {
        addParticipants([
          { name: initialOptions?.rock || tRps('option_rock') },
          { name: initialOptions?.paper || tRps('option_paper') },
          { name: initialOptions?.scissors || tRps('option_scissors') }
        ])
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
          { name: "Option 1" },
          { name: "Option 2" },
          { name: "Option 3" },
          { name: "Option 4" },
          { name: "Option 5" }
        ])
      }
    }

    if (modeChanged) {
      setActiveTool(seoMode)
    }

  }, [mounted, hasHydrated, initialStyle, seoMode, initialOptions, activeTool, setActiveTool, locale, addParticipants, clearParticipants])

  return null
}
