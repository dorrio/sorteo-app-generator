import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Simple in-memory rate limiter (For demonstration/simple use cases)
// Note: In serverless, this memory is ephemeral. For production, use Redis (e.g., Upstash).
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 20; // Max requests per window
const rateLimitMap = new Map<string, { count: number; expires: number }>();

function isRateLimited(ip: string) {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.expires) {
        rateLimitMap.set(ip, { count: 1, expires: now + RATE_LIMIT_WINDOW });
        return false;
    }

    if (record.count >= MAX_REQUESTS) {
        return true;
    }

    record.count++;
    return false;
}

export default async function middleware(request: NextRequest) {
    const { nextUrl } = request;
    // Type assertion for Vercel specific properties
    const geo = (request as any).geo;
    const ip = (request as any).ip || (request as any).headers.get('x-forwarded-for') || '127.0.0.1';

    // --- 1. Rate Limiting ---
    // Bypass for static assets usually, but matcher handles that.
    if (isRateLimited(ip)) {
        return new NextResponse('Too Many Requests', { status: 429 });
    }

    // --- 2. Geofencing ---
    // Example: Block users from "XX" (Placeholder blocked country)
    // Vercel populates request.geo
    const blockedCountries = ['XX'];
    const country = geo?.country || 'US';

    if (blockedCountries.includes(country)) {
        return new NextResponse('Access Denied: Country not allowed', { status: 403 });
    }

    // --- 3. Cookie / Special Headers Verification ---
    // Example: Ensure a 'verified' cookie exists for specific admin routes (mock logic)
    // Or for testing maintenance mode
    const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
    if (isMaintenanceMode) {
        const maintenanceBypass = request.cookies.get('maintenance-bypass');
        if (!maintenanceBypass) {
            return new NextResponse('Site is under maintenance', { status: 503 });
        }
    }

    // --- 4. Pass to next-intl ---
    return intlMiddleware(request);
}

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(es|en|pt)/:path*']
};
