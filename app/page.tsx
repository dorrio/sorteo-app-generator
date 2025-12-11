"use client"

import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useSorteoStore } from "@/lib/sorteo-store"
import { ParticleBackground } from "@/components/sorteo/particle-background"
import { SorteoSelector } from "@/components/sorteo/sorteo-selector"
import { CountdownAnimation } from "@/components/sorteo/countdown-animation"
import { WinnerCeremony } from "@/components/sorteo/winner-ceremony"
import { ParticipantManager } from "@/components/sorteo/participant-manager"
import { VisualEditor } from "@/components/sorteo/visual-editor"
import { HistoryPanel } from "@/components/sorteo/history-panel"
import { FloatingBubbles } from "@/components/sorteo/floating-bubbles"
import { Button } from "@/components/ui/button"
import { Sparkles, Settings2, Play, Trophy, Loader2 } from "lucide-react"

export default function SorteoApp() {
  const [mounted, setMounted] = useState(false)

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
          <p className="text-muted-foreground">Cargando Sorteo Pro...</p>
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
      <div className="relative z-10">
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
                <div className="font-display font-bold text-xl tracking-tight">{theme.customTitle}</div>
                <p className="text-xs text-muted-foreground">Pro para Influencers</p>
              </div>
            </motion.div>

            <Button variant="outline" size="sm" onClick={() => setIsEditorOpen(true)} className="gap-2">
              <Settings2 className="w-4 h-4" />
              <span className="hidden sm:inline">Personalizar</span>
            </Button>
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
                  className="text-4xl md:text-6xl font-display font-bold tracking-tight"
                  style={{ color: theme.primaryColor }}
                >
                  {theme.customTitle}
                </h1>
                <p className="text-muted-foreground text-lg">{theme.customSubtitle}</p>
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
                    className="h-16 px-12 text-xl font-display font-bold gap-3 rounded-2xl transition-all"
                    style={{
                      backgroundColor: theme.primaryColor,
                      color: theme.backgroundColor,
                      boxShadow: `0 0 40px ${theme.primaryColor}40`,
                    }}
                  >
                    {isSpinning ? (
                      <>
                        <Sparkles className="w-6 h-6 animate-spin" />
                        Sorteando...
                      </>
                    ) : (
                      <>
                        <Play className="w-6 h-6" />
                        Iniciar Sorteo
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>

              {participants.length < 2 && participants.length > 0 && (
                <p className="text-center text-sm text-muted-foreground">Añade al menos 2 participantes para iniciar</p>
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
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: theme.primaryColor }} />
                  Participantes
                </h3>

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

        {/* Footer */}
        <footer className="border-t border-border/50 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>Creado para influencers y creadores de contenido</p>
          </div>
        </footer>
      </div>

      {/* Overlays */}
      <CountdownAnimation onComplete={handleCountdownComplete} />
      <WinnerCeremony onClose={handleCloseCeremony} onNewSorteo={handleNewSorteo} />
      <VisualEditor />
    </div>
  )
}
