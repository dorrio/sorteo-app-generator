"use client"

import { useTranslations } from "next-intl"
import { Book, CheckCircle2 } from "lucide-react"

export function Glossary() {
  const t = useTranslations("Glossary")

  const terms = [
    {
      term: t("term_1"),
      definition: t("def_1"),
    },
    {
      term: t("term_2"),
      definition: t("def_2"),
    },
    {
      term: t("term_3"),
      definition: t("def_3"),
    },
    {
      term: t("term_4"),
      definition: t("def_4"),
    },
    {
      term: t("term_5"),
      definition: t("def_5"),
    },
    {
      term: t("term_6"),
      definition: t("def_6"),
    },
    {
      term: t("term_7"),
      definition: t("def_7"),
    },
  ]

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
           <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
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
