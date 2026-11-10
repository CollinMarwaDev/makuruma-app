import type { FC } from 'react'
import type { Client } from '~/types/partner'
import { Badge } from '~/global/components/badge'
import { Card } from '~/global/components/card'
import { LabelValueListItem } from '~/global/components/label-value-list-item'

/** Body of the client "View" slide-over. */
export const ClientDetails: FC<{ client: Client }> = ({ client }) => (
  <Card className="space-y-3 p-4">
    <LabelValueListItem label="Company" value={client.company_name} />
    <LabelValueListItem label="Short code" value={client.short_code ?? '—'} />
    <LabelValueListItem label="Email" value={client.email ?? '—'} />
    <LabelValueListItem label="Phone" value={client.phone ?? '—'} />
    <LabelValueListItem
      label="Advance invoicing"
      value={<Badge variant={client.allows_advance_invoice ? 'success' : 'disabled'} label={client.allows_advance_invoice ? 'Allowed' : 'Not allowed'} />}
    />
  </Card>
)
