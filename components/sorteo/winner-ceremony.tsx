"use client"

import { useEffect, useState } from "react"
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
} from "lucide-react"

interface WinnerCeremonyProps {
  onClose: () => void
  onNewSorteo: () => void
  seoMode?: string
}

export function WinnerCeremony({ onClose, onNewSorteo, seoMode }: WinnerCeremonyProps) {
  const { winner, theme, showWinnerCeremony } = useSorteoStore()
  const t = useTranslations("WinnerCeremony")
  const [showContent, setShowContent] = useState(false)
  const [copied, setCopied] = useState(false)
  const [canShareNative, setCanShareNative] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  useEffect(() => {
    setCanShareNative(typeof navigator !== "undefined" && !!navigator.share)
    setIsTouch(window.matchMedia("(pointer: coarse)").matches)

    if (showWinnerCeremony) {
      const timer = setTimeout(() => setShowContent(true), 300)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
  }, [showWinnerCeremony])

  const locale = useLocale()

  if (!showWinnerCeremony || !winner) return null

  // Viral Optimization: Create a deep link to the verification page
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  let shareUrl = winner.verificationId
    ? `${baseUrl}/${locale}/verify?id=${winner.verificationId}&name=${encodeURIComponent(winner.name)}`
    : typeof window !== "undefined" ? window.location.href : ""

  // Viralis: Append tool type context to maintain the loop
  if (winner.verificationId && seoMode && seoMode !== 'home') {
      shareUrl += `&type=${seoMode}`
  }

  // Viralis: Append custom context (Title & Color) to make the share more specific
  if (winner.verificationId && theme.customTitle) {
      shareUrl += `&title=${encodeURIComponent(theme.customTitle)}`
  }
  if (winner.verificationId && theme.primaryColor) {
      shareUrl += `&color=${encodeURIComponent(theme.primaryColor)}`
  }

  // Compelling share text
  let shareText = t("share_text", { name: winner.name })
  if (theme.customTitle) {
      shareText = t("share_text_custom", { name: winner.name, title: theme.customTitle })
  }

  // Pre-calculate Social URLs for SEO (Link Juice) & Accessibility
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
  // Facebook requires 'u' param
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
  // WhatsApp: Use api.whatsapp.com for better cross-device support
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`

  const shareNative = async () => {
    if (!navigator.share) return

    setIsSharing(true)
    try {
      // Viralis: Attempt to fetch the certificate image to share it natively
      // This increases social engagement by sharing an image instead of just text
      let filesArray: File[] = []

      try {
        // Reuse OG params logic (simplified)
        const ogParams = new URLSearchParams()
        if (winner) ogParams.set("name", winner.name)

        let dateToUse = new Date()
        if (winner && winner.verificationId) {
             try {
                const parts = winner.verificationId.split('-')
                if (parts.length >= 3) {
                  const timestampHex = parts[parts.length - 1]
                  const timestamp = parseInt(timestampHex, 16)
                  const d = new Date(timestamp)
                  if (!isNaN(d.getTime())) dateToUse = d
                }
             } catch (e) {}
        }
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

  const copyToClipboard = async () => {
    // Viralis Optimization: Copy full text + url
    await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareInstagram = async () => {
    await navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async () => {
    if (!winner) return

    // Construct OG Image URL
    const ogParams = new URLSearchParams()
    ogParams.set("name", winner.name)

    // Logic to extract date from ID or use current
    // Verification ID: ID-{UUID}-{TIMESTAMP_HEX}
    let dateToUse = new Date()
    if (winner.verificationId) {
      try {
        const parts = winner.verificationId.split('-')
        if (parts.length >= 3) {
          const timestampHex = parts[parts.length - 1]
          const timestamp = parseInt(timestampHex, 16)
          const d = new Date(timestamp)
          if (!isNaN(d.getTime())) {
            dateToUse = d
          }
        }
      } catch (e) {
        // fallback to current
      }
    }
    ogParams.set("date", dateToUse.toISOString())

    // Viralis: Apply branding context to the image
    if (seoMode && seoMode !== 'home') {
      ogParams.set("type", seoMode)
    }
    if (theme.customTitle) {
      ogParams.set("title", theme.customTitle)
    }
    if (theme.primaryColor) {
      ogParams.set("color", theme.primaryColor)
    }

    const imageUrl = `/api/og?${ogParams.toString()}`

    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      // Filename: Certificate-{Name}-{Date}.png
      const cleanName = winner.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      const dateStr = dateToUse.toISOString().split('T')[0]
      link.download = `Certificate-${cleanName}-${dateStr}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (e) {
      // Fallback: just open in new tab
      window.open(imageUrl, '_blank')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ceremony-title"
        aria-describedby="ceremony-winner"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-background/98 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Confetti */}
        <ConfettiEffect
          isActive={showWinnerCeremony && theme.showConfetti}
          colors={[theme.primaryColor, theme.secondaryColor, "#FFD700", "#FF6B6B", "#4ECDC4"]}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", damping: 15 }}
        >
          {/* Trophy icon */}
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

          {/* Winner label */}
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

          {/* Winner name */}
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

          {/* Verification ID */}
          {winner.verificationId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-8 flex flex-col items-center gap-2"
            >
              <span className="text-xs uppercase tracking-widest text-muted-foreground">ID Verificable</span>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted/50 cursor-pointer hover:bg-muted transition-colors border-none outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => {
                  navigator.clipboard.writeText(winner.verificationId!)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                aria-label={t("copy_text") + " " + winner.verificationId}
              >
                <code className="text-sm font-mono text-primary">{winner.verificationId}</code>
                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
              </button>
            </motion.div>
          )}

          {/* Celebration text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-2xl text-muted-foreground mb-12"
          >
            {t("congratulations")}
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            {/* Primary Share Action - Viralis Smart Share: Only prioritize native on touch devices */}
            {canShareNative && isTouch ? (
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
                    disabled={isSharing}
                    style={{
                      backgroundColor: theme.primaryColor,
                      color: theme.backgroundColor,
                    }}
                  >
                    {isSharing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
                    {t("share_button")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  {/* System Share Option for Desktop Safari/Edge */}
                  {canShareNative && (
                    <DropdownMenuItem onClick={shareNative} className="gap-2 cursor-pointer font-medium">
                      <Share2 className="w-4 h-4" />
                      {t("share_button")}
                    </DropdownMenuItem>
                  )}

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

                  {/* Semantic Fix: Real links for bots and users */}
                  <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
                      <Twitter className="w-4 h-4" />
                      Twitter / X
                    </a>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                    <a
                      href="https://www.instagram.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={shareInstagram}
                      aria-label="Share on Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
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

                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Viralis: Exposed Download Certificate Button (Visible on Mobile & Desktop) */}
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

        {/* Animated rings */}
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
