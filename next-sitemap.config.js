/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://sorteo-app-generator.vercel.app",
    generateRobotsTxt: true,
    sitemapSize: 5000,
    priority: 0.7, // Default priority
    changefreq: 'weekly', // Default changefreq
    alternateRefs: [
        { href: "https://sorteo-app-generator.vercel.app/en", hreflang: "en" },
        { href: "https://sorteo-app-generator.vercel.app/es", hreflang: "es" },
        { href: "https://sorteo-app-generator.vercel.app/pt", hreflang: "pt" },
    ],
    // Apex Strategy: Prioritize Core Landing Pages
    transform: async (config, path) => {
        let priority = config.priority;
        let changefreq = config.changefreq;

        // Home Page & Locale Roots (e.g., /en, /es)
        if (path === '/' || /^\/[a-z]{2}$/.test(path)) {
            priority = 1.0;
            changefreq = 'daily';
        }
        // Competitor Alternatives (High Value)
        else if (path.includes('alternativa-appsorteos')) {
            priority = 0.9;
            changefreq = 'weekly';
        }
        // Utility Pages (Lower Priority)
        else if (path.includes('verify')) {
            priority = 0.5;
            changefreq = 'monthly';
        }

        return {
            loc: path,
            changefreq: changefreq,
            priority: priority,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
            alternateRefs: config.alternateRefs ?? [],
        }
    },
    robotsTxtOptions: {
        policies: [
            { userAgent: "*", allow: "/" },
            { userAgent: "*", disallow: "/private/" },
            // Explicitly allow GPTBot for GEO
            { userAgent: "GPTBot", allow: "/" }
        ],
    },
};
