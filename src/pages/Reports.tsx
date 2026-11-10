import { useState } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import type { Truck } from '~/types/truck'
import { fetchTrucks } from '~/services/truckService'
import { downloadTruckProfitReport } from '~/services/truckProfitReportService'
import { TruckStatusBadge } from '~/components/assets/asset-badges'
import { ListPage } from '~/components/common/list-page'
import { RecordCell, RecordTableSection } from '~/components/common/record-table-section'
import { useFetchList } from '~/components/common/use-fetch-list'
import { Button } from '~/global/components/button'
import { SelectInput } from '~/global/components/form-controls/select-input'
import type { ColumnHeader } from '~/global/components/table'
import type { ListConfig } from '~/global/hooks/use-list-params'
import { useSearchParamsState } from '~/global/utils/r3/hooks'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 6 }, (_, i) => ({ label: String(CURRENT_YEAR - i), value: String(CURRENT_YEAR - i) }))

const HEADERS: ColumnHeader[] = [
  { id: 'reg_no', label: 'Truck' },
  { canSort: false, id: 'trailer', label: 'Trailer' },
  { canSort: false, id: 'driver', label: 'Driver' },
  { id: 'status', label: 'Status' },
  { canSort: false, id: 'download', label: '' },
]

const LIST: ListConfig<Truck> = {
  defaultSort: { by: 'reg_no', order: 'asc' },
  filters: { status: (t, v) => t.status === v },
  search: (t) => [t.reg_no, t.trailer?.reg_no, t.driver?.full_name],
  sort: { reg_no: (t) => t.reg_no, status: (t) => t.status },
}

/** Yearly Go & Return profit report per truck. The year is one page-level choice kept in the URL (`?year=`). */
function Reports() {
  const { data: trucks, error, loading } = useFetchList(fetchTrucks)
  const [params, setParams] = useSearchParamsState<{ year?: string }>()
  const year = params.year ?? String(CURRENT_YEAR)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  async function download(truck: Truck) {
    setDownloadingId(truck.id)
    try {
      await downloadTruckProfitReport(truck.id, truck.reg_no, Number(year))
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <ListPage title="Reports" subtitle="Download the full Go & Return profit report for any truck, for any year." error={error} loading={loading} retryLink="/reports">
      <RecordTableSection
        rows={trucks}
        isLoading={loading}
        config={LIST}
        headers={HEADERS}
        excludeParams={['year']}
        searchPlaceholder="Search truck, trailer, driver"
        actions={
          <div className="w-36">
            <SelectInput
              aria-label="Report year"
              options={YEARS}
              defaultValue={{ label: year, value: year }}
              onChange={(o) => setParams({ year: o.value === String(CURRENT_YEAR) ? undefined : String(o.value) })}
            />
          </div>
        }
        empty={{ notFound: 'No truck matches your search or filters.', text: 'Reports appear once trucks are registered under Assets.', title: 'No trucks yet' }}
        filters={(setFilter) => [
          {
            label: 'Status',
            onClick: () => undefined,
            subItems: (['active', 'maintenance', 'decommissioned'] as const).map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), onClick: () => setFilter('status', s) })),
          },
        ]}
        cells={(truck) => (
          <>
            <RecordCell className="font-medium">{truck.reg_no}</RecordCell>
            <RecordCell className="text-muted-foreground">{truck.trailer?.reg_no ?? '—'}</RecordCell>
            <RecordCell className="text-muted-foreground">{truck.driver?.full_name ?? '—'}</RecordCell>
            <RecordCell><TruckStatusBadge status={truck.status} /></RecordCell>
            <RecordCell className="text-right">
              <Button variant="tonal" loading={downloadingId === truck.id} loadingText="Downloading…" onClick={() => void download(truck)} className="px-4 py-1.5">
                <ArrowDownTrayIcon className="size-4" /> {year} report
              </Button>
            </RecordCell>
          </>
        )}
      />
    </ListPage>
  )
}

export default Reports
