import type { FC } from 'react'
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { Vendor } from '~/types/partner'
import { Badge } from '~/global/components/badge'
import type { ColumnHeader } from '~/global/components/table'
import type { ListConfig } from '~/global/hooks/use-list-params'
import { RecordCell, RecordTableSection } from '~/components/common/record-table-section'
import { useVendorTypes } from '~/components/vendors/use-vendor-types'

interface VendorsTableSectionProps {
  isLoading: boolean
  onCreate: () => void
  onDelete: (vendor: Vendor) => void
  onEdit: (vendor: Vendor) => void
  onView: (vendor: Vendor) => void
  vendors: Vendor[]
}

const HEADERS: ColumnHeader[] = [
  { id: 'company', label: 'Company' },
  { id: 'type', label: 'Type' },
  { canSort: false, id: 'phone', label: 'Phone' },
  { canSort: false, id: 'location', label: 'Location' },
]

const LIST: ListConfig<Vendor> = {
  defaultSort: { by: 'company', order: 'asc' },
  filters: { type: (v, value) => v.vendor_type === value },
  search: (v) => [v.company_name, v.phone, v.location],
  sort: { company: (v) => v.company_name.toLowerCase(), type: (v) => v.vendor_type },
}

export const VendorTypeBadge: FC<{ name: string; type: Vendor['vendor_type'] }> = ({ name, type }) => (
  <Badge hideDotIndicator variant={type === 'fuel' ? 'warning' : 'default'} label={name} />
)

/** Vendors list: search, vendor-type filter, sortable table, View / Edit / Delete. */
export const VendorsTableSection: FC<VendorsTableSectionProps> = ({ isLoading, onCreate, onDelete, onEdit, onView, vendors }) => {
  const { typeName, types } = useVendorTypes()

  return (
  <RecordTableSection
    rows={vendors}
    isLoading={isLoading}
    config={LIST}
    headers={HEADERS}
    searchPlaceholder="Search company, phone, location"
    createLabel="Add vendor"
    onCreate={onCreate}
    onView={onView}
    empty={{ notFound: 'No vendor matches your search or filters.', text: 'Add fuel, ECIL and other vendors to record their expenses and payments.', title: 'No vendors yet' }}
    filters={(setFilter) => [
      {
        label: 'Vendor type',
        onClick: () => undefined,
        subItems: types.map((t) => ({ label: t.name, onClick: () => setFilter('type', t.slug ?? '') })),
      },
    ]}
    menuItems={(vendor) => [
      { icon: EyeIcon, label: 'View', onClick: () => onView(vendor) },
      { icon: PencilSquareIcon, label: 'Edit', onClick: () => onEdit(vendor) },
      { icon: TrashIcon, label: 'Delete', onClick: () => onDelete(vendor) },
    ]}
    cells={(vendor) => (
      <>
        <RecordCell className="font-medium">{vendor.company_name}</RecordCell>
        <RecordCell><VendorTypeBadge type={vendor.vendor_type} name={typeName(vendor.vendor_type)} /></RecordCell>
        <RecordCell className="text-muted-foreground">{vendor.phone ?? '—'}</RecordCell>
        <RecordCell className="text-muted-foreground">{vendor.location ?? '—'}</RecordCell>
      </>
    )}
  />
  )
}
