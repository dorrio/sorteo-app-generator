"use client"

import { useTranslations } from "next-intl"
import { useSorteoStore } from "@/lib/sorteo-store"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ShareButton } from "@/components/ui/share-button"
import { Trophy, ShieldCheck, Settings2 } from "lucide-react"

interface HeaderIslandProps {
  initialTitle?: string;
  initialSubtitle?: string;
  seoMode?: string;
  shareTitle?: string;
  shareText?: string;
  customShareTextTemplate?: string;
  shareTranslations: {
    share: string;
    copy: string;
    copied: string;
    shareOn: string;
  };
}

export function HeaderIsland({
  initialTitle,
  initialSubtitle,
  seoMode = 'home',
  shareTitle = "Sorteo Pro",
  shareText = "Sorteo Pro",
  customShareTextTemplate = "🔥 Join my giveaway: *{title}*! Created with Sorteo Pro. Free & Unlimited. 👇",
  shareTranslations
}: HeaderIslandProps) {
  const t = useTranslations("HomePage")
  const tShare = useTranslations("ShareContent")
  // Translations needed for fallback titles
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

  const {
    theme,
    participants,
    setIsVerifyModalOpen,
    setIsEditorOpen,
    hasHydrated
  } = useSorteoStore()

  // Display Title Logic
  let displayTitle = hasHydrated ? theme.customTitle : (initialTitle || theme.customTitle)

  if (!hasHydrated && !initialTitle) {
    if (seoMode === 'wheel') displayTitle = tWheel('h1')
    else if (seoMode === 'instagram') displayTitle = tInsta('h1')
    else if (seoMode === 'rng') displayTitle = tRng('h1')
    else if (seoMode === 'list-randomizer') displayTitle = tList('h1')
    else if (seoMode === 'team') displayTitle = tTeam('h1')
    else if (seoMode === 'secret-santa') displayTitle = tSecret('h1')
    else if (seoMode === 'yes-no') displayTitle = tYesNo('h1')
    else if (seoMode === 'letter') displayTitle = tLetter('h1')
    else if (seoMode === 'dice') displayTitle = tDice('h1')
    else if (seoMode === 'coin') displayTitle = tCoin('h1')
    else if (seoMode === 'rps') displayTitle = tRps('h1')
    else if (seoMode === 'country') displayTitle = tCountry('h1')
    else if (seoMode === 'month') displayTitle = tMonth('h1')
    else if (seoMode === 'card') displayTitle = tCard('h1')
  }

  // Share Content Logic
  const getShareContent = () => {
    let finalShareText = shareText
    let finalShareTitle = shareTitle
    let url = typeof window !== "undefined" ? window.location.href : ""

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

        if (isCustomTitle && theme.customTitle) {
          finalShareText = customShareTextTemplate.replace('{title}', theme.customTitle)
          urlObj.searchParams.set('template_title', theme.customTitle)
          if (theme.primaryColor) {
            urlObj.searchParams.set('template_color', theme.primaryColor)
          }
        }

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
      } catch (e: unknown) {
        console.error("Error constructing share URL in HeaderIsland", e instanceof Error ? e.message : String(e))
      }
    }

    return {
      title: finalShareTitle,
      text: finalShareText,
      url: url
    }
  }

  const shareContent = getShareContent()

  return (
    <header className="border-b border-border/50 backdrop-blur-sm bg-background/50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Sorteo Pro Home"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
              }}
            >
              <Trophy className="w-5 h-5 text-background" />
            </div>
            <div>
              <div className="font-bold text-xl tracking-tight">{displayTitle}</div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <ShareButton
            title={shareContent.title}
            text={shareContent.text}
            url={shareContent.url}
            translations={shareTranslations}
          />

              <Button variant="ghost" size="icon" onClick={() => setIsVerifyModalOpen(true)} title={t("verify_sorteo")} aria-label={t("verify_sorteo")}>
            <ShieldCheck className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsEditorOpen(true)} className="gap-2" aria-label={t("customize")}>
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t("customize")}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
