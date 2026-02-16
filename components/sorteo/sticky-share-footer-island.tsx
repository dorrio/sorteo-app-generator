"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/ui/share-button"
import { Play, Share2, Loader2 } from "lucide-react"
import { useSorteoStore } from "@/lib/sorteo-store"

interface StickyShareFooterIslandProps {
  initialShareContent: {
    title: string
    text: string
    url: string
  }
  translations: {
    share_cta: string
    start_cta: string
    share_button: {
      share: string
      copy: string
      copied: string
      shareOn: string
    }
  }
  seoMode?: string
  customShareTextTemplate: string
}

export function StickyShareFooterIsland({
  initialShareContent,
  translations,
  seoMode,
  customShareTextTemplate
}: StickyShareFooterIslandProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const { theme, participants } = useSorteoStore()

  // Computed share content based on client state
  const getShareContent = () => {
    let finalShareText = initialShareContent.text
    let finalShareTitle = initialShareContent.title
    let url = typeof window !== "undefined" ? window.location.href : initialShareContent.url

    const defaultTitle = "Sorteo Pro" // Fallback
    const isCustomTitle = theme.customTitle && theme.customTitle !== defaultTitle

    if (typeof window !== "undefined") {
      try {
        const urlObj = new URL(window.location.href)

        // 1. Branding: Custom Title & Color
        if (isCustomTitle && theme.customTitle) {
          finalShareText = customShareTextTemplate.replace('{title}', theme.customTitle)

          urlObj.searchParams.set('template_title', theme.customTitle)
          if (theme.primaryColor) {
            urlObj.searchParams.set('template_color', theme.primaryColor)
          }
        }

        // 2. Content: Shareable Participant List (Deep Linking)
        if (participants.length > 0 && participants.length <= 100) {
          const names = participants.map(p => p.name)
          const encoded = encodeURIComponent(JSON.stringify(names))
          if (encoded.length < 1500) {
            urlObj.searchParams.set('list', encoded)
          }
        }

        url = urlObj.toString()
      } catch (e) {
        // Fallback
      }
    }

    return {
      title: finalShareTitle,
      text: finalShareText,
      url: url
    }
  }

  const shareContent = getShareContent()

  const handleNativeShare = async () => {
    // Note: This logic duplicates handleNativeShare from original StickyShareFooter
    // Ideally we should import it or keep it here.
    if (!navigator.share) return

    setIsSharing(true)
    try {
      const shareData = {
        title: shareContent.title,
        text: shareContent.text,
        url: shareContent.url,
      }

      // Attempt to generate image if we can
      let filesArray: File[] = []
       try {
        const urlObj = new URL(shareContent.url)
        const customTitle = urlObj.searchParams.get('template_title')
        const customColor = urlObj.searchParams.get('template_color')
        const list = urlObj.searchParams.get('list')

        const ogUrl = new URL(window.location.origin + '/api/og')
        if (seoMode) ogUrl.searchParams.set('type', seoMode)
        if (customTitle) ogUrl.searchParams.set('title', customTitle)
        if (customColor) ogUrl.searchParams.set('color', customColor)
        if (list) ogUrl.searchParams.set('list', list)

        const response = await fetch(ogUrl.toString())
        if (response.ok) {
           const blob = await response.blob()
           const file = new File([blob], 'share-card.png', { type: 'image/png' })
           if (navigator.canShare && navigator.canShare({ files: [file] })) {
             filesArray = [file]
           }
        }
      } catch (e) {
          console.error("Failed to generate share image", e)
      }

      await navigator.share({
        ...shareData,
        files: filesArray.length > 0 ? filesArray : undefined
      })
    } catch {
       // Cancelled
    } finally {
        setIsSharing(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 100
      setIsVisible(show)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/50 md:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="p-4 flex gap-3 max-w-md mx-auto items-center">
             <div className="flex-1">
                <ShareButton
                    title={shareContent.title}
                    text={shareContent.text}
                    url={shareContent.url}
                    translations={translations.share_button}
                    onNativeShare={handleNativeShare}
                    buttonVariant="secondary"
                    buttonSize="lg"
                    className="w-full gap-2 font-bold shadow-sm"
                >
                   {isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                   {translations.share_cta}
                </ShareButton>
             </div>

             <div className="flex-1">
                 <Button
                    onClick={scrollToTop}
                    size="lg"
                    className="w-full gap-2 font-bold shadow-primary/20 shadow-lg"
                 >
                    <Play className="w-4 h-4 fill-current" />
                    {translations.start_cta}
                 </Button>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
