import type { FC } from 'react'
import { EyeIcon, KeyIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { UserRecord } from '~/types/user'
import { Badge } from '~/global/components/badge'
import type { ColumnHeader } from '~/global/components/table'
import { distinctValues, type ListConfig } from '~/global/hooks/use-list-params'
import { RecordCell, RecordTableSection } from '~/components/common/record-table-section'

interface UsersTableSectionProps {
  canResetPassword: boolean
  isLoading: boolean
  onCreate: () => void
  onDelete: (user: UserRecord) => void
  onEdit: (user: UserRecord) => void
  onResetPassword: (user: UserRecord) => void
  onView: (user: UserRecord) => void
  users: UserRecord[]
}

const HEADERS: ColumnHeader[] = [
  { id: 'name', label: 'Name' },
  { canSort: false, id: 'phone', label: 'Phone' },
  { canSort: false, id: 'email', label: 'Email' },
  { id: 'role', label: 'Role' },
  { id: 'status', label: 'Status' },
]

const LIST: ListConfig<UserRecord> = {
  defaultSort: { by: 'name', order: 'asc' },
  filters: { role: (u, v) => u.role?.name === v, status: (u, v) => u.status === v },
  search: (u) => [u.name, u.email, u.phone],
  sort: { name: (u) => u.name.toLowerCase(), role: (u) => u.role?.name ?? '', status: (u) => u.status },
}

export const UserStatusBadge: FC<{ status: UserRecord['status'] }> = ({ status }) => (
  <Badge variant={status === 'active' ? 'success' : 'danger'} label={status === 'active' ? 'Active' : 'Suspended'} />
)

/** Users list: search, role and status filters, View / Edit / Reset password (admin) / Delete. */
export const UsersTableSection: FC<UsersTableSectionProps> = ({ canResetPassword, isLoading, onCreate, onDelete, onEdit, onResetPassword, onView, users }) => (
  <RecordTableSection
    rows={users}
    isLoading={isLoading}
    config={LIST}
    headers={HEADERS}
    searchPlaceholder="Search name, email, phone"
    createLabel="Add user"
    onCreate={onCreate}
    onView={onView}
    empty={{ notFound: 'No user matches your search or filters.', text: 'Add the people who sign in to the system.', title: 'No users yet' }}
    filters={(setFilter) => [
      { label: 'Role', onClick: () => undefined, subItems: distinctValues(users, (u) => u.role?.name).map((r) => ({ label: r, onClick: () => setFilter('role', r) })) },
      {
        label: 'Status',
        onClick: () => undefined,
        subItems: [
          { label: 'Active', onClick: () => setFilter('status', 'active') },
          { label: 'Suspended', onClick: () => setFilter('status', 'suspended') },
        ],
      },
    ]}
    menuItems={(user) => [
      { icon: EyeIcon, label: 'View', onClick: () => onView(user) },
      { icon: PencilSquareIcon, label: 'Edit', onClick: () => onEdit(user) },
      ...(canResetPassword ? [{ icon: KeyIcon, label: 'Reset password', onClick: () => onResetPassword(user) }] : []),
      { icon: TrashIcon, label: 'Delete', onClick: () => onDelete(user) },
    ]}
    cells={(user) => (
      <>
        <RecordCell className="font-medium">{user.name}</RecordCell>
        <RecordCell className="text-muted-foreground">{user.phone ?? '—'}</RecordCell>
        <RecordCell className="text-muted-foreground">{user.email}</RecordCell>
        <RecordCell>{user.role ? <Badge hideDotIndicator variant="default" label={user.role.name} /> : '—'}</RecordCell>
        <RecordCell><UserStatusBadge status={user.status} /></RecordCell>
      </>
    )}
  />
)
