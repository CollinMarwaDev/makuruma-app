import type { FC } from 'react'
import { Badge } from '~/global/components/badge'
import { useTrackingStatuses } from '~/components/tracking/use-tracking-statuses'

/** A tracking status shown with its admin-chosen label and colour. */
export const StatusBadge: FC<{ status: string }> = ({ status }) => {
  const { statusColor, statusLabel } = useTrackingStatuses()
  return <Badge variant={statusColor(status)} label={statusLabel(status)} />
}
