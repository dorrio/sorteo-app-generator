"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Share2 } from "lucide-react"
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

  const handleShare = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault() // Prevent dropdown from opening immediately
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
        setIsOpen(true)
      }
    } else {
      setIsOpen(true)
    }
  }

  const copyToClipboard = async () => {
    try {
      // Viralis Optimization: Copy ONLY the URL to reduce friction for manual sharing
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fail silently or log if needed
    }
  }

  const shareInstagram = async () => {
    try {
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
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`


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
        canShareNative={canShareNative}
        shareNative={handleShare}
      />
    </DropdownMenu>
  )
}
