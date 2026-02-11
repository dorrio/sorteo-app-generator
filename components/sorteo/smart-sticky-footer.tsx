"use client"

import { useState, useEffect } from "react"
import { StickyShareFooter } from "./sticky-share-footer"
import { useSorteoStore } from "@/lib/sorteo-store"

interface SmartStickyFooterProps {
  initialShareContent: {
    title: string
    text: string
    url: string
  }
  translations: any // Typing loosely to match StickyShareFooter complex type
  customShareTextTemplate: string
}

export function SmartStickyFooter({ initialShareContent, translations, customShareTextTemplate }: SmartStickyFooterProps) {
  const { theme, participants } = useSorteoStore()
  const [shareContent, setShareContent] = useState(initialShareContent)

  useEffect(() => {
    let finalShareText = initialShareContent.text
    let url = typeof window !== "undefined" ? window.location.href : initialShareContent.url
    const isCustomTitle = theme.customTitle && theme.customTitle !== "Sorteo Pro"

    if (typeof window !== "undefined") {
      try {
        const urlObj = new URL(window.location.href)
        if (isCustomTitle && theme.customTitle) {
          finalShareText = customShareTextTemplate.replace('{title}', theme.customTitle)
          urlObj.searchParams.set('template_title', theme.customTitle)
          if (theme.primaryColor) urlObj.searchParams.set('template_color', theme.primaryColor)
        }
        if (participants.length > 0 && participants.length <= 100) {
          const names = participants.map(p => p.name)
          const encoded = encodeURIComponent(JSON.stringify(names))
          if (encoded.length < 1500) {
            urlObj.searchParams.set('list', encoded)
          }
        }
        url = urlObj.toString()
      } catch (e) { }
    }
    setShareContent({ title: initialShareContent.title, text: finalShareText, url })
  }, [theme, participants, initialShareContent, customShareTextTemplate])

  return <StickyShareFooter shareContent={shareContent} translations={translations} />
}
