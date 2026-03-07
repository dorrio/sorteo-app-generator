import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely stringifies an object for use in a JSON-LD script tag.
 * It replaces '<' with '\u003c' to prevent early script termination.
 */
export function safeJsonLdStringify(data: any): string {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
}
