"use client"

import { useCallback, useEffect, useState, Suspense, useRef } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { motion } from "framer-motion"
import { useSorteoStore } from "@/lib/sorteo-store"
import { SorteoSelector } from "@/components/sorteo/sorteo-selector"
import { AppSkeleton } from "@/components/sorteo/skeletons"
import { ParticipantManager } from "@/components/sorteo/participant-manager"
import { HistoryPanel } from "@/components/sorteo/history-panel"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { SeoContent } from "@/components/sorteo/seo-content"
import { WheelGeo } from "@/components/sorteo/wheel-geo"
import { RngGeo } from "@/components/sorteo/rng-geo"
import { ListRandomizerGeo } from "@/components/sorteo/list-randomizer-geo"
import { SecretSantaGeo } from "@/components/sorteo/secret-santa-geo"
import { TeamGeo } from "@/components/sorteo/team-geo"
import { YesNoGeo } from "@/components/sorteo/yes-no-geo"
import { LetterGeo } from "@/components/sorteo/letter-geo"
import { DiceGeo } from "@/components/sorteo/dice-geo"
import { CoinGeo } from "@/components/sorteo/coin-geo"
import { RpsGeo } from "@/components/sorteo/rps-geo"
import { CountryGeo } from "@/components/sorteo/country-geo"
import { Glossary } from "@/components/sorteo/glossary"
import { InstagramGeo } from "@/components/sorteo/instagram-geo"
import { ShareButton } from "@/components/ui/share-button"
import { SiteFooter } from "@/components/sorteo/site-footer"
import { StickyShareFooter } from "@/components/sorteo/sticky-share-footer"
import { COUNTRIES } from "@/lib/countries"
import { Sparkles, Settings2, Play, Trophy, ShieldCheck, Share2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"

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
    seoMode?: 'home' | 'wheel' | 'instagram' | 'rng' | 'list-randomizer' | 'yes-no' | 'letter' | 'secret-santa' | 'team' | 'dice' | 'coin' | 'rps' | 'country';
}

export function MainApp({ initialStyle, seoMode = 'home' }: MainAppProps) {
  const t = useTranslations("HomePage")
  const tYesNo = useTranslations("YesNoPage")
  const tLetter = useTranslations("LetterGeneratorPage")
  const tDice = useTranslations("DicePage")
  const tCoin = useTranslations("CoinPage")
  const tRps = useTranslations("RpsPage")
  const tCountry = useTranslations("CountryPage")
  const tRng = useTranslations("RngPage")
  const tList = useTranslations("ListRandomizerPage")
  const tSecret = useTranslations("SecretSantaPage")
  const tTeam = useTranslations("TeamGeneratorPage")
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

  const contentRef = useRef<HTMLDivElement>(null)

  // Calculated state for inert
  const isOverlayOpen = isVerifyModalOpen || showWinnerCeremony || isEditorOpen || showCountdown

  useEffect(() => {
    if (contentRef.current) {
      if (isOverlayOpen) {
        contentRef.current.setAttribute('inert', '')
        // @ts-ignore
        contentRef.current.inert = true
      } else {
        contentRef.current.removeAttribute('inert')
        // @ts-ignore
        contentRef.current.inert = false
      }
    }
  }, [isOverlayOpen])

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
        } else if (seoMode === 'secret-santa') {
            update.customTitle = tSecret('h1')
            update.customSubtitle = tSecret('subtitle')
        } else if (seoMode === 'team') {
            update.customTitle = tTeam('h1')
            update.customSubtitle = tTeam('subtitle')
        } else if (seoMode === 'dice') {
            update.customTitle = tDice('h1')
            update.customSubtitle = tDice('subtitle')
        } else if (seoMode === 'coin') {
            update.customTitle = tCoin('h1')
            update.customSubtitle = tCoin('subtitle')
        } else if (seoMode === 'rps') {
            update.customTitle = tRps('h1')
            update.customSubtitle = tRps('subtitle')
        } else if (seoMode === 'country') {
            update.customTitle = tCountry('h1')
            update.customSubtitle = tCountry('subtitle')
        } else if (seoMode === 'instagram') {
            update.customTitle = tInsta('h1')
            update.customSubtitle = tInsta('subtitle')
        } else if (seoMode === 'wheel') {
            update.customTitle = tWheel('h1')
            update.customSubtitle = tWheel('subtitle')
        }

        updateTheme(update)
    }
  }, [initialStyle, updateTheme, seoMode, tYesNo, tLetter, tRng, tList, tSecret, tTeam, tInsta, tWheel, tCoin, tDice, tRps, tCountry])

  // Separate effect for populating dummy data if empty on a specific landing page
  // This ensures the Wheel is visible immediately (UX Best Practice)
  useEffect(() => {
    // Check for initial population scenarios
    const shouldPopulate =
      (initialStyle === 'roulette' || initialStyle === 'slot' || initialStyle === 'cards' || (seoMode === 'dice' && initialStyle === 'grid') || (seoMode === 'country'))
      && mounted && hasHydrated && participants.length === 0

    if (shouldPopulate) {
      if (seoMode === 'yes-no') {
        addParticipants([
          { name: tYesNo('option_yes') },
          { name: tYesNo('option_no') }
        ])
      } else if (seoMode === 'coin') {
              addParticipants([
                  { name: tCoin('option_heads') },
                  { name: tCoin('option_tails') }
              ])
          } else if (seoMode === 'rps') {
              addParticipants([
                  { name: tRps('option_rock') },
                  { name: tRps('option_paper') },
                  { name: tRps('option_scissors') }
              ])
          } else if (seoMode === 'letter') {
              const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
              addParticipants(alphabet.map(l => ({ name: l })))
          } else if (seoMode === 'dice') {
              addParticipants(["1", "2", "3", "4", "5", "6"].map(n => ({ name: n })))
              } else if (seoMode === 'country') {
                  addParticipants(COUNTRIES.map(c => ({ name: c })))
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
      let defaultTitle = "Sorteo Pro"

      if (seoMode === 'wheel') {
          shareTitle = tShare('wheel_title')
          shareText = tShare('wheel_text')
          defaultTitle = tWheel('h1')
      } else if (seoMode === 'instagram') {
          shareTitle = tShare('instagram_title')
          shareText = tShare('instagram_text')
          defaultTitle = tInsta('h1')
      } else if (seoMode === 'rng') {
          shareTitle = tShare('rng_title')
          shareText = tShare('rng_text')
          defaultTitle = tRng('h1')
      } else if (seoMode === 'list-randomizer') {
          shareTitle = tShare('list_title')
          shareText = tShare('list_text')
          defaultTitle = tList('h1')
      } else if (seoMode === 'team') {
          shareTitle = tShare('list_title') // Reuse list share text as it mentions teams
          shareText = tShare('list_text')
          defaultTitle = tTeam('h1')
      } else if (seoMode === 'secret-santa') {
          shareTitle = tShare('secret_santa_title')
          shareText = tShare('secret_santa_text')
          defaultTitle = tSecret('h1')
      } else if (seoMode === 'yes-no') {
          shareTitle = tShare('yes_no_title')
          shareText = tShare('yes_no_text')
          defaultTitle = tYesNo('h1')
      } else if (seoMode === 'letter') {
          shareTitle = tShare('letter_title')
          shareText = tShare('letter_text')
          defaultTitle = tLetter('h1')
      } else if (seoMode === 'dice') {
          shareTitle = tShare('dice_title')
          shareText = tShare('dice_text')
          defaultTitle = tDice('h1')
      } else if (seoMode === 'coin') {
          shareTitle = tShare('coin_title')
          shareText = tShare('coin_text')
          defaultTitle = tCoin('h1')
      } else if (seoMode === 'rps') {
          shareTitle = tShare('rps_title')
          shareText = tShare('rps_text')
          defaultTitle = tRps('h1')
      } else if (seoMode === 'country') {
          shareTitle = tShare('country_title')
          shareText = tShare('country_text')
          defaultTitle = tCountry('h1')
      }

      // Viralis: Check for custom title to enhance share context
      let url = typeof window !== "undefined" ? window.location.href : ""

      const isCustomTitle = theme.customTitle && theme.customTitle !== defaultTitle

      if (typeof window !== "undefined") {
        try {
          const urlObj = new URL(window.location.href)

          // 1. Branding: Custom Title & Color
          if (isCustomTitle) {
            shareText = tShare('custom_share_text', { title: theme.customTitle })
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

          url = urlObj.toString()
        } catch (e) {
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

  // Server-Side Rendering (SSR) & Initial Client Render
  // If not hydrated, we use the SEO mode to set the correct Title/Subtitle for bots
  let displayTitle = theme.customTitle
  let displaySubtitle = theme.customSubtitle

  if (!hasHydrated) {
    if (seoMode === 'wheel') {
        displayTitle = tWheel('h1')
        displaySubtitle = tWheel('subtitle')
    } else if (seoMode === 'instagram') {
        displayTitle = tInsta('h1')
        displaySubtitle = tInsta('subtitle')
    } else if (seoMode === 'rng') {
        displayTitle = tRng('h1')
        displaySubtitle = tRng('subtitle')
    } else if (seoMode === 'list-randomizer') {
        displayTitle = tList('h1')
        displaySubtitle = tList('subtitle')
    } else if (seoMode === 'team') {
        displayTitle = tTeam('h1')
        displaySubtitle = tTeam('subtitle')
    } else if (seoMode === 'secret-santa') {
        displayTitle = tSecret('h1')
        displaySubtitle = tSecret('subtitle')
    } else if (seoMode === 'yes-no') {
        displayTitle = tYesNo('h1')
        displaySubtitle = tYesNo('subtitle')
    } else if (seoMode === 'letter') {
        displayTitle = tLetter('h1')
        displaySubtitle = tLetter('subtitle')
    } else if (seoMode === 'dice') {
        displayTitle = tDice('h1')
        displaySubtitle = tDice('subtitle')
    } else if (seoMode === 'coin') {
        displayTitle = tCoin('h1')
        displaySubtitle = tCoin('subtitle')
    } else if (seoMode === 'rps') {
        displayTitle = tRps('h1')
        displaySubtitle = tRps('subtitle')
    } else if (seoMode === 'country') {
        displayTitle = tCountry('h1')
        displaySubtitle = tCountry('subtitle')
    }
  }

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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
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
                  {displayTitle}
                </h1>
                <p className="text-muted-foreground text-lg">{displaySubtitle}</p>
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
            </motion.section>

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

        {/* SEO Content Conditional Rendering */}
        {seoMode === 'wheel' ? (
             /* Wheel Mode: Prioritize WheelGeo */
             <>
                <WheelGeo />
                <Glossary seoMode={seoMode} />
             </>
        ) : seoMode === 'instagram' ? (
             /* Instagram Mode: Show Instagram specific content */
             <>
                <InstagramGeo />
                <Glossary seoMode={seoMode} />
             </>
        ) : seoMode === 'rng' ? (
            /* RNG Mode: Show Random Number Generator content */
            <>
               <RngGeo />
               <Glossary seoMode={seoMode} />
            </>
       ) : seoMode === 'list-randomizer' ? (
            /* List Randomizer Mode: Show List Randomizer content */
            <>
                <ListRandomizerGeo />
                <Glossary seoMode={seoMode} />
            </>
       ) : seoMode === 'secret-santa' ? (
            /* Secret Santa Mode */
            <>
                <SecretSantaGeo />
                <Glossary seoMode={seoMode} />
            </>
       ) : seoMode === 'team' ? (
            /* Team Mode */
            <>
                <TeamGeo />
                <Glossary seoMode="list-randomizer" />
            </>
       ) : seoMode === 'yes-no' ? (
            /* Yes/No Mode */
            <>
                <YesNoGeo />
                <Glossary seoMode={seoMode} />
            </>
       ) : seoMode === 'letter' ? (
            /* Letter Mode */
            <>
                <LetterGeo />
                <Glossary seoMode={seoMode} />
            </>
       ) : seoMode === 'dice' ? (
            /* Dice Mode */
            <>
                <DiceGeo />
                <Glossary seoMode="rng" />
            </>
       ) : seoMode === 'coin' ? (
            /* Coin Mode */
            <>
                <CoinGeo />
                <Glossary seoMode="yes-no" />
            </>
       ) : seoMode === 'rps' ? (
            /* RPS Mode */
            <>
                <RpsGeo />
                <Glossary seoMode="yes-no" />
            </>
       ) : seoMode === 'country' ? (
            /* Country Mode */
            <>
                <CountryGeo />
                <Glossary seoMode="wheel" />
            </>
       ) : (
            /* Home Mode: Show everything */
            <>
                <WheelGeo />
                <Glossary seoMode={seoMode} />
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
