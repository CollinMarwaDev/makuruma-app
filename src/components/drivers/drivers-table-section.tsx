import type { FC } from 'react'
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { Driver } from '~/types/employee'
import { DRIVER_DOCUMENT_TYPES } from '~/constants/employeeCompliance'
import type { ColumnHeader } from '~/global/components/table'
import type { ListConfig } from '~/global/hooks/use-list-params'
import { getExpiryStatus } from '~/utils/documentHelpers'
import { ExpiryBadge } from '~/components/common/expiry-badge'
import { RecordCell, RecordTableSection } from '~/components/common/record-table-section'

interface DriversTableSectionProps {
  drivers: Driver[]
  isLoading: boolean
  onCreate: () => void
  onDelete: (driver: Driver) => void
  onEdit: (driver: Driver) => void
  onView: (driver: Driver) => void
}

const HEADERS: ColumnHeader[] = [
  { id: 'name', label: 'Full name' },
  { canSort: false, id: 'phone', label: 'Phone' },
  ...DRIVER_DOCUMENT_TYPES.map(({ key, label }) => ({ canSort: false, id: key, label })),
]

const LIST: ListConfig<Driver> = {
  defaultSort: { by: 'name', order: 'asc' },
  filters: { documents: (d, v) => d.documents.some((doc) => getExpiryStatus(doc) === v) },
  search: (d) => [d.full_name, d.phone, ...d.documents.map((doc) => doc.number)],
  sort: { name: (d) => d.full_name.toLowerCase() },
}

/** Drivers list: search, document-expiry filter, compliance badges, View / Edit / Delete. */
export const DriversTableSection: FC<DriversTableSectionProps> = ({ drivers, isLoading, onCreate, onDelete, onEdit, onView }) => (
  <RecordTableSection
    rows={drivers}
    isLoading={isLoading}
    config={LIST}
    headers={HEADERS}
    searchPlaceholder="Search name, phone, document number"
    createLabel="Add driver"
    onCreate={onCreate}
    onView={onView}
    empty={{ notFound: 'No driver matches your search or filters.', text: 'Add drivers with their licence and passport to assign them to trucks.', title: 'No drivers yet' }}
    filters={(setFilter) => [
      {
        label: 'Documents',
        onClick: () => undefined,
        subItems: [
          { label: 'Expired', onClick: () => setFilter('documents', 'expired') },
          { label: 'Expiring in 30 days', onClick: () => setFilter('documents', 'expiring-soon') },
        ],
      },
    ]}
    menuItems={(driver) => [
      { icon: EyeIcon, label: 'View', onClick: () => onView(driver) },
      { icon: PencilSquareIcon, label: 'Edit', onClick: () => onEdit(driver) },
      { icon: TrashIcon, label: 'Delete', onClick: () => onDelete(driver) },
    ]}
    cells={(driver) => (
      <>
        <RecordCell className="font-medium">{driver.full_name}</RecordCell>
        <RecordCell className="text-muted-foreground">{driver.phone ?? '—'}</RecordCell>
        {DRIVER_DOCUMENT_TYPES.map(({ key }) => (
          <RecordCell key={key}>
            <ExpiryBadge doc={driver.documents.find((d) => d.document_type === key)} />
          </RecordCell>
        ))}
      </>
    )}
  />
)
