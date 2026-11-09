import { getBaseUrl } from "@/lib/config";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { AppSkeleton } from "@/components/sorteo/skeletons";
import { PasswordGeo } from "@/components/sorteo/password-geo";
import { Glossary } from "@/components/sorteo/glossary";
import { SiteFooter } from "@/components/sorteo/site-footer";
import { JsonLd } from "@/components/seo/json-ld";

const MainApp = dynamic(
  () => import("@/components/sorteo/main-app").then((mod) => mod.MainApp),
  { loading: () => <AppSkeleton visualization="slot-machine" /> },
);

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params;
  const { template_title, template_color } = await searchParams;
  const t = await getTranslations({ locale, namespace: "PasswordGenerator" });

  const baseUrl = getBaseUrl();
  const customTitle =
    typeof template_title === "string" ? template_title : undefined;
  const customColor =
    typeof template_color === "string" ? template_color : undefined;

  const displayTitle = customTitle ? `${customTitle} | Sorteo Pro` : t("title");
  const displayDescription = t("description");

  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  ogImageUrl.searchParams.set("type", "password");
  if (customTitle) ogImageUrl.searchParams.set("title", customTitle);
  if (customColor) ogImageUrl.searchParams.set("color", customColor);

  const shareUrl = new URL(`${baseUrl}/${locale}/random-password-generator`);
  if (customTitle) shareUrl.searchParams.set("template_title", customTitle);
  if (customColor) shareUrl.searchParams.set("template_color", customColor);

  const canonicalUrl =
    customTitle || customColor
      ? `/${locale}/random-password-generator?${shareUrl.searchParams.toString()}`
      : `/${locale}/random-password-generator`;

  return {
    title: displayTitle,
    description: displayDescription,
    keywords: [
      "random password generator",
      "secure password",
      "password generator",
      "generador de contraseñas",
      "gerador de senhas",
      "strong password",
      "cryptographically secure",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `/en/random-password-generator`,
        es: `/es/random-password-generator`,
        pt: `/pt/random-password-generator`,
      },
    },
    openGraph: {
      title: displayTitle,
      description: displayDescription,
      url: shareUrl.toString(),
      type: "website",
      siteName: "Sorteo Pro",
      locale: locale === "es" ? "es_ES" : locale === "pt" ? "pt_PT" : "en_US",
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: displayTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description: displayDescription,
      images: [ogImageUrl.toString()],
    },
  };
}

export default async function PasswordGeneratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "PasswordGenerator" });
  const tSorteoSeo = await getTranslations({ locale, namespace: "SorteoSeo" });
  const tShare = await getTranslations({ locale, namespace: "ShareContent" });
  const tWinner = await getTranslations({
    locale,
    namespace: "WinnerCeremony",
  });

  const baseUrl = getBaseUrl();
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Random Password Generator by Sorteo Pro",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web, iOS, Android",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: t("description"),
    featureList: [
      t("feature_1_title"),
      t("feature_2_title"),
      t("feature_3_title"),
    ],
    about: {
      "@type": "Thing",
      name: tSorteoSeo("about.name"),
      description: tSorteoSeo("about.description"),
    },
    mentions: [
      {
        "@type": "Thing",
        name: tSorteoSeo("mentions.randomNumber.name"),
        sameAs: "https://en.wikipedia.org/wiki/Random_number_generation",
      },
      {
        "@type": "Thing",
        name: tSorteoSeo("mentions.socialMedia.name"),
      },
    ],
    sameAs: ["https://github.com/sorteopro", "https://twitter.com/sorteopro"],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Sorteo Pro",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("h1"),
        item: `${baseUrl}/${locale}/random-password-generator`,
      },
    ],
  };

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
    <>
      <JsonLd data={[softwareAppSchema, breadcrumbSchema]} />
      <MainApp
        initialStyle="slot-machine"
        seoMode="password"
        initialTitle={t("h1")}
        initialSubtitle={t("subtitle")}
        shareTitle={tShare("password_title")}
        shareText={tShare("password_text")}
        customShareTextTemplate={tShare("custom_share_text", {
          title: "{title}",
        })}
        shareTranslations={shareTranslations}
        stickyTranslations={stickyTranslations}
        footer={<SiteFooter />}
      >
        <PasswordGeo />
        <Glossary seoMode="password" />
      </MainApp>
    </>
  );
}
