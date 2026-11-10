import type { FC } from 'react'
import type { DashboardSummary } from '~/types/dashboard'
import { Badge } from '~/global/components/badge'
import { Card } from '~/global/components/card'
import { EmptyStateIcon } from '~/global/components/error-boundary/icons'

type Compliance = DashboardSummary['compliance']

const daysUntil = (date: string) => Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000)
const entityLabel = (type: string, id: number) => `${type.split('\\').pop()} #${id}`

/** Driver, truck and trailer documents that expire soon (or already have). */
export const ComplianceCard: FC<{ compliance: Compliance }> = ({ compliance }) => (
  <Card variant="panel" className="h-full">
    <div className="flex items-start justify-between gap-2">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Compliance deadlines</h2>
        <p className="text-xs text-muted-foreground">Documents expiring in the coming weeks</p>
      </div>
      <div className="flex gap-1.5">
        {compliance.expired > 0 && <Badge variant="danger" label={`${compliance.expired} expired`} />}
        {compliance.expiring_soon > 0 && <Badge variant="warning" label={`${compliance.expiring_soon} soon`} />}
      </div>
    </div>

    {compliance.upcoming.length === 0 ? (
      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <EmptyStateIcon className="w-24" />
        <p className="text-sm text-muted-foreground">Nothing expiring soon.</p>
      </div>
    ) : (
      <ul className="divide-y divide-hairline">
        {compliance.upcoming.map((doc) => {
          const days = daysUntil(doc.expiry_date)
          return (
            <li key={doc.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium capitalize text-foreground">{doc.document_type.replace(/_/g, ' ')}</p>
                <p className="text-xs text-muted-foreground">{entityLabel(doc.documentable_type, doc.documentable_id)}</p>
              </div>
              <Badge
                hideDotIndicator
                variant={days < 0 ? 'danger' : days <= 7 ? 'danger' : 'warning'}
                label={days < 0 ? `${Math.abs(days)}d overdue` : `${days} day${days === 1 ? '' : 's'}`}
              />
            </li>
          )
        })}
      </ul>
    )}
  </Card>
)
