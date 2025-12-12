import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
        ? process.env.NEXT_PUBLIC_APP_URL
        : process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'https://sorteopro.com'
    const locales = ['en', 'es', 'pt'];

    const entries = locales.map(locale => ({
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    return [
        {
            url: baseUrl, // Root URL usually redirects, but good to have
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...entries
    ]
}
