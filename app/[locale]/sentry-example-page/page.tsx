"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

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

            <Button variant="secondary" onClick={() => fetch("/api/sentry-example-api")}>
                Lanzar Error Backend (API)
            </Button>
        </div>
    );
}
