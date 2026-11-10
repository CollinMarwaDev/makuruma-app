import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { Truck } from '~/types/truck'
import { deleteTruck, fetchTrucks } from '~/services/truckService'
import { TRUCK_COMPLIANCE_TYPES } from '~/constants/compliance'
import TruckForm from '~/components/TruckForm'
import { Card } from '~/global/components/card'
import { LabelValueListItem } from '~/global/components/label-value-list-item'
import type { ColumnHeader } from '~/global/components/table'
import type { ListConfig } from '~/global/hooks/use-list-params'
import { getExpiryStatus } from '~/utils/documentHelpers'
import { TripStatusBadge, TruckStatusBadge } from '~/components/assets/asset-badges'
import { CrudListPage } from '~/components/common/crud-list-page'
import { DocumentsCard } from '~/components/common/documents-card'
import { ExpiryBadge } from '~/components/common/expiry-badge'
import { RecordCell, RecordTableSection } from '~/components/common/record-table-section'

const HEADERS: ColumnHeader[] = [
  { id: 'reg_no', label: 'Reg no' },
  { id: 'capacity', label: 'Capacity' },
  { id: 'status', label: 'Status' },
  { canSort: false, id: 'trailer', label: 'Trailer / driver' },
  ...TRUCK_COMPLIANCE_TYPES.map(({ key, label }) => ({ canSort: false, id: key, label })),
]

const LIST: ListConfig<Truck> = {
  defaultSort: { by: 'reg_no', order: 'asc' },
  filters: {
    documents: (t, v) => t.documents.some((d) => getExpiryStatus(d) === v),
    missing: (t, v) => (v === 'trailer' ? !t.trailer_id : !t.driver_id),
    status: (t, v) => t.status === v,
    trip: (t, v) => t.trip_status === v,
  },
  search: (t) => [t.reg_no, t.trailer?.reg_no, t.driver?.full_name],
  sort: { capacity: (t) => Number(t.capacity), reg_no: (t) => t.reg_no, status: (t) => t.status },
}

/** Trucks tab of Assets. */
export function TrucksList() {
  return (
    <CrudListPage<Truck>
      embedded
      title="Trucks"
      subtitle=""
      entity="truck"
      retryLink="/assets?tab=trucks"
      fetchRows={fetchTrucks}
      removeRow={deleteTruck}
      name={(t) => t.reg_no}
      formSize="wide"
      deleteDescription="This cannot be undone. A truck on a booking or trip cannot be deleted."
      renderForm={(t, onSaved) => <TruckForm key={t?.id ?? 'new'} truck={t} onSaved={onSaved} />}
      renderDetails={(t) => (
        <>
          <Card className="space-y-3 p-4">
            <LabelValueListItem label="Reg no" value={t.reg_no} />
            <LabelValueListItem label="Capacity" value={`${t.capacity} tons`} />
            <LabelValueListItem label="Status" value={<TruckStatusBadge status={t.status} />} />
            <LabelValueListItem label="Trip" value={<TripStatusBadge status={t.trip_status} />} />
            <LabelValueListItem label="Trailer" value={t.trailer?.reg_no ?? 'Not assigned'} />
            <LabelValueListItem label="Driver" value={t.driver?.full_name ?? 'Not assigned'} />
            <LabelValueListItem label="Location" value={t.current_location ?? '—'} />
            <LabelValueListItem label="Buying price" value={t.buying_price ? Number(t.buying_price).toLocaleString() : '—'} />
          </Card>
          <DocumentsCard documents={t.documents} types={TRUCK_COMPLIANCE_TYPES} />
        </>
      )}
      renderList={(h) => (
        <RecordTableSection
          rows={h.rows}
          isLoading={h.isLoading}
          config={LIST}
          headers={HEADERS}
          excludeParams={['tab']}
          searchPlaceholder="Search reg no, trailer, driver"
          createLabel="Add truck"
          onCreate={h.onCreate}
          onView={h.onView}
          empty={{ notFound: 'No truck matches your search or filters.', text: 'Add trucks with their trailer, driver and permits.', title: 'No trucks yet' }}
          filters={(setFilter) => [
            {
              label: 'Status',
              onClick: () => undefined,
              subItems: (['active', 'maintenance', 'decommissioned'] as const).map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), onClick: () => setFilter('status', s) })),
            },
            {
              label: 'Trip',
              onClick: () => undefined,
              subItems: [
                { label: 'Go trip', onClick: () => setFilter('trip', 'go') },
                { label: 'Return trip', onClick: () => setFilter('trip', 'return') },
                { label: 'Off duty', onClick: () => setFilter('trip', 'off_duty') },
              ],
            },
            {
              label: 'Missing',
              onClick: () => undefined,
              subItems: [
                { label: 'No trailer', onClick: () => setFilter('missing', 'trailer') },
                { label: 'No driver', onClick: () => setFilter('missing', 'driver') },
              ],
            },
            {
              label: 'Documents',
              onClick: () => undefined,
              subItems: [
                { label: 'Expired', onClick: () => setFilter('documents', 'expired') },
                { label: 'Expiring in 30 days', onClick: () => setFilter('documents', 'expiring-soon') },
              ],
            },
          ]}
          menuItems={(t) => [
            { icon: EyeIcon, label: 'View', onClick: () => h.onView(t) },
            { icon: PencilSquareIcon, label: 'Edit', onClick: () => h.onEdit(t) },
            { icon: TrashIcon, label: 'Delete', onClick: () => h.onDelete(t) },
          ]}
          cells={(t) => (
            <>
              <RecordCell>
                <p className="font-medium">{t.reg_no}</p>
                <TripStatusBadge status={t.trip_status} />
              </RecordCell>
              <RecordCell className="whitespace-nowrap text-muted-foreground">{t.capacity} tons</RecordCell>
              <RecordCell><TruckStatusBadge status={t.status} /></RecordCell>
              <RecordCell className="text-muted-foreground">
                <p>{t.trailer?.reg_no ?? 'no trailer'}</p>
                <p className="text-xs">{t.driver?.full_name ?? 'no driver'}</p>
              </RecordCell>
              {TRUCK_COMPLIANCE_TYPES.map(({ key }) => (
                <RecordCell key={key}>
                  <ExpiryBadge doc={t.documents.find((d) => d.document_type === key)} />
                </RecordCell>
              ))}
            </>
          )}
        />
      )}
    />
  )
}
