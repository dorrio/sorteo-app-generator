import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function copyBlobToClipboard(blob: Blob): Promise<void> {
  if (
    typeof window === 'undefined' ||
    typeof navigator === 'undefined' ||
    !navigator.clipboard ||
    !navigator.clipboard.write ||
    typeof ClipboardItem === 'undefined'
  ) {
    throw new Error('Clipboard API not supported')
  }
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ])
  } catch (error) {
    console.error('Failed to copy blob to clipboard:', error)
    throw error
  }
}
