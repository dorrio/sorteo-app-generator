import { useEffect } from "react"
import { useSorteoStore, type ThemeConfig } from "@/lib/sorteo-store"
import { useTranslations } from "next-intl"

export function useThemeInitialization(
    initialStyle?: string,
    initialTitle?: string,
    initialSubtitle?: string,
    seoMode?: string
) {
    const { updateTheme, theme, hasHydrated } = useSorteoStore()

    const tYesNo = useTranslations("YesNoPage")
    const tLetter = useTranslations("LetterGeneratorPage")
    const tDice = useTranslations("DicePage")
    const tCoin = useTranslations("CoinPage")
    const tRps = useTranslations("RpsPage")
    const tCountry = useTranslations("CountryPage")
    const tMonth = useTranslations("MonthPage")
    const tCard = useTranslations("CardPage")
    const tRng = useTranslations("RngPage")
    const tList = useTranslations("ListRandomizerPage")
    const tSecret = useTranslations("SecretSantaPage")
    const tTeam = useTranslations("TeamGeneratorPage")
    const tInsta = useTranslations("InstagramPicker")
    const tWheel = useTranslations("WheelGeoPage")

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

    // Return formatted display title and subtitle for SSR / Hydration Fallbacks
    let displayTitle = hasHydrated ? theme.customTitle : (initialTitle || theme.customTitle)
    let displaySubtitle = hasHydrated ? theme.customSubtitle : (initialSubtitle || theme.customSubtitle)

    if (!hasHydrated && !initialTitle) {
        // Fallback logic for SSR when props are missing (e.g. legacy pages)
        if (seoMode === 'wheel') { displayTitle = tWheel('h1'); displaySubtitle = tWheel('subtitle'); }
        else if (seoMode === 'instagram') { displayTitle = tInsta('h1'); displaySubtitle = tInsta('subtitle'); }
        else if (seoMode === 'rng') { displayTitle = tRng('h1'); displaySubtitle = tRng('subtitle'); }
        else if (seoMode === 'list-randomizer') { displayTitle = tList('h1'); displaySubtitle = tList('subtitle'); }
        else if (seoMode === 'team') { displayTitle = tTeam('h1'); displaySubtitle = tTeam('subtitle'); }
        else if (seoMode === 'secret-santa') { displayTitle = tSecret('h1'); displaySubtitle = tSecret('subtitle'); }
        else if (seoMode === 'yes-no') { displayTitle = tYesNo('h1'); displaySubtitle = tYesNo('subtitle'); }
        else if (seoMode === 'letter') { displayTitle = tLetter('h1'); displaySubtitle = tLetter('subtitle'); }
        else if (seoMode === 'dice') { displayTitle = tDice('h1'); displaySubtitle = tDice('subtitle'); }
        else if (seoMode === 'coin') { displayTitle = tCoin('h1'); displaySubtitle = tCoin('subtitle'); }
        else if (seoMode === 'rps') { displayTitle = tRps('h1'); displaySubtitle = tRps('subtitle'); }
        else if (seoMode === 'country') { displayTitle = tCountry('h1'); displaySubtitle = tCountry('subtitle'); }
        else if (seoMode === 'month') { displayTitle = tMonth('h1'); displaySubtitle = tMonth('subtitle'); }
        else if (seoMode === 'card') { displayTitle = tCard('h1'); displaySubtitle = tCard('subtitle'); }
    }

    return { displayTitle, displaySubtitle }
}
