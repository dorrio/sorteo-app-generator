"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ShieldCheck, ShieldAlert, Calendar, User, X, Check } from "lucide-react"
import { useSorteoStore } from "@/lib/sorteo-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

interface VerificationModalProps {
    isOpen: boolean
    onClose: () => void
}

export function VerificationModal({ isOpen, onClose }: VerificationModalProps) {
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
                    timestamp: foundWinner.timestamp,
                },
            })
        } else {
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
                })
            } catch (e) {
                setResult({
                    valid: false,
                    error: t("result.invalid_format_message"),
                })
            }
        }
    }

    const handleClose = () => {
        setInputId("")
        setResult(null)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent
                className="sm:max-w-md border-0 bg-background/95 backdrop-blur-xl"
                style={{ borderColor: `${theme.primaryColor}20` }}
            >
                <DialogHeader>
                    <div className="mx-auto bg-muted/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-6 h-6" style={{ color: theme.primaryColor }} />
                    </div>
                    <DialogTitle className="text-center text-xl">{t("title")}</DialogTitle>
                    <DialogDescription className="text-center">{t("subtitle")}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <label htmlFor="verification-id" className="text-sm font-medium ml-1">
                            {t("input_label")}
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="verification-id"
                                placeholder={t("input_placeholder")}
                                className="pl-9"
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value.toUpperCase())}
                                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                                aria-invalid={result ? !result.valid : undefined}
                                aria-describedby={result && !result.valid ? "verification-error" : undefined}
                            />
                        </div>
                    </div>

                    <Button
                        className="w-full font-bold"
                        size="lg"
                        onClick={handleVerify}
                        style={{
                            backgroundColor: theme.primaryColor,
                            color: theme.backgroundColor
                        }}
                    >
                        {t("verify_button")}
                    </Button>

                    <AnimatePresence mode="wait">
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <Card className={`border-l-4 ${result.valid ? "border-green-500" : "border-red-500"} bg-muted/30 shadow-none`}>
                                    <CardContent className="pt-4 pb-4">
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-0.5 p-1.5 rounded-full ${result.valid ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                                                {result.valid ? <Check className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className={`font-bold text-sm ${result.valid ? "text-green-500" : "text-red-500"}`}>
                                                    {result.valid ? t("result.valid_title") : t("result.invalid_title")}
                                                </h4>

                                                {result.valid && result.participant && (
                                                    <div className="mt-3 space-y-2">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <User className="w-4 h-4 opacity-50" />
                                                            <span className="font-medium">{result.participant.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Calendar className="w-4 h-4 opacity-50" />
                                                            <span>{new Date(result.participant.timestamp).toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-green-500 mt-2">
                                                            <ShieldCheck className="w-3 h-3" />
                                                            {t("result.local_record")}
                                                        </div>
                                                    </div>
                                                )}

                                                {!result.valid && (
                                                    <p id="verification-error" className="text-muted-foreground text-xs mt-1">
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
                </div>
            </DialogContent>
        </Dialog>
    )
}
