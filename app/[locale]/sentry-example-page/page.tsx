"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Note: This page is intentionally Spanish-only for internal testing and should not be localized
export default function SentryTestPage(): React.JSX.Element {
    const [shouldThrow, setShouldThrow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

            <Button variant="secondary" disabled={isLoading} onClick={async () => {
                setIsLoading(true);
                toast.loading("Calling API...");

                try {
                    const response = await fetch("/api/sentry-example-api");
                    if (!response.ok) {
                        throw new Error(`API returned ${response.status} ${response.statusText}`);
                    }
                    toast.dismiss();
                    toast.success("API Call completed.");
                } catch (error) {
                    toast.dismiss();
                    toast.error("Fetch to API failed");
                    // Log or handle the error so that the unhandled promise tracker / Sentry can capture it
                    console.error("Fetch to API failed", error);
                    throw error;
                } finally {
                    setIsLoading(false);
                }
            }}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cargando...</> : "Lanzar Error Backend (API)"}
            </Button>
        </div>
    );
}
