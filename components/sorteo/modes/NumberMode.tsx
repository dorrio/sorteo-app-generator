import React from "react"
import { RngGeo } from "@/components/sorteo/rng-geo"
import { Glossary, type SeoMode } from "@/components/sorteo/glossary"

export function NumberMode({ seoMode }: { seoMode: SeoMode }): React.JSX.Element {
    return <><RngGeo /><Glossary seoMode={seoMode} /></>
}
