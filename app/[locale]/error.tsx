"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";

import { useTranslations } from "next-intl";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations("ErrorPage");

    useEffect(() => {
        // Log the error to Sentry
        Sentry.captureException(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
            <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                {t('description')}
            </p>
            <Button onClick={() => reset()} variant="default">
                {t('retry')}
            </Button>
        </div>
    );
}
