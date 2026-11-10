import type { FC } from 'react'
import type { DashboardSummary } from '~/types/dashboard'
import { Card } from '~/global/components/card'
import { ProgressBar } from '~/global/components/progress-bar'
import { cn } from '~/global/utils/cn'

type TrackingCounts = DashboardSummary['tracking']

/** Status groups shown on the dashboard, in the order a trip moves. */
const GROUPS: { keys: string[]; label: string; tone: string }[] = [
  { keys: ['pending'], label: 'Waiting / off duty', tone: 'bg-status-grey-pc' },
  { keys: ['on_route_to_loading', 'loading'], label: 'To / at loading', tone: 'bg-secondary-500' },
  { keys: ['in_transit'], label: 'In transit', tone: 'bg-primary' },
  { keys: ['at_border'], label: 'At border', tone: 'bg-accent' },
  { keys: ['offloading'], label: 'Offloading', tone: 'bg-secondary-400' },
  { keys: ['delayed', 'breakdown'], label: 'Delayed / breakdown', tone: 'bg-status-red' },
  { keys: ['completed'], label: 'Completed', tone: 'bg-status-green' },
]

/** Where the fleet is right now, by tracking status. */
export const FleetStatusCard: FC<{ tracking: TrackingCounts }> = ({ tracking }) => {
  const total = Object.values(tracking).reduce((sum, n) => sum + n, 0)
  const grouped = new Set(GROUPS.flatMap((g) => g.keys))
  // Admin-added statuses (contract 2.2 D-4) are summed into one extra row so nothing is hidden.
  const otherKeys = Object.keys(tracking).filter((key) => !grouped.has(key))
  const groups = [...GROUPS, ...(otherKeys.length ? [{ keys: otherKeys, label: 'Other statuses', tone: 'bg-secondary-300' }] : [])]

  return (
    <Card variant="panel" className="h-full">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Fleet status</h2>
        <p className="text-xs text-muted-foreground">{total} trucks by current tracking status</p>
      </div>
      <ul className="space-y-3">
        {groups.map((group) => {
          const count = group.keys.reduce((sum, key) => sum + (tracking[key] ?? 0), 0)
          return (
            <li key={group.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-foreground">
                  <span className={cn('size-2 rounded-full', group.tone)} />
                  {group.label}
                </span>
                <span className="tabular-nums text-muted-foreground">{count}</span>
              </div>
              <ProgressBar
                label={group.label}
                progress={total ? (count / total) * 100 : 0}
                className="h-1.5 bg-surface-container"
                indicatorClassName={group.tone}
              />
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
