"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Share2, Copy, Twitter, Facebook, MessageCircle, Check, Instagram, Send, Linkedin } from "lucide-react"
import { buildTelegramShareUrl, buildLinkedinShareUrl } from "@/lib/social-share-urls"

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
  const [isTouch, setIsTouch] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setCanShareNative(typeof navigator !== "undefined" && !!navigator.share)
    setIsTouch(window.matchMedia("(pointer: coarse)").matches)
  }, [])

  const handleShare = async () => {
    if (canShareNative) {
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
        // But typically we don't need to do anything if user cancels
      }
    }
  }

  const copyToClipboard = async () => {
    try {
      // Viralis Optimization: Copy ONLY the URL to reduce friction for manual sharing
      // Users often want just the link to paste into Discord/Slack/Email without the "Check this out" prefix.
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fail silently or log if needed
    }
  }

  const shareInstagram = async () => {
    try {
      // Instagram doesn't have a direct share URL for text/links easily on web
      // Best practice is to copy to clipboard and open instagram
      await navigator.clipboard.writeText(text + " " + url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fail silently or log
    }
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
      onClick={canShareNative ? handleShare : undefined}
      title={translations.share}
      aria-label={translations.share}
    >
      {children || <Share2 className={iconClassName} />}
    </Button>
  )

  // Viralis Optimization: Only prioritize native share on touch devices (mobile/tablet)
  // On desktop (even with native share support like Safari), the dropdown is often preferred
  // as it offers direct "Copy Link" access which native share sheets sometimes bury.
  const shouldUseNative = canShareNative && isTouch

  if (shouldUseNative) {
    return TriggerButton
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {TriggerButton}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Viralis: Provide access to System Share on desktop if available */}
        {canShareNative && (
          <DropdownMenuItem onClick={handleShare} className="gap-2 cursor-pointer font-medium">
            <Share2 className="w-4 h-4" />
            {translations.share}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={copyToClipboard} className="gap-2 cursor-pointer">
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-green-500">{translations.copied}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              {translations.copy}
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="gap-2 cursor-pointer">
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
            <Twitter className="w-4 h-4" />
            Twitter / X
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="gap-2 cursor-pointer">
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
            <Facebook className="w-4 h-4" />
            Facebook
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="gap-2 cursor-pointer">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="gap-2 cursor-pointer">
          <a href={telegramUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Telegram">
            <Send className="w-4 h-4" />
            Telegram
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="gap-2 cursor-pointer">
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="gap-2 cursor-pointer">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={shareInstagram}
            aria-label={translations.shareOn ? `${translations.shareOn} Instagram` : "Share on Instagram"}
          >
            <Instagram className="w-4 h-4" />
            Instagram
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
