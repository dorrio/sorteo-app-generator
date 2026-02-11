"use client"

import dynamic from "next/dynamic"

export const LazyParticleBackground = dynamic(
  () => import("./particle-background").then((mod) => mod.ParticleBackground),
  { ssr: false }
)
