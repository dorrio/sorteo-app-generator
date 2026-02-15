import { Suspense } from "react"
import { ThemeInitializer } from "@/components/sorteo/islands/theme-initializer"
import { BackgroundIsland } from "@/components/sorteo/islands/background-island"
import { ContentWrapperIsland } from "@/components/sorteo/islands/content-wrapper-island"
import { HeaderIsland } from "@/components/sorteo/islands/header-island"
import { SorteoGameIsland } from "@/components/sorteo/islands/sorteo-game-island"
import { SidebarIsland } from "@/components/sorteo/islands/sidebar-island"
import { OverlaysIsland } from "@/components/sorteo/islands/overlays-island"
import { StickyShareFooterIsland } from "@/components/sorteo/islands/sticky-share-footer-island"
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
import { MonthGeo } from "@/components/sorteo/month-geo"
import { CardGeo } from "@/components/sorteo/card-geo"
import { Glossary } from "@/components/sorteo/glossary"
import { SeoContent } from "@/components/sorteo/seo-content"
import { InstagramGeo } from "@/components/sorteo/instagram-geo"

interface MainAppProps {
  initialStyle?: string;
  seoMode?: 'home' | 'wheel' | 'instagram' | 'rng' | 'list-randomizer' | 'yes-no' | 'letter' | 'secret-santa' | 'team' | 'dice' | 'coin' | 'rps' | 'country' | 'month' | 'card' | 'bingo';
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
  initialOptions?: {
    yes: string;
    no: string;
    heads: string;
    tails: string;
    rock: string;
    paper: string;
    scissors: string;
  };
}

export function MainAppOptimized({
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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Suspense fallback={null}>
        <ThemeInitializer
          initialStyle={initialStyle}
          initialTitle={initialTitle}
          initialSubtitle={initialSubtitle}
          seoMode={seoMode}
          initialOptions={initialOptions}
        />
      </Suspense>

      <BackgroundIsland />

      <ContentWrapperIsland className="relative z-10" style={{ fontFamily: "var(--font-display)" }}>
        <HeaderIsland
          initialTitle={initialTitle}
          seoMode={seoMode}
          shareTitle={shareTitle}
          shareText={shareText}
          customShareTextTemplate={customShareTextTemplate}
          shareTranslations={shareTranslations}
        />

        <main id="sorteo-section" className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
             <SorteoGameIsland
                initialStyle={initialStyle}
                initialTitle={initialTitle}
                initialSubtitle={initialSubtitle}
                seoMode={seoMode}
             />

             <SidebarIsland />
          </div>
        </main>

        {children ? children : (
          /* Fallback for Legacy Pages that don't pass children yet */
          seoMode === 'wheel' ? (
            <> <WheelGeo /> <Glossary seoMode={seoMode} /> </>
          ) : seoMode === 'instagram' ? (
            <> <InstagramGeo /> <Glossary seoMode={seoMode} /> </>
          ) : seoMode === 'rng' ? (
            <> <RngGeo /> <Glossary seoMode={seoMode} /> </>
          ) : seoMode === 'list-randomizer' ? (
            <> <ListRandomizerGeo /> <Glossary seoMode={seoMode} /> </>
          ) : seoMode === 'secret-santa' ? (
            <> <SecretSantaGeo /> <Glossary seoMode={seoMode} /> </>
          ) : seoMode === 'team' ? (
            <> <TeamGeo /> <Glossary seoMode="list-randomizer" /> </>
          ) : seoMode === 'yes-no' ? (
            <> <YesNoGeo /> <Glossary seoMode={seoMode} /> </>
          ) : seoMode === 'letter' ? (
            <> <LetterGeo /> <Glossary seoMode={seoMode} /> </>
          ) : seoMode === 'dice' ? (
            <> <DiceGeo /> <Glossary seoMode="rng" /> </>
          ) : seoMode === 'coin' ? (
            <> <CoinGeo /> <Glossary seoMode="yes-no" /> </>
          ) : seoMode === 'rps' ? (
            <> <RpsGeo /> <Glossary seoMode="yes-no" /> </>
          ) : seoMode === 'country' ? (
            <> <CountryGeo /> <Glossary seoMode="wheel" /> </>
          ) : seoMode === 'month' ? (
            <> <MonthGeo /> <Glossary seoMode="wheel" /> </>
          ) : seoMode === 'card' ? (
            <> <CardGeo /> <Glossary seoMode="card" /> </>
          ) : (
            <> <WheelGeo /> <Glossary seoMode={seoMode} /> <SeoContent /> </>
          )
        )}

        {footer}

        <StickyShareFooterIsland
            initialTitle={initialTitle}
            seoMode={seoMode}
            shareTitle={shareTitle}
            shareText={shareText}
            customShareTextTemplate={customShareTextTemplate}
            translations={{
                ...stickyTranslations,
                share_button: shareTranslations
            }}
        />
      </ContentWrapperIsland>

      <OverlaysIsland seoMode={seoMode} />
    </div>
  )
}
