import React from "react"
import { YesNoGeo } from "@/components/sorteo/yes-no-geo"
import { LetterGeo } from "@/components/sorteo/letter-geo"
import { DiceGeo } from "@/components/sorteo/dice-geo"
import { CoinGeo } from "@/components/sorteo/coin-geo"
import { RpsGeo } from "@/components/sorteo/rps-geo"
import { CountryGeo } from "@/components/sorteo/country-geo"
import { MonthGeo } from "@/components/sorteo/month-geo"
import { CardGeo } from "@/components/sorteo/card-geo"
import { BingoGeo } from "@/components/sorteo/bingo-geo"
import { Glossary, type SeoMode } from "@/components/sorteo/glossary"

export function MiscModes({ seoMode }: { seoMode: SeoMode }): React.JSX.Element | null {
    switch (seoMode) {
        case 'yes-no':
            return <><YesNoGeo /><Glossary seoMode={seoMode} /></>
        case 'letter':
            return <><LetterGeo /><Glossary seoMode={seoMode} /></>
        case 'dice':
            return <><DiceGeo /><Glossary seoMode="rng" /></>
        case 'coin':
            return <><CoinGeo /><Glossary seoMode="yes-no" /></>
        case 'rps':
            return <><RpsGeo /><Glossary seoMode="yes-no" /></>
        case 'country':
            return <><CountryGeo /><Glossary seoMode="wheel" /></>
        case 'month':
            return <><MonthGeo /><Glossary seoMode="wheel" /></>
        case 'card':
            return <><CardGeo /><Glossary seoMode="card" /></>
        case 'bingo':
            return <><BingoGeo /><Glossary seoMode={seoMode} /></>
        default:
            return null
    }
}
