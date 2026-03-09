import { useMemo } from "react"
import { useSorteoStore } from "@/lib/sorteo-store"
import { useTranslations } from "next-intl"

export function useShareContent(
    seoMode: string = 'home',
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
            if (seoMode === 'wheel') { finalShareTitle = tShare('wheel_title'); finalShareText = tShare('wheel_text'); }
            else if (seoMode === 'instagram') { finalShareTitle = tShare('instagram_title'); finalShareText = tShare('instagram_text'); }
            else if (seoMode === 'rng') { finalShareTitle = tShare('rng_title'); finalShareText = tShare('rng_text'); }
            else if (seoMode === 'list-randomizer') { finalShareTitle = tShare('list_title'); finalShareText = tShare('list_text'); }
            else if (seoMode === 'team') { finalShareTitle = tShare('list_title'); finalShareText = tShare('list_text'); }
            else if (seoMode === 'secret-santa') { finalShareTitle = tShare('secret_santa_title'); finalShareText = tShare('secret_santa_text'); }
            else if (seoMode === 'yes-no') { finalShareTitle = tShare('yes_no_title'); finalShareText = tShare('yes_no_text'); }
            else if (seoMode === 'letter') { finalShareTitle = tShare('letter_title'); finalShareText = tShare('letter_text'); }
            else if (seoMode === 'dice') { finalShareTitle = tShare('dice_title'); finalShareText = tShare('dice_text'); }
            else if (seoMode === 'coin') { finalShareTitle = tShare('coin_title'); finalShareText = tShare('coin_text'); }
            else if (seoMode === 'rps') { finalShareTitle = tShare('rps_title'); finalShareText = tShare('rps_text'); }
            else if (seoMode === 'country') { finalShareTitle = tShare('country_title'); finalShareText = tShare('country_text'); }
            else if (seoMode === 'month') { finalShareTitle = tShare('month_title'); finalShareText = tShare('month_text'); }
            else if (seoMode === 'card') { finalShareTitle = tShare('card_title'); finalShareText = tShare('card_text'); }
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
                // Fallback to current url if parsing fails
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
