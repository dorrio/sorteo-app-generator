import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Trophy, ShieldCheck, Settings2, Sparkles } from "lucide-react"
import { Link } from "@/i18n/routing"
import { UrlHandler } from "./url-handler"
import { BackgroundLayer } from "./background-layer"
import { HeaderLogic } from "./header-logic"
import { ThemeTitle, HeaderTitle } from "./theme-title"
import { Controls } from "./controls"
import { Overlays } from "./overlays"
import { SmartStickyFooter } from "./smart-sticky-footer"
import { LazyParticleBackground } from "./lazy-particles"

interface MainAppOptimizedProps {
  initialStyle?: string
  seoMode?: string
  initialTitle?: string
  initialSubtitle?: string
  shareTitle?: string;
  shareText?: string;
  customShareTextTemplate?: string;
  initialOptions?: any;
  shareTranslations?: any;
  stickyTranslations?: any;
  children?: React.ReactNode; // Tool Visual
  sidebar?: React.ReactNode; // Participant Manager
  footer?: React.ReactNode; // Site Footer
  seoContent?: React.ReactNode; // Content below tool
}

export function MainAppOptimized({
  initialStyle,
  seoMode = 'home',
  initialTitle,
  initialSubtitle,
  shareTitle = "Sorteo Pro",
  shareText = "Sorteo Pro",
  customShareTextTemplate = "🔥 Join my giveaway: *{title}*! Created with Sorteo Pro. Free & Unlimited. 👇",
  initialOptions,
  shareTranslations,
  stickyTranslations,
  children,
  sidebar,
  footer,
  seoContent
}: MainAppOptimizedProps) {

  // Default translations fallback if not provided
  const safeShareTranslations = shareTranslations || {
    share: "Share...",
    copy: "Copy Link",
    copied: "Copied!",
    shareOn: "Share on"
  }

  const safeStickyTranslations = stickyTranslations || {
    share_cta: "Share Tool",
    start_cta: "Start Giveaway"
  }

  const fullStickyTranslations = {
    ...safeStickyTranslations,
    share_button: safeShareTranslations
  }

  const initialShareContent = {
    title: shareTitle,
    text: shareText,
    url: "" // Hydration will fill this
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <UrlHandler
        initialStyle={initialStyle}
        initialTitle={initialTitle}
        initialSubtitle={initialSubtitle}
        seoMode={seoMode}
        initialOptions={initialOptions}
      />

      <BackgroundLayer />
      <LazyParticleBackground />

      {/* Main Content Shell */}
      <div className="relative z-10 font-sans">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="flex items-center gap-3"
                aria-label="Sorteo Pro Home"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <HeaderTitle initialTitle={initialTitle} />
              </Link>
            </div>

            <HeaderLogic
              initialTitle={initialTitle}
              shareTitle={shareTitle}
              shareText={shareText}
              customShareTextTemplate={customShareTextTemplate}
              shareTranslations={safeShareTranslations}
            />
          </div>
        </header>

        {/* Main Grid */}
        <main id="sorteo-section" className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Tool Area */}
            <section className="space-y-8" aria-label="Main Tool Area">
              <ThemeTitle initialTitle={initialTitle} initialSubtitle={initialSubtitle} />

              {/* The Visual Tool (Client Component passed as child) */}
              {children}

              <Controls />
            </section>

            {/* Sidebar (No entrance animation for LCP) */}
            <aside className="space-y-6">
              {sidebar}
            </aside>
          </div>
        </main>

        {/* SEO Content */}
        {seoContent}

        {/* Footer */}
        {footer}

        {/* Sticky Share Footer (Mobile) */}
        <SmartStickyFooter
           initialShareContent={initialShareContent}
           translations={fullStickyTranslations}
           customShareTextTemplate={customShareTextTemplate}
        />
      </div>

      <Overlays seoMode={seoMode} />
    </div>
  )
}
