"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { useSorteoStore } from "@/lib/sorteo-store"
import { ConfettiEffect } from "./confetti-effect"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Trophy,
  Sparkles,
  Share2,
  RotateCcw,
  Copy,
  Check,
  Twitter,
  Facebook,
  MessageCircle,
  Instagram,
  Download,
  Loader2,
  Send,
  Linkedin
}from "lucide-react"
import { type SeoMode } from "@/components/sorteo/glossary"

interface WinnerCeremonyProps {
  onClose: () => void
  onNewSorteo: () => void
  seoMode?: SeoMode
}

/**
 * Extracts the date from a verification ID string (format: ID-UUID-TIMESTAMP_HEX)
 * Returns current Date as fallback if parsing fails.
 */
function extractDateFromVerificationId(verificationId: string | undefined): Date {
  if (!verificationId) return new Date()
  try {
    const parts = verificationId.split("-")
    if (parts.length >= 3) {
      const timestampHex = parts[parts.length - 1]
      const timestamp = parseInt(timestampHex, 16)
      const d = new Date(timestamp)
      if (!isNaN(d.getTime())) return d
    }
  } catch {
    // Intentionally ignoring parsing errors to use current date as fallback
  }
  return new Date()
}

export function WinnerCeremony({ onClose, onNewSorteo, seoMode }: WinnerCeremonyProps) {
  const { winner, theme, showWinnerCeremony } = useSorteoStore()
  const t = useTranslations("WinnerCeremony")
  const [copied, setCopied] = useState(false)
  const [canShareNative, setCanShareNative] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const locale = useLocale()

  useEffect(() => {
    setCanShareNative(
      typeof navigator !== "undefined" &&
      !!navigator.share &&
      window.matchMedia("(pointer: coarse)").matches
    )

  }, [showWinnerCeremony])

  // Viral Optimization: Create a deep link to the verification page
  const shareData = useMemo(() => {
    if (!winner) return { url: "", text: "", twitterUrl: "", facebookUrl: "", whatsappUrl: "", telegramUrl: "", linkedinUrl: "" }

    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    let shareUrl = typeof window !== "undefined" ? window.location.href : ""

    if (winner.verificationId) {
      const params = new URLSearchParams()
      params.set("id", winner.verificationId)
      params.set("name", winner.name)

      if (seoMode && seoMode !== "home") params.set("type", seoMode)
      if (theme.customTitle) params.set("title", theme.customTitle)
      if (theme.primaryColor) params.set("color", theme.primaryColor)

      shareUrl = `${baseUrl}/${locale}/verify?${params.toString()}`
    }

    let text = t("share_text", { name: winner.name })
    if (theme.customTitle) {
      text = t("share_text_custom", { name: winner.name, title: theme.customTitle })
    }

    return {
      url: shareUrl,
      text,
      twitterUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebookUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`,
      whatsappUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + shareUrl)}`,
      telegramUrl: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
      linkedinUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    }
  }, [winner, locale, seoMode, theme.customTitle, theme.primaryColor, t])

  const { url: shareUrl, text: shareText, twitterUrl, facebookUrl, whatsappUrl, telegramUrl, linkedinUrl } = shareData

  // Early return MUST happen after all hooks
  if (!showWinnerCeremony || !winner) return null

  const shareNative = async () => {
    if (!navigator.share) return

    setIsSharing(true)
    try {
      let filesArray: File[] = []

      try {
        const ogParams = new URLSearchParams()
        ogParams.set("name", winner.name)

        const dateToUse = extractDateFromVerificationId(winner.verificationId)
        ogParams.set("date", dateToUse.toISOString())
        if (seoMode && seoMode !== 'home') ogParams.set("type", seoMode)
        if (theme.customTitle) ogParams.set("title", theme.customTitle)
        if (theme.primaryColor) ogParams.set("color", theme.primaryColor)

        const imageUrl = `/api/og?${ogParams.toString()}`
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const file = new File([blob], 'certificate.png', { type: 'image/png' })

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          filesArray = [file]
        }
      } catch (e) {
        console.error("Image generation failed, falling back to text share", e)
      }

      await navigator.share({
        files: filesArray.length > 0 ? filesArray : undefined,
        title: t("share_title"),
        text: shareText,
        url: shareUrl,
      })
    } catch {
      // User cancelled
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopy = async (textToCopy: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        // Fallback for browsers without clipboard API
        const textarea = document.createElement('textarea')
        textarea.value = textToCopy
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        const success = document.execCommand('copy')
        document.body.removeChild(textarea)
        if (success) {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }
      }
    } catch (e) {
      console.error("Failed to copy text:", e)
    }
  }

  const copyToClipboard = () => handleCopy(shareUrl)

  const shareInstagram = () => handleCopy(shareText)

  const handleDownload = async () => {
    if (!winner) return

    const ogParams = new URLSearchParams()
    ogParams.set("name", winner.name)

    const dateToUse = extractDateFromVerificationId(winner.verificationId)
    ogParams.set("date", dateToUse.toISOString())

    if (seoMode && seoMode !== 'home') ogParams.set("type", seoMode)
    if (theme.customTitle) ogParams.set("title", theme.customTitle)
    if (theme.primaryColor) ogParams.set("color", theme.primaryColor)

    const imageUrl = `/api/og?${ogParams.toString()}`

    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      const cleanName = winner.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      const dateStr = dateToUse.toISOString().split('T')[0]
      link.download = `Certificate-${cleanName}-${dateStr}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch {
      window.open(imageUrl, '_blank')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ceremony-title"
        aria-describedby="ceremony-winner"
      >
        <motion.div
          className="absolute inset-0 bg-background/98 backdrop-blur-xl"
          initial={false}
          animate={{ opacity: 1 }}
        />

        <ConfettiEffect
          isActive={showWinnerCeremony && theme.showConfetti}
          colors={[theme.primaryColor, theme.secondaryColor, "#FFD700", "#FF6B6B", "#4ECDC4"]}
        />

        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", damping: 15 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring", damping: 10 }}
            className="mb-6"
          >
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                boxShadow: `0 0 80px ${theme.primaryColor}60`,
              }}
            >
              <Trophy className="w-16 h-16 text-background" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
            <Sparkles className="w-5 h-5" style={{ color: theme.primaryColor }} />
            <span id="ceremony-title" className="text-xl uppercase tracking-[0.3em] text-muted-foreground font-medium">{t("winner_label")}</span>
            <Sparkles className="w-5 h-5" style={{ color: theme.primaryColor }} />
          </motion.div>

          <motion.h1
            id="ceremony-winner"
            initial={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.6, type: "spring", damping: 12 }}
            className="text-5xl md:text-7xl font-display font-bold mb-8"
            style={{
              color: theme.primaryColor,
              textShadow: `0 0 60px ${theme.primaryColor}60`,
            }}
          >
            {winner.name}
          </motion.h1>

          {winner.verificationId && (
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-8 flex flex-col items-center gap-2"
            >
              <span className="text-xs uppercase tracking-widest text-muted-foreground">ID Verificable</span>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted/50 cursor-pointer hover:bg-muted transition-colors border-none outline-none"
                onClick={() => handleCopy(winner.verificationId!)}
              >
                <code className="text-sm font-mono text-primary">{winner.verificationId}</code>
                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
              </button>
            </motion.div>
          )}

          <motion.p
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-2xl text-muted-foreground mb-12"
          >
            {t("congratulations")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            {canShareNative ? (
              <Button
                size="lg"
                className="gap-2"
                onClick={shareNative}
                disabled={isSharing}
                style={{
                  backgroundColor: theme.primaryColor,
                  color: theme.backgroundColor,
                }}
              >
                {isSharing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
                {t("share_button")}
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="lg"
                    className="gap-2"
                    style={{
                      backgroundColor: theme.primaryColor,
                      color: theme.backgroundColor,
                    }}
                  >
                    <Share2 className="w-5 h-5" />
                    {t("share_button")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  <DropdownMenuItem onClick={copyToClipboard} className="gap-2 cursor-pointer">
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-green-500">{t("copied")}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        {t("copy_text")}
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                      <Twitter className="w-4 h-4" />
                      Twitter / X
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" onClick={shareInstagram}>
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                    <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                    <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
                      <Send className="w-4 h-4" />
                      Telegram
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              size="lg"
              variant="secondary"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="w-5 h-5" />
              {t("download_certificate")}
            </Button>

            <Button size="lg" variant="outline" onClick={onNewSorteo} className="gap-2 bg-transparent">
              <RotateCcw className="w-5 h-5" />
              {t("new_giveaway")}
            </Button>

            <Button size="lg" variant="ghost" onClick={onClose}>
              {t("close")}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border opacity-20 pointer-events-none"
          style={{ borderColor: theme.primaryColor }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border opacity-10 pointer-events-none"
          style={{ borderColor: theme.primaryColor }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.05, 0.1],
          }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
        />
      </motion.div>
    </AnimatePresence>
  )
}