export function buildTelegramShareUrl(url: string, text: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
}

export function buildLinkedinShareUrl(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
}
