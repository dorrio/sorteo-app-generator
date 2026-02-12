"use client"

import type React from "react"
import { useSorteoStore, type ThemeConfig } from "@/lib/sorteo-store"

interface TryToolButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  sorteoStyle: ThemeConfig["sorteoStyle"]
  children: React.ReactNode
}

export function TryToolButton({ sorteoStyle, children, onClick, ...props }: TryToolButtonProps) {
  const { updateTheme } = useSorteoStore()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    updateTheme({ sorteoStyle })
    if (onClick) onClick(e)
  }

  return (
    <a href="#sorteo-section" onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
