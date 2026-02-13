import { Suspense } from "react"
import Link from "next/link"
import { Trophy } from "lucide-react"

import {
  ThemeInitializer,
  BackgroundIsland,
  TitleIsland,
  HeaderIsland,
  SidebarIsland,
  OverlaysIsland,
  SorteoGameIsland,
  SmartStickyFooter,
} from "@/components/sorteo/islands"

interface MainAppOptimizedProps {
  initialStyle?: string
  seoMode?: string
  children?: React.ReactNode
  initialTitle?: string
  initialSubtitle?: string
  shareTitle?: string
  shareText?: string
  customShareTextTemplate?: string
  footer?: React.ReactNode
  shareTranslations?: {
    share: string
    copy: string
    copied: string
    shareOn: string
  }
  stickyTranslations?: {
    share_cta: string
    start_cta: string
  }
  initialOptions?: {
    yes: string
    no: string
    heads: string
    tails: string
    rock: string
    paper: string
    scissors: string
  }
  customizeText?: string // "Customize" text for button under title
}

export function MainAppOptimized({
  initialStyle,
  seoMode = 'home',
  children,
  initialTitle = "Sorteo Pro",
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
  initialOptions,
  customizeText = "Customize"
}: MainAppOptimizedProps) {

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

      {/* Header (Server Wrapper) */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/50 relative z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label="Sorteo Pro Home"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600"
              >
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                {/* We render title here or rely on the H1 below? MainApp had title in header too. */}
                {/* MainApp had: <div className="font-bold text-xl tracking-tight">{displayTitle}</div> */}
                {/* For layout stability, maybe just "Sorteo Pro" or pass initialTitle? */}
                <div className="font-bold text-xl tracking-tight">Sorteo Pro</div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <HeaderIsland
              shareTitle={shareTitle}
              shareText={shareText}
              customShareTextTemplate={customShareTextTemplate}
              initialTitle={initialTitle}
              shareTranslations={shareTranslations}
            />
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main id="sorteo-section" className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Sorteo Area */}
          <section className="space-y-8" aria-label="Main Tool Area">
            <TitleIsland
              initialTitle={initialTitle}
              initialSubtitle={initialSubtitle}
              customizeText={customizeText}
            />

            <SorteoGameIsland initialStyle={initialStyle} />
          </section>

          {/* Sidebar */}
          <SidebarIsland />
        </div>
      </main>

      {/* SEO Content (Server Components passed as children) */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Footer (Static) */}
      {footer}

      {/* Dynamic Footer (Client) */}
      <SmartStickyFooter
        shareTitle={shareTitle}
        shareText={shareText}
        customShareTextTemplate={customShareTextTemplate}
        initialTitle={initialTitle}
        stickyTranslations={stickyTranslations}
        shareTranslations={shareTranslations}
      />

      {/* Modals & Overlays */}
      <OverlaysIsland seoMode={seoMode} />
    </div>
  )
}
