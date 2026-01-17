"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"

export function LanguageSwitcher() {
    const locale = useLocale()
    const pathname = usePathname()
    const t = useTranslations("LanguageSwitcher")

    const languages = [
        { code: "en", label: "English" },
        { code: "es", label: "Español" },
        { code: "pt", label: "Português" },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9">
                    <Languages className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                    <span className="sr-only">{t("switchLanguage")}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        asChild
                        className={locale === lang.code ? "bg-accent" : ""}
                    >
                        <Link href={pathname} locale={lang.code} className="w-full cursor-pointer">
                            {lang.label}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
