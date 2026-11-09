type UmamiEventData = Record<string, string | number | boolean>

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: UmamiEventData) => void
    }
  }
}

/**
 * Sends a custom event to Umami. No-op on the server, before the script loads,
 * or when tracking is disabled. Never pass participant names, emails or winner data.
 */
export function trackEvent(eventName: string, eventData?: UmamiEventData): void {
  if (typeof window === "undefined") return
  window.umami?.track(eventName, eventData)
}
