import { withSentryConfig } from '@sentry/nextjs';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './i18n/request.ts'
);

const isDev = process.env.NODE_ENV === 'development';

// Content-Security-Policy baseline.
// - 'unsafe-inline' on script-src is required because we embed JSON-LD via
//   dangerouslySetInnerHTML (see components/seo/json-ld.tsx) and Next.js
//   emits inline hydration scripts. Every JSON-LD payload already flows
//   through safeJsonLdStringify, which escapes < > &, and DOMPurify gates
//   the handful of translation HTML sites — so the residual risk window is
//   small and CSP is defence-in-depth rather than the primary control.
// - Sentry errors go through the same-origin tunnelRoute '/monitoring',
//   so 'ingest.sentry.io' does NOT need to be in connect-src.
// - Vercel Analytics and Speed Insights use va.vercel-scripts.com (script)
//   and vitals.vercel-insights.com (beacon).
// - Google Tag Manager and Google Fonts are conditional on env config but
//   included unconditionally for the production policy so enabling them
//   later does not silently break.
const cspDirectives = [
  "default-src 'self'",
  [
    "script-src 'self' 'unsafe-inline'",
    isDev && "'unsafe-eval'",
    'https://va.vercel-scripts.com',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
  ]
    .filter(Boolean)
    .join(' '),
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://vitals.vercel-insights.com https://*.google-analytics.com https://analytics.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: cspDirectives },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'framer-motion',
      'clsx',
      'tailwind-merge',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-context-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-hover-card',
      '@radix-ui/react-label',
      '@radix-ui/react-menubar',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group',
      '@radix-ui/react-tooltip',
    ],
    turbopackUseSystemTlsCerts: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

// Only apply Sentry config if SENTRY_ORG is set to avoid Turbopack issues
const finalConfig = process.env.SENTRY_ORG
  ? withSentryConfig(
      withNextIntl(nextConfig),
      {
        // For all available options, see:
        // https://github.com/getsentry/sentry-webpack-plugin#options
        silent: true,
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
      },
      {
        // For all available options, see:
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

        widenClientFileUpload: true,
        transpileClientSDK: true,
        tunnelRoute: "/monitoring",
        hideSourceMaps: true,
        disableLogger: true,
      }
    )
  : withNextIntl(nextConfig);

export default finalConfig;