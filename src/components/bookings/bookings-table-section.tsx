import type { FC } from 'react'
import { ArrowDownTrayIcon, ArrowUturnLeftIcon, DocumentDuplicateIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { Booking } from '~/types/booking'
import { Badge } from '~/global/components/badge'
import { Button } from '~/global/components/button'
import { EllipsisMenu } from '~/global/components/ellipsis-menu'
import { Pagination } from '~/global/components/pagination'
import { TableSection, type Filter } from '~/global/components/table-section'
import { createTable, type ColumnHeader } from '~/global/components/table'
import { EmptyState } from '~/global/components/empty-state'
import { bookingTons, useBookingList } from '~/components/bookings/use-booking-list'

export interface BookingActions {
  onCopy: (booking: Booking) => void
  onCreate: (direction: 'go' | 'return') => void
  onCreateReturn: (booking: Booking) => void
  onDelete: (booking: Booking) => void
  onDownload: (booking: Booking) => void
  onEdit: (booking: Booking) => void
}

interface BookingsTableSectionProps extends BookingActions {
  bookings: Booking[]
  isLoading: boolean
}

const BookingTable = createTable<Booking>()

const HEADERS: ColumnHeader[] = [
  { id: 'booking_number', label: 'Booking No.' },
  { canSort: false, id: 'direction', label: 'Direction' },
  { id: 'client', label: 'Client' },
  { id: 'trucks', label: 'Trucks' },
  { id: 'tons', label: 'Tons' },
  { id: 'eta', label: 'ETA' },
  { canSort: false, id: 'route', label: 'Loading → Offloading' },
  { canSort: false, id: 'actions', label: '' },
]

/** Shared value of a per-truck field, or "Multiple" when the trucks differ. */
function sharedValue(booking: Booking, field: 'loading_point' | 'offloading_point'): string {
  const values = new Set(booking.booking_trucks.map((bt) => bt[field] ?? ''))
  if (values.size > 1) return 'Multiple'
  return [...values][0] || '—'
}

function etaRange(booking: Booking): string {
  const etas = booking.booking_trucks.map((bt) => bt.eta?.slice(0, 10)).filter(Boolean).sort() as string[]
  if (etas.length === 0) return '—'
  return etas[0] === etas[etas.length - 1] ? etas[0] : `${etas[0]} → ${etas[etas.length - 1]}`
}

/** Bookings list built on the global TableSection, Table, SearchBox, filters, Pagination and empty state. */
export const BookingsTableSection: FC<BookingsTableSectionProps> = ({ bookings, isLoading, ...actions }) => {
  const { clients, filteredCount, pageRows, setFilter, totalPages } = useBookingList(bookings)

  const filters: Filter[] = [
    {
      label: 'Direction',
      onClick: () => undefined,
      subItems: [
        { label: 'Go', onClick: () => setFilter('direction', 'go') },
        { label: 'Return', onClick: () => setFilter('direction', 'return') },
      ],
    },
    {
      label: 'Client',
      onClick: () => undefined,
      subItems: clients.map((client) => ({ label: client, onClick: () => setFilter('client', client) })),
    },
  ]

  return (
    <TableSection>
      <TableSection.Header className="flex-wrap gap-3 pb-0">
        <TableSection.SearchAndFilter filters={filters} placeholder="Search booking, client, truck, driver" />
        <TableSection.Actions>
          <Button variant="outline" className="flex items-center gap-2 py-2.5" onClick={() => actions.onCreate('return')}>
            <PlusIcon strokeWidth={2.5} className="size-4" /> New Return Booking
          </Button>
          <Button className="flex items-center gap-2 py-2.5" onClick={() => actions.onCreate('go')}>
            <PlusIcon strokeWidth={2.5} className="size-4" /> New Go Booking
          </Button>
        </TableSection.Actions>
      </TableSection.Header>
      <TableSection.ActiveFilters exclude={['sortBy', 'sortOrder']} className="pb-3" />

      {isLoading ? (
        <BookingTable.Loading columns={7} rows={6} className="pt-4" />
      ) : filteredCount === 0 ? (
        <EmptyState
          className="py-10"
          noDataTitle="No bookings yet"
          noDataText="Create a Go booking to start moving cargo."
          searchNotFoundText="No booking matches your search or filters. Clear a filter chip to see more."
        />
      ) : (
        <BookingTable data={pageRows}>
          <BookingTable.Header headers={HEADERS} />
          <BookingTable.Body>
            {(booking) => {
              const regNos = booking.booking_trucks.map((bt) => bt.truck.reg_no).join(', ')
              return (
                <BookingTable.Row rowId={String(booking.id)}>
                  <BookingTable.Cell className="font-medium">
                    {booking.booking_number}
                    {booking.source_booking && <p className="text-xs font-normal text-muted-foreground">from {booking.source_booking.booking_number}</p>}
                  </BookingTable.Cell>
                  <BookingTable.Cell>
                    <Badge variant={booking.direction === 'go' ? 'warning' : 'default'} label={booking.direction === 'go' ? 'Go' : 'Return'} />
                  </BookingTable.Cell>
                  <BookingTable.Cell>{booking.client.company_name}</BookingTable.Cell>
                  <BookingTable.Cell className="max-w-[10rem] truncate text-muted-foreground" title={regNos}>
                    {regNos} <span className="opacity-70">({booking.booking_trucks.length})</span>
                  </BookingTable.Cell>
                  <BookingTable.Cell className="tabular-nums">{bookingTons(booking).toLocaleString(undefined, { maximumFractionDigits: 2 })}</BookingTable.Cell>
                  <BookingTable.Cell className="text-muted-foreground">{etaRange(booking)}</BookingTable.Cell>
                  <BookingTable.Cell className="text-muted-foreground">
                    {sharedValue(booking, 'loading_point')} → {sharedValue(booking, 'offloading_point')}
                  </BookingTable.Cell>
                  <BookingTable.Cell className="text-right">
                    <EllipsisMenu
                      title="Booking actions"
                      menuItems={[
                        { icon: PencilSquareIcon, label: 'Edit booking', onClick: () => actions.onEdit(booking) },
                        { icon: DocumentDuplicateIcon, label: 'Copy & edit', onClick: () => actions.onCopy(booking) },
                        ...(booking.direction === 'go'
                          ? [{ icon: ArrowUturnLeftIcon, label: 'Create return booking', onClick: () => actions.onCreateReturn(booking) }]
                          : []),
                        { icon: ArrowDownTrayIcon, label: 'Download access list', onClick: () => actions.onDownload(booking) },
                        { danger: true, divider: true, icon: TrashIcon, label: 'Delete', onClick: () => actions.onDelete(booking) },
                      ]}
                    />
                  </BookingTable.Cell>
                </BookingTable.Row>
              )
            }}
          </BookingTable.Body>
        </BookingTable>
      )}

      {!isLoading && totalPages > 1 && (
        <TableSection.Footer>
          <Pagination totalPages={totalPages} />
        </TableSection.Footer>
      )}
    </TableSection>
  )
}
