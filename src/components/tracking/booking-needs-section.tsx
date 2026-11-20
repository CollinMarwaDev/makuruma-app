import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '~/global/components/badge'
import { EmptyState } from '~/global/components/empty-state'
import { createTable, type ColumnHeader } from '~/global/components/table'
import { StatusBadge } from '~/components/tracking/status-badge'
import type { BookingNeeds } from '~/services/trackingService'

type Unbooked = BookingNeeds['unbooked'][number]
type Urgent = BookingNeeds['urgent'][number]

interface BookingNeedsSectionProps {
  isLoading: boolean
  needs: BookingNeeds
  onOpenLeg: (legId: number) => void
  search: string
  view: 'unbooked' | 'urgent'
}

const UnbookedTable = createTable<Unbooked & { id: number }>()
const UrgentTable = createTable<Urgent & { id: number }>()

const UNBOOKED_HEADERS: ColumnHeader[] = [
  { id: 'truck', label: 'Truck' },
  { id: 'needs', label: 'Next booking' },
  { id: 'last', label: 'Last leg' },
  { id: 'location', label: 'Last location' },
  { id: 'idle', label: 'Idle' },
  { id: 'actions', label: '' },
].map((h) => ({ ...h, canSort: false }))

const URGENT_HEADERS: ColumnHeader[] = [
  { id: 'truck', label: 'Truck' },
  { id: 'needs', label: 'Needs' },
  { id: 'booking', label: 'Current leg' },
  { id: 'reached', label: 'Reached' },
  { id: 'status', label: 'Status' },
  { id: 'actions', label: '' },
].map((h) => ({ ...h, canSort: false }))

const directionLabel = (d: 'go' | 'return' | null) => (d === 'go' ? 'Go' : d === 'return' ? 'Return' : '—')

const BookLink: FC<{ direction: 'go' | 'return' }> = ({ direction }) => (
  <Link to={`/bookings?new=${direction}`} className="whitespace-nowrap text-xs font-medium text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
    Create {directionLabel(direction)} booking
  </Link>
)

const matches = (term: string, values: (string | null | undefined)[]) => !term || values.some((v) => v?.toLowerCase().includes(term))

/**
 * Tracking tabs "Unbooked" and "Needs booking" (UAT 20 Nov): trucks without an open leg, and trucks that reached
 * Kasumbalesa/Sakania Zambia (Go, no Return yet) or Nakonde (Return, no next Go).
 */
export const BookingNeedsSection: FC<BookingNeedsSectionProps> = ({ isLoading, needs, onOpenLeg, search, view }) => {
  const term = search.trim().toLowerCase()

  if (isLoading) return <UnbookedTable.Loading columns={5} rows={6} className="pt-4" />

  if (view === 'unbooked') {
    const rows = needs.unbooked
      .filter((r) => matches(term, [r.truck.reg_no, r.trailer, r.driver, r.location, r.last_leg?.booking_number]))
      .map((r) => ({ ...r, id: r.truck.id }))
    if (rows.length === 0) {
      return <EmptyState className="py-10" ignoreParams={['view']} noDataTitle="Every truck is booked" noDataText="Trucks with no open Go or Return leg appear here." searchNotFoundText="No unbooked truck matches your search." />
    }
    return (
      <UnbookedTable data={rows}>
        <UnbookedTable.Header headers={UNBOOKED_HEADERS} />
        <UnbookedTable.Body>
          {(r) => (
            <UnbookedTable.Row rowId={String(r.id)}>
              <UnbookedTable.Cell>
                <p className="font-medium">{r.truck.reg_no}</p>
                <p className="text-xs text-muted-foreground">{r.trailer ?? 'no trailer'} · {r.driver ?? 'no driver'}{r.driver_phone ? ` · ${r.driver_phone}` : ''}</p>
              </UnbookedTable.Cell>
              <UnbookedTable.Cell>
                <Badge hideDotIndicator variant={r.needs === 'go' ? 'warning' : 'default'} label={directionLabel(r.needs)} />
              </UnbookedTable.Cell>
              <UnbookedTable.Cell className="text-muted-foreground">
                {r.last_leg ? (
                  <>
                    <p>{r.last_leg.booking_number} · {directionLabel(r.last_leg.direction)}</p>
                    <p className="text-xs">Offloaded {r.last_leg.offloading_date?.slice(0, 10) ?? '—'} at {r.last_leg.offloading_point ?? '—'}</p>
                  </>
                ) : (
                  'Never booked'
                )}
              </UnbookedTable.Cell>
              <UnbookedTable.Cell className="text-muted-foreground">{r.location ?? '—'}</UnbookedTable.Cell>
              <UnbookedTable.Cell className="whitespace-nowrap text-muted-foreground">{r.days_idle === null ? '—' : `${r.days_idle} day${r.days_idle === 1 ? '' : 's'}`}</UnbookedTable.Cell>
              <UnbookedTable.Cell className="text-right"><BookLink direction={r.needs} /></UnbookedTable.Cell>
            </UnbookedTable.Row>
          )}
        </UnbookedTable.Body>
      </UnbookedTable>
    )
  }

  const rows = needs.urgent
    .filter((r) => matches(term, [r.truck.reg_no, r.driver, r.booking_number, r.client, r.reached, r.location]))
    .map((r) => ({ ...r, id: r.leg_id }))
  if (rows.length === 0) {
    return <EmptyState className="py-10" ignoreParams={['view']} noDataTitle="No urgent bookings" noDataText="Go trucks that reached Kasumbalesa or Sakania (Zambia) without a Return, and Return trucks that reached Nakonde without a next Go, appear here." searchNotFoundText="No truck matches your search." />
  }
  return (
    <UrgentTable data={rows}>
      <UrgentTable.Header headers={URGENT_HEADERS} />
      <UrgentTable.Body>
        {(r) => (
          <UrgentTable.Row rowId={String(r.id)} className="cursor-pointer hover:bg-primary-50" onClick={() => onOpenLeg(r.leg_id)}>
            <UrgentTable.Cell>
              <p className="font-medium">{r.truck.reg_no}</p>
              <p className="text-xs text-muted-foreground">{r.driver ?? 'no driver'}{r.driver_phone ? ` · ${r.driver_phone}` : ''}</p>
            </UrgentTable.Cell>
            <UrgentTable.Cell>
              <Badge variant="danger" label={`${directionLabel(r.needs)} booking`} />
            </UrgentTable.Cell>
            <UrgentTable.Cell className="text-muted-foreground">
              <p>{r.booking_number} · {directionLabel(r.direction)}</p>
              <p className="text-xs">{r.client ?? '—'}</p>
            </UrgentTable.Cell>
            <UrgentTable.Cell className="text-muted-foreground">
              <p>{r.reached}</p>
              <p className="text-xs">{r.reached_at ?? 'from current location'}</p>
            </UrgentTable.Cell>
            <UrgentTable.Cell><StatusBadge status={r.status} /></UrgentTable.Cell>
            <UrgentTable.Cell className="text-right"><BookLink direction={r.needs} /></UrgentTable.Cell>
          </UrgentTable.Row>
        )}
      </UrgentTable.Body>
    </UrgentTable>
  )
}
