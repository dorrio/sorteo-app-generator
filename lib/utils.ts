import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function copyBlobToClipboard(blob: Blob): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return false
  }

  try {
    // Check if ClipboardItem is supported (Safari requirement for images)
    if (typeof ClipboardItem !== "undefined") {
      const type = blob.type || "image/png"
      const data = [new ClipboardItem({ [type]: blob })]
      await navigator.clipboard.write(data)
      return true
    } else {
      console.warn("ClipboardItem not supported")
      return false
    }
  } catch (error: unknown) {
    console.error("Failed to copy blob to clipboard:", error instanceof Error ? error.message : String(error))
    return false
  }
}

export function safeJsonLdStringify(data: any): string {
  return JSON.stringify(data).replace(
    /[<>&]/g,
    (c) =>
    ({
      '<': '\\u003c',
      '>': '\\u003e',
      '&': '\\u0026',
    }[c] || c)
  )
}
