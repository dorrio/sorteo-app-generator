"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ShieldCheck, ShieldAlert, Calendar, User, ArrowLeft, Check } from "lucide-react"
import { useSorteoStore } from "@/lib/sorteo-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

export default function VerifyPage() {
    const t = useTranslations("VerificationPage")
    const { theme, pastWinners } = useSorteoStore()
    const [inputId, setInputId] = useState("")
    const [result, setResult] = useState<{
        valid: boolean
        participant?: { name: string; timestamp: Date }
        error?: string
    } | null>(null)

    const handleVerify = () => {
        if (!inputId.trim()) return

        // Format: ID-{UUID}-{TIMESTAMP_HEX}
        // Regex to basic check format 
        const idRegex = /^ID-[A-F0-9]{8}-[A-F0-9]+$/

        if (!idRegex.test(inputId.trim().toUpperCase())) {
            setResult({
                valid: false,
                error: t("result.invalid_format_message"),
            })
            return
        }

        // Check local storage for match
        const foundWinner = pastWinners.find((w) => w.verificationId === inputId.trim().toUpperCase())

        if (foundWinner) {
            setResult({
                valid: true,
                participant: {
                    name: foundWinner.name,
                    timestamp: foundWinner.timestamp, // In real scenario we might decode from ID too
                },
            })
        } else {
            // Since we only have client-side storage, if not found here, we can't verify it fully.
            // We can decode the timestamp from the ID as a partial verification.
            try {
                const parts = inputId.trim().split('-')
                const timestampHex = parts[2]
                const timestamp = parseInt(timestampHex, 16)
                const date = new Date(timestamp)

                if (isNaN(date.getTime())) {
                    throw new Error("Invalid date")
                }

                setResult({
                    valid: false,
                    error: t("result.not_found_message"),
                    // We could show "Format Valid" but "Record Not Found"
                })
            } catch (e) {
                setResult({
                    valid: false,
                    error: t("result.invalid_format_message"),
                })
            }
        }
    }

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
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

            <div className="w-full max-w-md z-10">
                <Link href="/">
                    <Button variant="ghost" className="mb-8 hover:bg-white/10" style={{ color: theme.textColor }}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t("back_button")}
                    </Button>
                </Link>

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
                                <Card className={`border-l-4 ${result.valid ? "border-green-500" : "border-red-500"} bg-card/95 backdrop-blur shadow-xl`}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-full ${result.valid ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                                                {result.valid ? <Check className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className={`font-bold text-lg ${result.valid ? "text-green-500" : "text-red-500"}`}>
                                                    {result.valid ? t("result.valid_title") : t("result.invalid_title")}
                                                </h4>

                                                {result.valid && result.participant && (
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
                                                            {t("result.valid_format")}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-green-500">
                                                            <ShieldCheck className="w-3 h-3" />
                                                            {t("result.local_record")}
                                                        </div>
                                                    </div>
                                                )}

                                                {!result.valid && (
                                                    <p className="text-muted-foreground text-sm mt-2">
                                                        {result.error}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    )
}
