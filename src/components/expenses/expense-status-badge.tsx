import type { FC } from 'react'
import type { ExpenseStatus } from '~/types/expense'
import { Badge } from '~/global/components/badge'

const VARIANT = { approved: 'default', paid: 'success', pending: 'warning', rejected: 'danger' } as const

export const ExpenseStatusBadge: FC<{ status: ExpenseStatus }> = ({ status }) => (
  <Badge variant={VARIANT[status]} label={status.charAt(0).toUpperCase() + status.slice(1)} />
)
