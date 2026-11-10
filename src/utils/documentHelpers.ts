import type { Document } from '../types/truck'

export function getExpiryStatus(doc: Document): 'expired' | 'expiring-soon' | 'valid' | 'unknown' {
  if (!doc.expiry_date) return 'unknown'

  const expiry = new Date(doc.expiry_date)
  const today = new Date()
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= 30) return 'expiring-soon'
  return 'valid'
}

export type ExpiryStatus = ReturnType<typeof getExpiryStatus>

/** Global Badge variant for a document's expiry state. */
export const EXPIRY_BADGE: Record<ExpiryStatus, 'success' | 'warning' | 'danger' | 'disabled'> = {
  expired: 'danger',
  'expiring-soon': 'warning',
  unknown: 'disabled',
  valid: 'success',
}

/** True when any document is expired or expires within 30 days. */
export const hasExpiringDocument = (docs: Document[]) => docs.some((d) => ['expired', 'expiring-soon'].includes(getExpiryStatus(d)))
