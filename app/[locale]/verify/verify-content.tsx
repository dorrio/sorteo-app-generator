"use client"

import { useState, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ShieldCheck, ShieldAlert, Calendar, User, ArrowLeft, Check, AlertTriangle, Sparkles, Share2, Twitter, Facebook, MessageCircle, Instagram, Copy, Download } from "lucide-react"
import { useSorteoStore } from "@/lib/sorteo-store"
import { ConfettiEffect } from "@/components/sorteo/confetti-effect"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"

export function VerifyContent() {
    const t = useTranslations("VerificationPage")
    const locale = useLocale()
    const { theme, pastWinners } = useSorteoStore()
    const searchParams = useSearchParams()
    const initialId = searchParams.get("id") || ""
    const type = searchParams.get("type")

    const [inputId, setInputId] = useState(initialId)
    const [result, setResult] = useState<{
        status: "valid" | "partial" | "invalid"
        participant?: { name: string; timestamp: Date }
        date?: Date
        error?: string
    } | null>(null)
    const [showCopied, setShowCopied] = useState(false)
    // Initialize to true (Mobile/Lite) to minimize server HTML size and avoid Mobile CLS.
    // Desktop will hydrate and switch to Dropdown (Heavy) if needed.
    const [canShareNative, setCanShareNative] = useState(true)
    const [isStickyVisible, setIsStickyVisible] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)

    useEffect(() => {
        if (result?.status === "valid") {
            setShowConfetti(true)
            const timer = setTimeout(() => setShowConfetti(false), 5000)
            return () => clearTimeout(timer)
        }
    }, [result])

    useEffect(() => {
        setCanShareNative(typeof navigator !== "undefined" && !!navigator.share)

        // Show sticky CTA on scroll if result is visible
        const handleScroll = () => {
            if (result && window.scrollY > 150) {
                setIsStickyVisible(true)
            } else {
                setIsStickyVisible(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [result])

    // Auto-verify if ID is in URL
    useEffect(() => {
        if (initialId) {
             verifyId(initialId)
        }
    }, [initialId, pastWinners])

    const verifyId = (idToVerify: string) => {
        const id = idToVerify.trim().toUpperCase()
        if (!id) return

        // Format: ID-{UUID}-{TIMESTAMP_HEX}
        const idRegex = /^ID-[A-F0-9]{8}-[A-F0-9]+$/

        if (!idRegex.test(id)) {
            setResult({
                status: "invalid",
                error: t("result.invalid_format_message"),
            })
            return
        }

        // Check local storage for match
        const foundWinner = pastWinners.find((w) => w.verificationId === id)

        if (foundWinner) {
            setResult({
                status: "valid",
                participant: {
                    name: foundWinner.name,
                    timestamp: foundWinner.timestamp,
                },
            })
        } else {
            // Partial Verification Logic
            try {
                const parts = id.split('-')
                const timestampHex = parts[2]
                const timestamp = parseInt(timestampHex, 16)
                const date = new Date(timestamp)

                if (isNaN(date.getTime())) {
                    throw new Error("Invalid date")
                }

                setResult({
                    status: "partial",
                    date: date,
                })
            } catch (e) {
                setResult({
                    status: "invalid",
                    error: t("result.invalid_format_message"),
                })
            }
        }
    }

    const handleVerify = () => verifyId(inputId)

    // Construct Share Data
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sorteopro.com"
    const winnerName = result?.participant?.name || searchParams.get("name") || "Someone"
    // Use inputId as the verified ID source when result is present
    let shareUrl = `${baseUrl}/${locale}/verify?id=${inputId}&name=${encodeURIComponent(winnerName)}`

    // Viralis Fix: Persist tool context in shared link
    if (type) {
        shareUrl += `&type=${encodeURIComponent(type)}`
    }

    const shareText = t("share_proof_text", { name: winnerName })

    // Pre-calculate intent URLs for semantic <a> tags
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`

    const shareNative = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: t("title"),
                    text: shareText,
                    url: shareUrl,
                })
            } catch {
                // User cancelled
            }
        }
    }

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        setShowCopied(true)
        setTimeout(() => setShowCopied(false), 2000)
    }

    const shareInstagram = async () => {
        await navigator.clipboard.writeText(shareText)
        setShowCopied(true)
        setTimeout(() => setShowCopied(false), 2000)
        window.open("https://www.instagram.com/", "_blank")
    }

    const handleDownload = async () => {
        if (!winnerName) return

        // Construct OG Image URL
        const ogParams = new URLSearchParams()
        ogParams.set("name", winnerName)

        // Logic to extract date from result
        let dateToUse = new Date()
        if (result?.participant?.timestamp) {
            dateToUse = new Date(result.participant.timestamp)
        } else if (result?.date) {
            dateToUse = new Date(result.date)
        }
        ogParams.set("date", dateToUse.toISOString())

        const imageUrl = `/api/og?${ogParams.toString()}`

        try {
            const response = await fetch(imageUrl)
            const blob = await response.blob()
            const blobUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = blobUrl
            // Filename: Certificate-{Name}-{Date}.png
            const cleanName = winnerName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
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

    // Viralis: Dynamic return URL to close the viral loop contextually
    let returnUrl = "/"
    if (type === 'wheel') returnUrl = "/wheel-of-names"
    else if (type === 'instagram') returnUrl = "/instagram-comment-picker"
    else if (type === 'rng') returnUrl = "/random-number-generator"
    else if (type === 'list-randomizer') returnUrl = "/list-randomizer"
    else if (type === 'yes-no') returnUrl = "/yes-or-no-wheel"
    else if (type === 'letter') returnUrl = "/random-letter-generator"

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 pb-24 relative overflow-hidden"
            style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                fontFamily: theme.fontFamily,
            }}
        >
            {/* Background Ambience */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${theme.primaryColor}20 0%, transparent 70%)`,
                }}
            />

            <ConfettiEffect
                isActive={showConfetti}
                colors={[theme.primaryColor, theme.secondaryColor, "#FFD700", "#FF6B6B", "#4ECDC4"]}
            />

            <div className="w-full max-w-md z-10">
                <Button variant="ghost" className="mb-8 hover:bg-white/10" style={{ color: theme.textColor }} asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t("back_button")}
                    </Link>
                </Button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="border-0 shadow-2xl backdrop-blur-md bg-opacity-90 dark:bg-opacity-90" style={{ backgroundColor: `${theme.backgroundColor}90`, borderColor: `${theme.primaryColor}40`, borderWidth: 1 }}>
                        <CardHeader className="text-center pb-2">
                            <div
                                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                                style={{ backgroundColor: `${theme.primaryColor}20` }}
                            >
                                <ShieldCheck className="w-8 h-8" style={{ color: theme.primaryColor }} />
                            </div>
                            <CardTitle className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                                {t("title")}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                {t("subtitle")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1" style={{ color: theme.textColor }}>
                                    {t("input_label")}
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder={t("input_placeholder")}
                                        className="pl-9 bg-background/50 border-input/50 focus-visible:ring-1"
                                        value={inputId}
                                        onChange={(e) => setInputId(e.target.value.toUpperCase())}
                                        style={{ borderColor: `${theme.primaryColor}40` }}
                                    />
                                </div>
                            </div>
                            <Button
                                className="w-full font-bold shadow-lg transition-all hover:scale-[1.02]"
                                size="lg"
                                onClick={handleVerify}
                                style={{
                                    backgroundColor: theme.primaryColor,
                                    color: theme.backgroundColor,
                                    boxShadow: `0 4px 20px ${theme.primaryColor}40`
                                }}
                            >
                                {t("verify_button")}
                            </Button>
                        </CardContent>
                    </Card>

                    <AnimatePresence mode="wait">
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6"
                            >
                                <Card className={`border-l-4 ${
                                    result.status === "valid" ? "border-green-500" :
                                    result.status === "partial" ? "border-yellow-500" : "border-red-500"
                                } bg-card/95 backdrop-blur shadow-xl`}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-full ${
                                                result.status === "valid" ? "bg-green-500/20 text-green-500" :
                                                result.status === "partial" ? "bg-yellow-500/20 text-yellow-500" : "bg-red-500/20 text-red-500"
                                            }`}>
                                                {result.status === "valid" ? <Check className="w-6 h-6" /> :
                                                 result.status === "partial" ? <ShieldCheck className="w-6 h-6" /> :
                                                 <ShieldAlert className="w-6 h-6" />}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className={`font-bold text-lg ${
                                                    result.status === "valid" ? "text-green-500" :
                                                    result.status === "partial" ? "text-yellow-500" : "text-red-500"
                                                }`}>
                                                    {result.status === "valid" ? t("result.valid_title") :
                                                     result.status === "partial" ? "Valid Format (External)" :
                                                     t("result.invalid_title")}
                                                </h4>

                                                {/* FULL MATCH */}
                                                {result.status === "valid" && result.participant && (
                                                    <div className="mt-4 space-y-3">
                                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                                            <User className="w-5 h-5 opacity-70" />
                                                            <div>
                                                                <p className="text-xs text-muted-foreground uppercase">{t("result.winner_label")}</p>
                                                                <p className="font-medium text-lg">{result.participant.name}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                                            <Calendar className="w-5 h-5 opacity-70" />
                                                            <div>
                                                                <p className="text-xs text-muted-foreground uppercase">{t("result.date_label")}</p>
                                                                <p className="font-medium">
                                                                    {new Date(result.participant.timestamp).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-green-500 mt-2">
                                                            <ShieldCheck className="w-3 h-3" />
                                                            {t("result.local_record")}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* PARTIAL MATCH */}
                                                {result.status === "partial" && result.date && (
                                                    <div className="mt-4 space-y-3">
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            This ID has a valid format and was generated on:
                                                        </p>
                                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                                            <Calendar className="w-5 h-5 text-yellow-500" />
                                                            <div>
                                                                <p className="text-xs text-muted-foreground uppercase">{t("result.date_label")}</p>
                                                                <p className="font-medium text-yellow-500">
                                                                    {result.date.toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-2 text-xs text-muted-foreground mt-2 bg-muted/50 p-2 rounded">
                                                            <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                                                            <span>Winner details are only available on the device that ran the giveaway.</span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* INVALID */}
                                                {result.status === "invalid" && (
                                                    <p className="text-muted-foreground text-sm mt-2">
                                                        {result.error}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* VIRAL LOOP CTA - MAIN */}
                                        {(result.status === "valid" || result.status === "partial") && (
                                            <div className="mt-6 pt-4 border-t border-border/50 space-y-3">
                                                <div className="flex gap-2">
                                                    {canShareNative ? (
                                                        <Button
                                                            className="flex-1 gap-2 font-bold"
                                                            size="lg"
                                                            variant="outline"
                                                            onClick={shareNative}
                                                            style={{
                                                                borderColor: theme.primaryColor,
                                                                color: theme.primaryColor
                                                            }}
                                                        >
                                                            <Share2 className="w-4 h-4" />
                                                            {t("share_button")}
                                                        </Button>
                                                    ) : (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    className="flex-1 gap-2 font-bold"
                                                                    size="lg"
                                                                    variant="outline"
                                                                    style={{
                                                                        borderColor: theme.primaryColor,
                                                                        color: theme.primaryColor
                                                                    }}
                                                                >
                                                                    <Share2 className="w-4 h-4" />
                                                                    {t("share_button")}
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="center" className="w-56">
                                                            <DropdownMenuItem onClick={copyToClipboard} className="gap-2 cursor-pointer">
                                                                {showCopied ? (
                                                                    <>
                                                                        <Check className="w-4 h-4 text-green-500" />
                                                                        <span className="text-green-500">{t("result.copied")}</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Copy className="w-4 h-4" />
                                                                        Copy Link
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>

                                                            {/* Semantic Links for Social Sharing */}
                                                            <DropdownMenuItem asChild>
                                                                <a
                                                                    href={twitterUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="gap-2 cursor-pointer flex w-full items-center"
                                                                    aria-label="Share on Twitter"
                                                                >
                                                                    <Twitter className="w-4 h-4" />
                                                                    Twitter / X
                                                                </a>
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem onClick={shareInstagram} className="gap-2 cursor-pointer">
                                                                <Instagram className="w-4 h-4" />
                                                                Instagram
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem asChild>
                                                                <a
                                                                    href={facebookUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="gap-2 cursor-pointer flex w-full items-center"
                                                                    aria-label="Share on Facebook"
                                                                >
                                                                    <Facebook className="w-4 h-4" />
                                                                    Facebook
                                                                </a>
                                                            </DropdownMenuItem>

                                                                <DropdownMenuItem asChild>
                                                                    <a
                                                                        href={whatsappUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="gap-2 cursor-pointer flex w-full items-center"
                                                                        aria-label="Share on WhatsApp"
                                                                    >
                                                                        <MessageCircle className="w-4 h-4" />
                                                                        WhatsApp
                                                                    </a>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}

                                                    {/* Download Certificate Button */}
                                                    <Button
                                                        className="flex-1 gap-2 font-bold"
                                                        size="lg"
                                                        variant="outline"
                                                        onClick={handleDownload}
                                                        style={{
                                                            borderColor: theme.primaryColor,
                                                            color: theme.primaryColor
                                                        }}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        {t("download_certificate")}
                                                    </Button>
                                                </div>

                                                <Button
                                                    asChild
                                                    className="w-full gap-2 font-bold shadow-lg hover:scale-[1.02] transition-transform animate-pulse"
                                                    size="lg"
                                                    style={{
                                                        backgroundColor: theme.primaryColor,
                                                        color: theme.backgroundColor,
                                                        boxShadow: `0 4px 15px ${theme.primaryColor}30`
                                                    }}
                                                >
                                                    <Link href={returnUrl}>
                                                        <Sparkles className="w-4 h-4" />
                                                        {t("create_your_own")}
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Viralis: Sticky CTA for Mobile */}
            <AnimatePresence>
                {isStickyVisible && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border z-50 flex gap-2 shadow-2xl"
                        style={{ borderTopColor: `${theme.primaryColor}40` }}
                    >
                        {canShareNative && (
                            <Button
                                className="flex-1 font-bold shadow-lg"
                                size="lg"
                                variant="outline"
                                onClick={shareNative}
                                style={{
                                    borderColor: theme.primaryColor,
                                    color: theme.primaryColor
                                }}
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                {t("share_button")}
                            </Button>
                        )}

                        <Button
                            asChild
                            className="flex-[2] font-bold shadow-lg"
                            size="lg"
                            style={{
                                backgroundColor: theme.primaryColor,
                                color: theme.backgroundColor
                            }}
                        >
                            <Link href={returnUrl}>
                                <Sparkles className="w-4 h-4 mr-2" />
                                {t("create_your_own")}
                            </Link>
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
