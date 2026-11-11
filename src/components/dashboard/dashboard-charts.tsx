import type { FC } from 'react'
import type { DashboardSummary } from '~/types/dashboard'
import { Card } from '~/global/components/card'
import { LineChart, PieChart } from '~/global/components/charts'
import { globalColors } from '~/global/constants/global-colors'
import { EmptyStateIcon } from '~/global/components/error-boundary/icons'

const money = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
/** Expense amounts are recorded in Tanzanian shillings. */
const tzs = (value: number) => `TZS ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
const gridColor = 'rgba(148, 163, 184, 0.15)'

/** "2026-06" → "Jun 26" */
const monthLabel = (month: string) =>
  new Date(`${month}-01T00:00:00`).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })

/** Revenue and expenses per month as two area series (kit LineChart). Hovering anywhere shows the month's figures. */
export const RevenueExpenseCard: FC<{ trend: DashboardSummary['finance_trend'] }> = ({ trend }) => {
  const revenue = trend.map((p) => p.revenue)
  const expenses = trend.map((p) => p.expenses ?? 0)
  const current = trend[trend.length - 1]
  const net = current ? current.revenue - (current.expenses ?? 0) : 0
  const hasData = trend.some((p) => p.revenue > 0 || (p.expenses ?? 0) > 0)

  return (
    <Card variant="panel" className="h-full">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Revenue &amp; expenses</h2>
          <p className="text-xs text-muted-foreground">Last 6 months, in USD · expenses converted from TZS at that month's invoice rate</p>
        </div>
        {current && (
          <div className="text-right">
            <p className={`text-lg font-bold ${net >= 0 ? 'text-status-green-pc' : 'text-status-red-pc'}`}>
              {net >= 0 ? '+' : '−'}
              {money(Math.abs(net))}
            </p>
            <p className="text-xs text-muted-foreground">net this month</p>
          </div>
        )}
      </div>
      {!hasData ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6">
          <EmptyStateIcon className="w-24" />
          <p className="text-sm text-muted-foreground">No invoices or expenses in the last 6 months.</p>
        </div>
      ) : (
        <div className="h-64">
          <LineChart
            hoverMode="index"
            showLegend
            labels={trend.map((p) => monthLabel(p.month))}
            tooltipValue={money}
            tooltipFooter={(i) => {
              const p = trend[i]
              const diff = p.revenue - (p.expenses ?? 0)
              return [
                `Net: ${diff >= 0 ? '' : '−'}${money(Math.abs(diff))}`,
                `Expenses: TZS ${p.expenses_tzs.toLocaleString()}${p.rate ? ` @ ${p.rate.toLocaleString()}` : ''}`,
              ]
            }}
            xAxes={{ drawBorder: false, showGridLines: false }}
            yAxes={{ drawBorder: false, gridLinesColor: gridColor }}
            dataset={[
              {
                data: revenue,
                fill: true,
                lineColor: { color: globalColors.primary },
                lineDescription: 'Revenue',
                lineGradientColor: {
                  start: { color: globalColors.primary, opacity: 0.02 },
                  stop: { color: globalColors.primary, opacity: 0.4 },
                },
                lineWidth: 2.5,
                point: { pointBackground: { color: globalColors.primary }, style: 'circle' },
                smoothCorner: true,
              },
              {
                data: expenses,
                fill: true,
                lineColor: { color: globalColors.accent },
                lineDescription: 'Expenses',
                lineGradientColor: {
                  start: { color: globalColors.accent, opacity: 0.02 },
                  stop: { color: globalColors.accent, opacity: 0.35 },
                },
                lineWidth: 2.5,
                point: { pointBackground: { color: globalColors.accent }, style: 'circle' },
                smoothCorner: true,
              },
            ]}
          />
        </div>
      )}
    </Card>
  )
}

const CATEGORIES = [
  { key: 'trip', label: 'Trip', color: globalColors.primary, side: 'left' },
  { key: 'truck', label: 'Truck', color: globalColors.accent, side: 'center' },
  { key: 'office', label: 'Office', color: globalColors.success, side: 'right' },
] as const

/** "TZS 12,450,000" → "TZS 12.5M" so the legend fits a third-width card. */
const tzsCompact = (value: number) =>
  `TZS ${value.toLocaleString(undefined, { maximumFractionDigits: 1, notation: 'compact' })}`

/**
 * Expense split by category: the kit donut with the total in the centre and
 * PieChart.Legends connector lines (left / centre / right) under it.
 */
export const ExpenseSplitCard: FC<{ expenses: DashboardSummary['expenses'] }> = ({ expenses }) => {
  const categories = CATEGORIES.map((c) => ({ ...c, value: expenses.by_category[c.key] }))
  const total = categories.reduce((sum, c) => sum + c.value, 0)

  return (
    <Card variant="panel" className="h-full">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Expenses by category</h2>
        <p className="text-xs text-muted-foreground">{tzs(expenses.paid_this_month)} paid this month</p>
      </div>
      {total === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6">
          <EmptyStateIcon className="w-24" />
          <p className="text-sm text-muted-foreground">No expenses recorded yet.</p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="size-40">
            <PieChart
              data={categories.map((c) => c.value)}
              labels={categories.map((c) => c.label)}
              backgroundColors={categories.map((c) => ({ color: c.color }))}
              innerCircleWidth={68}
              borderWidth={0}
            >
              <div className="flex flex-col items-center leading-tight">
                <span className="text-[11px] text-muted-foreground">Total</span>
                <span className="text-base font-bold tabular-nums text-foreground">{tzsCompact(total)}</span>
              </div>
            </PieChart>
          </div>
          <div className="-mt-3 flex w-full justify-around" title={tzs(total)}>
            {categories.map((c) => (
              <PieChart.Legends
                key={c.key}
                name={c.label}
                value={tzsCompact(c.value)}
                hint={`${Math.round((c.value / total) * 100)}%`}
                color={c.color}
                side={c.side}
                lineWidth={c.side === 'center' ? undefined : 34}
                curveRadius={10}
                lineHeight={12}
                finalRiseHeight={14}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
