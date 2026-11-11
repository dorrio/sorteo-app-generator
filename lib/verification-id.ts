// Verification IDs have the form ID-{8 hex chars}-{draw time in ms, as hex}
export function getDrawDateFromVerificationId(verificationId: string): Date | null {
  const parts = verificationId.split("-")
  if (parts.length < 3) return null
  const date = new Date(parseInt(parts[parts.length - 1], 16))
  return isNaN(date.getTime()) ? null : date
}
