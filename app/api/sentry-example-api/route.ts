import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

// A route to test Sentry's Error Tracking inside API routes
// Navigating to /api/sentry-example-api will throw and Sentry should capture it.
export async function GET() {
    logger.info({ context: "test-api" }, "Accessing the Sentry test endpoint");
    throw new Error("Sentry Example API Error - this is expected during US-006 testing");
    return NextResponse.json({ name: "John Doe" });
}
