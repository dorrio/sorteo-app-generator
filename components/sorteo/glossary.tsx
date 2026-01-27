"use client"

import { useTranslations } from "next-intl"
import { Book, CheckCircle2, ArrowRight } from "lucide-react"
import { Link } from "@/i18n/routing"

interface GlossaryProps {
  seoMode?: 'home' | 'wheel' | 'instagram' | 'rng' | 'list-randomizer' | 'yes-no' | 'letter' | 'secret-santa';
}

export function Glossary({ seoMode }: GlossaryProps) {
  const t = useTranslations("Glossary")

  const allTerms = [
    {
      id: "rng",
      term: t("term_1"),
      definition: t("def_1"),
    },
    {
      id: "provably-fair",
      term: t("term_2"),
      definition: t("def_2"),
    },
    {
      id: "instagram",
      term: t("term_3"),
      definition: t("def_3"),
    },
    {
      id: "list",
      term: t("term_4"),
      definition: t("def_4"),
    },
    {
      id: "wheel",
      term: t("term_5"),
      definition: t("def_5"),
    },
    {
      id: "yes-no",
      term: t("term_6"),
      definition: t("def_6"),
    },
    {
      id: "letter",
      term: t("term_7"),
      definition: t("def_7"),
    },
    {
      id: "secret-santa",
      term: t("term_8"),
      definition: t("def_8"),
    },
  ]

  // Filter terms based on seoMode (Apex Optimization: Relevance)
  const filteredTerms = allTerms.filter(term => {
      if (!seoMode || seoMode === 'home') return true;

      // Always show Provably Fair (id: provably-fair) as a trust signal
      if (term.id === 'provably-fair') return true;

      if (seoMode === 'wheel' && term.id === 'wheel') return true;
      if (seoMode === 'rng' && term.id === 'rng') return true;
      if (seoMode === 'instagram' && term.id === 'instagram') return true;
      if (seoMode === 'list-randomizer' && term.id === 'list') return true;
      if (seoMode === 'yes-no' && term.id === 'yes-no') return true;
      if (seoMode === 'letter' && term.id === 'letter') return true;
      if (seoMode === 'secret-santa' && term.id === 'secret-santa') return true;

      return false;
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Sorteo Glossary',
    hasDefinedTerm: filteredTerms.map(item => ({
      '@type': 'DefinedTerm',
      name: item.term,
      description: item.definition,
    }))
  }

  // Logic to show a "View Full Glossary" link if we are showing a subset
  const showFullGlossaryLink = seoMode && seoMode !== 'home';

  return (
    <section className="w-full py-12 px-4 border-t border-border/30 bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-2">
                <Book className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
           </div>
           {showFullGlossaryLink && (
               <Link href="/glossary" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                   {t("title")} <ArrowRight className="w-4 h-4" />
               </Link>
           )}
        </div>

        <dl className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredTerms.map((item, idx) => (
             <div key={idx} id={item.id} className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
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

        {showFullGlossaryLink && (
            <div className="flex justify-center mt-8">
                 <Link href="/glossary" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary/50 text-secondary-foreground hover:bg-secondary transition-colors text-sm font-medium">
                    <Book className="w-4 h-4" />
                    {t("title")}
                 </Link>
            </div>
        )}
      </div>
    </section>
  )
}
