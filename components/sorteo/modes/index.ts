import type React from "react"
import { WheelMode } from "./WheelMode"
import { ListMode } from "./ListMode"
import { NumberMode } from "./NumberMode"
import { MiscModes } from "./MiscModes"
import type { SeoMode } from "../glossary"

export { WheelMode, ListMode, NumberMode, MiscModes }

export const MODE_COMPONENTS: Record<SeoMode, React.ComponentType<{ seoMode: SeoMode }>> = {
    home: WheelMode,
    wheel: WheelMode,
    instagram: WheelMode,
    rng: NumberMode,
    'list-randomizer': ListMode,
    'secret-santa': ListMode,
    team: ListMode,
    'yes-no': MiscModes,
    letter: MiscModes,
    dice: MiscModes,
    coin: MiscModes,
    rps: MiscModes,
    country: MiscModes,
    month: MiscModes,
    card: MiscModes,
    bingo: MiscModes,
    'truth-or-dare': MiscModes,
}
