import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import type { DashboardSummary } from '~/types/dashboard'
import { Badge } from '~/global/components/badge'
import { Card } from '~/global/components/card'
import { EmptyStateIcon } from '~/global/components/error-boundary/icons'

type Compliance = DashboardSummary['compliance']

const daysUntil = (date: string) => Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000)
const entityName = (type: string) => type.split('\\').pop() ?? type

/** Where a document's owner opens: its "View" slide-over on the owning page. */
const OWNER_LINK: Record<string, (id: number) => string> = {
  BookingTruck: (id) => `/tracking?leg=${id}`,
  Driver: (id) => `/drivers?details=${id}`,
  Staff: (id) => `/staff?details=${id}`,
  Trailer: (id) => `/assets?tab=trailers&details=${id}`,
  Truck: (id) => `/assets?details=${id}`,
}

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
            <li key={doc.id}>
              <Link
                to={OWNER_LINK[entityName(doc.documentable_type)]?.(doc.documentable_id) ?? '/assets'}
                className="group -mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-primary-50"
                title="Open details"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium capitalize text-foreground">{doc.document_type.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-muted-foreground">
                    {entityName(doc.documentable_type)} · {doc.owner_name ?? `#${doc.documentable_id}`}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1">
                  <Badge
                    hideDotIndicator
                    variant={days < 0 ? 'danger' : days <= 7 ? 'danger' : 'warning'}
                    label={days < 0 ? `${Math.abs(days)}d overdue` : `${days} day${days === 1 ? '' : 's'}`}
                  />
                  <ChevronRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    )}
  </Card>
)
