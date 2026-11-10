import { useEffect, useState, type FC } from 'react'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { BORDER_ROUTE_LABELS, type TrackingLeg } from '~/types/tracking'
import { fetchTrackingLeg } from '~/services/trackingService'
import { Badge } from '~/global/components/badge'
import { Card } from '~/global/components/card'
import { ParagraphLoading } from '~/global/components/loaders/paragraph-loader'
import { LegCheckpointsSection } from '~/components/tracking/leg-checkpoints-section'
import { LegDatesSection } from '~/components/tracking/leg-dates-section'
import { InlineError } from '~/components/tracking/leg-form-common'
import { LegPodSection } from '~/components/tracking/leg-pod-section'
import { LegStatusSection } from '~/components/tracking/leg-status-section'
import { StatusBadge } from '~/components/tracking/status-badge'

interface TrackingLegFormProps {
  legId: number
  /** Called after any save so the list behind the modal stays current. */
  onChanged: () => void
}

/** Everything recorded on one booking leg: status, dates, checkpoints and POD (contract 2.2). */
export const TrackingLegForm: FC<TrackingLegFormProps> = ({ legId, onChanged }) => {
  const [leg, setLeg] = useState<TrackingLeg | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchTrackingLeg(legId)
      .then((data) => !cancelled && setLeg(data))
      .catch((err: unknown) => !cancelled && setError(getErrorMessage(err)))
    return () => {
      cancelled = true
    }
  }, [legId])

  if (error) return <InlineError message={error} />
  if (!leg) return <ParagraphLoading lines={8} />

  function handleUpdated(updated: TrackingLeg) {
    setLeg(updated)
    onChanged()
  }

  return (
    <div className="space-y-4">
      <Card variant="filled" className="grid gap-3 p-4 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-base font-semibold text-foreground">{leg.truck.reg_no}</p>
          <p className="text-xs text-muted-foreground">
            {leg.trailer?.reg_no ?? 'no trailer'} · {leg.driver?.full_name ?? 'no driver'}
            {leg.driver?.phone ? ` · ${leg.driver.phone}` : ''}
          </p>
        </div>
        <div className="space-y-1 sm:text-right">
          <div className="flex items-center gap-2 sm:justify-end">
            <span className="text-sm font-medium text-foreground">{leg.booking.booking_number}</span>
            <Badge hideDotIndicator variant={leg.booking.direction === 'go' ? 'warning' : 'default'} label={leg.booking.direction === 'go' ? 'Go' : 'Return'} />
          </div>
          <p className="text-xs text-muted-foreground">
            {leg.booking.client?.company_name ?? '—'} · {leg.trip?.trip_code ?? 'no trip'} · via {BORDER_ROUTE_LABELS[leg.route]}
          </p>
        </div>
        <div className="flex flex-wrap gap-1 sm:col-span-2">
          <StatusBadge status={leg.current_status} />
          {leg.is_overdue && <Badge variant="danger" label="Past ETA" />}
          {leg.pod_overdue && <Badge variant="danger" label="POD overdue" />}
          {leg.auto_completed_at && (
            <Badge hideDotIndicator variant="disabled" label={`Auto-completed ${leg.auto_completed_at.slice(0, 10)}`} />
          )}
        </div>
      </Card>

      {/* Keys reset each section's local inputs when the leg is replaced by a server response. */}
      <LegStatusSection key={`status-${leg.current_status}-${leg.route}`} leg={leg} onUpdated={handleUpdated} />
      <LegDatesSection leg={leg} onUpdated={handleUpdated} />
      <LegCheckpointsSection key={`cp-${leg.route}`} leg={leg} onUpdated={handleUpdated} />
      <LegPodSection leg={leg} onUpdated={handleUpdated} />
    </div>
  )
}
