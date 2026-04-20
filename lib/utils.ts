import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeJsonLdStringify(data: unknown): string {
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

// Unbiased Fisher-Yates shuffle backed by crypto.getRandomValues.
// Avoids the classic `.sort(() => Math.random() - 0.5)` trap — that comparator
// is non-transitive, so engines (notably V8) produce a non-uniform distribution.
export function cryptoShuffle<T>(input: readonly T[]): T[] {
  const arr = [...input]
  const buf = new Uint32Array(1)
  for (let i = arr.length - 1; i > 0; i--) {
    crypto.getRandomValues(buf)
    const j = buf[0] % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
