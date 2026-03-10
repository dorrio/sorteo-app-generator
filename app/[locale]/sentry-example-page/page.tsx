"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

// Note: This page is intentionally Spanish-only for internal testing and should not be localized
export default function SentryTestPage() {
    const [shouldThrow, setShouldThrow] = useState(false);

    if (shouldThrow) {
        throw new Error("Sentry Example Frontend Error - this is expected during US-006 testing");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 p-4">
            <h1 className="text-3xl font-bold">Prueba de Error Vercel/Sentry</h1>
            <p className="max-w-md text-center">
                Haz clic en el botón para lanzar un error deliberado. Si la integración Sentry/Vercel es correcta,
                deberías recibir una notificación/email en el proyecto configurado.
            </p>

            <Button variant="destructive" onClick={() => setShouldThrow(true)}>
                Lanzar Error Frontend
            </Button>

            <Button variant="secondary" onClick={async () => {
                try {
                    const response = await fetch("/api/sentry-example-api");
                    if (!response.ok) {
                        throw new Error(`API returned ${response.status} ${response.statusText}`);
                    }
                } catch (error) {
                    // Log or handle the error so that the unhandled promise tracker / Sentry can capture it
                    console.error("Fetch to API failed", error);
                    throw error;
                }
            }}>
                Lanzar Error Backend (API)
            </Button>
        </div>
    );
}
