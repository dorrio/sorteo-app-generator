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
    const { id, name } = await searchParams
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

    const title = winnerName
        ? `🏆 WINNER ANNOUNCEMENT: ${winnerName} | Verified by Sorteo Pro`
        : t("verify_title")

    const description = verificationId
        ? `✅ Official Result for ID: ${verificationId}. Click to verify the winner certificate.`
        : t("verify_description")

    // Generate dynamic OG image URL
    // We append a timestamp to prevent caching if the name changes for some reason,
    // but primarily we need 'name' and 'date'
    const ogParams = new URLSearchParams()
    if (winnerName) ogParams.set("name", winnerName)
    // We could add date here if we had it, but name is the most important "Viral Hook"

    const ogImageUrl = `${baseUrl}/api/og?${ogParams.toString()}`

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: `${baseUrl}/${locale}/verify`,
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
