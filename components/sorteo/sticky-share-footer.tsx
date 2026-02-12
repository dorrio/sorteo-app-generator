"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ShareButton } from "@/components/ui/share-button"
import { Play, Share2 } from "lucide-react"

interface StickyShareFooterProps {
  shareContent: {
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
}

export function StickyShareFooter({ shareContent, translations }: StickyShareFooterProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Viralis: Show after scrolling 100px (reduced from 300px) to capture users on mobile faster
      const show = window.scrollY > 100
      setIsVisible(show)
    }

    // Check immediately on mount (in case of anchor link or refresh)
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
             {/* Share Button (Primary Viral Lever) */}
             <div className="flex-1">
                <ShareButton
                    title={shareContent.title}
                    text={shareContent.text}
                    url={shareContent.url}
                    translations={translations.share_button}
                    buttonVariant="secondary"
                    buttonSize="lg"
                    className="w-full gap-2 font-bold shadow-sm"
                >
                   <Share2 className="w-4 h-4" />
                   {translations.share_cta}
                </ShareButton>
             </div>

             {/* Start Button (Conversion Lever) */}
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
