import { useEffect, useState } from 'react'
import { AlertOctagon, ClipboardList, FileText, MapPin, Receipt, Truck } from 'lucide-react'
import type { DashboardSummary } from '~/types/dashboard'
import { fetchDashboardSummary } from '~/services/dashboardService'
import { useAuth } from '~/hooks/useAuth'
import { ButtonLink } from '~/global/components/button'
import { ErrorFallback } from '~/global/components/error-boundary'
import { ProgressBar } from '~/global/components/progress-bar'
import { StatCardLoading, StatsCard } from '~/global/components/stats-card'
import BarChartLoading from '~/global/components/charts/bar-chart-loading'
import PieChartLoading from '~/global/components/charts/pie-chart-loading'
import { Badge } from '~/global/components/badge'
import { FleetStatusCard } from '~/components/dashboard/fleet-status-card'
import { ComplianceCard } from '~/components/dashboard/compliance-card'
import { BookingsCard } from '~/components/dashboard/bookings-card'
import { ExpenseSplitCard, RevenueExpenseCard } from '~/components/dashboard/dashboard-charts'

const money = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
/** Expense amounts are recorded in Tanzanian shillings. */
const tzs = (value: number) => `TZS ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
const percent = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0)

function greeting() {
  const hour = new Date().getHours()
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
}

/** First load: the kit's stat-card and chart skeletons in the dashboard's layout. */
function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <StatCardLoading />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <BarChartLoading containerClassName="lg:col-span-2" className="h-64" />
        <PieChartLoading />
      </div>
    </div>
  )
}

/** Operations overview built from the global component kit. */
function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    let cancelled = false
    fetchDashboardSummary()
      .then((data) => !cancelled && setSummary(data))
      .catch((err: unknown) => !cancelled && setError(err))
    return () => {
      cancelled = true
    }
  }, [])

  const today = new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', weekday: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen space-y-6 bg-background p-4 md:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{today}</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {greeting()}, {user?.name?.split(' ')[0] ?? 'there'}
          </h1>
          <p className="text-sm text-muted-foreground">Here's what's happening across your fleet today.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink to="/tracking" variant="outline" className="px-4 py-2">
            <MapPin size={16} /> Tracking
          </ButtonLink>
          <ButtonLink to="/expenses" variant="outline" className="px-4 py-2">
            <Receipt size={16} /> Expenses
          </ButtonLink>
          <ButtonLink to="/bookings" variant="accent" className="px-4 py-2">
            <ClipboardList size={16} /> Bookings
          </ButtonLink>
        </div>
      </header>

      {error ? (
        <ErrorFallback error={error} ctaLabel="Reload" ctaLink="/" />
      ) : !summary ? (
        <DashboardSkeleton />
      ) : (
        <DashboardContent summary={summary} />
      )}
    </div>
  )
}

function DashboardContent({ summary }: { summary: DashboardSummary }) {
  const { bookings, compliance, expenses, fleet, invoicing, tracking } = summary
  const onTheRoad = tracking.in_transit + tracking.at_border + tracking.offloading
  const troubled = tracking.delayed + tracking.breakdown
  const complianceTotal = compliance.expired + compliance.expiring_soon

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          icon={Truck}
          title="Active trucks"
          value={String(fleet.active)}
          valueSuffix={`of ${fleet.total}`}
          content={
            <div className="space-y-1.5">
              <ProgressBar label="Active trucks" progress={percent(fleet.active, fleet.total)} className="h-1.5 bg-surface" />
              <p className="text-xs text-muted-foreground">
                {fleet.maintenance} in maintenance · {fleet.decommissioned} decommissioned
              </p>
            </div>
          }
        />
        <StatsCard
          icon={MapPin}
          title="On the road"
          value={String(onTheRoad)}
          valueSuffix="trucks"
          iconClassName="bg-accent/15 text-accent"
          content={
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="default" label={`${tracking.at_border} at border`} />
              <Badge variant={troubled ? 'danger' : 'success'} label={troubled ? `${troubled} delayed / breakdown` : 'No delays'} />
            </div>
          }
        />
        <StatsCard
          icon={Receipt}
          title="Pending expenses"
          value={String(expenses.pending_count)}
          valueSuffix="awaiting approval"
          iconClassName="bg-status-red-bg text-status-red-pc"
          content={<p className="text-xs text-muted-foreground">{tzs(expenses.pending_total)} to approve · {tzs(expenses.paid_this_month)} paid this month</p>}
        />
        <StatsCard
          icon={FileText}
          title="Invoiced this month"
          value={money(invoicing.this_month)}
          iconClassName="bg-status-green-bg text-status-green-pc"
          content={<p className="text-xs text-muted-foreground">{money(invoicing.total_invoiced)} invoiced all-time</p>}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueExpenseCard trend={summary.finance_trend ?? []} />
        </div>
        <FleetStatusCard tracking={tracking} />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <BookingsCard bookings={bookings} />
        <ExpenseSplitCard expenses={expenses} />
        <div className="relative">
          {complianceTotal > 0 && (
            <span className="absolute -top-2 -right-2 z-10 flex items-center gap-1 rounded-full bg-status-red px-2 py-0.5 text-xs font-semibold text-white shadow">
              <AlertOctagon size={12} /> {complianceTotal}
            </span>
          )}
          <ComplianceCard compliance={compliance} />
        </div>
      </section>
    </div>
  )
}

export default Dashboard
