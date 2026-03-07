"use client"

import { useCallback, useEffect, useState, Suspense, useRef } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { motion } from "framer-motion"
import { useSorteoStore } from "@/lib/sorteo-store"
import { SorteoSelector } from "@/components/sorteo/sorteo-selector"
import { ParticipantManager } from "@/components/sorteo/participant-manager"
import { HistoryPanel } from "@/components/sorteo/history-panel"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ShareButton } from "@/components/ui/share-button"
import { StickyShareFooter } from "@/components/sorteo/sticky-share-footer"
import { COUNTRIES } from "@/lib/countries"
import { Sparkles, Settings2, Play, Trophy, ShieldCheck } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"

const CARD_SUITS = ['♠', '♥', '♦', '♣']
const CARD_RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const CARD_DECK = CARD_SUITS.flatMap(suit => CARD_RANKS.map(rank => `${rank}${suit}`))
const BINGO_NUMBERS = Array.from({ length: 75 }, (_, i) => (i + 1).toString())

const ParticleBackground = dynamic(
  () => import("@/components/sorteo/particle-background").then((mod) => mod.ParticleBackground),
  { ssr: false }
)

const VisualEditor = dynamic(
  () => import("@/components/sorteo/visual-editor").then((mod) => mod.VisualEditor),
  { ssr: false }
)
const VerificationModal = dynamic(
  () => import("@/components/sorteo/verification-modal").then((mod) => mod.VerificationModal),
  { ssr: false }
)
const WinnerCeremony = dynamic(
  () => import("@/components/sorteo/winner-ceremony").then((mod) => mod.WinnerCeremony),
  { ssr: false }
)
const CountdownAnimation = dynamic(
  () => import("@/components/sorteo/countdown-animation").then((mod) => mod.CountdownAnimation),
  { ssr: false }
)
const FloatingBubbles = dynamic(
  () => import("@/components/sorteo/floating-bubbles").then((mod) => mod.FloatingBubbles),
  { ssr: false }
)

import { ThemeConfig } from "@/lib/sorteo-store"

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

interface MainAppProps {
  initialStyle?: string;
  seoMode?: 'home' | 'wheel' | 'instagram' | 'rng' | 'list-randomizer' | 'yes-no' | 'letter' | 'secret-santa' | 'team' | 'dice' | 'coin' | 'rps' | 'country' | 'month' | 'card' | 'bingo';
  children: React.ReactNode;
  initialTitle?: string;
  initialSubtitle?: string;
  shareTitle?: string;
  shareText?: string;
  customShareTextTemplate?: string;
  footer?: React.ReactNode;
  shareTranslations?: {
    share: string;
    copy: string;
    copied: string;
    shareOn: string;
  };
  stickyTranslations?: {
    share_cta: string;
    start_cta: string;
  };
  // Translations for initial population (options)
  initialOptions?: {
    yes: string;
    no: string;
    heads: string;
    tails: string;
    rock: string;
    paper: string;
    scissors: string;
    // Generators that might simply get passed translated strings or just use defaults
  };
}

export function MainApp({
  initialStyle,
  seoMode = 'home',
  children,
  initialTitle,
  initialSubtitle,
  shareTitle = "Sorteo Pro",
  shareText = "Sorteo Pro",
  customShareTextTemplate = "🔥 Join my giveaway: *{title}*! Created with Sorteo Pro. Free & Unlimited. 👇",
  footer,
  shareTranslations = {
    share: "Share...",
    copy: "Copy Link",
    copied: "Copied!",
    shareOn: "Share on"
  },
  stickyTranslations = {
    share_cta: "Share Tool",
    start_cta: "Start Giveaway"
  },
  initialOptions
}: MainAppProps) {
  const locale = useLocale()
  const t = useTranslations("HomePage")
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
  const tShare = useTranslations("ShareContent")


  const [mounted, setMounted] = useState(false)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)

  const {
    participants,
    addParticipants,
    clearParticipants,
    activeTool,
    setActiveTool,
    theme,
    isSpinning,
    setIsSpinning,
    showCountdown,
    setShowCountdown,
    showWinnerCeremony,
    setShowWinnerCeremony,
    setWinner,
    isEditorOpen,
    setIsEditorOpen,
    hasHydrated,
    updateTheme
  } = useSorteoStore()

  const contentRef = useRef<HTMLDivElement>(null)

  // Calculated state for inert
  const isOverlayOpen = isVerifyModalOpen || showWinnerCeremony || isEditorOpen || showCountdown

  useEffect(() => {
    if (contentRef.current) {
      if (isOverlayOpen) {
        contentRef.current.setAttribute('inert', '')

        contentRef.current.inert = true
      } else {
        contentRef.current.removeAttribute('inert')

        contentRef.current.inert = false
      }
    }
  }, [isOverlayOpen])

  useEffect(() => {
    setMounted(true)

    const update: Partial<ThemeConfig> = {}

    if (initialStyle) {
      update.sorteoStyle = initialStyle as any
    }

    // Initialize custom title from props if available
    if (initialTitle) {
      update.customTitle = initialTitle
    }
    if (initialSubtitle) {
      update.customSubtitle = initialSubtitle
    }

    if (Object.keys(update).length > 0) {
      updateTheme(update)
    }
  }, [initialStyle, updateTheme, initialTitle, initialSubtitle, seoMode, tYesNo, tLetter, tRng, tList, tSecret, tTeam, tDice, tCoin, tRps, tCountry, tMonth, tCard, tInsta, tWheel])

  // Separate effect for populating dummy data if empty on a specific landing page
  // This ensures the Wheel is visible immediately (UX Best Practice)
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

      if (seoMode === 'yes-no' && initialOptions) {
        addParticipants([
          { name: initialOptions.yes },
          { name: initialOptions.no }
        ])
      } else if (seoMode === 'coin' && initialOptions) {
        addParticipants([
          { name: initialOptions.heads },
          { name: initialOptions.tails }
        ])
      } else if (seoMode === 'rps' && initialOptions) {
        addParticipants([
          { name: initialOptions.rock },
          { name: initialOptions.paper },
          { name: initialOptions.scissors }
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
        // Capitalize first letter as Intl returns lowercase in some locales
        const capitalizedMonths = months.map(m => m.charAt(0).toUpperCase() + m.slice(1))
        addParticipants(capitalizedMonths.map(m => ({ name: m })))
      } else if (seoMode === 'country') {
        addParticipants(COUNTRIES.map(c => ({ name: c })))
      } else if (seoMode === 'bingo') {
        addParticipants(BINGO_NUMBERS.map(n => ({ name: n })))
      } else if (seoMode === 'card') {
        addParticipants(CARD_DECK.map(c => ({ name: c })))
      } else if (isEmpty && !isPresetTool) {
        // Ensure we don't double populate if it WAS a preset tool
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
  }, [mounted, hasHydrated, initialStyle, seoMode, initialOptions, activeTool, setActiveTool, locale, addParticipants, clearParticipants, participants.length, tYesNo, tCoin, tRps])

  const startSorteo = () => {
    if (participants.length < 2) return
    setShowCountdown(true)
  }

  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false)
    setIsSpinning(true)
  }, [setShowCountdown, setIsSpinning])

  const handleWinnerSelected = useCallback(() => {
    setShowWinnerCeremony(true)
  }, [setShowWinnerCeremony])

  const handleCloseCeremony = () => {
    setShowWinnerCeremony(false)
  }

  const handleNewSorteo = () => {
    setShowWinnerCeremony(false)
    setWinner(null)
  }

  // Determine share content based on seoMode
  const getShareContent = () => {
    let finalShareText = shareText
    let finalShareTitle = shareTitle
    const url = typeof window !== "undefined" ? window.location.href : ""

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
          // We only share the list if it fits within URL limits
          const names = participants.map(p => p.name)
          const encoded = encodeURIComponent(JSON.stringify(names))
          // Safety limit for URL length (browser limits usually ~2000)
          if (encoded.length < 1500) {
            urlObj.searchParams.set('list', encoded)
          }
        }

        return {
          title: shareTitle,
          text: finalShareText,
          url: urlObj.toString()
        }
      } catch {
        // Fallback to current url if parsing fails
      }
    }

    return {
      title: shareTitle,
      text: shareText,
      url: url
    }
  }

  const shareContent = getShareContent()

  // Full Sticky Translations Object
  const fullStickyTranslations = {
    ...stickyTranslations,
    share_button: shareTranslations
  }

  // Server-Side Rendering (SSR) & Initial Client Render
  // If not hydrated, we use the initialTitle prop for SSR (SEO friendly)
  // Once hydrated, we use the store state (User preference)
  let displayTitle = hasHydrated ? theme.customTitle : (initialTitle || theme.customTitle)
  let displaySubtitle = hasHydrated ? theme.customSubtitle : (initialSubtitle || theme.customSubtitle)

  const bgOpacity = theme.backgroundOpacity ?? 30
  const bgBlur = theme.backgroundBlur ?? 0
  const participantDisplay = theme.participantDisplay ?? "list"

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Suspense fallback={null}>
        <ThemeParamsHandler updateTheme={updateTheme} />
        <ListParamsHandler />
      </Suspense>

      {/* Background image */}
      {theme.backgroundImage && (
        <div className="fixed inset-0 z-0">
          <Image
            src={theme.backgroundImage}
            alt="Custom Background"
            fill
            priority
            className="object-cover"
            unoptimized
            style={{
              opacity: bgOpacity / 100,
              filter: `blur(${bgBlur}px)`,
            }}
          />
        </div>
      )}

      {/* Particle background */}
      <ParticleBackground />

      {/* Main content */}
      <div
        ref={contentRef}
        className="relative z-10"
        style={{
          fontFamily:
            theme.fontFamily === "Inter" ? "var(--font-inter)" :
              theme.fontFamily === "Space Grotesk" ? "var(--font-display)" :
                theme.fontFamily === "Roboto" ? "system-ui, sans-serif" :
                  theme.fontFamily === "Montserrat" ? "system-ui, sans-serif" :
                    theme.fontFamily === "Open Sans" ? "system-ui, sans-serif" :
                      theme.fontFamily === "Lato" ? "system-ui, sans-serif" :
                        theme.fontFamily === "Poppins" ? "system-ui, sans-serif" :
                          theme.fontFamily === "system-ui" ? "system-ui, sans-serif" :
                            "var(--font-display)"
        }}
      >
        {/* Header */}
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

              {/* Viralis: Added Share Button in Header */}
              <ShareButton
                title={shareContent.title}
                text={shareContent.text}
                url={shareContent.url}
                translations={shareTranslations}
              />

              <Button variant="ghost" size="icon" onClick={() => setIsVerifyModalOpen(true)} title="Verificar Sorteo" aria-label={t("verify_sorteo")}>
                <ShieldCheck className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsEditorOpen(true)} className="gap-2" aria-label={t("customize")}>
                <Settings2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t("customize")}</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main grid */}
        <main id="sorteo-section" className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Sorteo area */}
            <section
              className="space-y-8"
              aria-label="Main Tool Area"
            >
              {/* Title */}
              <div className="text-center space-y-2">
                <h1
                  className="text-4xl md:text-6xl font-bold tracking-tight"
                  style={{ color: theme.primaryColor }}
                >
                  {displayTitle}
                </h1>
                <p className="text-muted-foreground text-lg">{displaySubtitle}</p>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{
                    backgroundColor: `${theme.primaryColor}20`,
                    color: theme.primaryColor,
                    border: `1px solid ${theme.primaryColor}40`
                  }}
                  onClick={() => setIsEditorOpen(true)}
                >
                  <Settings2 className="w-4 h-4" />
                  {t("customize")}
                </button>
              </div>

              {/* Slot machine */}
              <SorteoSelector onWinnerSelected={handleWinnerSelected} forcedStyle={initialStyle} />

              {/* Start button */}
              <div className="flex justify-center">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    onClick={startSorteo}
                    disabled={participants.length < 2 || isSpinning}
                    className="h-16 px-12 text-xl font-bold gap-3 rounded-2xl transition-all"
                    style={{
                      backgroundColor: theme.primaryColor,
                      color: theme.backgroundColor,
                      boxShadow: `0 0 40px ${theme.primaryColor}40`,
                    }}
                  >
                    {isSpinning ? (
                      <>
                        <Sparkles className="w-6 h-6 animate-spin" />
                        {t("spinning")}
                      </>
                    ) : (
                      <>
                        <Play className="w-6 h-6" />
                        {t("start_button")}
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>

              {participants.length < 2 && participants.length > 0 && (
                <p className="text-center text-sm text-muted-foreground">{t("min_participants_warning")}</p>
              )}
            </section>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Participants card */}
              <section
                className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6"
                aria-labelledby="participants-title"
              >
                <h2
                  id="participants-title"
                  className="font-bold text-lg mb-4 flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" style={{ color: theme.primaryColor }} />
                  {t("participants_title")}
                </h2>

                {participantDisplay === "bubbles" ? <FloatingBubbles /> : <ParticipantManager />}

                {participantDisplay === "bubbles" && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <ParticipantManager showOnlyInput />
                  </div>
                )}
              </section>

              {/* History card */}
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6">
                <HistoryPanel />
              </div>
            </motion.aside>
          </div>
        </main>

        {/* SEO Content / Footer Children */}
        {children}

        {/* Footer */}
        {footer}
        <StickyShareFooter shareContent={shareContent} translations={fullStickyTranslations} />
      </div >

      {/* Overlays */}
      <CountdownAnimation onComplete={handleCountdownComplete} />
      <WinnerCeremony onClose={handleCloseCeremony} onNewSorteo={handleNewSorteo} seoMode={seoMode} />
      <VisualEditor />
      <VerificationModal isOpen={isVerifyModalOpen} onClose={() => setIsVerifyModalOpen(false)} />
    </div >
  )
}
