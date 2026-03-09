import { ListRandomizerGeo } from "@/components/sorteo/list-randomizer-geo"
import { SecretSantaGeo } from "@/components/sorteo/secret-santa-geo"
import { TeamGeo } from "@/components/sorteo/team-geo"
import { Glossary } from "@/components/sorteo/glossary"

export function ListMode({ seoMode }: { seoMode: string }) {
    if (seoMode === 'secret-santa') {
        return <><SecretSantaGeo /><Glossary seoMode={seoMode} /></>
    }

    if (seoMode === 'team') {
        return <><TeamGeo /><Glossary seoMode="list-randomizer" /></>
    }

    // list-randomizer
    return <><ListRandomizerGeo /><Glossary seoMode={seoMode} /></>
}
