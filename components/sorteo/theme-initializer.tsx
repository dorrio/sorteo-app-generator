"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useSorteoStore, type ThemeConfig } from "@/lib/sorteo-store"
import { COUNTRIES } from "@/lib/countries"
import { useLocale, useTranslations } from "next-intl"

const CARD_SUITS = ['♠', '♥', '♦', '♣']
const CARD_RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const CARD_DECK = CARD_SUITS.flatMap(suit => CARD_RANKS.map(rank => `${rank}${suit}`))
const BINGO_NUMBERS = Array.from({ length: 75 }, (_, i) => (i + 1).toString())

interface ThemeInitializerProps {
  initialStyle?: string
  seoMode?: string
  initialTitle?: string
  initialSubtitle?: string
  initialOptions?: {
    yes?: string
    no?: string
    heads?: string
    tails?: string
    rock?: string
    paper?: string
    scissors?: string
  }
}

function ThemeParamsHandler({ updateTheme }: { updateTheme: (config: Partial<ThemeConfig>) => void }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Viralis: Apply template overrides if present (Context Injection)
    const templateTitle = searchParams.get('template_title')
    const templateColor = searchParams.get('template_color')

    const update: Partial<ThemeConfig> = {}
    if (templateTitle) update.customTitle = templateTitle
    if (templateColor) update.primaryColor = templateColor

    if (Object.keys(update).length > 0) {
      updateTheme(update)
    }
  }, [searchParams, updateTheme])

  return null
}

function ListParamsHandler() {
  const searchParams = useSearchParams()
  const { participants, addParticipants, hasHydrated } = useSorteoStore()

  useEffect(() => {
    // Viralis: Check for shared list in URL (Deep Linking)
    // This runs before default population to respect user intent
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

  return null
}

export function ThemeInitializer({
  initialStyle,
  seoMode = 'home',
  initialTitle,
  initialSubtitle,
  initialOptions
}: ThemeInitializerProps) {
  const locale = useLocale()
  const {
    participants,
    addParticipants,
    clearParticipants,
    activeTool,
    setActiveTool,
    theme,
    updateTheme,
    hasHydrated
  } = useSorteoStore()

  // We need translations for defaults if initialOptions are missing
  const tYesNo = useTranslations("YesNoPage")
  const tCoin = useTranslations("CoinPage")
  const tRps = useTranslations("RpsPage")
  const tWheel = useTranslations("WheelGeoPage")
  const tInsta = useTranslations("InstagramPicker")
  const tRng = useTranslations("RngPage")
  const tList = useTranslations("ListRandomizerPage")
  const tSecret = useTranslations("SecretSantaPage")
  const tTeam = useTranslations("TeamGeneratorPage")
  const tLetter = useTranslations("LetterGeneratorPage")
  const tDice = useTranslations("DicePage")
  const tCountry = useTranslations("CountryPage")
  const tMonth = useTranslations("MonthPage")
  const tCard = useTranslations("CardPage")


  useEffect(() => {
    // Theme Update Logic
    const update: Partial<ThemeConfig> = {}

    if (initialStyle) {
      update.sorteoStyle = initialStyle as ThemeConfig["sorteoStyle"]
    }

    // Initialize custom title
    if (initialTitle) {
      update.customTitle = initialTitle
    } else if (seoMode) {
      // Fallback to Head's logic if no initialTitle prop
      if (seoMode === 'yes-no') update.customTitle = tYesNo('h1')
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
        // Fallback to Head's logic
        if (seoMode === 'yes-no') update.customSubtitle = tYesNo('subtitle')
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

  // Population Logic
  useEffect(() => {
    if (!hasHydrated) return

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

  }, [hasHydrated, initialStyle, seoMode, initialOptions, activeTool, setActiveTool, locale, addParticipants, clearParticipants])

  return (
    <Suspense fallback={null}>
      <ThemeParamsHandler updateTheme={updateTheme} />
      <ListParamsHandler />
    </Suspense>
  )
}
