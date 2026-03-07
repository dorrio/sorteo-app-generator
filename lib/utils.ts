import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
