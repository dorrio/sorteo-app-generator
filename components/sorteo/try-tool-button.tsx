"use client"

import type React from "react"
import { useSorteoStore, type ThemeConfig } from "@/lib/sorteo-store"
import { useShallow } from "zustand/react/shallow"

interface TryToolButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  sorteoStyle: ThemeConfig["sorteoStyle"]
  children: React.ReactNode
}

export function TryToolButton({ sorteoStyle, children, onClick, ...props }: TryToolButtonProps) {
  const { updateTheme } = useSorteoStore(
    useShallow((state) => ({ updateTheme: state.updateTheme })),
  )

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
