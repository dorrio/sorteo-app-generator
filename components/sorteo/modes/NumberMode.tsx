import { RngGeo } from "@/components/sorteo/rng-geo"
import { Glossary } from "@/components/sorteo/glossary"

export function NumberMode({ seoMode }: { seoMode: string }) {
    return <><RngGeo /><Glossary seoMode={seoMode} /></>
}
