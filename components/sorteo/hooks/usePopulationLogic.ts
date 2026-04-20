import { useEffect } from "react"
import { useSorteoStore } from "@/lib/sorteo-store"
import { useTranslations, useLocale } from "next-intl"
import { COUNTRIES } from "@/lib/countries"
import { cryptoShuffle } from "@/lib/utils"
import { type SeoMode } from "@/components/sorteo/glossary"

const CARD_SUITS = ['♠', '♥', '♦', '♣']
const CARD_RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
export const CARD_DECK = CARD_SUITS.flatMap(suit => CARD_RANKS.map(rank => `${rank}${suit}`))
export const BINGO_NUMBERS = Array.from({ length: 75 }, (_, i) => (i + 1).toString())

type Translator = (key: string) => string;

interface PopulationContext {
    opt?: Record<string, string>;
    locale: string;
    tYesNo: Translator;
    tCoin: Translator;
    tRps: Translator;
}

const POPULATION_MAPPERS: Partial<Record<SeoMode, (ctx: PopulationContext) => { name: string }[]>> = {
    'yes-no': ({ opt, tYesNo }) => [
        { name: opt?.yes || tYesNo('option_yes') },
        { name: opt?.no || tYesNo('option_no') }
    ],
    'coin': ({ opt, tCoin }) => [
        { name: opt?.heads || tCoin('option_heads') },
        { name: opt?.tails || tCoin('option_tails') }
    ],
    'rps': ({ opt, tRps }) => [
        { name: opt?.rock || tRps('option_rock') },
        { name: opt?.paper || tRps('option_paper') },
        { name: opt?.scissors || tRps('option_scissors') }
    ],
    'letter': () => Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(l => ({ name: l })),
    'dice': () => ["1", "2", "3", "4", "5", "6"].map(n => ({ name: n })),
    'month': ({ locale }) => Array.from({ length: 12 }, (_, i) => {
        return { name: new Date(2024, i, 1).toLocaleString(locale, { month: 'long' }) }
    }),
    'country': () => COUNTRIES.map(c => ({ name: c })),
    'bingo': () => BINGO_NUMBERS.map(n => ({ name: n })),
    'card': () => CARD_DECK.map(c => ({ name: c })),
    'truth-or-dare': ({ opt }) => {
        let items: string[] = []
        try {
            const truths = JSON.parse(opt?.truths || '[]')
            const dares = JSON.parse(opt?.dares || '[]')
            items = [...truths, ...dares]
        } catch {
            // fallback if not provided or parsing fails
            items = ["Truth?", "Dare?"]
        }
        return cryptoShuffle(items).map(n => ({ name: n }))
    },
}

const PRESET_TOOLS: SeoMode[] = Object.keys(POPULATION_MAPPERS) as SeoMode[]

export function usePopulationLogic(
    mounted: boolean,
    seoMode: SeoMode = 'home',
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
        const isPresetTool = PRESET_TOOLS.includes(seoMode)

        // We populate if:
        // 1. The list is empty (standard behavior)
        // 2. OR we are switching to a "Preset Tool" (Generator), forcing a reset to ensure correct dataset.
        const shouldPopulate = isEmpty || (modeChanged && isPresetTool)

        if (shouldPopulate) {
            if (!isEmpty && modeChanged && isPresetTool) {
                clearParticipants()
            }

            const populateFn = POPULATION_MAPPERS[seoMode]
            if (populateFn) {
                addParticipants(populateFn({ opt: initialOptions, locale, tYesNo, tCoin, tRps }))
            } else if (isEmpty && !isPresetTool) {
                const hasListParam = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('list')
                if (!hasListParam) {
                    addParticipants([
                        { name: "Option 1" },
                        { name: "Option 2" },
                        { name: "Option 3" },
                        { name: "Option 4" },
                        { name: "Option 5" }
                    ])
                }
            }
        }

        if (modeChanged) {
            setActiveTool(seoMode)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally ignoring participants.length so population only runs on mode change, not on every participant add/remove
    }, [mounted, hasHydrated, seoMode, initialOptions, activeTool, setActiveTool, locale, addParticipants, clearParticipants, tYesNo, tCoin, tRps])
}
