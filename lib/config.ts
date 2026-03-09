/**
 * Canonical base URL resolution for the application.
 *
 * Priority order:
 * 1. NEXT_PUBLIC_APP_URL — explicitly set production/staging domain
 * 2. VERCEL_URL — automatically set by Vercel on preview deployments
 * 3. localhost fallback for local development
 */
export function getBaseUrl(): string {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`
    }
    return "http://localhost:3000"
}
