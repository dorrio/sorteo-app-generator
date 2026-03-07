"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Share2, Copy, Twitter, Facebook, MessageCircle, Check, Instagram, Send, Linkedin } from "lucide-react"
import { buildTelegramShareUrl, buildLinkedinShareUrl } from "@/lib/social-share-urls"
import { ShareDropdownContent } from "@/components/ui/share-dropdown-content"

interface ShareButtonProps {
  title: string
  text: string
  url: string
  buttonVariant?: "default" | "outline" | "ghost" | "secondary"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  className?: string
  iconClassName?: string
  children?: React.ReactNode // Default to <Share2 /> icon if empty
  onNativeShare?: () => Promise<void> // Viralis: Optional custom handler for native sharing
  translations: {
    share: string
    copy: string
    copied: string
    close?: string
    shareOn?: string // "Share on {platform}"
  }
}

export function ShareButton({
  title,
  text,
  url,
  buttonVariant = "ghost",
  buttonSize = "icon",
  className,
  iconClassName = "w-5 h-5",
  children,
  onNativeShare,
  translations
}: ShareButtonProps) {
  const [canShareNative, setCanShareNative] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setCanShareNative(typeof navigator !== "undefined" && !!navigator.share)
  }, [])

  const handleShare = async (e: React.MouseEvent) => {
    if (canShareNative) {
      e.preventDefault() // Prevent dropdown from opening immediately
      try {
        if (onNativeShare) {
          await onNativeShare()
        } else {
          await navigator.share({
            title: title,
            text: text,
            url: url,
          })
        }
      } catch (err) {
        // Fallback to dropdown if user cancels or error
        setIsOpen(true)
      }
    }
  }

  const copyToClipboard = async () => {
    // Viralis Optimization: Copy full text + url to preserve the hook
    const clipboardText = text ? `${text} ${url}` : url
    await navigator.clipboard.writeText(clipboardText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareInstagram = async () => {
    // Instagram doesn't have a direct share URL for text/links easily on web
    // Best practice is to copy to clipboard and open instagram
    await navigator.clipboard.writeText(text + " " + url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Pre-calculate Social URLs
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
  // WhatsApp: Use api.whatsapp.com for better cross-device support
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`
  // Telegram: Highly viral in crypto/giveaway communities
  const telegramUrl = buildTelegramShareUrl(url, text)
  // LinkedIn: Good for professional tools (Team Generator)
  const linkedinUrl = buildLinkedinShareUrl(url)


  const TriggerButton = (
    <Button
      variant={buttonVariant}
      size={buttonSize}
      className={className}
      onClick={handleShare}
      title={translations.share}
      aria-label={translations.share}
    >
      {children || <Share2 className={iconClassName} />}
    </Button>
  )

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {TriggerButton}
      </DropdownMenuTrigger>
      <ShareDropdownContent
        copyToClipboard={copyToClipboard}
        shareInstagram={shareInstagram}
        copied={copied}
        twitterUrl={twitterUrl}
        facebookUrl={facebookUrl}
        whatsappUrl={whatsappUrl}
        telegramUrl={telegramUrl}
        linkedinUrl={linkedinUrl}
        translations={translations}
        align="end"
      />
    </DropdownMenu>
  )
}
