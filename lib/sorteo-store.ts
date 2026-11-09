"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { randomIndex } from "@/lib/utils"
import { trackEvent } from "@/lib/analytics"

export interface Participant {
  id: string
  name: string
  email?: string
  comment?: string
  timestamp: Date
  verificationId?: string
}

export const selectSecureWinner = (participants: Participant[]): Participant | null => {
  if (participants.length === 0) return null

  // Use unbiased random index selection
  const index = randomIndex(participants.length)
  const winner = participants[index]

  // Generate verifiable ID: PREFIX-UUID_PART-TIMESTAMP_HEX
  const verificationId = `ID-${crypto.randomUUID().slice(0, 8).toUpperCase()}-${Date.now().toString(16).toUpperCase()}`

  return { ...winner, verificationId }
}

export interface ThemeConfig {
  style: "luxury-gold" | "neon-creator" | "minimal-elegance" | "rose-gold" | "ocean-depth" | "forest-mist"
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  borderRadius: number
  showConfetti: boolean
  showParticles: boolean
  showDynamicBackground: boolean
  countdownDuration: number
  spinDuration: number
  customLogo?: string
  customTitle: string
  customSubtitle: string
  backgroundImage?: string
  backgroundOpacity: number
  backgroundBlur: number
  participantDisplay: "list" | "bubbles"
  sorteoStyle: "slot-machine" | "roulette" | "cascade" | "cards" | "matrix" | "grid"
}

export interface SorteoState {
  // Participants
  participants: Participant[]
  addParticipant: (participant: Omit<Participant, "id" | "timestamp">) => void
  addParticipants: (participants: Omit<Participant, "id" | "timestamp">[]) => void
  removeParticipant: (id: string) => void
  updateParticipant: (id: string, name: string) => void
  clearParticipants: () => void
  // The user's own list, set aside while a preset tool (dice, coin, …) temporarily replaces it
  customParticipants: Participant[]
  setCustomParticipants: (participants: Participant[]) => void
  setParticipants: (participants: Participant[]) => void

  // Sorteo state
  winner: Participant | null
  setWinner: (winner: Participant | null) => void
  isSpinning: boolean
  setIsSpinning: (spinning: boolean) => void
  showCountdown: boolean
  setShowCountdown: (show: boolean) => void
  showWinnerCeremony: boolean
  setShowWinnerCeremony: (show: boolean) => void
  resetDrawState: () => void

  // History
  pastWinners: Participant[]
  addToPastWinners: (winner: Participant) => void
  clearHistory: () => void

  // Theme
  theme: ThemeConfig
  updateTheme: (config: Partial<ThemeConfig>) => void
  // Shared-link overrides (template_title / template_color): shown in this session, never persisted
  applyTemplateOverrides: (config: Partial<ThemeConfig>) => void
  themeBeforeTemplate: Partial<ThemeConfig>
  setPresetTheme: (
    preset: "luxury-gold" | "neon-creator" | "minimal-elegance" | "rose-gold" | "ocean-depth" | "forest-mist",
  ) => void

  // Editor
  isEditorOpen: boolean
  setIsEditorOpen: (open: boolean) => void

  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void

  activeTool: string | null
  setActiveTool: (tool: string | null) => void
}

const defaultTheme: ThemeConfig = {
  style: "luxury-gold",
  primaryColor: "#D4AF37",
  secondaryColor: "#B8860B",
  backgroundColor: "#0A0A0A",
  textColor: "#FAFAFA",
  fontFamily: "Space Grotesk",
  borderRadius: 12,
  showConfetti: true,
  showParticles: true,
  showDynamicBackground: true,
  countdownDuration: 5,
  spinDuration: 4,
  customTitle: "SORTEO",
  customSubtitle: "El momento ha llegado",
  backgroundImage: undefined,
  backgroundOpacity: 30,
  backgroundBlur: 0,
  participantDisplay: "list",
  sorteoStyle: "grid",
}

const PERSIST_VERSION = 1

function isPersistedParticipant(value: unknown): value is Participant {
  if (typeof value !== "object" || value === null) return false
  const candidate = value as Record<string, unknown>
  return typeof candidate.id === "string" && typeof candidate.name === "string"
}

// localStorage is user-editable and survives app upgrades: keep only well-formed participants
// and revive `timestamp`, which JSON round-trips as a string.
function sanitizeParticipants(value: unknown): Participant[] {
  if (!Array.isArray(value)) return []
  return value.filter(isPersistedParticipant).map((participant) => ({
    ...participant,
    timestamp: participant.timestamp ? new Date(participant.timestamp) : new Date(),
  }))
}

function withoutKeys<T extends object>(source: T, keys: string[]): T {
  const result = { ...source }
  for (const key of keys) delete result[key as keyof T]
  return result
}

const themePresets: Record<string, Partial<ThemeConfig>> = {
  "luxury-gold": {
    style: "luxury-gold",
    primaryColor: "#D4AF37",
    secondaryColor: "#B8860B",
    backgroundColor: "#0A0A0A",
    textColor: "#FAFAFA",
  },
  "neon-creator": {
    style: "neon-creator",
    primaryColor: "#FF00FF",
    secondaryColor: "#00FFFF",
    backgroundColor: "#0D0221",
    textColor: "#FFFFFF",
  },
  "minimal-elegance": {
    style: "minimal-elegance",
    primaryColor: "#FFFFFF",
    secondaryColor: "#888888",
    backgroundColor: "#000000",
    textColor: "#FFFFFF",
  },
  "rose-gold": {
    style: "rose-gold",
    primaryColor: "#E8B4B8",
    secondaryColor: "#B76E79",
    backgroundColor: "#1A1215",
    textColor: "#FDF5F6",
  },
  "ocean-depth": {
    style: "ocean-depth",
    primaryColor: "#00D9FF",
    secondaryColor: "#0099CC",
    backgroundColor: "#0A1929",
    textColor: "#E3F2FD",
  },
  "forest-mist": {
    style: "forest-mist",
    primaryColor: "#90EE90",
    secondaryColor: "#228B22",
    backgroundColor: "#0D1F0D",
    textColor: "#F0FFF0",
  },
}

export const useSorteoStore = create<SorteoState>()(
  persist(
    (set, get) => ({
      // Participants
      participants: [],
      addParticipant: (participant) =>
        set((state) => ({
          participants: [
            ...state.participants,
            {
              ...participant,
              id: crypto.randomUUID(),
              timestamp: new Date(),
            },
          ],
        })),
      addParticipants: (participants) =>
        set((state) => ({
          participants: [
            ...state.participants,
            ...participants.map((p) => ({
              ...p,
              id: crypto.randomUUID(),
              timestamp: new Date(),
            })),
          ],
        })),
      removeParticipant: (id) =>
        set((state) => ({
          participants: state.participants.filter((p) => p.id !== id),
        })),
      updateParticipant: (id, name) =>
        set((state) => ({
          participants: state.participants.map((p) => (p.id === id ? { ...p, name } : p)),
        })),
      clearParticipants: () => set({ participants: [] }),
      customParticipants: [],
      setCustomParticipants: (customParticipants) => set({ customParticipants }),
      setParticipants: (participants) => set({ participants }),

      // Sorteo state
      winner: null,
      setWinner: (winner) => set({ winner }),
      isSpinning: false,
      setIsSpinning: (isSpinning) => set({ isSpinning }),
      showCountdown: false,
      setShowCountdown: (showCountdown) => set({ showCountdown }),
      showWinnerCeremony: false,
      setShowWinnerCeremony: (showWinnerCeremony) => set({ showWinnerCeremony }),
      resetDrawState: () => set({ isSpinning: false, showCountdown: false, showWinnerCeremony: false }),

      // History
      pastWinners: [],
      addToPastWinners: (winner) => {
        set((state) => ({
          pastWinners: [...state.pastWinners, winner],
        }))
        const { theme, participants } = get()
        trackEvent("draw_completed", { mode: theme.sorteoStyle, participants: participants.length })
      },
      clearHistory: () => set({ pastWinners: [] }),

      // Theme
      theme: defaultTheme,
      // An explicit change by the user wins over a shared-link override, so it is persisted
      updateTheme: (config) =>
        set((state) => ({
          theme: { ...state.theme, ...config },
          themeBeforeTemplate: withoutKeys(state.themeBeforeTemplate, Object.keys(config)),
        })),
      themeBeforeTemplate: {},
      applyTemplateOverrides: (config) =>
        set((state) => {
          const originals: Partial<ThemeConfig> = { ...state.themeBeforeTemplate }
          for (const key of Object.keys(config) as (keyof ThemeConfig)[]) {
            if (!(key in originals)) {
              Object.assign(originals, { [key]: state.theme[key] })
            }
          }
          return { theme: { ...state.theme, ...config }, themeBeforeTemplate: originals }
        }),
      setPresetTheme: (preset) =>
        set((state) => ({
          theme: { ...state.theme, ...themePresets[preset] },
          themeBeforeTemplate: withoutKeys(state.themeBeforeTemplate, Object.keys(themePresets[preset])),
        })),

      // Editor
      isEditorOpen: false,
      setIsEditorOpen: (isEditorOpen) => set({ isEditorOpen }),

      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),

      activeTool: null,
      setActiveTool: (activeTool) => set({ activeTool }),
    }),
    {
      name: "sorteo-storage",
      version: PERSIST_VERSION,
      // v0 (unversioned) and v1 share the same shape; `merge` below fills any missing fields
      migrate: (persistedState) => persistedState as SorteoState,
      partialize: (state) => ({
        participants: state.participants,
        customParticipants: state.customParticipants,
        pastWinners: state.pastWinners,
        theme: { ...state.theme, ...state.themeBeforeTemplate },
        activeTool: state.activeTool,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (typeof persistedState === "object" && persistedState !== null
          ? persistedState
          : {}) as Partial<Record<keyof SorteoState, unknown>>
        const persistedTheme =
          typeof persisted.theme === "object" && persisted.theme !== null ? (persisted.theme as Partial<ThemeConfig>) : {}
        return {
          ...currentState,
          participants: sanitizeParticipants(persisted.participants),
          customParticipants: sanitizeParticipants(persisted.customParticipants),
          pastWinners: sanitizeParticipants(persisted.pastWinners),
          // Defaults first so fields added to ThemeConfig after a user's last visit are never undefined
          theme: { ...defaultTheme, ...persistedTheme },
          activeTool: typeof persisted.activeTool === "string" ? persisted.activeTool : null,
        }
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)