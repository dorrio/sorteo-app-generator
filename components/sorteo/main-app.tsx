"use client"

import { useCallback, useEffect, useMemo, useState, Suspense, useRef } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { motion } from "framer-motion"
import { useSorteoStore, type ThemeConfig } from "@/lib/sorteo-store"
import { SorteoSelector } from "@/components/sorteo/sorteo-selector"
import { ParticipantManager } from "@/components/sorteo/participant-manager"
import { HistoryPanel } from "@/components/sorteo/history-panel"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { WheelMode, MODE_COMPONENTS } from "@/components/sorteo/modes"
import { type SeoMode } from "@/components/sorteo/glossary"
import { ShareButton } from "@/components/ui/share-button"
import { StickyShareFooter } from "@/components/sorteo/sticky-share-footer"
import { Sparkles, Settings2, Play, Trophy, ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"
import { useThemeInitialization, usePopulationLogic, useShareContent } from "@/components/sorteo/hooks"

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
  initialStyle?: ThemeConfig["sorteoStyle"];
  seoMode?: SeoMode;
  children?: React.ReactNode;
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
  customShareTextTemplate,
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
  const t = useTranslations("HomePage")

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
  }, [])

  const { displayTitle, displaySubtitle } = useThemeInitialization(initialStyle, initialTitle, initialSubtitle, seoMode)
  usePopulationLogic(mounted, seoMode, initialOptions)

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
  const shareContent = useShareContent(seoMode, shareTitle, shareText, initialTitle, customShareTextTemplate)

  // Full Sticky Translations Object
  const fullStickyTranslations = {
    ...stickyTranslations,
    share_button: shareTranslations
  }

  // Server-Side Rendering (SSR) & Initial Client Render
  // is now handled by `useThemeInitialization`

  const bgOpacity = theme.backgroundOpacity ?? 30
  const bgBlur = theme.backgroundBlur ?? 0
  const participantDisplay = theme.participantDisplay ?? "list"

  // Font Optimization: Use classes for preloaded fonts to avoid FOUT/Layout Shifts
  const { className: fontClassName, style: fontStyle } = useMemo(() => {
    switch (theme.fontFamily) {
      case "Inter": return { className: "font-sans", style: {} }
      case "Space Grotesk": return { className: "font-display", style: {} }
      case "Roboto":
      case "Montserrat":
      case "Open Sans":
      case "Lato":
      case "Poppins":
      case "system-ui":
        return { className: undefined, style: { fontFamily: "system-ui, sans-serif" } as React.CSSProperties }
      default: return { className: undefined, style: { fontFamily: "system-ui, sans-serif" } as React.CSSProperties }
    }
  }, [theme.fontFamily])

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
        className={`relative z-10${fontClassName ? ` ${fontClassName}` : ""}`}
        style={fontStyle}
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
        {children ? children : (
          /* Fallback for Legacy Pages that don't pass children yet */
          (() => {
            const ModeComponent = (seoMode && MODE_COMPONENTS[seoMode]) || WheelMode
            return <ModeComponent seoMode={seoMode || 'home'} />
          })()
        )}

        {/* Footer */}
        {footer}
        <StickyShareFooter shareContent={shareContent} translations={fullStickyTranslations} seoMode={seoMode} />
      </div >

      {/* Overlays */}
      <CountdownAnimation onComplete={handleCountdownComplete} />
      <WinnerCeremony onClose={handleCloseCeremony} onNewSorteo={handleNewSorteo} seoMode={seoMode} />
      <VisualEditor />
      <VerificationModal isOpen={isVerifyModalOpen} onClose={() => setIsVerifyModalOpen(false)} />
    </div >
  )
}
