import type { FC } from 'react'
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { Staff } from '~/types/employee'
import { Badge } from '~/global/components/badge'
import type { ColumnHeader } from '~/global/components/table'
import type { ListConfig } from '~/global/hooks/use-list-params'
import { RecordCell, RecordTableSection } from '~/components/common/record-table-section'

interface StaffTableSectionProps {
  isLoading: boolean
  onCreate: () => void
  onDelete: (member: Staff) => void
  onEdit: (member: Staff) => void
  onView: (member: Staff) => void
  staff: Staff[]
}

const HEADERS: ColumnHeader[] = [
  { id: 'name', label: 'Full name' },
  { canSort: false, id: 'phone', label: 'Phone' },
  { canSort: false, id: 'tin', label: 'TIN' },
  { canSort: false, id: 'account', label: 'Payment account' },
  { id: 'attachment', label: 'Attachment' },
]

const LIST: ListConfig<Staff> = {
  defaultSort: { by: 'name', order: 'asc' },
  filters: { attachment: (s, v) => (v === 'yes') === s.documents.length > 0 },
  search: (s) => [s.full_name, s.phone, s.tin_number, s.payment_account],
  sort: { attachment: (s) => s.documents.length, name: (s) => s.full_name.toLowerCase() },
}

/** Staff list: search, attachment filter, sortable table, View / Edit / Delete. */
export const StaffTableSection: FC<StaffTableSectionProps> = ({ isLoading, onCreate, onDelete, onEdit, onView, staff }) => (
  <RecordTableSection
    rows={staff}
    isLoading={isLoading}
    config={LIST}
    headers={HEADERS}
    searchPlaceholder="Search name, phone, TIN, account"
    createLabel="Add staff"
    onCreate={onCreate}
    onView={onView}
    empty={{ notFound: 'No staff member matches your search or filters.', text: 'Add office staff to record their details and attachments.', title: 'No staff yet' }}
    filters={(setFilter) => [
      {
        label: 'Attachment',
        onClick: () => undefined,
        subItems: [
          { label: 'Has attachment', onClick: () => setFilter('attachment', 'yes') },
          { label: 'No attachment', onClick: () => setFilter('attachment', 'no') },
        ],
      },
    ]}
    menuItems={(member) => [
      { icon: EyeIcon, label: 'View', onClick: () => onView(member) },
      { icon: PencilSquareIcon, label: 'Edit', onClick: () => onEdit(member) },
      { icon: TrashIcon, label: 'Delete', onClick: () => onDelete(member) },
    ]}
    cells={(member) => (
      <>
        <RecordCell className="font-medium">{member.full_name}</RecordCell>
        <RecordCell className="text-muted-foreground">{member.phone ?? '—'}</RecordCell>
        <RecordCell className="text-muted-foreground">{member.tin_number ?? '—'}</RecordCell>
        <RecordCell className="text-muted-foreground">{member.payment_account ?? '—'}</RecordCell>
        <RecordCell>
          <Badge hideDotIndicator variant={member.documents.length ? 'success' : 'disabled'} label={member.documents.length ? 'Attached' : 'None'} />
        </RecordCell>
      </>
    )}
  />
)
