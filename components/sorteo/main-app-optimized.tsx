import { Suspense } from "react"
import { getTranslations, getLocale } from "next-intl/server"
import { SorteoLayoutWrapper } from "@/components/sorteo/sorteo-layout-wrapper"
import { HeaderIsland } from "@/components/sorteo/header-island"
import { TitleIsland } from "@/components/sorteo/title-island"
import { SorteoGameIsland } from "@/components/sorteo/sorteo-game-island"
import { SidebarIsland } from "@/components/sorteo/sidebar-island"
import { ThemeInitializer } from "@/components/sorteo/theme-initializer"
import { OverlaysIsland } from "@/components/sorteo/overlays-island"
import { BackgroundIsland } from "@/components/sorteo/background-island"
import { SmartStickyFooter } from "@/components/sorteo/smart-sticky-footer"

// Legacy imports for fallback
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
import { SeoContent } from "@/components/sorteo/seo-content"

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

export async function MainAppOptimized(props: MainAppProps) {
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
    shareTranslations,
    stickyTranslations,
    initialOptions
  } = props

  const locale = await getLocale()

  // 1. Resolve Title & Subtitle (SSR Fallback)
  let resolvedTitle = initialTitle
  let resolvedSubtitle = initialSubtitle

  if (!resolvedTitle) {
    if (seoMode === 'yes-no') { const t = await getTranslations({ locale, namespace: 'YesNoPage' }); resolvedTitle = t('h1'); resolvedSubtitle = t('subtitle'); }
    else if (seoMode === 'letter') { const t = await getTranslations({ locale, namespace: 'LetterGeneratorPage' }); resolvedTitle = t('h1'); resolvedSubtitle = t('subtitle'); }
    else if (seoMode === 'rng') { const t = await getTranslations({ locale, namespace: 'RngPage' }); resolvedTitle = t('h1'); resolvedSubtitle = t('subtitle'); }
    else if (seoMode === 'list-randomizer') { const t = await getTranslations({ locale, namespace: 'ListRandomizerPage' }); resolvedTitle = t('h1'); resolvedSubtitle = t('subtitle'); }
    else if (seoMode === 'secret-santa') { const t = await getTranslations({ locale, namespace: 'SecretSantaPage' }); resolvedTitle = t('h1'); resolvedSubtitle = t('subtitle'); }
    else if (seoMode === 'team') { const t = await getTranslations({ locale, namespace: 'TeamGeneratorPage' }); resolvedTitle = t('h1'); resolvedSubtitle = t('subtitle'); }
    else if (seoMode === 'dice') { const t = await getTranslations({ locale, namespace: 'DicePage' }); resolvedTitle = t('h1'); resolvedSubtitle = t('subtitle'); }
    else if (seoMode === 'coin') { const t = await getTranslations({ locale, namespace: 'CoinPage' }); resolvedTitle = t('h1'); resolvedSubtitle = t('subtitle'); }
    else if (seoMode === 'rps') { const t = await getTranslations({ locale, namespace: 'RpsPage' }); resolvedTitle = t('h1'); resolvedSubtitle = t('subtitle'); }
    else if (seoMode === 'country') { const t = await getTranslations({ locale, namespace: 'CountryPage' }); resolvedTitle = t('h1'); resolvedSubtitle = t('subtitle'); }
    else if (seoMode === 'month') { const t = await getTranslations({ locale, namespace: 'MonthPage' }); resolvedTitle = t('h1'); resolvedSubtitle = t('subtitle'); }
    else if (seoMode === 'card') { const t = await getTranslations({ locale, namespace: 'CardPage' }); resolvedTitle = t('h1'); resolvedSubtitle = t('subtitle'); }
    else if (seoMode === 'instagram') { const t = await getTranslations({ locale, namespace: 'InstagramPicker' }); resolvedTitle = t('h1'); resolvedSubtitle = t('subtitle'); }
    else if (seoMode === 'wheel') { const t = await getTranslations({ locale, namespace: 'WheelGeoPage' }); resolvedTitle = t('h1'); resolvedSubtitle = t('subtitle'); }
  }

  const finalTitle = resolvedTitle || "Sorteo Pro"
  const finalSubtitle = resolvedSubtitle || "The Premium Giveaway Tool"

  // 2. Resolve Translations
  let finalShareTranslations = shareTranslations
  if (!finalShareTranslations) {
     const tWinner = await getTranslations({ locale, namespace: 'WinnerCeremony' })
     finalShareTranslations = {
        share: tWinner('share_menu'),
        copy: tWinner('copy_text'),
        copied: tWinner('copied'),
        shareOn: tWinner('share_on')
     }
  }

  let finalStickyTranslations = stickyTranslations
  if (!finalStickyTranslations) {
     const tShare = await getTranslations({ locale, namespace: 'ShareContent' })
     finalStickyTranslations = {
        share_cta: tShare('cta_share'),
        start_cta: tShare('cta_start')
     }
  }

  const fullStickyTranslations = {
    ...finalStickyTranslations,
    share_button: finalShareTranslations
  }

  // 3. Resolve Share Content (SSR)
  let headerShareTitle = shareTitle
  let headerShareText = shareText

  if (shareTitle === "Sorteo Pro" && seoMode && seoMode !== 'home') {
      const tShare = await getTranslations({ locale, namespace: 'ShareContent' })
      if (seoMode === 'wheel') { headerShareTitle = tShare('wheel_title'); headerShareText = tShare('wheel_text'); }
      else if (seoMode === 'instagram') { headerShareTitle = tShare('instagram_title'); headerShareText = tShare('instagram_text'); }
      else if (seoMode === 'rng') { headerShareTitle = tShare('rng_title'); headerShareText = tShare('rng_text'); }
      else if (seoMode === 'list-randomizer') { headerShareTitle = tShare('list_title'); headerShareText = tShare('list_text'); }
      else if (seoMode === 'team') { headerShareTitle = tShare('list_title'); headerShareText = tShare('list_text'); }
      else if (seoMode === 'secret-santa') { headerShareTitle = tShare('secret_santa_title'); headerShareText = tShare('secret_santa_text'); }
      else if (seoMode === 'yes-no') { headerShareTitle = tShare('yes_no_title'); headerShareText = tShare('yes_no_text'); }
      else if (seoMode === 'letter') { headerShareTitle = tShare('letter_title'); headerShareText = tShare('letter_text'); }
      else if (seoMode === 'dice') { headerShareTitle = tShare('dice_title'); headerShareText = tShare('dice_text'); }
      else if (seoMode === 'coin') { headerShareTitle = tShare('coin_title'); headerShareText = tShare('coin_text'); }
      else if (seoMode === 'rps') { headerShareTitle = tShare('rps_title'); headerShareText = tShare('rps_text'); }
      else if (seoMode === 'country') { headerShareTitle = tShare('country_title'); headerShareText = tShare('country_text'); }
      else if (seoMode === 'month') { headerShareTitle = tShare('month_title'); headerShareText = tShare('month_text'); }
      else if (seoMode === 'card') { headerShareTitle = tShare('card_title'); headerShareText = tShare('card_text'); }
  }

  const headerShareContent = {
      title: headerShareTitle,
      text: headerShareText,
      url: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/${locale}` : `https://sorteopro.com/${locale}`
  }

  // 4. Resolve Children (Legacy Fallback)
  let finalChildren = children
  if (!finalChildren) {
    if (seoMode === 'wheel') finalChildren = <> <WheelGeo /> <Glossary seoMode={seoMode} /> </>
    else if (seoMode === 'instagram') finalChildren = <> <InstagramGeo /> <Glossary seoMode={seoMode} /> </>
    else if (seoMode === 'rng') finalChildren = <> <RngGeo /> <Glossary seoMode={seoMode} /> </>
    else if (seoMode === 'list-randomizer') finalChildren = <> <ListRandomizerGeo /> <Glossary seoMode={seoMode} /> </>
    else if (seoMode === 'secret-santa') finalChildren = <> <SecretSantaGeo /> <Glossary seoMode={seoMode} /> </>
    else if (seoMode === 'team') finalChildren = <> <TeamGeo /> <Glossary seoMode="list-randomizer" /> </>
    else if (seoMode === 'yes-no') finalChildren = <> <YesNoGeo /> <Glossary seoMode={seoMode} /> </>
    else if (seoMode === 'letter') finalChildren = <> <LetterGeo /> <Glossary seoMode={seoMode} /> </>
    else if (seoMode === 'dice') finalChildren = <> <DiceGeo /> <Glossary seoMode="rng" /> </>
    else if (seoMode === 'coin') finalChildren = <> <CoinGeo /> <Glossary seoMode="yes-no" /> </>
    else if (seoMode === 'rps') finalChildren = <> <RpsGeo /> <Glossary seoMode="yes-no" /> </>
    else if (seoMode === 'country') finalChildren = <> <CountryGeo /> <Glossary seoMode="wheel" /> </>
    else if (seoMode === 'month') finalChildren = <> <MonthGeo /> <Glossary seoMode="wheel" /> </>
    else if (seoMode === 'card') finalChildren = <> <CardGeo /> <Glossary seoMode="card" /> </>
    else finalChildren = <> <WheelGeo /> <Glossary seoMode={seoMode} /> <SeoContent /> </>
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Client Logic Islands */}
      <Suspense fallback={null}>
        <ThemeInitializer
          initialStyle={initialStyle}
          initialTitle={finalTitle}
          initialSubtitle={finalSubtitle}
          seoMode={seoMode}
          initialOptions={initialOptions}
        />
      </Suspense>
      <BackgroundIsland />
      <OverlaysIsland seoMode={seoMode} />

      {/* Main Layout */}
      <SorteoLayoutWrapper>
         <HeaderIsland
            initialTitle={finalTitle}
            shareContent={headerShareContent}
            shareTranslations={finalShareTranslations}
         />

         <main id="sorteo-section" className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-[1fr,400px] gap-8">
               {/* Sorteo Area */}
               <section className="space-y-8" aria-label="Main Tool Area">
                  <TitleIsland initialTitle={finalTitle} initialSubtitle={finalSubtitle} />
                  <SorteoGameIsland initialStyle={initialStyle} />
               </section>

               {/* Sidebar */}
               <SidebarIsland />
            </div>
         </main>

         {/* Children (SEO Content, Tool Components) */}
         {finalChildren}

         {/* Footer */}
         {footer}

         <SmartStickyFooter
            shareTitle={headerShareTitle}
            shareText={headerShareText}
            customShareTextTemplate={customShareTextTemplate}
            translations={fullStickyTranslations}
         />
      </SorteoLayoutWrapper>
    </div>
  )
}
