"use client"

import { useCallback, useEffect, useState, Suspense } from "react"
import { motion } from "framer-motion"
import { useSorteoStore } from "@/lib/sorteo-store"
import { ParticleBackground } from "@/components/sorteo/particle-background"
import { SorteoSelector } from "@/components/sorteo/sorteo-selector"
import { AppSkeleton } from "@/components/sorteo/skeletons"
import { SmartLoader } from "@/components/ui/smart-loader"
import { VerificationModal } from "@/components/sorteo/verification-modal"
import { CountdownAnimation } from "@/components/sorteo/countdown-animation"
import { WinnerCeremony } from "@/components/sorteo/winner-ceremony"
import { ParticipantManager } from "@/components/sorteo/participant-manager"
import { VisualEditor } from "@/components/sorteo/visual-editor"
import { HistoryPanel } from "@/components/sorteo/history-panel"
import { FloatingBubbles } from "@/components/sorteo/floating-bubbles"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { SeoContent } from "@/components/sorteo/seo-content"
import { WheelGeo } from "@/components/sorteo/wheel-geo"
import { RngGeo } from "@/components/sorteo/rng-geo"
import { ListRandomizerGeo } from "@/components/sorteo/list-randomizer-geo"
import { YesNoGeo } from "@/components/sorteo/yes-no-geo"
import { LetterGeo } from "@/components/sorteo/letter-geo"
import { Glossary } from "@/components/sorteo/glossary"
import { InstagramGeo } from "@/components/sorteo/instagram-geo"
import { ShareButton } from "@/components/ui/share-button"
import { SiteFooter } from "@/components/sorteo/site-footer"
import { StickyShareFooter } from "@/components/sorteo/sticky-share-footer"
import { Sparkles, Settings2, Play, Trophy, Loader2, ShieldCheck, Share2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"

function ThemeParamsHandler({ updateTheme }: { updateTheme: (config: any) => void }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Viralis: Apply template overrides if present (Context Injection)
    const templateTitle = searchParams.get('template_title')
    const templateColor = searchParams.get('template_color')

    const update: any = {}
    if (templateTitle) update.customTitle = templateTitle
    if (templateColor) update.primaryColor = templateColor

    if (Object.keys(update).length > 0) {
      updateTheme(update)
    }
  }, [searchParams, updateTheme])

  return null
}

interface MainAppProps {
    initialStyle?: string;
    seoMode?: 'home' | 'wheel' | 'instagram' | 'rng' | 'list-randomizer' | 'yes-no' | 'letter';
}

export function MainApp({ initialStyle, seoMode = 'home' }: MainAppProps) {
  const t = useTranslations("HomePage")
  const tYesNo = useTranslations("YesNoPage")
  const tLetter = useTranslations("LetterGeneratorPage")
  const tRng = useTranslations("RngPage")
  const tList = useTranslations("ListRandomizerPage")
  const tInsta = useTranslations("InstagramPicker")
  const tWheel = useTranslations("WheelGeoPage") 
  const tMeta = useTranslations("Metadata")
  const tWinner = useTranslations("WinnerCeremony")
  const tShare = useTranslations("ShareContent")
  const [mounted, setMounted] = useState(false)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)

  const {
    participants,
    addParticipants,
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

  // Calculated state for inert
  const isOverlayOpen = isVerifyModalOpen || showWinnerCeremony || isEditorOpen || showCountdown

  useEffect(() => {
    setMounted(true)
    if (initialStyle) {
        const update: any = { sorteoStyle: initialStyle }
        if (seoMode === 'yes-no') {
            update.customTitle = tYesNo('h1')
            update.customSubtitle = tYesNo('subtitle')
        } else if (seoMode === 'letter') {
            update.customTitle = tLetter('h1')
            update.customSubtitle = tLetter('subtitle')
        } else if (seoMode === 'rng') {
            update.customTitle = tRng('h1')
            update.customSubtitle = tRng('subtitle')
        } else if (seoMode === 'list-randomizer') {
            update.customTitle = tList('h1')
            update.customSubtitle = tList('subtitle')
        } else if (seoMode === 'instagram') {
            update.customTitle = tInsta('h1')
            update.customSubtitle = tInsta('subtitle')
        } else if (seoMode === 'wheel') {
            update.customTitle = tWheel('h1')
            update.customSubtitle = tWheel('subtitle')
        }

        updateTheme(update)
    }
  }, [initialStyle, updateTheme, seoMode, tYesNo, tLetter, tRng, tList, tInsta, tWheel])

  // Separate effect for populating dummy data if empty on a specific landing page
  // This ensures the Wheel is visible immediately (UX Best Practice)
  useEffect(() => {
      if ((initialStyle === 'roulette' || initialStyle === 'slot') && mounted && hasHydrated && participants.length === 0) {
          if (seoMode === 'yes-no') {
              addParticipants([
                  { name: tYesNo('option_yes') },
                  { name: tYesNo('option_no') }
              ])
          } else if (seoMode === 'letter') {
              const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
              addParticipants(alphabet.map(l => ({ name: l })))
          } else {
              addParticipants([
                  { name: "Option 1" },
                  { name: "Option 2" },
                  { name: "Option 3" },
                  { name: "Option 4" },
                  { name: "Option 5" }
              ])
          }
      }
      // We only run this when mounted/hydrated changes to true, or initialStyle changes
      // We include participants.length in dependency to know if it's 0, but we should be careful not to loop.
      // addParticipants is stable.
      // To avoid infinite loop if user clears list, we might want to only do this ONCE.
      // But for a landing page, maybe it's okay?
      // Actually, if user clears list, participants becomes 0, and this re-adds them. That's annoying.
      // We should use a ref to track if we've auto-populated.
  }, [mounted, hasHydrated, initialStyle, seoMode]) // Removed participants.length from dependency to avoid re-populating on clear

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
      // Default / Home
      let shareTitle = tShare('home_title')
      let shareText = tShare('home_text')

      if (seoMode === 'wheel') {
          shareTitle = tShare('wheel_title')
          shareText = tShare('wheel_text')
      } else if (seoMode === 'instagram') {
          shareTitle = tShare('instagram_title')
          shareText = tShare('instagram_text')
      } else if (seoMode === 'rng') {
          shareTitle = tShare('rng_title')
          shareText = tShare('rng_text')
      } else if (seoMode === 'list-randomizer') {
          shareTitle = tShare('list_title')
          shareText = tShare('list_text')
      } else if (seoMode === 'yes-no') {
          shareTitle = tShare('yes_no_title')
          shareText = tShare('yes_no_text')
      } else if (seoMode === 'letter') {
          shareTitle = tShare('letter_title')
          shareText = tShare('letter_text')
      }

      return {
          title: shareTitle,
          text: shareText,
          url: typeof window !== "undefined" ? window.location.href : ""
      }
  }

  const shareContent = getShareContent()

  // Translations for ShareButton
  // We'll reuse existing keys or provide defaults
  const shareTranslations = {
      share: tWinner('share_menu'),
      copy: tWinner('copy_text'),
      copied: tWinner('copied'),
      shareOn: "Share on"
  }

  const stickyTranslations = {
      share_cta: tShare('cta_share'),
      start_cta: tShare('cta_start'),
      share_button: shareTranslations
  }

  if (!mounted || !hasHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    )
  }

  const bgOpacity = theme.backgroundOpacity ?? 30
  const bgBlur = theme.backgroundBlur ?? 0
  const participantDisplay = theme.participantDisplay ?? "list"

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Suspense fallback={null}>
        <ThemeParamsHandler updateTheme={updateTheme} />
      </Suspense>

      {/* Background image */}
      {theme.backgroundImage && (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${theme.backgroundImage})`,
            opacity: bgOpacity / 100,
            filter: `blur(${bgBlur}px)`,
          }}
        />
      )}

      {theme.backgroundImage && (
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundColor: theme.backgroundColor,
            opacity: 0.7,
          }}
        />
      )}

      {/* Particle background */}
      <ParticleBackground />

      {/* Main content */}
      <div
        className="relative z-10"
        inert={isOverlayOpen ? true : undefined}
        style={{
          fontFamily:
            theme.fontFamily === "Inter" ? "var(--font-inter)" :
              theme.fontFamily === "Space Grotesk" ? "var(--font-display)" :
                theme.fontFamily === "Roboto" ? "var(--font-roboto)" :
                  theme.fontFamily === "Montserrat" ? "var(--font-montserrat)" :
                    theme.fontFamily === "Open Sans" ? "var(--font-open-sans)" :
                      theme.fontFamily === "Lato" ? "var(--font-lato)" :
                        theme.fontFamily === "Poppins" ? "var(--font-poppins)" :
                          theme.fontFamily === "system-ui" ? "system-ui, sans-serif" :
                            "var(--font-display)"
        }}
      >
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
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
                <div className="font-bold text-xl tracking-tight">{theme.customTitle}</div>
              </div>
            </motion.div>

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
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
              aria-label="Main Tool Area"
            >
              {/* Title */}
              <div className="text-center space-y-2">
                <h1
                  className="text-4xl md:text-6xl font-bold tracking-tight"
                  style={{ color: theme.primaryColor }}
                >
                  {theme.customTitle}
                </h1>
                <p className="text-muted-foreground text-lg">{theme.customSubtitle}</p>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
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
                </motion.button>
              </div>

              {/* Slot machine */}
              <SorteoSelector onWinnerSelected={handleWinnerSelected} />

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
            </motion.section>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Participants card */}
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: theme.primaryColor }} />
                  {t("participants_title")}
                </h2>

                {participantDisplay === "bubbles" ? <FloatingBubbles /> : <ParticipantManager />}

                {participantDisplay === "bubbles" && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <ParticipantManager showOnlyInput />
                  </div>
                )}
              </div>

              {/* History card */}
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6">
                <HistoryPanel />
              </div>
            </motion.aside>
          </div>
        </main>

        {/* SEO Content Conditional Rendering */}
        {seoMode === 'wheel' ? (
             /* Wheel Mode: Prioritize WheelGeo */
             <>
                <WheelGeo />
                <Glossary />
             </>
        ) : seoMode === 'instagram' ? (
             /* Instagram Mode: Show Instagram specific content */
             <>
                <InstagramGeo />
                <Glossary />
             </>
        ) : seoMode === 'rng' ? (
            /* RNG Mode: Show Random Number Generator content */
            <>
               <RngGeo />
               <Glossary />
            </>
       ) : seoMode === 'list-randomizer' ? (
            /* List Randomizer Mode: Show List Randomizer content */
            <>
                <ListRandomizerGeo />
                <Glossary />
            </>
       ) : seoMode === 'yes-no' ? (
            /* Yes/No Mode */
            <>
                <YesNoGeo />
                <Glossary />
            </>
       ) : seoMode === 'letter' ? (
            /* Letter Mode */
            <>
                <LetterGeo />
                <Glossary />
            </>
       ) : (
            /* Home Mode: Show everything */
            <>
                <WheelGeo />
                <Glossary />
                <SeoContent />
            </>
        )}

        {/* Footer */}
        <SiteFooter />
        <StickyShareFooter shareContent={shareContent} translations={stickyTranslations} />
      </div>

      {/* Overlays */}
      <CountdownAnimation onComplete={handleCountdownComplete} />
      <WinnerCeremony onClose={handleCloseCeremony} onNewSorteo={handleNewSorteo} seoMode={seoMode} />
      <VisualEditor />
      <VerificationModal isOpen={isVerifyModalOpen} onClose={() => setIsVerifyModalOpen(false)} />
    </div>
  )
}
