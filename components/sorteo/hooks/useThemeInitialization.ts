import { useEffect } from "react"
import { useSorteoStore, type ThemeConfig } from "@/lib/sorteo-store"
import { useTranslations } from "next-intl"
import { type SeoMode } from "@/components/sorteo/glossary"

export function useThemeInitialization(
    initialStyle?: ThemeConfig["sorteoStyle"],
    initialTitle?: string,
    initialSubtitle?: string,
    seoMode?: SeoMode
) {
    const { updateTheme, theme, hasHydrated } = useSorteoStore()

    const tMap: Partial<Record<SeoMode, any>> = {
        'yes-no': useTranslations("YesNoPage"),
        'letter': useTranslations("LetterGeneratorPage"),
        'rng': useTranslations("RngPage"),
        'list-randomizer': useTranslations("ListRandomizerPage"),
        'secret-santa': useTranslations("SecretSantaPage"),
        'team': useTranslations("TeamGeneratorPage"),
        'dice': useTranslations("DicePage"),
        'coin': useTranslations("CoinPage"),
        'rps': useTranslations("RpsPage"),
        'country': useTranslations("CountryPage"),
        'month': useTranslations("MonthPage"),
        'card': useTranslations("CardPage"),
        'instagram': useTranslations("InstagramPicker"),
        'wheel': useTranslations("WheelGeoPage"),
        'bingo': useTranslations("BingoPage"),
    }

    useEffect(() => {
        if (!hasHydrated) return

        // Theme Update Logic
        const update: Partial<ThemeConfig> = {}

        if (initialStyle) {
            update.sorteoStyle = initialStyle
        }

        const t = seoMode ? tMap[seoMode] : null

        // Initialize custom title
        if (initialTitle) {
            update.customTitle = initialTitle
        } else if (t) {
            update.customTitle = t('h1')
        }

        if (initialSubtitle) {
            update.customSubtitle = initialSubtitle
        } else if (t) {
            update.customSubtitle = t('subtitle')
        }

        if (Object.keys(update).length > 0) {
            updateTheme(update)
        }
    }, [initialStyle, updateTheme, initialTitle, initialSubtitle, seoMode, hasHydrated])

    // Return formatted display title and subtitle for SSR / Hydration Fallbacks
    let displayTitle = hasHydrated ? theme.customTitle : (initialTitle || theme.customTitle)
    let displaySubtitle = hasHydrated ? theme.customSubtitle : (initialSubtitle || theme.customSubtitle)

    if (!hasHydrated && !initialTitle && seoMode) {
        const t = tMap[seoMode]
        if (t) {
            displayTitle = t('h1')
            displaySubtitle = t('subtitle')
        }
    }

    return { displayTitle, displaySubtitle }
}
