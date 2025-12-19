import { Suspense } from "react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { VerifyContent } from "./verify-content"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "Metadata" })

    // Fallback URL if env is missing
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sorteopro.com"

    return {
        title: t("verify_title"),
        description: t("verify_description"),
        openGraph: {
            title: t("verify_title"),
            description: t("verify_description"),
            url: `${baseUrl}/${locale}/verify`,
            images: [
                {
                    url: `${baseUrl}/og-verify.jpg`,
                    width: 1200,
                    height: 630,
                    alt: "Official Sorteo Pro Verification Result",
                },
                {
                    url: `${baseUrl}/og-image.jpg`, // Fallback
                    width: 1200,
                    height: 630,
                    alt: "Sorteo Pro",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: t("verify_title"),
            description: t("verify_description"),
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
