"use client"

import { useTranslations } from "next-intl"
import { Book, CheckCircle2 } from "lucide-react"

export function Glossary() {
  const t = useTranslations("Glossary")

  // Dynamically load terms 1-6
  const terms = [1, 2, 3, 4, 5, 6].map(i => ({
    term: t(`term_${i}`),
    definition: t(`def_${i}`),
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Sorteo Glossary',
    hasDefinedTerm: terms.map(item => ({
      '@type': 'DefinedTerm',
      name: item.term,
      description: item.definition,
    }))
  }

  return (
    <section className="w-full py-12 px-4 border-t border-border/30 bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-2 mb-6">
           <Book className="w-6 h-6 text-primary" />
           <h2 className="text-2xl font-bold tracking-tight">{t("section_title")}</h2>
        </div>

        <dl className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {terms.map((item, idx) => (
             <div key={idx} className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
                <dt className="font-bold text-lg mb-2 flex items-center gap-2">
                   <CheckCircle2 className="w-4 h-4 text-primary/60" />
                   {item.term}
                </dt>
                <dd className="text-sm text-muted-foreground leading-relaxed">
                   {item.definition}
                </dd>
             </div>
           ))}
        </dl>
      </div>
    </section>
  )
}
