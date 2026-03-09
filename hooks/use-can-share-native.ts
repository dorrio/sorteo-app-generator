import { useState, useEffect } from "react"

export function useCanShareNative() {
  const [canShareNative, setCanShareNative] = useState(false)

  useEffect(() => {
    setCanShareNative(
      typeof navigator !== "undefined" &&
      !!navigator.share &&
      window.matchMedia("(pointer: coarse)").matches
    )
  }, [])

  return canShareNative
}
