import type { FC } from 'react'
import type { DashboardSummary } from '~/types/dashboard'
import { ButtonLink } from '~/global/components/button'
import { Card } from '~/global/components/card'
import { BarChart, PieChart } from '~/global/components/charts'
import { EmptyStateIcon } from '~/global/components/error-boundary/icons'
import { globalColors } from '~/global/constants/global-colors'

const gridColor = 'rgba(148, 163, 184, 0.15)'

/** "2026-06" → "Jun" */
const monthLabel = (month: string) => new Date(`${month}-01T00:00:00`).toLocaleDateString(undefined, { month: 'short' })

const STATUS = [
  { key: 'completed', label: 'Completed', color: globalColors.success },
  { key: 'awaiting_return', label: 'Awaiting return', color: globalColors.accent },
] as const

/**
 * Bookings at a glance: a donut of trip status (completion % in the centre) and
 * a stacked column chart of bookings created per month, split Go / Return.
 */
export const BookingsCard: FC<{ bookings: DashboardSummary['bookings'] }> = ({ bookings }) => {
  const total = bookings.completed + bookings.awaiting_return
  const completion = total ? Math.round((bookings.completed / total) * 100) : 0
  const trend = bookings.monthly_trend ?? []
  const hasTrend = trend.some((m) => m.go + m.return > 0)

  return (
    <Card variant="panel" className="h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Bookings</h2>
          <p className="text-xs text-muted-foreground">{bookings.this_month} created this month</p>
        </div>
        <ButtonLink to="/bookings" variant="text" className="px-3 py-1.5 text-xs">View all</ButtonLink>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6">
          <EmptyStateIcon className="w-24" />
          <p className="text-sm text-muted-foreground">No trips booked yet.</p>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="size-32 shrink-0">
            <PieChart
              data={STATUS.map((s) => bookings[s.key])}
              labels={STATUS.map((s) => s.label)}
              backgroundColors={STATUS.map((s) => ({ color: s.color }))}
              innerCircleWidth={60}
              borderWidth={0}
            >
              <div className="flex h-full flex-col items-center justify-center">
                <span className="text-lg font-bold leading-none text-foreground">{completion}%</span>
                <span className="text-[10px] text-muted-foreground">completed</span>
              </div>
            </PieChart>
          </div>
          <dl className="flex-1 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <dt className="text-muted-foreground">Total trips</dt>
              <dd className="font-semibold tabular-nums text-foreground">{total}</dd>
            </div>
            {STATUS.map((s) => (
              <div key={s.key} className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-2 text-foreground">
                  <span className="size-2.5 rounded-sm" style={{ backgroundColor: s.color }} aria-hidden />
                  {s.label}
                </dt>
                <dd className="tabular-nums text-muted-foreground">{bookings[s.key]}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {hasTrend && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Bookings per month</span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="size-2 rounded-sm" style={{ backgroundColor: globalColors.primary }} aria-hidden />Go</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-sm" style={{ backgroundColor: globalColors.primaryLight }} aria-hidden />Return</span>
            </span>
          </div>
          <div className="h-28">
            <BarChart
              labels={trend.map((m) => monthLabel(m.month))}
              barPercentage={0.6}
              xAxes={{ drawBorder: false, showGridLines: false, stacked: true }}
              yAxes={{ drawBorder: false, gridLinesColor: gridColor, stacked: true }}
              datasets={[
                { label: 'Go', data: trend.map((m) => m.go), stack: 'bookings', barColor: { color: globalColors.primary }, hoverBackgroundColor: { color: globalColors.primaryDark }, borderRadius: 4 },
                { label: 'Return', data: trend.map((m) => m.return), stack: 'bookings', barColor: { color: globalColors.primaryLight }, hoverBackgroundColor: { color: globalColors.primaryLight, opacity: 0.8 }, borderRadius: 4 },
              ]}
            />
          </div>
        </div>
      )}
    </Card>
  )
}
