import { Suspense } from "react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { getBaseUrl } from "@/lib/config"
import { VerifyContent } from "./verify-content"

type Props = {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { locale } = await params
    const { id, name, type, title: titleParam, color: colorParam } = await searchParams
    const t = await getTranslations({ locale, namespace: "Metadata" })

    const baseUrl = getBaseUrl()

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
        } catch {
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

    // Viralis: og:url keeps the query params so FB/Twitter cache a distinct
    // preview per winner instead of collapsing every verification to one card.
    // The search-engine canonical (below) stays bare so Google indexes one
    // verify page instead of treating each winner as a new URL.
    const ogParamsUrl = new URLSearchParams()
    if (verificationId) ogParamsUrl.set("id", verificationId)
    if (winnerName) ogParamsUrl.set("name", winnerName)
    if (typeof type === "string" && type) ogParamsUrl.set("type", type)
    if (customTitle) ogParamsUrl.set("title", customTitle)
    if (typeof colorParam === "string" && colorParam) ogParamsUrl.set("color", colorParam)

    const ogUrl = `${baseUrl}/${locale}/verify${ogParamsUrl.toString() ? `?${ogParamsUrl.toString()}` : ""}`

    return {
        title: title,
        description: description,
        alternates: {
            canonical: `/${locale}/verify`,
            languages: {
                en: `/en/verify`,
                es: `/es/verify`,
                pt: `/pt/verify`,
            },
        },
        openGraph: {
            title: title,
            description: description,
            url: ogUrl,
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
