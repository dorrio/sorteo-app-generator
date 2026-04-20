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

        // Core Tools List (GEO Optimized)
        const CORE_TOOLS = [
            'alternativa-',
            'instagram-comment-picker',
            'wheel-of-names',
            'glossary',
            'random-number-generator',
            'list-randomizer',
            'secret-santa-generator',
            'team-generator',
            'yes-or-no-wheel',
            'random-letter-generator',
            'dice-roller',
            'coin-flip',
            'rock-paper-scissors',
            'random-country-generator',
            'random-month-generator',
            'random-card-generator',
            'bingo-number-generator',
            'truth-or-dare-generator',
            'versus'
        ];

        // Home Page & Locale Roots (e.g., /en, /es)
        if (path === '/' || /^\/[a-z]{2}$/.test(path)) {
            priority = 1.0;
            changefreq = 'daily';
        }
        // Competitor Alternatives & Core Tools
        else if (CORE_TOOLS.some(tool => path.includes(tool))) {
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
    additionalPaths: async (config) => {
        const result = [];
        const CORE_TOOLS = [
            'instagram-comment-picker',
            'wheel-of-names',
            'glossary',
            'random-number-generator',
            'list-randomizer',
            'secret-santa-generator',
            'team-generator',
            'yes-or-no-wheel',
            'random-letter-generator',
            'dice-roller',
            'coin-flip',
            'rock-paper-scissors',
            'random-country-generator',
            'random-month-generator',
            'random-card-generator',
            'bingo-number-generator',
            'truth-or-dare-generator',
            'versus',
            'alternativa-appsorteos',
            'alternativa-wheel-of-names'
        ];
        const locales = ['en', 'es', 'pt'];

        for (const locale of locales) {
            for (const tool of CORE_TOOLS) {
                const path = `/${locale}/${tool}`;

                const alternateRefs = locales.map(altLocale => ({
                    hreflang: altLocale,
                    href: `${config.siteUrl}/${altLocale}/${tool}`,
                    hrefIsAbsolute: true
                }));

                result.push({
                    loc: path,
                    changefreq: 'weekly',
                    priority: 0.9,
                    lastmod: new Date().toISOString(),
                    alternateRefs: alternateRefs
                });
            }
        }
        return result;
    },
    robotsTxtOptions: {
        policies: [
            { userAgent: "*", allow: "/" },
            { userAgent: "*", disallow: "/private/" },
            // Explicitly allow AI and GEO Bots
            { userAgent: "GPTBot", allow: "/" },
            { userAgent: "PerplexityBot", allow: "/" },
            { userAgent: "ClaudeBot", allow: "/" },
            { userAgent: "Google-Extended", allow: "/" },
            { userAgent: "anthropic-ai", allow: "/" },
            { userAgent: "Omgilibot", allow: "/" },
            { userAgent: "Omgili", allow: "/" }
        ],
    },
};
