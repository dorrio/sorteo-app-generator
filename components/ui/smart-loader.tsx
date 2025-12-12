"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface SmartLoaderProps {
    message?: string
    fallbackMessage?: string
    estimatedTime?: number // in ms, default 3000
    className?: string
}

export function SmartLoader({
    message = "Loading application...",
    fallbackMessage = "This is taking a bit longer than usual...",
    estimatedTime = 3000,
    className
}: SmartLoaderProps) {
    const [showFallback, setShowFallback] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        // Progress simulation
        const startTime = Date.now()
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime
            const percentage = Math.min((elapsed / estimatedTime) * 100, 95) // Cap at 95% until done
            setProgress(percentage)

            if (elapsed > estimatedTime && !showFallback) {
                setShowFallback(true)
            }
        }, 100)

        return () => clearInterval(interval)
    }, [estimatedTime, showFallback])

    return (
        <div className={cn("flex flex-col items-center justify-center p-8 space-y-6 max-w-sm mx-auto text-center", className)}>
            <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5"
                >
                    <Clock className="w-5 h-5 text-muted-foreground" />
                </motion.div>
            </div>

            <div className="space-y-2 w-full">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={showFallback ? "fallback" : "primary"}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-lg font-medium text-foreground"
                    >
                        {showFallback ? fallbackMessage : message}
                    </motion.p>
                </AnimatePresence>

                <div className="w-full space-y-1">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">
                        {Math.round(progress)}%
                    </p>
                </div>
            </div>
        </div>
    )
}
