import type { FC } from 'react'
import { Link } from 'react-router-dom'
import type { TripBookingTruck } from '~/types/trip'
import { Badge } from '~/global/components/badge'
import { Card } from '~/global/components/card'
import { LabelValueListItem } from '~/global/components/label-value-list-item'
import { StatusBadge } from '~/components/tracking/status-badge'

/** One leg (Go or Return) of a trip in the trip slide-over. */
export const TripLegCard: FC<{ leg: TripBookingTruck | null; title: string }> = ({ leg, title }) => (
  <Card className="space-y-3 p-4">
    <div className="flex items-center justify-between gap-2">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {leg?.current_status && <StatusBadge status={leg.current_status} />}
    </div>
    {leg ? (
      <>
        <LabelValueListItem label="Booking" value={leg.booking.booking_number} />
        <LabelValueListItem label="Client" value={leg.booking.client.company_name} />
        <LabelValueListItem
          label="Route"
          value={`${leg.loading_point ?? leg.booking.loading_point ?? '—'} → ${leg.offloading_point ?? leg.booking.offloading_point ?? '—'}`}
        />
        <LabelValueListItem label="Cargo · tons" value={`${leg.cargo ?? '—'} · ${leg.capacity ?? '—'}`} />
        <LabelValueListItem label="Driver" value={leg.driver?.full_name ?? '—'} />
        <LabelValueListItem label="Loaded → offloaded" value={`${leg.loading_date?.slice(0, 10) ?? '—'} → ${leg.offloading_date?.slice(0, 10) ?? '—'}`} />
        <div className="flex items-center justify-between gap-2">
          {leg.is_overdue ? <Badge variant="danger" label="Past ETA" /> : <span />}
          <Link to={`/tracking?leg=${leg.id}`} className="text-sm font-medium text-primary hover:underline">
            Open tracking →
          </Link>
        </div>
      </>
    ) : (
      <p className="text-sm text-muted-foreground">Not booked yet.</p>
    )}
  </Card>
)
