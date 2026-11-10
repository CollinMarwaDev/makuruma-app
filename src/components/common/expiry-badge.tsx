import type { FC } from 'react'
import type { Document } from '~/types/truck'
import { Badge } from '~/global/components/badge'
import { EXPIRY_BADGE, getExpiryStatus } from '~/utils/documentHelpers'

/** A document's expiry date coloured by status (valid / expiring in 30 days / expired); "—" when missing. */
export const ExpiryBadge: FC<{ doc?: Document }> = ({ doc }) =>
  doc?.expiry_date ? (
    <Badge variant={EXPIRY_BADGE[getExpiryStatus(doc)]} label={doc.expiry_date.slice(0, 10)} />
  ) : (
    <span className="text-muted-foreground">—</span>
  )
