import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowDownTrayIcon, BanknotesIcon, CheckIcon, Cog6ToothIcon, CurrencyDollarIcon, EyeIcon, PencilSquareIcon, TableCellsIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { ExpenseListItem, ExpenseOrder } from '~/types/expense'
import {
  approveExpenseOrder,
  deleteExpenseOrder,
  downloadExpenseCategory,
  downloadExpenseOrder,
  downloadExpenseOrderExcel,
  fetchExpenseOrder,
  fetchExpenseOrders,
  rejectExpenseOrder,
} from '~/services/expenseService'
import { LINE_CATEGORIES, expenseTypeLabel } from '~/constants/expenseLineCategories'
import { useAuth } from '~/hooks/useAuth'
import ExpenseForm from '~/components/expense-form/expense-form'
import { DetailsSlideOver } from '~/components/common/details-slide-over'
import { FormModal } from '~/components/common/form-modal'
import { ListPage } from '~/components/common/list-page'
import { RecordCell, RecordTableSection } from '~/components/common/record-table-section'
import { useConfirmAction } from '~/components/common/use-confirm-action'
import { useDetailsParam } from '~/components/common/use-details-param'
import { useFetchList } from '~/components/common/use-fetch-list'
import { ExpenseDetailsPanel } from '~/components/expenses/expense-details'
import { ExpenseStatusBadge } from '~/components/expenses/expense-status-badge'
import { FuelDownloadDialog } from '~/components/expenses/fuel-download-dialog'
import { PricePendingBadge } from '~/components/expenses/price-pending-badge'
import { PriceUpdateDialog } from '~/components/expenses/price-update-dialog'
import { Button, ButtonLink } from '~/global/components/button'
import { DateRange } from '~/global/components/date-range'
import type { DropdownMenuType } from '~/global/components/dropdown'
import { TabLinks } from '~/global/components/tab-link'
import type { ColumnHeader } from '~/global/components/table'
import type { ListConfig } from '~/global/hooks/use-list-params'
import { useSearchParamsState } from '~/global/utils/r3/hooks'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'
import { MarkPaidDialog } from '~/components/expenses/mark-paid-dialog'

const fetchAll = () => fetchExpenseOrders({})

const VIEWS = [
  { label: 'All', value: 'all' },
  { label: 'Trip', value: 'trip' },
  { label: 'Office', value: 'office' },
  { label: 'Truck', value: 'truck' },
] as const

const HEADERS: ColumnHeader[] = [
  { id: 'order', label: 'Order' },
  { id: 'type', label: 'Type' },
  { canSort: false, id: 'reference', label: 'For' },
  { canSort: false, id: 'people', label: 'Created / initiated by' },
  { id: 'payment_date', label: 'Payment date' },
  { id: 'total', label: 'Total (TZS)' },
  { id: 'status', label: 'Status' },
]

const LIST: ListConfig<ExpenseListItem> = {
  defaultSort: { by: 'created', order: 'desc' },
  filters: {
    from: (e, v) => e.created_at.slice(0, 10) >= v,
    line: (e, v) => e.expense_type === v,
    price: (e, v) => (v === 'overdue' ? e.price_overdue : e.pending_price),
    status: (e, v) => e.status === v,
    to: (e, v) => e.created_at.slice(0, 10) <= v,
    view: (e, v) => v === 'all' || e.category === v,
  },
  search: (e) => [e.form_number, e.order_number, e.subcategory?.name, ...e.bookings.flatMap((b) => [b.booking_number, b.client.company_name ?? '']), ...e.truck_reg_nos, e.creator?.name, e.initiated_by],
  sort: {
    created: (e) => e.created_at,
    order: (e) => e.form_number,
    payment_date: (e) => e.payment_date ?? '',
    status: (e) => e.status,
    total: (e) => Number(e.total_amount),
    type: (e) => e.expense_type,
  },
}

/** Bookings, truck or "Office" the order is for. */
const orderFor = (e: ExpenseListItem) => (e.bookings.length ? e.bookings.map((b) => b.booking_number).join(', ') : e.truck_reg_nos.join(', ') || 'Office')

/** "$630" or "-$140" (Vibali Congo, kept in USD). */
const usd = (value: string) => `${Number(value) < 0 ? '-' : ''}$${Math.abs(Number(value)).toLocaleString()}`

/** Run a download and show failures as a toast. */
const safely = (run: () => Promise<void>) => () =>
  void run().catch((err: unknown) => toast.error(getErrorMessage(err)))

function Expenses() {
  const { user } = useAuth()
  const role = user?.role?.slug ?? ''
  const canApprove = role === 'manager' || role === 'admin'
  const canPay = role === 'accountant' || role === 'admin'
  const canManageSettings = canPay || role === 'manager'
  const confirmAction = useConfirmAction()
  const { data: expenses, error, loading, refresh: reload } = useFetchList(fetchAll)
  /** Bumped after every action so the open details reload too. */
  const [version, setVersion] = useState(0)
  const refresh = () => {
    reload()
    setVersion((v) => v + 1)
  }
  const { closeDetails, openDetails } = useDetailsParam()
  const [, setParams] = useSearchParamsState<{ currentPage?: string; from?: string; to?: string }>()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState<{ expense: ExpenseOrder | null } | null>(null)
  const [pricing, setPricing] = useState<ExpenseOrder | null>(null)
  const [downloading, setDownloading] = useState<ExpenseListItem | null>(null)
  const [paying, setPaying] = useState<ExpenseListItem | null>(null)

  const counts = useMemo(
    () => Object.fromEntries(VIEWS.map((v) => [v.value, v.value === 'all' ? expenses.length : expenses.filter((e) => e.category === v.value).length])),
    [expenses]
  )

  /** Editing and pricing need the full order (lines); the list only has list rows. */
  const withFullOrder = (e: ExpenseListItem, open: (full: ExpenseOrder) => void) => () =>
    void fetchExpenseOrder(e.id)
      .then(open)
      .catch((err: unknown) => toast.error(getErrorMessage(err)))
  const edit = (e: ExpenseListItem | null) =>
    e
      ? withFullOrder(e, (expense) => {
          closeDetails()
          setForm({ expense })
        })()
      : setForm({ expense: null })
  const price = (e: ExpenseListItem) => withFullOrder(e, setPricing)()

  const act = async (opts: Parameters<typeof confirmAction>[0]) => {
    if (await confirmAction(opts)) refresh()
  }

  const remove = (e: ExpenseListItem) =>
    act({
      action: async () => {
        await deleteExpenseOrder(e.id)
        closeDetails()
      },
      description: e.status !== 'pending' ? `${e.form_number} has already been ${e.status}. Deleting it removes it permanently.` : 'This cannot be undone.',
      okayText: 'Delete expense',
      success: `${e.form_number} deleted`,
      title: `Delete expense order ${e.form_number}?`,
    })
  const approve = (e: ExpenseListItem) =>
    act({
      action: () => approveExpenseOrder(e.id),
      description: `Approve TZS ${Number(e.total_amount).toLocaleString()} so the accountant can pay it.`,
      okayText: 'Approve',
      success: `${e.form_number} approved`,
      title: `Approve ${e.form_number}?`,
      type: 'success',
    })
  const reject = (e: ExpenseListItem) =>
    act({
      action: () => rejectExpenseOrder(e.id),
      description: 'The order will not be paid. The creator can see it was rejected.',
      okayText: 'Reject',
      success: `${e.form_number} rejected`,
      title: `Reject ${e.form_number}?`,
    })
  const markPaid = (e: ExpenseListItem) => setPaying(e)
  /** Pending orders, and approved ones for the user who approved them until paid (UAT 20 Nov). */
  const canEdit = (e: ExpenseListItem) => !e.is_legacy_mixed && (e.status === 'pending' || (e.status === 'approved' && e.approver?.id === user?.id))

  /** Fuel orders ask whether the PDF shows prices (req. 11). */
  const downloadPdf = (e: ExpenseListItem) => (e.expense_type === 'fuel' ? () => setDownloading(e) : safely(() => downloadExpenseOrder(e)))
  const canPrice = (e: ExpenseListItem) => e.expense_type === 'fuel' && (e.status === 'pending' || e.status === 'approved') && !e.is_legacy_mixed

  const menuItems = (e: ExpenseListItem): DropdownMenuType[] => [
    { icon: EyeIcon, label: 'View', onClick: () => openDetails(e.id) },
    ...(canEdit(e) ? [{ icon: PencilSquareIcon, label: 'Edit', onClick: () => edit(e) }] : []),
    ...(e.status === 'pending' && canApprove
      ? [
          { icon: CheckIcon, label: 'Approve', onClick: () => void approve(e) },
          { icon: XMarkIcon, label: 'Reject', onClick: () => void reject(e) },
        ]
      : []),
    ...(canPrice(e) ? [{ icon: CurrencyDollarIcon, label: e.pending_price ? 'Enter fuel prices' : 'Change fuel prices', onClick: () => price(e) }] : []),
    ...(e.status === 'approved' && canPay && !e.pending_price ? [{ icon: BanknotesIcon, label: 'Mark as paid', onClick: () => void markPaid(e) }] : []),
    { icon: ArrowDownTrayIcon, label: 'Download PDF', onClick: downloadPdf(e) },
    { icon: TableCellsIcon, label: 'Download Excel (all lines)', onClick: safely(() => downloadExpenseOrderExcel(e)) },
    ...e.line_categories.map((cat) => ({
      icon: TableCellsIcon,
      label: `Excel: ${LINE_CATEGORIES.find((c) => c.value === cat)?.label ?? cat}`,
      onClick: safely(() => downloadExpenseCategory(e, cat)),
    })),
    { icon: TrashIcon, label: 'Delete', onClick: () => void remove(e) },
  ]

  const from = searchParams.get('from')
  const to = searchParams.get('to')

  return (
    <ListPage
      title="Expenses"
      subtitle="Fuel, Vibali and other expense orders for trips, trucks and the office: approve, reject and pay."
      actions={
        canManageSettings && (
          <ButtonLink to="/expenses/settings" variant="text" className="px-4">
            <Cog6ToothIcon className="size-4" /> Expense settings
          </ButtonLink>
        )
      }
      error={error}
      loading={loading}
      retryLink="/expenses"
      overlays={
        <>
          <DetailsSlideOver
            records={expenses}
            title={(e) => `Expense ${e.form_number}`}
            footer={(e) => (
              <>
                {e.status === 'pending' && canApprove && <Button variant="outline" onClick={() => void reject(e)}>Reject</Button>}
                {e.status === 'pending' && canApprove && <Button variant="success" onClick={() => void approve(e)}>Approve</Button>}
                {canPrice(e) && <Button variant="outline" onClick={() => price(e)}>{e.pending_price ? 'Enter prices' : 'Change prices'}</Button>}
                {e.status === 'approved' && canPay && !e.pending_price && <Button variant="success" onClick={() => void markPaid(e)}>Mark as paid</Button>}
                {canEdit(e) && <Button onClick={() => edit(e)}>Edit</Button>}
                {e.status !== 'pending' && <Button variant="outline" onClick={downloadPdf(e)}>Download PDF</Button>}
              </>
            )}
          >
            {(e) => <ExpenseDetailsPanel id={e.id} version={version} />}
          </DetailsSlideOver>
          <FormModal open={!!form} size="wide" onClose={() => setForm(null)} title={form?.expense ? `Edit Expense — ${form.expense.form_number}` : 'New Expense Order'}>
            <ExpenseForm
              key={form?.expense?.id ?? 'new'}
              expense={form?.expense ?? null}
              onSaved={() => {
                setForm(null)
                toast.success('Expense saved')
                refresh()
              }}
            />
          </FormModal>
          <PriceUpdateDialog
            expense={pricing}
            onClose={() => setPricing(null)}
            onSaved={() => {
              setPricing(null)
              refresh()
            }}
          />
          <FuelDownloadDialog expense={downloading} onClose={() => setDownloading(null)} />
          <MarkPaidDialog
            expense={paying}
            onClose={() => setPaying(null)}
            onSaved={() => {
              setPaying(null)
              closeDetails()
              refresh()
            }}
          />
        </>
      }
    >
      <div className="space-y-4">
        <TabLinks
          containerClassName="px-0"
          tabs={VIEWS.map((v) => ({
            matchPattern: v.value === 'all' ? /^\/expenses(?![^#]*[?&]view=(trip|office|truck)\b)/ : new RegExp(`^/expenses\\?(.*&)?view=${v.value}\\b`),
            name: `${v.label} (${counts[v.value] ?? 0})`,
            url: v.value === 'all' ? '/expenses' : `/expenses?view=${v.value}`,
          }))}
        />
        <RecordTableSection
          rows={expenses}
          isLoading={loading}
          config={LIST}
          headers={HEADERS}
          excludeParams={['view']}
          searchPlaceholder="Search order, reference, booking, truck, person"
          createLabel="New expense"
          onCreate={() => edit(null)}
          onView={(e) => openDetails(e.id)}
          empty={{ notFound: 'No expense order matches your search or filters.', text: 'Create an expense order for a trip, the office or a truck.', title: 'No expense orders yet' }}
          filters={(setFilter) => [
            {
              label: 'Status',
              onClick: () => undefined,
              subItems: (['pending', 'approved', 'rejected', 'paid'] as const).map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), onClick: () => setFilter('status', s) })),
            },
            { label: 'Expense type', onClick: () => undefined, subItems: LINE_CATEGORIES.map((c) => ({ label: c.label, onClick: () => setFilter('line', c.value) })) },
            {
              label: 'Fuel price',
              onClick: () => undefined,
              subItems: [
                { label: 'Price pending', onClick: () => setFilter('price', 'pending') },
                { label: 'Overdue (14+ days)', onClick: () => setFilter('price', 'overdue') },
              ],
            },
            {
              content: (close) => (
                <div className="w-72 p-2">
                  <p className="mb-2 text-xs text-muted-foreground">Created between</p>
                  <DateRange
                    defaultValue={from && to ? { from, to } : undefined}
                    onChange={(range) => {
                      setParams({ currentPage: undefined, from: range.from, to: range.to })
                      close()
                    }}
                  />
                </div>
              ),
              label: 'Created date',
              onClick: () => undefined,
            },
          ]}
          menuItems={menuItems}
          cells={(e) => (
            <>
              <RecordCell>
                <p className="font-medium">{e.form_number}</p>
                <p className="text-xs capitalize text-muted-foreground">
                  {e.category} · {e.order_number}
                </p>
              </RecordCell>
              <RecordCell className="whitespace-nowrap">
                {expenseTypeLabel(e.expense_type)}
                {e.subcategory && <span className="block text-xs text-muted-foreground">{e.subcategory.name}</span>}
              </RecordCell>
              <RecordCell className="text-muted-foreground">{orderFor(e)}</RecordCell>
              <RecordCell className="text-muted-foreground">
                <p>{e.creator?.name ?? '—'}</p>
                <p className="text-xs">{e.initiated_by ?? '—'}</p>
              </RecordCell>
              <RecordCell className="whitespace-nowrap text-muted-foreground">{e.payment_date?.slice(0, 10) ?? '—'}</RecordCell>
              <RecordCell className="font-medium">
                {Number(e.total_amount) !== 0 || Number(e.usd_total) === 0 ? Number(e.total_amount).toLocaleString() : usd(e.usd_total)}
                {Number(e.usd_total) !== 0 && Number(e.total_amount) !== 0 && <span className="block text-xs font-normal text-muted-foreground">+ {usd(e.usd_total)}</span>}
              </RecordCell>
              <RecordCell>
                <div className="flex flex-col items-start gap-1">
                  <ExpenseStatusBadge status={e.status} />
                  <PricePendingBadge expense={e} />
                </div>
              </RecordCell>
            </>
          )}
        />
      </div>
    </ListPage>
  )
}

export default Expenses
