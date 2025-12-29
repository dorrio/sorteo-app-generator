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
} from "lucide-react"

interface WinnerCeremonyProps {
  onClose: () => void
  onNewSorteo: () => void
}

export function WinnerCeremony({ onClose, onNewSorteo }: WinnerCeremonyProps) {
  const { winner, theme, showWinnerCeremony } = useSorteoStore()
  const t = useTranslations("WinnerCeremony")
  const [showContent, setShowContent] = useState(false)
  const [copied, setCopied] = useState(false)
  const [canShareNative, setCanShareNative] = useState(false)

  useEffect(() => {
    setCanShareNative(typeof navigator !== "undefined" && !!navigator.share)

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
  const shareUrl = winner.verificationId
    ? `${baseUrl}/${locale}/verify?id=${winner.verificationId}&name=${encodeURIComponent(winner.name)}`
    : typeof window !== "undefined" ? window.location.href : ""

  // Compelling share text
  const shareText = t("share_text", { name: winner.name })

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("share_title"),
          text: shareText,
          url: shareUrl,
        })
      } catch {
        // User cancelled
      }
    }
  }

  const copyToClipboard = async () => {
    // Viralis Optimization: Copy full text + url
    await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareTwitter = () => {
    // Viralis: Append URL to Tweet
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, "_blank", "width=550,height=420")
  }

  const shareFacebook = () => {
    // Viralis: Facebook requires 'u' param for the link
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    window.open(url, "_blank", "width=550,height=420")
  }

  const shareWhatsApp = () => {
    // Viralis: Use api.whatsapp.com for better cross-device support (desktop/mobile)
    // Append URL at the end
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`
    window.open(url, "_blank")
  }

  const shareInstagram = async () => {
    await navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    window.open("https://www.instagram.com/", "_blank")
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
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
            <span className="text-xl uppercase tracking-[0.3em] text-muted-foreground font-medium">{t("winner_label")}</span>
            <Sparkles className="w-5 h-5" style={{ color: theme.primaryColor }} />
          </motion.div>

          {/* Winner name */}
          <motion.h1
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
            {canShareNative ? (
              <Button
                size="lg"
                className="gap-2"
                onClick={shareNative}
                style={{
                  backgroundColor: theme.primaryColor,
                  color: theme.backgroundColor,
                }}
              >
                <Share2 className="w-5 h-5" />
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
                  <DropdownMenuItem onClick={shareTwitter} className="gap-2 cursor-pointer">
                    <Twitter className="w-4 h-4" />
                    Twitter / X
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={shareInstagram} className="gap-2 cursor-pointer">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={shareFacebook} className="gap-2 cursor-pointer">
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={shareWhatsApp} className="gap-2 cursor-pointer">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

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
