import { ThemeInitializer } from "@/components/sorteo/theme-initializer"
import { BackgroundIsland } from "@/components/sorteo/background-island"
import { ContentWrapperIsland } from "@/components/sorteo/content-wrapper-island"
import { HeaderIsland } from "@/components/sorteo/header-island"
import { SorteoGameIsland } from "@/components/sorteo/sorteo-game-island"
import { SidebarIsland } from "@/components/sorteo/sidebar-island"
import { OverlaysIsland } from "@/components/sorteo/overlays-island"
import { StickyShareFooterIsland } from "@/components/sorteo/sticky-share-footer-island"
import { Suspense } from "react"
import type React from "react"

interface MainAppOptimizedProps {
  initialStyle?: string
  seoMode?: string
  initialTitle?: string
  initialSubtitle?: string
  shareTitle?: string;
  shareText?: string;
  customShareTextTemplate?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
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
    yes?: string
    no?: string
    heads?: string
    tails?: string
    rock?: string
    paper?: string
    scissors?: string
  }
}

export function MainAppOptimized({
  initialStyle,
  seoMode = 'home',
  initialTitle = "Sorteo Pro",
  initialSubtitle = "The Premium Giveaway Tool",
  shareTitle = "Sorteo Pro",
  shareText = "Sorteo Pro",
  customShareTextTemplate = "🔥 Join my giveaway: *{title}*! Created with Sorteo Pro. Free & Unlimited. 👇",
  footer,
  children,
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
}: MainAppOptimizedProps) {

  // Initial share content for server rendering
  const initialShareContent = {
    title: shareTitle,
    text: shareText,
    url: "" // Client islands will hydrate this with window.location.href
  }

  // Combine sticky translations
  const fullStickyTranslations = {
      ...stickyTranslations,
      share_button: shareTranslations
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ThemeInitializer
        initialStyle={initialStyle}
        seoMode={seoMode}
        initialTitle={initialTitle}
        initialSubtitle={initialSubtitle}
        initialOptions={initialOptions}
      />
      <BackgroundIsland />

      <ContentWrapperIsland>
        <HeaderIsland
          displayTitle={initialTitle}
          shareContent={initialShareContent}
          shareTranslations={shareTranslations}
        />

        <main id="sorteo-section" className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            <SorteoGameIsland
              initialTitle={initialTitle}
              initialSubtitle={initialSubtitle}
              initialStyle={initialStyle}
            />
            <SidebarIsland />
          </div>
        </main>

        {children}

        {footer}
        <StickyShareFooterIsland
            initialShareContent={initialShareContent}
            translations={fullStickyTranslations}
            seoMode={seoMode}
            customShareTextTemplate={customShareTextTemplate}
        />
      </ContentWrapperIsland>

      <OverlaysIsland seoMode={seoMode} />
    </div>
  )
}
