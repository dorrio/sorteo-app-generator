import { Suspense } from "react"
import { ThemeInitializer } from "@/components/sorteo/islands/theme-initializer"
import { BackgroundIsland } from "@/components/sorteo/islands/background-island"
import { HeaderIsland } from "@/components/sorteo/islands/header-island"
import { SorteoGameIsland } from "@/components/sorteo/islands/sorteo-game-island"
import { SidebarIsland } from "@/components/sorteo/islands/sidebar-island"
import { OverlaysIsland } from "@/components/sorteo/islands/overlays-island"
import { ContentWrapperIsland } from "@/components/sorteo/islands/content-wrapper-island"
import { StickyShareFooterIsland } from "@/components/sorteo/islands/sticky-share-footer-island"
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
import { MonthGeo } from "@/components/sorteo/month-geo"
import { CardGeo } from "@/components/sorteo/card-geo"
import { Glossary } from "@/components/sorteo/glossary"
import { InstagramGeo } from "@/components/sorteo/instagram-geo"

interface MainAppOptimizedProps {
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

export function MainAppOptimized(props: MainAppOptimizedProps) {
  const {
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
  } = props

  // Fallback Logic for Children (Server Rendered)
  const renderFallbackChildren = () => {
    if (seoMode === 'wheel') return <> <WheelGeo /> <Glossary seoMode={seoMode} /> </>
    if (seoMode === 'instagram') return <> <InstagramGeo /> <Glossary seoMode={seoMode} /> </>
    if (seoMode === 'rng') return <> <RngGeo /> <Glossary seoMode={seoMode} /> </>
    if (seoMode === 'list-randomizer') return <> <ListRandomizerGeo /> <Glossary seoMode={seoMode} /> </>
    if (seoMode === 'secret-santa') return <> <SecretSantaGeo /> <Glossary seoMode={seoMode} /> </>
    if (seoMode === 'team') return <> <TeamGeo /> <Glossary seoMode="list-randomizer" /> </>
    if (seoMode === 'yes-no') return <> <YesNoGeo /> <Glossary seoMode={seoMode} /> </>
    if (seoMode === 'letter') return <> <LetterGeo /> <Glossary seoMode={seoMode} /> </>
    if (seoMode === 'dice') return <> <DiceGeo /> <Glossary seoMode="rng" /> </>
    if (seoMode === 'coin') return <> <CoinGeo /> <Glossary seoMode="yes-no" /> </>
    if (seoMode === 'rps') return <> <RpsGeo /> <Glossary seoMode="yes-no" /> </>
    if (seoMode === 'country') return <> <CountryGeo /> <Glossary seoMode="wheel" /> </>
    if (seoMode === 'month') return <> <MonthGeo /> <Glossary seoMode="wheel" /> </>
    if (seoMode === 'card') return <> <CardGeo /> <Glossary seoMode="card" /> </>
    // Default Home
    return <> <WheelGeo /> <Glossary seoMode={seoMode} /> <SeoContent /> </>
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Suspense fallback={null}>
        <ThemeInitializer
          initialStyle={initialStyle}
          seoMode={seoMode}
          initialTitle={initialTitle}
          initialSubtitle={initialSubtitle}
          initialOptions={initialOptions}
        />
      </Suspense>

      <BackgroundIsland />

      <ContentWrapperIsland>
        <HeaderIsland
          initialTitle={initialTitle}
          initialSubtitle={initialSubtitle}
          seoMode={seoMode}
          shareTitle={shareTitle}
          shareText={shareText}
          customShareTextTemplate={customShareTextTemplate}
          shareTranslations={shareTranslations}
        />

        <main id="sorteo-section" className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            <SorteoGameIsland
              initialTitle={initialTitle}
              initialSubtitle={initialSubtitle}
              initialStyle={initialStyle}
              seoMode={seoMode}
            />

            <SidebarIsland />
          </div>
        </main>

        {children ? children : renderFallbackChildren()}

        {footer}
        <StickyShareFooterIsland
          seoMode={seoMode}
          shareTitle={shareTitle}
          shareText={shareText}
          customShareTextTemplate={customShareTextTemplate}
          stickyTranslations={stickyTranslations}
          shareTranslations={shareTranslations}
          initialTitle={initialTitle}
        />
      </ContentWrapperIsland>

      <OverlaysIsland seoMode={seoMode} />
    </div>
  )
}
