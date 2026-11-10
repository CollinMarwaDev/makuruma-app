import { ArrowDownTrayIcon, EyeIcon } from '@heroicons/react/24/outline'
import type { Trip } from '~/types/trip'
import { fetchTrips } from '~/services/tripService'
import { downloadTruckProfitReport } from '~/services/truckProfitReportService'
import { DetailsSlideOver } from '~/components/common/details-slide-over'
import { ListPage } from '~/components/common/list-page'
import { RecordCell, RecordTableSection } from '~/components/common/record-table-section'
import { useDetailsParam } from '~/components/common/use-details-param'
import { useFetchList } from '~/components/common/use-fetch-list'
import { TripLegCard } from '~/components/trips/trip-leg-card'
import { Badge } from '~/global/components/badge'
import { Button } from '~/global/components/button'
import type { ColumnHeader } from '~/global/components/table'
import { distinctValues, type ListConfig } from '~/global/hooks/use-list-params'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

const isComplete = (t: Trip) => !!t.return_booking_truck
const clientsOf = (t: Trip) => [t.go_booking_truck?.booking.client.company_name, t.return_booking_truck?.booking.client.company_name]

const HEADERS: ColumnHeader[] = [
  { id: 'trip_code', label: 'Trip code' },
  { id: 'truck', label: 'Truck' },
  { canSort: false, id: 'go', label: 'Go booking' },
  { canSort: false, id: 'return', label: 'Return booking' },
  { id: 'status', label: 'Status' },
  { id: 'created_at', label: 'Started' },
]

const LIST: ListConfig<Trip> = {
  defaultSort: { by: 'created_at', order: 'desc' },
  filters: { client: (t, v) => clientsOf(t).includes(v), status: (t, v) => (v === 'completed') === isComplete(t) },
  search: (t) => [t.trip_code, t.truck.reg_no, t.go_booking_truck?.booking.booking_number, t.return_booking_truck?.booking.booking_number, ...clientsOf(t)],
  sort: { created_at: (t) => t.created_at, status: (t) => Number(isComplete(t)), trip_code: (t) => t.trip_code, truck: (t) => t.truck.reg_no },
}

const TripStatusBadge = ({ trip }: { trip: Trip }) => (
  <Badge variant={isComplete(trip) ? 'success' : 'warning'} label={isComplete(trip) ? 'Go + Return booked' : 'Awaiting return'} />
)

const BookingCell = ({ leg }: { leg: Trip['go_booking_truck'] }) =>
  leg ? (
    <>
      <p>{leg.booking.booking_number}</p>
      <p className="text-xs">{leg.booking.client.company_name}</p>
    </>
  ) : (
    <>—</>
  )

async function downloadReport(trip: Trip) {
  try {
    await downloadTruckProfitReport(trip.truck.id, trip.truck.reg_no, new Date().getFullYear())
  } catch (err) {
    toast.error(getErrorMessage(err))
  }
}

function Trips() {
  const { data: trips, error, loading } = useFetchList(fetchTrips)
  const { openDetails } = useDetailsParam()

  return (
    <ListPage
      title="Trips"
      subtitle="Each truck's Go and Return journey, linked by trip code."
      error={error}
      loading={loading}
      retryLink="/trips"
      overlays={
        <DetailsSlideOver
          records={trips}
          title={(t) => `Trip ${t.trip_code}`}
          footer={(t) => (
            <Button variant="outline" onClick={() => void downloadReport(t)}>
              <ArrowDownTrayIcon className="size-4" /> {t.truck.reg_no} profit report ({new Date().getFullYear()})
            </Button>
          )}
        >
          {(t) => (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-foreground">{t.truck.reg_no}</span>
                <TripStatusBadge trip={t} />
              </div>
              <TripLegCard title="Go leg" leg={t.go_booking_truck} />
              <TripLegCard title="Return leg" leg={t.return_booking_truck} />
            </>
          )}
        </DetailsSlideOver>
      }
    >
      <RecordTableSection
        rows={trips}
        isLoading={loading}
        config={LIST}
        headers={HEADERS}
        searchPlaceholder="Search trip code, truck, booking, client"
        onView={(t) => openDetails(t.id)}
        empty={{ notFound: 'No trip matches your search or filters.', text: 'A trip starts when a truck is put on a Go booking.', title: 'No trips yet' }}
        filters={(setFilter) => [
          {
            label: 'Status',
            onClick: () => undefined,
            subItems: [
              { label: 'Awaiting return', onClick: () => setFilter('status', 'awaiting') },
              { label: 'Go + Return booked', onClick: () => setFilter('status', 'completed') },
            ],
          },
          { label: 'Client', onClick: () => undefined, subItems: distinctValues(trips.flatMap(clientsOf), (c) => c).map((c) => ({ label: c, onClick: () => setFilter('client', c) })) },
        ]}
        menuItems={(t) => [
          { icon: EyeIcon, label: 'View', onClick: () => openDetails(t.id) },
          { icon: ArrowDownTrayIcon, label: 'Profit report', onClick: () => void downloadReport(t) },
        ]}
        cells={(t) => (
          <>
            <RecordCell className="font-medium">{t.trip_code}</RecordCell>
            <RecordCell className="text-muted-foreground">{t.truck.reg_no}</RecordCell>
            <RecordCell className="text-muted-foreground"><BookingCell leg={t.go_booking_truck} /></RecordCell>
            <RecordCell className="text-muted-foreground"><BookingCell leg={t.return_booking_truck} /></RecordCell>
            <RecordCell><TripStatusBadge trip={t} /></RecordCell>
            <RecordCell className="whitespace-nowrap text-muted-foreground">{t.created_at.slice(0, 10)}</RecordCell>
          </>
        )}
      />
    </ListPage>
  )
}

export default Trips
