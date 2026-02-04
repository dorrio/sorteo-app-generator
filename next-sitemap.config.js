/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://sorteo-app-generator.vercel.app",
    generateRobotsTxt: true,
    sitemapSize: 5000,
    priority: 0.7, // Default priority
    changefreq: 'weekly', // Default changefreq

    // Apex Strategy: Prioritize Core Landing Pages
    transform: async (config, path) => {
        let priority = config.priority;
        let changefreq = config.changefreq;

        // Home Page & Locale Roots (e.g., /en, /es)
        if (path === '/' || /^\/[a-z]{2}$/.test(path)) {
            priority = 1.0;
            changefreq = 'daily';
        }
        // Competitor Alternatives (High Value) & Semantic Hubs (Glossary)
        else if (path.includes('alternativa-') || path.includes('instagram-comment-picker') || path.includes('wheel-of-names') || path.includes('glossary') || path.includes('random-number-generator') || path.includes('list-randomizer') || path.includes('secret-santa-generator') || path.includes('team-generator') || path.includes('yes-or-no-wheel') || path.includes('random-letter-generator') || path.includes('dice-roller') || path.includes('coin-flip') || path.includes('rock-paper-scissors') || path.includes('random-country-generator') || path.includes('random-month-generator') || path.includes('versus')) {
            priority = 0.9;
            changefreq = 'weekly';
        }
        // Utility Pages (Lower Priority)
        else if (path.includes('verify')) {
            priority = 0.5;
            changefreq = 'monthly';
        }

        // Logic to correct alternateRefs
        const locales = ['en', 'es', 'pt'];

        // Find if the current path starts with a locale
        const currentLocale = locales.find(l => path.startsWith(`/${l}`));

        let alternateRefs = [];

        if (currentLocale) {
            // Strip locale to get the base path suffix (e.g. /en/foo -> /foo)
            // If path is exactly /en, suffix is empty string or slash?
            // path: /en -> replace -> "" (empty)
            // path: /en/foo -> replace -> /foo
            let pathSuffix = path.replace(`/${currentLocale}`, '');
            if (!pathSuffix) pathSuffix = '';

            alternateRefs = locales.map(locale => ({
                hreflang: locale,
                // Ensure absolute URL and correct structure
                href: `${config.siteUrl}/${locale}${pathSuffix}`,
                hrefIsAbsolute: true
            }));
        }

        return {
            loc: path,
            changefreq: changefreq,
            priority: priority,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
            alternateRefs: alternateRefs,
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
