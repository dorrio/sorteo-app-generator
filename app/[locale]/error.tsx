"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to Sentry
        Sentry.captureException(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
            <h2 className="text-2xl font-bold mb-4">Un error ha ocurrido</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                Lo sentimos, algo no funcionó como se esperaba. Hemos sido notificados.
            </p>
            <Button onClick={() => reset()} variant="default">
                Intentar de nuevo
            </Button>
        </div>
    );
}
