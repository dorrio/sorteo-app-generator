import { useMemo } from "react"
import { useSorteoStore } from "@/lib/sorteo-store"
import { useTranslations } from "next-intl"
import { type SeoMode } from "@/components/sorteo/glossary"

export function useShareContent(
    seoMode: SeoMode = 'home',
    shareTitle: string = "Sorteo Pro",
    shareText: string = "Sorteo Pro",
    initialTitle?: string,
    customShareTextTemplate: string = "🔥 Join my giveaway: *{title}*! Created with Sorteo Pro. Free & Unlimited. 👇"
) {
    const { theme, participants } = useSorteoStore()
    const tShare = useTranslations("ShareContent")

    const shareContent = useMemo(() => {
        let finalShareText = shareText
        let finalShareTitle = shareTitle
        let url = typeof window !== "undefined" ? window.location.href : ""

        // Fallback logic if shareTitle/Text are defaults and we're in a specific mode without props passed
        if (shareTitle === "Sorteo Pro" && seoMode) {
            const MODE_SHARE_KEYS: Record<string, { title: string; text: string }> = {
                wheel: { title: 'wheel_title', text: 'wheel_text' },
                instagram: { title: 'instagram_title', text: 'instagram_text' },
                rng: { title: 'rng_title', text: 'rng_text' },
                'list-randomizer': { title: 'list_title', text: 'list_text' },
                team: { title: 'list_title', text: 'list_text' },
                'secret-santa': { title: 'secret_santa_title', text: 'secret_santa_text' },
                'yes-no': { title: 'yes_no_title', text: 'yes_no_text' },
                letter: { title: 'letter_title', text: 'letter_text' },
                dice: { title: 'dice_title', text: 'dice_text' },
                coin: { title: 'coin_title', text: 'coin_text' },
                rps: { title: 'rps_title', text: 'rps_text' },
                country: { title: 'country_title', text: 'country_text' },
                month: { title: 'month_title', text: 'month_text' },
                card: { title: 'card_title', text: 'card_text' },
            }

            const keys = MODE_SHARE_KEYS[seoMode]
            if (keys) {
                finalShareTitle = tShare(keys.title)
                finalShareText = tShare(keys.text)
            }
        }

        const defaultTitle = initialTitle || "Sorteo Pro"
        const isCustomTitle = theme.customTitle && theme.customTitle !== defaultTitle

        if (typeof window !== "undefined") {
            try {
                const urlObj = new URL(window.location.href)

                // 1. Branding: Custom Title & Color
                if (isCustomTitle && theme.customTitle) {
                    finalShareText = customShareTextTemplate.replace('{title}', theme.customTitle)

                    urlObj.searchParams.set('template_title', theme.customTitle)
                    if (theme.primaryColor) {
                        urlObj.searchParams.set('template_color', theme.primaryColor)
                    }
                }

                // 2. Content: Shareable Participant List (Deep Linking)
                if (participants.length > 0 && participants.length <= 100) {
                    const names = participants.map(p => p.name)
                    const encoded = encodeURIComponent(JSON.stringify(names))
                    if (encoded.length < 1500) {
                        urlObj.searchParams.set('list', encoded)
                    }
                }

                return {
                    title: finalShareTitle,
                    text: finalShareText,
                    url: urlObj.toString()
                }
            } catch (e) {
                if (process.env.NODE_ENV !== 'production') {
                    console.warn("Failed to parse URL in useShareContent", e)
                }
            }
        }

        return {
            title: finalShareTitle,
            text: finalShareText,
            url: url
        }
    }, [shareTitle, shareText, seoMode, tShare, initialTitle, theme.customTitle, theme.primaryColor, customShareTextTemplate, participants])

    return shareContent
}
