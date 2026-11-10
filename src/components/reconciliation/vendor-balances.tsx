import { useState } from 'react'
import { ArrowDownTrayIcon, BanknotesIcon } from '@heroicons/react/24/outline'
import { downloadVendorLedger } from '~/services/reconciliationService'
import VendorPaymentForm from '~/components/VendorPaymentForm'
import { FormModal } from '~/components/common/form-modal'
import { ListPage } from '~/components/common/list-page'
import { RecordCell, RecordTableSection } from '~/components/common/record-table-section'
import { useFetchList } from '~/components/common/use-fetch-list'
import { fetchVendorBalances, type VendorBalanceRow } from '~/components/reconciliation/reconciliation-rows'
import { Badge } from '~/global/components/badge'
import type { ColumnHeader } from '~/global/components/table'
import type { ListConfig } from '~/global/hooks/use-list-params'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

const HEADERS: ColumnHeader[] = [
  { id: 'name', label: 'Vendor' },
  { id: 'debt', label: 'Total debt (TZS)' },
  { id: 'paid', label: 'Paid (TZS)' },
  { id: 'balance', label: 'Balance (TZS)' },
]

const LIST: ListConfig<VendorBalanceRow> = {
  defaultSort: { by: 'balance', order: 'desc' },
  filters: { balance: (r, v) => (v === 'outstanding' ? r.balance > 0 : r.balance <= 0) },
  search: (r) => [r.name],
  sort: { balance: (r) => r.balance, debt: (r) => r.total_debt, name: (r) => r.name.toLowerCase(), paid: (r) => r.total_paid },
}

async function download(row: VendorBalanceRow) {
  try {
    await downloadVendorLedger(row.id, row.name)
  } catch (err) {
    toast.error(getErrorMessage(err))
  }
}

/** Vendor expenses tab: what is owed to each vendor, with Record payment. */
export function VendorBalances() {
  const { data, error, loading, refresh } = useFetchList(fetchVendorBalances)
  const [payVendor, setPayVendor] = useState<VendorBalanceRow | null>(null)

  return (
    <ListPage
      embedded
      title=""
      subtitle=""
      error={error}
      loading={loading}
      retryLink="/reconciliation?tab=vendors"
      overlays={
        <FormModal open={!!payVendor} onClose={() => setPayVendor(null)} title={`Record payment — ${payVendor?.name ?? ''}`}>
          {payVendor && (
            <VendorPaymentForm
              vendorId={payVendor.id}
              onSaved={() => {
                setPayVendor(null)
                toast.success('Payment recorded')
                refresh()
              }}
            />
          )}
        </FormModal>
      }
    >
      <RecordTableSection
        rows={data}
        isLoading={loading}
        config={LIST}
        headers={HEADERS}
        excludeParams={['tab']}
        searchPlaceholder="Search vendor"
        empty={{ notFound: 'No vendor matches your search or filters.', text: 'Balances appear once vendor expenses are approved.', title: 'No vendors yet' }}
        filters={(setFilter) => [
          {
            label: 'Balance',
            onClick: () => undefined,
            subItems: [
              { label: 'Money owed', onClick: () => setFilter('balance', 'outstanding') },
              { label: 'Settled', onClick: () => setFilter('balance', 'settled') },
            ],
          },
        ]}
        menuItems={(row) => [
          { icon: BanknotesIcon, label: 'Record payment', onClick: () => setPayVendor(row) },
          { icon: ArrowDownTrayIcon, label: 'Download ledger', onClick: () => void download(row) },
        ]}
        cells={(row) => (
          <>
            <RecordCell className="font-medium">{row.name}</RecordCell>
            <RecordCell className="text-muted-foreground">{row.total_debt.toLocaleString()}</RecordCell>
            <RecordCell className="text-muted-foreground">{row.total_paid.toLocaleString()}</RecordCell>
            <RecordCell>
              <Badge hideDotIndicator variant={row.balance > 0 ? 'danger' : 'success'} label={row.balance.toLocaleString()} />
            </RecordCell>
          </>
        )}
      />
    </ListPage>
  )
}
