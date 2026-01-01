import { setRequestLocale, getTranslations } from "next-intl/server"
import { Glossary } from "@/components/sorteo/glossary"
import { Metadata } from "next"

export const dynamic = "force-static"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params

  // Minimal static metadata for now, ideally this would be localized too
  return {
    title: "Glossary - Sorteo Pro",
    description: "Definitions of key terms related to giveaways, RNG, and viral marketing.",
  }
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }, { locale: "pt" }]
}

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("Glossary")

  return (
    <main className="min-h-screen bg-background text-foreground pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Direct Answer Block (ChatGPT Bait) */}
        <section className="mb-12 p-6 bg-card border border-border/50 rounded-xl shadow-sm">
           <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
           <div className="prose dark:prose-invert max-w-none">
             <p className="text-lg leading-relaxed">
               {t.rich("intro_text", {
                 strong: (chunks) => <strong className="font-semibold text-primary">{chunks}</strong>
               })}
             </p>
           </div>
        </section>

        {/* The Main Glossary Component */}
        <Glossary />
      </div>
    </main>
  )
}
