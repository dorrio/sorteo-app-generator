import React from "react"
import { WheelGeo } from "@/components/sorteo/wheel-geo"
import { Glossary, type SeoMode } from "@/components/sorteo/glossary"
import { SeoContent } from "@/components/sorteo/seo-content"
import { InstagramGeo } from "@/components/sorteo/instagram-geo"

interface WheelModeProps {
    seoMode: SeoMode;
}

export function WheelMode({ seoMode }: WheelModeProps): React.JSX.Element {
    if (seoMode === 'instagram') {
        return (
            <>
                <InstagramGeo />
                <Glossary seoMode={seoMode} />
            </>
        )
    }

    // Covers 'wheel', 'home' and any other generic fallback 
    return (
        <>
            <WheelGeo />
            <Glossary seoMode={seoMode} />
            {seoMode !== 'wheel' && <SeoContent />}
        </>
    )
}
