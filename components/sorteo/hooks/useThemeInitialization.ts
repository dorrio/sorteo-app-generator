import { useEffect } from "react"
import { useSorteoStore, type ThemeConfig } from "@/lib/sorteo-store"
import { useTranslations } from "next-intl"
import { type SeoMode } from "@/components/sorteo/glossary"

const MODE_NAMESPACES: Record<string, string> = {
    'yes-no': 'YesNoPage',
    'letter': 'LetterGeneratorPage',
    'rng': 'RngPage',
    'list-randomizer': 'ListRandomizerPage',
    'secret-santa': 'SecretSantaPage',
    'team': 'TeamGeneratorPage',
    'dice': 'DicePage',
    'coin': 'CoinPage',
    'rps': 'RpsPage',
    'country': 'CountryPage',
    'month': 'MonthPage',
    'card': 'CardPage',
    'instagram': 'InstagramPicker',
    'wheel': 'WheelGeoPage',
    'bingo': 'BingoPage',
}

export function useThemeInitialization(
    initialStyle?: ThemeConfig["sorteoStyle"],
    initialTitle?: string,
    initialSubtitle?: string,
    seoMode?: SeoMode
) {
    const { updateTheme, theme, hasHydrated } = useSorteoStore()
    const tRoot = useTranslations()

    useEffect(() => {
        if (!hasHydrated) return

        const update: Partial<ThemeConfig> = {}

        if (initialStyle) {
            update.sorteoStyle = initialStyle
        }

        // Initialize custom title from SEO mode if not provided and not yet customized
        if (initialTitle) {
            update.customTitle = initialTitle
        } else if (seoMode && seoMode !== 'home') {
            const ns = MODE_NAMESPACES[seoMode]
            if (ns) {
                try {
                    update.customTitle = tRoot(`${ns}.h1`)
                } catch {
                    // Fallback to existing or SORTEO
                }
            }
        }

        if (initialSubtitle) {
            update.customSubtitle = initialSubtitle
        } else if (seoMode && seoMode !== 'home') {
            const ns = MODE_NAMESPACES[seoMode]
            if (ns) {
                try {
                    update.customSubtitle = tRoot(`${ns}.subtitle`)
                } catch {
                    // Fallback
                }
            }
        }

        if (Object.keys(update).length > 0) {
            updateTheme(update)
        }
    }, [initialStyle, updateTheme, initialTitle, initialSubtitle, seoMode, hasHydrated, tRoot])

    // Return current theme values, or fallback to SSR/initial values
    let displayTitle = hasHydrated ? theme.customTitle : (initialTitle || theme.customTitle || "SORTEO")
    let displaySubtitle = hasHydrated ? theme.customSubtitle : (initialSubtitle || theme.customSubtitle || "El momento ha llegado")

    // SSR / Hydration Fallback: If we have an SEO mode but no initial title/subtitle, use the translated ones
    if (!hasHydrated && !initialTitle && seoMode && seoMode !== 'home') {
        const ns = MODE_NAMESPACES[seoMode]
        if (ns) {
            try {
                displayTitle = tRoot(`${ns}.h1`)
                displaySubtitle = tRoot(`${ns}.subtitle`)
            } catch {
                // Stick to current displayTitle/Subtitle
            }
        }
    }

    return { displayTitle, displaySubtitle }
}
