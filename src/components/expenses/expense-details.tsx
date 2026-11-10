import type { FC } from 'react'
import type { ExpenseOrder } from '~/types/expense'
import { LINE_CATEGORIES } from '~/constants/expenseLineCategories'
import { Card } from '~/global/components/card'
import { LabelValueListItem } from '~/global/components/label-value-list-item'
import { ExpenseStatusBadge } from '~/components/expenses/expense-status-badge'

const tzs = (value: string | number) => `TZS ${Number(value).toLocaleString()}`
const lineLabel = (value: string) => LINE_CATEGORIES.find((c) => c.value === value)?.label ?? value

/** Expense order "View" slide-over: order details, approval trail and lines. */
export const ExpenseDetails: FC<{ expense: ExpenseOrder }> = ({ expense }) => (
  <>
    <Card className="space-y-3 p-4">
      <LabelValueListItem label="Status" value={<ExpenseStatusBadge status={expense.status} />} />
      <LabelValueListItem label="Category" value={expense.category.charAt(0).toUpperCase() + expense.category.slice(1)} />
      <LabelValueListItem label="Reference no" value={expense.reference_no ?? '—'} />
      <LabelValueListItem
        label="For"
        value={expense.booking ? `${expense.booking.booking_number} · ${expense.booking.client.company_name}` : (expense.truck?.reg_no ?? '—')}
      />
      <LabelValueListItem label="Initiated by" value={expense.initiated_by ?? '—'} />
      <LabelValueListItem label="Payment account" value={expense.payment_account ?? '—'} />
      <LabelValueListItem label="Payment date" value={expense.payment_date?.slice(0, 10) ?? '—'} />
      <LabelValueListItem label="Total" value={tzs(expense.total_amount)} />
    </Card>

    <Card className="space-y-2 p-4">
      <h3 className="text-sm font-semibold text-foreground">Approval trail</h3>
      <LabelValueListItem label="Created" value={`${expense.created_at.slice(0, 10)} · ${expense.creator.name}`} />
      <LabelValueListItem label="Approved" value={expense.approver ? `${expense.approved_at?.slice(0, 10) ?? ''} · ${expense.approver.name}` : '—'} />
      <LabelValueListItem label="Paid" value={expense.payer ? `${expense.paid_at?.slice(0, 10) ?? ''} · ${expense.payer.name}` : '—'} />
    </Card>

    <Card className="space-y-2 p-4">
      <h3 className="text-sm font-semibold text-foreground">Lines ({expense.lines.length})</h3>
      <ul className="divide-y divide-outline">
        {expense.lines.map((line) => (
          <li key={line.id} className="flex flex-wrap items-start justify-between gap-2 py-2">
            <div>
              <p className="text-sm text-foreground">{line.description}</p>
              <p className="text-xs text-muted-foreground">
                {lineLabel(line.line_category)}
                {line.vendor ? ` · ${line.vendor.company_name}` : ''}
                {line.booking_truck ? ` · ${line.booking_truck.truck.reg_no}` : ''}
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="font-medium text-foreground">{tzs(line.amount)}</p>
              {line.currency !== 'TZS' && (
                <p className="text-xs text-muted-foreground">
                  {line.currency} {Number(line.original_amount).toLocaleString()} × {Number(line.exchange_rate).toLocaleString()}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  </>
)
