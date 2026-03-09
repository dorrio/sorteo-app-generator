import { useEffect } from "react"
import { useSorteoStore } from "@/lib/sorteo-store"
import { useTranslations, useLocale } from "next-intl"
import { COUNTRIES } from "@/lib/countries"

const CARD_SUITS = ['♠', '♥', '♦', '♣']
const CARD_RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
export const CARD_DECK = CARD_SUITS.flatMap(suit => CARD_RANKS.map(rank => `${rank}${suit}`))
export const BINGO_NUMBERS = Array.from({ length: 75 }, (_, i) => (i + 1).toString())

export function usePopulationLogic(
    mounted: boolean,
    seoMode: string = 'home',
    initialOptions?: Record<string, string>
) {
    const {
        participants,
        addParticipants,
        clearParticipants,
        activeTool,
        setActiveTool,
        hasHydrated
    } = useSorteoStore()

    const locale = useLocale()

    const tYesNo = useTranslations("YesNoPage")
    const tCoin = useTranslations("CoinPage")
    const tRps = useTranslations("RpsPage")

    // Population Logic
    useEffect(() => {
        if (!mounted || !hasHydrated) return

        // Detect if we just navigated to a new mode
        const modeChanged = activeTool !== seoMode
        const isEmpty = participants.length === 0
        const isPresetTool = ['card', 'bingo', 'month', 'country', 'rps', 'coin', 'dice', 'letter', 'yes-no'].includes(seoMode)

        // We populate if:
        // 1. The list is empty (standard behavior)
        // 2. OR we are switching to a "Preset Tool" (Generator), forcing a reset to ensure correct dataset.
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

    }, [mounted, hasHydrated, seoMode, initialOptions, activeTool, setActiveTool, locale, addParticipants, clearParticipants, tYesNo, tCoin, tRps])
}
