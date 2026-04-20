import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
    dsn: SENTRY_DSN,
    // Reduce sample rate in production to avoid high tracing overhead.
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    // Only accept events originating from our own origins — prevents third parties
    // from spamming the project quota with forged errors via the public DSN.
    allowUrls: [/https?:\/\/([^/]+\.)?sorteo-app-generator\.vercel\.app/, /https?:\/\/localhost/],
    debug: false,
});
