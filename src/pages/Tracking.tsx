import { useEffect, useState } from 'react'
import { ArrowDownTrayIcon, Cog6ToothIcon, TableCellsIcon } from '@heroicons/react/24/outline'
import type { TrackingLeg } from '~/types/tracking'
import { downloadTrackingExcel, downloadTrackingReport, fetchTrackingLegs } from '~/services/trackingService'
import { useAuth } from '~/hooks/useAuth'
import { exportTrackingCsv } from '~/utils/csvExports'
import { TrackingLegForm } from '~/components/tracking/tracking-leg-form'
import { TrackingTableSection } from '~/components/tracking/tracking-table-section'
import { useTrackingList } from '~/components/tracking/use-tracking-list'
import { useTrackingStatuses } from '~/components/tracking/use-tracking-statuses'
import { Button, ButtonLink } from '~/global/components/button'
import { ErrorFallback, GeneralErrorBoundary } from '~/global/components/error-boundary'
import PageHeader from '~/global/components/page-header'
import { SlideOver } from '~/global/components/slider-over/slide-over'
import { useSearchParamsState } from '~/global/utils/r3/hooks'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

function Tracking() {
  const { user } = useAuth()
  const { statusLabel } = useTrackingStatuses()
  const [legs, setLegs] = useState<TrackingLeg[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)
  const [reloadTrigger, setReloadTrigger] = useState(0)
  const [isExportingExcel, setIsExportingExcel] = useState(false)
  /** The open leg lives in the URL (`?leg=`) so a tracking detail can be linked and survives a refresh. */
  const [params, setParams] = useSearchParamsState<{ leg?: string }>()
  const openLegId = params.leg ? Number(params.leg) : null
  const { filtered } = useTrackingList(legs)

  useEffect(() => {
    let cancelled = false
    fetchTrackingLegs('all')
      .then((data) => {
        if (cancelled) return
        setLegs(data)
        setError(null)
      })
      .catch((err: unknown) => !cancelled && setError(err))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [reloadTrigger])

  const refresh = () => setReloadTrigger((prev) => prev + 1)
  const openLeg = (leg: TrackingLeg | null) => setParams({ leg: leg ? String(leg.id) : undefined })

  async function handleDownload(leg: TrackingLeg) {
    try {
      await downloadTrackingReport(leg)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  async function handleExportExcel() {
    setIsExportingExcel(true)
    try {
      await downloadTrackingExcel()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsExportingExcel(false)
    }
  }

  return (
    <div className="min-h-screen space-y-6 bg-background p-4 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="Tracking"
          subtitle="Status, border route, checkpoints and POD for every Go and Return leg."
          titleClassName="font-semibold tracking-tight text-foreground"
          subTitleClassName="text-muted-foreground"
        />
        <div className="flex flex-wrap gap-2">
          {user?.role?.slug === 'admin' && (
            <ButtonLink to="/tracking/statuses" variant="text" className="px-4">
              <Cog6ToothIcon className="size-4" /> Manage statuses
            </ButtonLink>
          )}
          <Button variant="outline" disabled={filtered.length === 0} onClick={() => exportTrackingCsv(filtered, statusLabel)} className="px-4">
            <ArrowDownTrayIcon className="size-4" /> Export CSV ({filtered.length})
          </Button>
          <Button variant="outline" loading={isExportingExcel} loadingText="Exporting…" onClick={() => void handleExportExcel()} className="px-4">
            <TableCellsIcon className="size-4" /> Export Excel
          </Button>
        </div>
      </div>

      {error && !loading ? (
        <ErrorFallback error={error} ctaLabel="Try again" ctaLink="/tracking" />
      ) : (
        <GeneralErrorBoundary>
          <TrackingTableSection legs={legs} isLoading={loading} onOpen={openLeg} onDownload={handleDownload} />
        </GeneralErrorBoundary>
      )}

      <SlideOver open={openLegId !== null} onClose={() => openLeg(null)}>
        <SlideOver.Panel size="3xl" className="max-w-[calc(100vw-2.5rem)]">
          <SlideOver.Header title="Update tracking" />
          <SlideOver.Content className="space-y-4">
            <GeneralErrorBoundary>
              {openLegId !== null && <TrackingLegForm key={openLegId} legId={openLegId} onChanged={refresh} />}
            </GeneralErrorBoundary>
          </SlideOver.Content>
        </SlideOver.Panel>
      </SlideOver>
    </div>
  )
}

export default Tracking
