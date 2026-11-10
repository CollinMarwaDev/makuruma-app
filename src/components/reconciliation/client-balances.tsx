import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { downloadClientStatement } from '~/services/reconciliationService'
import { ListPage } from '~/components/common/list-page'
import { RecordCell, RecordTableSection } from '~/components/common/record-table-section'
import { useFetchList } from '~/components/common/use-fetch-list'
import { fetchClientBalances, type ClientBalanceRow } from '~/components/reconciliation/reconciliation-rows'
import { Badge } from '~/global/components/badge'
import type { ColumnHeader } from '~/global/components/table'
import type { ListConfig } from '~/global/hooks/use-list-params'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

const HEADERS: ColumnHeader[] = [
  { id: 'name', label: 'Client' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'invoiced', label: 'Invoiced ($)' },
  { id: 'paid', label: 'Paid ($)' },
  { id: 'outstanding', label: 'Outstanding ($)' },
]

const LIST: ListConfig<ClientBalanceRow> = {
  defaultSort: { by: 'outstanding', order: 'desc' },
  filters: { balance: (r, v) => (v === 'outstanding' ? r.outstanding > 0 : r.outstanding <= 0) },
  search: (r) => [r.name],
  sort: { invoiced: (r) => r.total_invoiced, invoices: (r) => r.invoice_count, name: (r) => r.name.toLowerCase(), outstanding: (r) => r.outstanding, paid: (r) => r.total_paid },
}

async function download(row: ClientBalanceRow) {
  try {
    await downloadClientStatement(row.id, row.name)
  } catch (err) {
    toast.error(getErrorMessage(err))
  }
}

/** Client revenue tab: what each client was invoiced, paid and still owes. */
export function ClientBalances() {
  const { data, error, loading } = useFetchList(fetchClientBalances)

  return (
    <ListPage embedded title="" subtitle="" error={error} loading={loading} retryLink="/reconciliation">
      <RecordTableSection
        rows={data}
        isLoading={loading}
        config={LIST}
        headers={HEADERS}
        excludeParams={['tab']}
        searchPlaceholder="Search client"
        empty={{ notFound: 'No client matches your search or filters.', text: 'Balances appear once clients are invoiced.', title: 'No clients yet' }}
        filters={(setFilter) => [
          {
            label: 'Balance',
            onClick: () => undefined,
            subItems: [
              { label: 'Outstanding', onClick: () => setFilter('balance', 'outstanding') },
              { label: 'Fully paid', onClick: () => setFilter('balance', 'paid') },
            ],
          },
        ]}
        menuItems={(row) => [{ icon: ArrowDownTrayIcon, label: 'Download statement', onClick: () => void download(row) }]}
        cells={(row) => (
          <>
            <RecordCell className="font-medium">{row.name}</RecordCell>
            <RecordCell className="text-muted-foreground">{row.invoice_count}</RecordCell>
            <RecordCell className="text-muted-foreground">{row.total_invoiced.toLocaleString()}</RecordCell>
            <RecordCell className="text-muted-foreground">{row.total_paid.toLocaleString()}</RecordCell>
            <RecordCell>
              <Badge hideDotIndicator variant={row.outstanding > 0 ? 'danger' : 'success'} label={row.outstanding.toLocaleString()} />
            </RecordCell>
          </>
        )}
      />
    </ListPage>
  )
}
