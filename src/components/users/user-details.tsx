import type { FC } from 'react'
import type { UserRecord } from '~/types/user'
import { Card } from '~/global/components/card'
import { LabelValueListItem } from '~/global/components/label-value-list-item'
import { UserStatusBadge } from '~/components/users/users-table-section'

/** Body of the user "View" slide-over. */
export const UserDetails: FC<{ user: UserRecord }> = ({ user }) => (
  <Card className="space-y-3 p-4">
    <LabelValueListItem label="Name" value={user.name} />
    <LabelValueListItem label="Email" value={user.email} />
    <LabelValueListItem label="Phone" value={user.phone ?? '—'} />
    <LabelValueListItem label="Role" value={user.role?.name ?? '—'} />
    <LabelValueListItem label="Status" value={<UserStatusBadge status={user.status} />} />
  </Card>
)
