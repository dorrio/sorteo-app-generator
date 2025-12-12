/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://sorteo-app-generator.vercel.app",
    generateRobotsTxt: true,
    sitemapSize: 5000,
    alternateRefs: [
        { href: "https://sorteo-app-generator.vercel.app/en", hreflang: "en" },
        { href: "https://sorteo-app-generator.vercel.app/es", hreflang: "es" },
        { href: "https://sorteo-app-generator.vercel.app/pt", hreflang: "pt" },
    ],
    robotsTxtOptions: {
        policies: [
            { userAgent: "*", allow: "/" },
            { userAgent: "*", disallow: "/private/" },
        ],
    },
};
