import type { FC } from 'react'
import type { DashboardSummary } from '~/types/dashboard'
import { Card } from '~/global/components/card'
import { LineChart, PieChart } from '~/global/components/charts'
import { globalColors } from '~/global/constants/global-colors'
import { EmptyStateIcon } from '~/global/components/error-boundary/icons'

const money = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
const gridColor = 'rgba(148, 163, 184, 0.15)'

/** "2026-06" → "Jun 26" */
const monthLabel = (month: string) =>
  new Date(`${month}-01T00:00:00`).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })

/** Invoiced revenue per month (kit LineChart, brand teal with a soft fill). */
export const RevenueTrendCard: FC<{ invoicing: DashboardSummary['invoicing'] }> = ({ invoicing }) => {
  const points = invoicing.monthly_trend
  const values = points.map((point) => Number(point.total))

  return (
    <Card variant="panel" className="h-full">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Revenue trend</h2>
          <p className="text-xs text-muted-foreground">Invoiced per month</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">{money(invoicing.this_month)}</p>
          <p className="text-xs text-muted-foreground">this month · {money(invoicing.total_invoiced)} all-time</p>
        </div>
      </div>
      {points.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6">
          <EmptyStateIcon className="w-24" />
          <p className="text-sm text-muted-foreground">No invoices yet.</p>
        </div>
      ) : (
        <div className="h-64">
          <LineChart
            labels={points.map((point) => monthLabel(point.month))}
            xAxes={{ drawBorder: false, showGridLines: false }}
            yAxes={{ drawBorder: false, gridLinesColor: gridColor }}
            dataset={[
              {
                data: values,
                fill: true,
                lineColor: { color: globalColors.primary },
                lineDescription: 'Invoiced',
                lineGradientColor: {
                  start: { color: globalColors.primary, opacity: 0.05 },
                  stop: { color: globalColors.primary, opacity: 0.45 },
                },
                lineWidth: 2.5,
                point: { pointBackground: { color: globalColors.primary }, style: 'circle' },
                smoothCorner: true,
              },
            ]}
          />
        </div>
      )}
    </Card>
  )
}

const CATEGORY_COLORS = [globalColors.primary, globalColors.accent, globalColors.success]

/** Expense split by category (kit PieChart as a donut) with a value legend. */
export const ExpenseSplitCard: FC<{ expenses: DashboardSummary['expenses'] }> = ({ expenses }) => {
  const categories = [
    { label: 'Trip', value: expenses.by_category.trip },
    { label: 'Truck', value: expenses.by_category.truck },
    { label: 'Office', value: expenses.by_category.office },
  ]
  const total = categories.reduce((sum, c) => sum + c.value, 0)

  return (
    <Card variant="panel" className="h-full">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Expenses by category</h2>
        <p className="text-xs text-muted-foreground">{money(expenses.paid_this_month)} paid this month</p>
      </div>
      {total === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6">
          <EmptyStateIcon className="w-24" />
          <p className="text-sm text-muted-foreground">No expenses recorded yet.</p>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="size-36 shrink-0">
            <PieChart
              data={categories.map((c) => c.value)}
              labels={categories.map((c) => c.label)}
              backgroundColors={CATEGORY_COLORS.map((color) => ({ color }))}
              innerCircleWidth={52}
              borderWidth={0}
            />
          </div>
          <ul className="flex-1 space-y-2 text-sm">
            {categories.map((c, i) => (
              <li key={c.label} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-foreground">
                  <span className="size-2.5 rounded-sm" style={{ backgroundColor: CATEGORY_COLORS[i] }} />
                  {c.label}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {money(c.value)} <span className="text-xs">({Math.round((c.value / total) * 100)}%)</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
