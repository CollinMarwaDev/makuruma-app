import type { FC } from 'react'
import { ArrowDownTrayIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { BORDER_ROUTE_LABELS, type TrackingLeg } from '~/types/tracking'
import { Badge } from '~/global/components/badge'
import { EllipsisMenu } from '~/global/components/ellipsis-menu'
import { EmptyState } from '~/global/components/empty-state'
import { Pagination } from '~/global/components/pagination'
import { TableSection, type Filter } from '~/global/components/table-section'
import { createTable, type ColumnHeader } from '~/global/components/table'
import { TabLinks } from '~/global/components/tab-link'
import { StatusBadge } from '~/components/tracking/status-badge'
import { useTrackingList, type TrackingView } from '~/components/tracking/use-tracking-list'
import { useTrackingStatuses } from '~/components/tracking/use-tracking-statuses'

interface TrackingTableSectionProps {
  isLoading: boolean
  legs: TrackingLeg[]
  onDownload: (leg: TrackingLeg) => void
  onOpen: (leg: TrackingLeg) => void
}

const LegTable = createTable<TrackingLeg>()

const HEADERS: ColumnHeader[] = [
  { id: 'truck', label: 'Truck' },
  { id: 'booking', label: 'Booking' },
  { id: 'status', label: 'Status' },
  { canSort: false, id: 'location', label: 'Current location' },
  { canSort: false, id: 'route', label: 'Route' },
  { canSort: false, id: 'dates', label: 'Loaded → Offloaded' },
  { canSort: false, id: 'actions', label: '' },
]

/** View tabs live in the URL (`?view=`), so they use the global TabLinks. Switching a tab clears search and filters. */
const VIEWS: { label: string; matchPattern: RegExp; value: TrackingView }[] = [
  { label: 'All active', matchPattern: /^\/tracking(?![^#]*[?&]view=(go|return|completed)\b)/, value: 'active' },
  { label: 'Go', matchPattern: /^\/tracking\?(.*&)?view=go\b/, value: 'go' },
  { label: 'Return', matchPattern: /^\/tracking\?(.*&)?view=return\b/, value: 'return' },
  { label: 'Completed', matchPattern: /^\/tracking\?(.*&)?view=completed\b/, value: 'completed' },
]

const day = (value: string | null) => (value ? value.slice(0, 10) : '—')

/** Tracking legs on the global TableSection: view tabs, search, filters, table, empty state, pagination. */
export const TrackingTableSection: FC<TrackingTableSectionProps> = ({ isLoading, legs, onDownload, onOpen }) => {
  const { clients, counts, filtered, pageRows, setFilter, totalPages, view } = useTrackingList(legs)
  const { activeStatuses } = useTrackingStatuses()

  const filters: Filter[] = [
    {
      label: 'Status',
      onClick: () => undefined,
      subItems: activeStatuses.map((s) => ({ label: s.label, onClick: () => setFilter('status', s.key) })),
    },
    { label: 'Client', onClick: () => undefined, subItems: clients.map((c) => ({ label: c, onClick: () => setFilter('client', c) })) },
    {
      label: 'Border route',
      onClick: () => undefined,
      subItems: (['kasumbalesa', 'sakania'] as const).map((r) => ({ label: BORDER_ROUTE_LABELS[r], onClick: () => setFilter('route', r) })),
    },
    { label: 'Needs attention (late / POD)', onClick: () => setFilter('attention', 'yes') },
  ]

  return (
    <TableSection>
      <TabLinks
        containerClassName="overflow-x-auto px-4 pt-3"
        tabs={VIEWS.map((tab) => ({
          matchPattern: tab.matchPattern,
          name: `${tab.label} (${counts[tab.value]})`,
          url: tab.value === 'active' ? '/tracking' : `/tracking?view=${tab.value}`,
        }))}
      />

      <TableSection.Header className="flex-wrap gap-3">
        <TableSection.SearchAndFilter filters={filters} placeholder="Search truck, driver, trip, booking" />
      </TableSection.Header>
      <TableSection.ActiveFilters exclude={['sortBy', 'sortOrder', 'view']} className="-mt-2 pb-4" />

      {isLoading ? (
        <LegTable.Loading columns={6} rows={6} className="pt-4" />
      ) : filtered.length === 0 ? (
        <EmptyState
          className="py-10"
          ignoreParams={['currentPage', 'sortBy', 'sortOrder', 'view']}
          noDataTitle={view === 'completed' ? 'No completed trips yet' : 'No trucks on the road'}
          noDataText={view === 'completed' ? 'Completed legs appear here.' : 'Trucks appear here once they are booked on a Go or Return trip.'}
          searchNotFoundText="No truck matches your search or filters. Clear a filter chip to see more."
        />
      ) : (
        <LegTable data={pageRows}>
          <LegTable.Header headers={HEADERS} />
          <LegTable.Body>
            {(leg) => {
              const hasPod = leg.documents.some((d) => d.document_type === 'POD')
              return (
                <LegTable.Row rowId={String(leg.id)} className="cursor-pointer hover:bg-primary-50" onClick={() => onOpen(leg)}>
                  <LegTable.Cell>
                    <p className="font-medium">{leg.truck.reg_no}</p>
                    <p className="text-xs text-muted-foreground">
                      {leg.trailer?.reg_no ?? 'no trailer'} · {leg.driver?.full_name ?? 'no driver'}
                    </p>
                  </LegTable.Cell>
                  <LegTable.Cell>
                    <div className="flex items-center gap-2">
                      <span>{leg.booking.booking_number}</span>
                      <Badge hideDotIndicator variant={leg.booking.direction === 'go' ? 'warning' : 'default'} label={leg.booking.direction === 'go' ? 'Go' : 'Return'} />
                    </div>
                    <p className="text-xs text-muted-foreground">{leg.booking.client?.company_name ?? '—'} · {leg.trip?.trip_code ?? 'no trip'}</p>
                  </LegTable.Cell>
                  <LegTable.Cell>
                    <div className="flex flex-wrap gap-1">
                      <StatusBadge status={leg.current_status} />
                      {leg.is_overdue && <Badge variant="danger" label="Past ETA" />}
                      {leg.pod_overdue && <Badge variant="danger" label="POD overdue" />}
                      {leg.auto_completed_at && <Badge hideDotIndicator variant="disabled" label="Auto" />}
                    </div>
                  </LegTable.Cell>
                  <LegTable.Cell className="text-muted-foreground">{leg.current_location ?? '—'}</LegTable.Cell>
                  <LegTable.Cell className="text-muted-foreground">
                    <p>{leg.loading_point ?? '—'} → {leg.offloading_point ?? '—'}</p>
                    <p className="text-xs">via {BORDER_ROUTE_LABELS[leg.route]}</p>
                  </LegTable.Cell>
                  <LegTable.Cell className="whitespace-nowrap text-muted-foreground">
                    <p>{day(leg.loading_date)} → {day(leg.offloading_date)}</p>
                    {leg.offloading_date && <p className="text-xs">{hasPod ? 'POD uploaded' : 'POD pending'}</p>}
                  </LegTable.Cell>
                  <LegTable.Cell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <EllipsisMenu
                      title="Tracking actions"
                      menuItems={[
                        { icon: MapPinIcon, label: 'Update tracking', onClick: () => onOpen(leg) },
                        { icon: ArrowDownTrayIcon, label: 'Download report', onClick: () => onDownload(leg) },
                      ]}
                    />
                  </LegTable.Cell>
                </LegTable.Row>
              )
            }}
          </LegTable.Body>
        </LegTable>
      )}

      {!isLoading && totalPages > 1 && (
        <TableSection.Footer>
          <Pagination totalPages={totalPages} />
        </TableSection.Footer>
      )}
    </TableSection>
  )
}
