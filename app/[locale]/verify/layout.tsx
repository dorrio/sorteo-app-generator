import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "VerificationPage" });

  return {
    title: `🛡️ ${t("title")} | Sorteo Pro`,
    description: t("subtitle"),
    openGraph: {
      title: `🛡️ ${t("title")} | Sorteo Pro`,
      description: t("subtitle"),
      type: "website",
      images: [
        {
          url: "/og-verify.jpg", // Ideally we'd have a specific image, but fallback to default if not
          width: 1200,
          height: 630,
          alt: "Sorteo Pro Verification",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `🛡️ ${t("title")} | Sorteo Pro`,
      description: t("subtitle"),
    },
  };
}

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
