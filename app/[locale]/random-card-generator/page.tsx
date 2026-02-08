import { MainApp } from '@/components/sorteo/main-app';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'CardPage' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sorteopro.com";

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
        canonical: `/${locale}/random-card-generator`
    },
    openGraph: {
        title: t('title'),
        description: t('description'),
        url: `${baseUrl}/${locale}/random-card-generator`,
        type: "website",
    }
  };
}

export default function RandomCardGeneratorPage() {
  return <MainApp seoMode="card" initialStyle="cards" />;
}
