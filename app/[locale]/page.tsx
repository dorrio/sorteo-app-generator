import { getBaseUrl } from "@/lib/config"
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { safeJsonLdStringify } from '@/lib/utils';
import { AppSkeleton } from "@/components/sorteo/skeletons";
import { WheelGeo } from "@/components/sorteo/wheel-geo";
import { Glossary } from "@/components/sorteo/glossary";
import { SeoContent } from "@/components/sorteo/seo-content";
import { SiteFooter } from "@/components/sorteo/site-footer";

const MainApp = dynamic(
  () => import("@/components/sorteo/main-app").then((mod) => mod.MainApp),
  { loading: () => <AppSkeleton /> }
)

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params;
  const { template_title, template_color, list } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  const baseUrl = getBaseUrl()
  // Viralis: Dynamic Metadata for Custom Giveaways
  const customTitle = typeof template_title === 'string' ? template_title : undefined;
  const customColor = typeof template_color === 'string' ? template_color : undefined;
  const customList = typeof list === 'string' ? list : undefined;

  const displayTitle = customTitle ? `${customTitle} | Sorteo Pro` : t('title');
  const displayDescription = t('description');

  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  // Default type for home is undefined, which defaults to generic in api/og
  if (customTitle) ogImageUrl.searchParams.set('title', customTitle);
  if (customColor) ogImageUrl.searchParams.set('color', customColor);
  if (customList) {
    ogImageUrl.searchParams.set('list', customList);
    // Explicitly set type to 'list' so the OG image renders the list content theme
    ogImageUrl.searchParams.set('type', 'list');
  }

  const shareUrl = new URL(`${baseUrl}/${locale}`);
  if (customTitle) shareUrl.searchParams.set('template_title', customTitle);
  if (customColor) shareUrl.searchParams.set('template_color', customColor);
  if (customList) shareUrl.searchParams.set('list', customList);

  const canonicalUrl =
    customTitle || customColor || customList
      ? `/${locale}?${shareUrl.searchParams.toString()}`
      : `/${locale}`;

  return {
    title: displayTitle,
    description: displayDescription,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: displayTitle,
      description: displayDescription,
      url: shareUrl.toString(),
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
      card: 'summary_large_image',
      title: displayTitle,
      description: displayDescription,
      images: [ogImageUrl.toString()],
    },
  };
}

export default async function SorteoApp({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const tShare = await getTranslations({ locale, namespace: 'ShareContent' });
  const tWinner = await getTranslations({ locale, namespace: 'WinnerCeremony' });

  // Reuse existing share logic (Home has generic share content)
  const shareTranslations = {
    share: tWinner('share_menu'),
    copy: tWinner('copy_text'),
    copied: tWinner('copied'),
    shareOn: tWinner('share_on')
  }

  const stickyTranslations = {
    share_cta: tShare('cta_share'),
    start_cta: tShare('cta_start')
  }

  const baseUrl = getBaseUrl()
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Sorteo Pro",
      "item": `${baseUrl}/${locale}`
    }]
  };

  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted schema data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbSchema) }}
      />
      <MainApp
        seoMode="home"
        initialTitle="Sorteo Pro"
        initialSubtitle="The Premium Giveaway Tool"
        shareTitle={tShare('home_title')}
        shareText={tShare('home_text')}
        customShareTextTemplate={tShare('custom_share_text', { title: '{title}' })}
        shareTranslations={shareTranslations}
        stickyTranslations={stickyTranslations}
        footer={<SiteFooter />}
      >
        <WheelGeo />
        <Glossary seoMode="home" />
        <SeoContent />
      </MainApp>
    </>
  )
}
