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
import { Sparkles, Settings2, Play, Trophy, Loader2, ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

export default function SorteoApp() {
  const t = useTranslations("HomePage")
  const [mounted, setMounted] = useState(false)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)

  const {
    participants,
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
  } = useSorteoStore()

  useEffect(() => {
    setMounted(true)
  }, [])

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

        {/* SEO Content */}
        <SeoContent />

        {/* Footer */}
        <footer className="border-t border-border/50">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
            <p>{t("footer_text")}</p>
            <Link
              href="/alternativa-appsorteos"
              className="text-muted-foreground/60 hover:text-primary transition-colors text-xs"
            >
              {t("footer_versus_link")}
            </Link>
          </div>
        </footer>
      </div>

      {/* Overlays */}
      <CountdownAnimation onComplete={handleCountdownComplete} />
      <WinnerCeremony onClose={handleCloseCeremony} onNewSorteo={handleNewSorteo} />
      <VisualEditor />
      <VerificationModal isOpen={isVerifyModalOpen} onClose={() => setIsVerifyModalOpen(false)} />
    </div>
  )
}

