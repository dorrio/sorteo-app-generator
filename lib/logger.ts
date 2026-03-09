import pino from "pino";

// Vercel parses pino JSON output cleanly.
// For local development, we use pino-pretty for better readability, if installed.
export const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    // In development, pretty print logs if pino-pretty is available.
    // In production, keep pure JSON (Vercel parses this beautifully).
    ...(process.env.NODE_ENV === "development" && {
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
                singleLine: true,
                ignore: "pid,hostname",
            },
        },
    }),
});
