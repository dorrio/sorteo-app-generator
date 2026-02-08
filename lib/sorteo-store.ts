"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

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

  const randomBuffer = new Uint32Array(1)
  crypto.getRandomValues(randomBuffer)

  // Use modulo for uniform distribution
  const index = randomBuffer[0] % participants.length
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

  // Sorteo state
  winner: Participant | null
  setWinner: (winner: Participant | null) => void
  isSpinning: boolean
  setIsSpinning: (spinning: boolean) => void
  showCountdown: boolean
  setShowCountdown: (show: boolean) => void
  showWinnerCeremony: boolean
  setShowWinnerCeremony: (show: boolean) => void

  // History
  pastWinners: Participant[]
  addToPastWinners: (winner: Participant) => void
  clearHistory: () => void

  // Theme
  theme: ThemeConfig
  updateTheme: (config: Partial<ThemeConfig>) => void
  setPresetTheme: (
    preset: "luxury-gold" | "neon-creator" | "minimal-elegance" | "rose-gold" | "ocean-depth" | "forest-mist",
  ) => void

  // Editor
  isEditorOpen: boolean
  setIsEditorOpen: (open: boolean) => void

  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
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

      // Sorteo state
      winner: null,
      setWinner: (winner) => set({ winner }),
      isSpinning: false,
      setIsSpinning: (isSpinning) => set({ isSpinning }),
      showCountdown: false,
      setShowCountdown: (showCountdown) => set({ showCountdown }),
      showWinnerCeremony: false,
      setShowWinnerCeremony: (showWinnerCeremony) => set({ showWinnerCeremony }),

      // History
      pastWinners: [],
      addToPastWinners: (winner) =>
        set((state) => ({
          pastWinners: [...state.pastWinners, winner],
        })),
      clearHistory: () => set({ pastWinners: [] }),

      // Theme
      theme: defaultTheme,
      updateTheme: (config) =>
        set((state) => ({
          theme: { ...state.theme, ...config },
        })),
      setPresetTheme: (preset) =>
        set((state) => ({
          theme: { ...state.theme, ...themePresets[preset] },
        })),

      // Editor
      isEditorOpen: false,
      setIsEditorOpen: (isEditorOpen) => set({ isEditorOpen }),

      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "sorteo-storage",
      partialize: (state) => ({
        participants: state.participants,
        pastWinners: state.pastWinners,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)
