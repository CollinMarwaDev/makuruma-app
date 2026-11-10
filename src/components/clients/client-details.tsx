import type { FC } from 'react'
import type { Client } from '~/types/partner'
import { Card } from '~/global/components/card'
import { LabelValueListItem } from '~/global/components/label-value-list-item'
import { AdvanceBadge } from '~/components/clients/clients-table-section'

/** Body of the client "View" slide-over. */
export const ClientDetails: FC<{ client: Client }> = ({ client }) => (
  <Card className="space-y-3 p-4">
    <LabelValueListItem label="Company" value={client.company_name} />
    <LabelValueListItem label="Short code" value={client.short_code ?? '—'} />
    <LabelValueListItem label="Email" value={client.email ?? '—'} />
    <LabelValueListItem label="Phone" value={client.phone ?? '—'} />
    <LabelValueListItem
      label="Advance invoicing"
      value={<AdvanceBadge allowed={client.allows_advance_invoice} />}
    />
  </Card>
)
