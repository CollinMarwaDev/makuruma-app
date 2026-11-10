import type { FC } from 'react'
import type { Invoice } from '~/types/invoice'
import { Badge } from '~/global/components/badge'

export const InvoiceStatusBadge: FC<{ status: Invoice['status'] }> = ({ status }) => (
  <Badge variant={status === 'paid' ? 'success' : 'warning'} label={status === 'paid' ? 'Paid' : 'Pending'} />
)
