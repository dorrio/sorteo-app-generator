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

// Generate an unbiased random index in [0, upperExclusive) using crypto.getRandomValues.
// Avoids modulo bias by rejecting values outside the largest unbiased range.
export function randomIndex(upperExclusive: number): number {
  const buf = new Uint32Array(1)
  const maxUnbiased = 0x100000000 - (0x100000000 % upperExclusive)

  do {
    crypto.getRandomValues(buf)
  } while (buf[0] >= maxUnbiased)

  return buf[0] % upperExclusive
}

// Unbiased Fisher-Yates shuffle backed by crypto.getRandomValues.
// Avoids the classic `.sort(() => Math.random() - 0.5)` trap — that comparator
// is non-transitive, so engines (notably V8) produce a non-uniform distribution.
export function cryptoShuffle<T>(input: readonly T[]): T[] {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}