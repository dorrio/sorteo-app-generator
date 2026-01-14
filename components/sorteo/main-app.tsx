"use client"

import { useCallback, useEffect, useState } from "react"
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
import { Glossary } from "@/components/sorteo/glossary"
import { InstagramGeo } from "@/components/sorteo/instagram-geo"
import { ShareButton } from "@/components/ui/share-button"
import { SiteFooter } from "@/components/sorteo/site-footer"
import { Sparkles, Settings2, Play, Trophy, Loader2, ShieldCheck, Share2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

interface MainAppProps {
    initialStyle?: string;
    seoMode?: 'home' | 'wheel' | 'instagram' | 'rng' | 'list-randomizer' | 'yes-no';
}

export function MainApp({ initialStyle, seoMode = 'home' }: MainAppProps) {
  const t = useTranslations("HomePage")
  const tYesNo = useTranslations("YesNoPage")
  const tMeta = useTranslations("Metadata")
  const tWinner = useTranslations("WinnerCeremony")
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
    setIsEditorOpen,
    hasHydrated,
    updateTheme
  } = useSorteoStore()

  useEffect(() => {
    setMounted(true)
    if (initialStyle) {
        const update: any = { sorteoStyle: initialStyle }
        if (seoMode === 'yes-no') {
            update.customTitle = tYesNo('h1')
            update.customSubtitle = tYesNo('description')
        }
        updateTheme(update)
    }
  }, [initialStyle, updateTheme, seoMode])

  // Separate effect for populating dummy data if empty on a specific landing page
  // This ensures the Wheel is visible immediately (UX Best Practice)
  useEffect(() => {
      if (initialStyle === 'roulette' && mounted && hasHydrated && participants.length === 0) {
          if (seoMode === 'yes-no') {
              addParticipants([
                  { name: tYesNo('option_yes') },
                  { name: tYesNo('option_no') }
              ])
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
      let shareTitle = tMeta('title')
      let shareText = "Check out Sorteo Pro - The best free giveaway tool!"

      if (seoMode === 'wheel') {
          shareTitle = "Wheel of Names | Sorteo Pro"
          shareText = "Check out this free Wheel of Names tool! No ads and unlimited entries."
      } else if (seoMode === 'instagram') {
          shareTitle = "Instagram Comment Picker | Sorteo Pro"
          shareText = "Pick a random winner from Instagram comments for free!"
      } else if (seoMode === 'rng') {
          shareTitle = "Random Number Generator | Sorteo Pro"
          shareText = "Generate secure random numbers instantly."
      } else if (seoMode === 'list-randomizer') {
          shareTitle = "List Randomizer | Sorteo Pro"
          shareText = "Randomize lists and pick winners easily."
      } else if (seoMode === 'yes-no') {
          shareTitle = "Yes or No Wheel | Sorteo Pro"
          shareText = "Spin the wheel and decide! Yes or No?"
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
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Sorteo area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
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
            </motion.div>

            {/* Sidebar */}
            <motion.div
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
            </motion.div>
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
      </div>

      {/* Overlays */}
      <CountdownAnimation onComplete={handleCountdownComplete} />
      <WinnerCeremony onClose={handleCloseCeremony} onNewSorteo={handleNewSorteo} />
      <VisualEditor />
      <VerificationModal isOpen={isVerifyModalOpen} onClose={() => setIsVerifyModalOpen(false)} />
    </div>
  )
}
