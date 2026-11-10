import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowDownTrayIcon, BanknotesIcon, CheckIcon, EyeIcon, PencilSquareIcon, TableCellsIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { ExpenseOrder } from '~/types/expense'
import {
  approveExpenseOrder,
  deleteExpenseOrder,
  downloadExpenseCategory,
  downloadExpenseOrder,
  downloadExpenseOrderExcel,
  fetchExpenseOrders,
  markExpensePaid,
  rejectExpenseOrder,
} from '~/services/expenseService'
import { LINE_CATEGORIES } from '~/constants/expenseLineCategories'
import { useAuth } from '~/hooks/useAuth'
import ExpenseForm from '~/components/ExpenseForm'
import { DetailsSlideOver } from '~/components/common/details-slide-over'
import { FormModal } from '~/components/common/form-modal'
import { ListPage } from '~/components/common/list-page'
import { RecordCell, RecordTableSection } from '~/components/common/record-table-section'
import { useConfirmAction } from '~/components/common/use-confirm-action'
import { useDetailsParam } from '~/components/common/use-details-param'
import { useFetchList } from '~/components/common/use-fetch-list'
import { ExpenseDetails } from '~/components/expenses/expense-details'
import { ExpenseStatusBadge } from '~/components/expenses/expense-status-badge'
import { Button } from '~/global/components/button'
import { DateRange } from '~/global/components/date-range'
import type { DropdownMenuType } from '~/global/components/dropdown'
import { TabLinks } from '~/global/components/tab-link'
import type { ColumnHeader } from '~/global/components/table'
import type { ListConfig } from '~/global/hooks/use-list-params'
import { useSearchParamsState } from '~/global/utils/r3/hooks'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

const fetchAll = () => fetchExpenseOrders({})

const VIEWS = [
  { label: 'All', value: 'all' },
  { label: 'Trip', value: 'trip' },
  { label: 'Office', value: 'office' },
  { label: 'Truck', value: 'truck' },
] as const

const HEADERS: ColumnHeader[] = [
  { id: 'order', label: 'Order' },
  { canSort: false, id: 'reference', label: 'For' },
  { canSort: false, id: 'people', label: 'Created / initiated by' },
  { id: 'payment_date', label: 'Payment date' },
  { id: 'total', label: 'Total (TZS)' },
  { id: 'status', label: 'Status' },
]

const LIST: ListConfig<ExpenseOrder> = {
  defaultSort: { by: 'created', order: 'desc' },
  filters: {
    from: (e, v) => e.created_at.slice(0, 10) >= v,
    line: (e, v) => e.lines.some((l) => l.line_category === v),
    status: (e, v) => e.status === v,
    to: (e, v) => e.created_at.slice(0, 10) <= v,
    view: (e, v) => v === 'all' || e.category === v,
  },
  search: (e) => [e.order_number, e.reference_no, e.booking?.booking_number, e.booking?.client.company_name, e.truck?.reg_no, e.creator.name, e.initiated_by],
  sort: {
    created: (e) => e.created_at,
    order: (e) => e.order_number,
    payment_date: (e) => e.payment_date ?? '',
    status: (e) => e.status,
    total: (e) => Number(e.total_amount),
  },
}

/** Run a download and show failures as a toast. */
const safely = (run: () => Promise<void>) => () =>
  void run().catch((err: unknown) => toast.error(getErrorMessage(err)))

function Expenses() {
  const { user } = useAuth()
  const role = user?.role?.slug ?? ''
  const canApprove = role === 'manager' || role === 'admin'
  const canPay = role === 'accountant' || role === 'admin'
  const confirmAction = useConfirmAction()
  const { data: expenses, error, loading, refresh } = useFetchList(fetchAll)
  const { closeDetails, openDetails } = useDetailsParam()
  const [, setParams] = useSearchParamsState<{ currentPage?: string; from?: string; to?: string }>()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState<{ expense: ExpenseOrder | null } | null>(null)

  const counts = useMemo(
    () => Object.fromEntries(VIEWS.map((v) => [v.value, v.value === 'all' ? expenses.length : expenses.filter((e) => e.category === v.value).length])),
    [expenses]
  )

  const edit = (expense: ExpenseOrder | null) => {
    closeDetails()
    setForm({ expense })
  }

  const act = async (opts: Parameters<typeof confirmAction>[0]) => {
    if (await confirmAction(opts)) refresh()
  }

  const remove = (e: ExpenseOrder) =>
    act({
      action: async () => {
        await deleteExpenseOrder(e.id)
        closeDetails()
      },
      description: e.status !== 'pending' ? `${e.order_number} has already been ${e.status}. Deleting it removes it permanently.` : 'This cannot be undone.',
      okayText: 'Delete expense',
      success: `${e.order_number} deleted`,
      title: `Delete expense order ${e.order_number}?`,
    })
  const approve = (e: ExpenseOrder) =>
    act({
      action: () => approveExpenseOrder(e.id),
      description: `Approve TZS ${Number(e.total_amount).toLocaleString()} so the accountant can pay it.`,
      okayText: 'Approve',
      success: `${e.order_number} approved`,
      title: `Approve ${e.order_number}?`,
      type: 'success',
    })
  const reject = (e: ExpenseOrder) =>
    act({
      action: () => rejectExpenseOrder(e.id),
      description: 'The order will not be paid. The creator can see it was rejected.',
      okayText: 'Reject',
      success: `${e.order_number} rejected`,
      title: `Reject ${e.order_number}?`,
    })
  const markPaid = (e: ExpenseOrder) =>
    act({
      action: () => markExpensePaid(e.id),
      description: `Confirm TZS ${Number(e.total_amount).toLocaleString()} has been paid.`,
      okayText: 'Mark as paid',
      success: `${e.order_number} marked as paid`,
      title: `Mark ${e.order_number} as paid?`,
      type: 'success',
    })

  const menuItems = (e: ExpenseOrder): DropdownMenuType[] => [
    { icon: EyeIcon, label: 'View', onClick: () => openDetails(e.id) },
    ...(e.status === 'pending' ? [{ icon: PencilSquareIcon, label: 'Edit', onClick: () => edit(e) }] : []),
    ...(e.status === 'pending' && canApprove
      ? [
          { icon: CheckIcon, label: 'Approve', onClick: () => void approve(e) },
          { icon: XMarkIcon, label: 'Reject', onClick: () => void reject(e) },
        ]
      : []),
    ...(e.status === 'approved' && canPay ? [{ icon: BanknotesIcon, label: 'Mark as paid', onClick: () => void markPaid(e) }] : []),
    { icon: ArrowDownTrayIcon, label: 'Download PDF', onClick: safely(() => downloadExpenseOrder(e)) },
    { icon: TableCellsIcon, label: 'Download Excel (all lines)', onClick: safely(() => downloadExpenseOrderExcel(e)) },
    ...[...new Set(e.lines.map((l) => l.line_category))].map((cat) => ({
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
      subtitle="Trip, office and truck expense orders: approve, reject and pay."
      error={error}
      loading={loading}
      retryLink="/expenses"
      overlays={
        <>
          <DetailsSlideOver
            records={expenses}
            title={(e) => `Expense ${e.order_number}`}
            footer={(e) => (
              <>
                {e.status === 'pending' && canApprove && <Button variant="outline" onClick={() => void reject(e)}>Reject</Button>}
                {e.status === 'pending' && canApprove && <Button variant="success" onClick={() => void approve(e)}>Approve</Button>}
                {e.status === 'approved' && canPay && <Button variant="success" onClick={() => void markPaid(e)}>Mark as paid</Button>}
                {e.status === 'pending' && <Button onClick={() => edit(e)}>Edit</Button>}
                {e.status !== 'pending' && <Button variant="outline" onClick={safely(() => downloadExpenseOrder(e))}>Download PDF</Button>}
              </>
            )}
          >
            {(e) => <ExpenseDetails expense={e} />}
          </DetailsSlideOver>
          <FormModal open={!!form} size="wide" onClose={() => setForm(null)} title={form?.expense ? `Edit Expense — ${form.expense.order_number}` : 'New Expense Order'}>
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
                <p className="font-medium">{e.order_number}</p>
                <p className="text-xs capitalize text-muted-foreground">
                  {e.category}
                  {e.reference_no ? ` · ${e.reference_no}` : ''}
                </p>
              </RecordCell>
              <RecordCell className="text-muted-foreground">{e.booking?.booking_number ?? e.truck?.reg_no ?? '—'}</RecordCell>
              <RecordCell className="text-muted-foreground">
                <p>{e.creator.name}</p>
                <p className="text-xs">{e.initiated_by ?? '—'}</p>
              </RecordCell>
              <RecordCell className="whitespace-nowrap text-muted-foreground">{e.payment_date?.slice(0, 10) ?? '—'}</RecordCell>
              <RecordCell className="font-medium">{Number(e.total_amount).toLocaleString()}</RecordCell>
              <RecordCell><ExpenseStatusBadge status={e.status} /></RecordCell>
            </>
          )}
        />
      </div>
    </ListPage>
  )
}

export default Expenses
