import { Suspense } from "react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { VerifyContent } from "./verify-content"

type Props = {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { locale } = await params
    const { id, name, type, title: titleParam, color: colorParam } = await searchParams
    const t = await getTranslations({ locale, namespace: "Metadata" })

    // Fallback URL logic:
    // 1. NEXT_PUBLIC_APP_URL (Explicit override)
    // 2. VERCEL_PROJECT_PRODUCTION_URL (Vercel Prod)
    // 3. VERCEL_URL (Vercel Preview - needs https://)
    // 4. Default to sorteopro.com
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sorteopro.com"

    if (!process.env.NEXT_PUBLIC_APP_URL) {
        if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
            baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        } else if (process.env.VERCEL_URL) {
            baseUrl = `https://${process.env.VERCEL_URL}`
        }
    }

    // Viral Optimization: Dynamic Metadata
    const winnerName = typeof name === "string" ? name : null
    const verificationId = typeof id === "string" ? id : null
    const customTitle = typeof titleParam === "string" ? titleParam : null

    // Parse date from verification ID for metadata
    let dateStr: string | null = null
    if (verificationId) {
        try {
            // Format: ID-{UUID}-{TIMESTAMP_HEX}
            const parts = verificationId.split('-')
            if (parts.length >= 3) {
                // The timestamp is always the last part
                const timestampHex = parts[parts.length - 1]
                const timestamp = parseInt(timestampHex, 16)
                const date = new Date(timestamp)
                if (!isNaN(date.getTime())) {
                    dateStr = date.toISOString()
                }
            }
        } catch (e) {
            // Ignore parsing errors for metadata
        }
    }

    let title = t("verify_title")
    if (winnerName) {
        if (customTitle) {
            title = `🏆 ${winnerName} won ${customTitle} | Verified by Sorteo Pro`
        } else {
            title = `🏆 WINNER ANNOUNCEMENT: ${winnerName} | Verified by Sorteo Pro`
        }
    }

    const description = verificationId
        ? `✅ Official Result for ID: ${verificationId}. Click to verify the winner certificate.`
        : t("verify_description")

    // Generate dynamic OG image URL
    // We append a timestamp to prevent caching if the name changes for some reason,
    // but primarily we need 'name' and 'date'
    const ogParams = new URLSearchParams()
    if (winnerName) ogParams.set("name", winnerName)
    if (dateStr) ogParams.set("date", dateStr)
    if (typeof type === "string" && type) ogParams.set("type", type)
    if (customTitle) ogParams.set("title", customTitle)
    if (typeof colorParam === "string" && colorParam) ogParams.set("color", colorParam)

    const ogImageUrl = `${baseUrl}/api/og?${ogParams.toString()}`

    // Viralis Fix: Ensure og:url includes query params to prevent social cache collisions
    // If we don't include params, FB/Twitter will treat all winners as the same page
    const canonicalParams = new URLSearchParams()
    if (verificationId) canonicalParams.set("id", verificationId)
    if (winnerName) canonicalParams.set("name", winnerName)
    const canonicalUrl = `${baseUrl}/${locale}/verify${canonicalParams.toString() ? `?${canonicalParams.toString()}` : ""}`

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: canonicalUrl,
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: winnerName ? `${winnerName} - Official Winner` : "Official Sorteo Pro Verification Result",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: [ogImageUrl], // Twitter also needs the dynamic image
        },
    }
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <VerifyContent />
        </Suspense>
    )
}
