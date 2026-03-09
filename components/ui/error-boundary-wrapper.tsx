"use client"

import { ErrorBoundary, type FallbackProps } from "react-error-boundary"
import { RefreshCw, AlertTriangle } from "lucide-react"

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div
            role="alert"
            className="flex flex-col items-center justify-center min-h-[50vh] gap-6 px-4 text-center"
        >
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>

            <div className="space-y-2 max-w-sm">
                <h2 className="text-xl font-bold text-foreground">
                    Something went wrong
                </h2>
                <p className="text-sm text-muted-foreground">
                    An unexpected error occurred. Your data is safe — you can try refreshing the page.
                </p>
                {process.env.NODE_ENV === "development" && (
                    <details className="mt-4 text-left text-xs text-muted-foreground bg-muted rounded p-3">
                        <summary className="cursor-pointer font-medium mb-1">Error details</summary>
                        <pre className="whitespace-pre-wrap break-words">{error.message}</pre>
                    </details>
                )}
            </div>

            <button
                onClick={resetErrorBoundary}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
                <RefreshCw className="w-4 h-4" />
                Try again
            </button>
        </div>
    )
}

interface ErrorBoundaryWrapperProps {
    children: React.ReactNode
}

/**
 * SSR-safe error boundary wrapper.
 * Catches runtime errors in the component tree and shows a friendly fallback
 * instead of a blank white screen.
 *
 * Usage: wrap any subtree that could throw at runtime.
 */
export function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error, info) => {
                // In production, forward to monitoring (Sentry / Vercel) here.
                // For now, log to console in dev only.
                if (process.env.NODE_ENV === "development") {
                    console.error("[ErrorBoundary] caught:", error, info)
                }
            }}
        >
            {children}
        </ErrorBoundary>
    )
}
