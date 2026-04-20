import { getTranslations } from "next-intl/server"
import { getBaseUrl } from "@/lib/config"
import { routing } from "@/i18n/routing"
import { safeJsonLdStringify } from "@/lib/utils"
import dynamic from 'next/dynamic'
import { AppSkeleton } from "@/components/sorteo/skeletons"

const MainApp = dynamic(
  () => import("@/components/sorteo/main-app").then((mod) => mod.MainApp),
  { loading: () => <AppSkeleton />, ssr: false }
)

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TruthPage' });
  const baseUrl = getBaseUrl();

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/truth-or-dare-generator`
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}/truth-or-dare-generator`,
    }
  };
}

export default async function TruthOrDarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // We fetch translations server-side for metadata and initial render
  const t = await getTranslations({ locale, namespace: 'TruthPage' });
  const tShare = await getTranslations({ locale, namespace: 'ShareContent' });
  const tWinner = await getTranslations({ locale, namespace: 'WinnerCeremony' });

  // Schema: SoftwareApplication
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: t("title"),
    description: t("description"),
    applicationCategory: 'EntertainmentApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };

  // Pre-fetch all 20 truths and 20 dares from the dictionary to pass down to Client Island
  // The generator uses keys truth_0 through truth_19 and dare_0 through dare_19
  const truths = Array.from({ length: 20 }, (_, i) => t(`truth_${i}`));
  const dares = Array.from({ length: 20 }, (_, i) => t(`dare_${i}`));

  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is safe and necessary for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(schema) }}
      />
      <MainApp
        initialStyle="cards"
        seoMode="truth-or-dare"
        initialTitle={t("h1")}
        initialSubtitle={t("subtitle")}
        shareTitle={tShare("truth_title")}
        shareText={tShare("truth_text")}
        customShareTextTemplate={tShare("custom_share_text", { title: "{title}" })}
        shareTranslations={{
          share: tWinner('share_menu'),
          copy: tWinner('copy_text'),
          copied: tWinner('copied'),
          shareOn: tWinner('share_on')
        }}
        initialOptions={{
          truths: JSON.stringify(truths),
          dares: JSON.stringify(dares)
        }}
      />
    </>
  );
}