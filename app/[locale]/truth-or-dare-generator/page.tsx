import { getTranslations } from "next-intl/server";
import { MainApp } from "@/components/sorteo/main-app";
import { TruthDareGeo } from "@/components/sorteo/truth-dare-geo";
import { Glossary } from "@/components/sorteo/glossary";
import { SiteFooter } from "@/components/sorteo/site-footer";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "TruthDarePage" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sorteo-app-generator.vercel.app";
  const canonicalUrl = `${baseUrl}/${locale}/truth-or-dare-generator`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonicalUrl,
      type: "website",
    },
  };
}

export default async function TruthDareGeneratorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "TruthDarePage" });
  const tShare = await getTranslations({ locale, namespace: "ShareContent" });
  const tWinner = await getTranslations({ locale, namespace: "WinnerCeremony" });

  const truths = Array.from({ length: 10 }, (_, i) => t(`truth_${i}`));
  const dares = Array.from({ length: 10 }, (_, i) => t(`dare_${i}`));

  const shareTranslations = {
    share: tWinner("share_menu"),
    copy: tWinner("copy_text"),
    copied: tWinner("copied"),
    shareOn: tWinner("share_on"),
  };

  const stickyTranslations = {
    share_cta: tShare("cta_share"),
    start_cta: tShare("cta_start"),
  };

  return (
    <MainApp
      seoMode="truth-dare"
      initialTitle={t("h1")}
      initialSubtitle={t("subtitle")}
      shareTitle={t("title")}
      shareText={t("description")} // Using description as share text base
      customShareTextTemplate={tShare("custom_share_text")}
      shareTranslations={shareTranslations}
      stickyTranslations={stickyTranslations}
      initialOptions={{
        truths,
        dares
      }}
      footer={<SiteFooter />}
    >
      <TruthDareGeo />
      <Glossary seoMode="truth-dare" />
    </MainApp>
  );
}
