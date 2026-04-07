"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Share2, Copy, Twitter, Facebook, MessageCircle, Check, Instagram, Linkedin, Send } from "lucide-react"

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
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    setCanShareNative(
      typeof navigator !== "undefined" &&
      !!navigator.share &&
      window.matchMedia("(pointer: coarse)").matches
    )
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
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          // User cancelled the share dialog.
          // Temporarily disable native share so the dropdown renders, then open it.
          // We restore native share after a delay so subsequent clicks use native share again.
          setCanShareNative(false)
          setDropdownOpen(true)
          setTimeout(() => {
            setCanShareNative(true)
          }, 500) // Restore after dropdown is likely closed/unmounted or next interaction
        } else {
          // Genuine failure. Fallback to dropdown and disable native share.
          setCanShareNative(false)
          setDropdownOpen(true)
        }
      }
    }
  }

  const copyToClipboard = async () => {
    // Viralis Optimization: Copy only URL to prevent 404 errors when pasted into address bars
    const clipboardText = url
    try {
      await navigator.clipboard.writeText(clipboardText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
      // Provide fallback or notification logic here if needed
    }
  }

  const shareInstagram = async () => {
      // Instagram doesn't have a direct share URL for text/links easily on web
      // Best practice is to copy to clipboard and open instagram
      try {
        await navigator.clipboard.writeText(text + " " + url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy text for Instagram:", err)
      }
  }

  // Pre-calculate Social URLs
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
  // WhatsApp: Use api.whatsapp.com for better cross-device support
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`


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

  if (canShareNative) {
    return TriggerButton
  }

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        {TriggerButton}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
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
           <a href={telegramUrl} target="_blank" rel="noopener noreferrer" aria-label={translations.shareOn ? `${translations.shareOn} Telegram` : "Share on Telegram"}>
            <Send className="w-4 h-4" />
            Telegram
           </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="gap-2 cursor-pointer">
           <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={translations.shareOn ? `${translations.shareOn} LinkedIn` : "Share on LinkedIn"}>
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
