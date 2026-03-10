export const dynamic = "force-dynamic";

// A route to test Sentry's Error Tracking inside API routes
// Navigating to /api/sentry-example-api will throw and Sentry should capture it.
export async function GET() {
    throw new Error("Sentry Example API Error - this is expected during US-006 testing");
}
