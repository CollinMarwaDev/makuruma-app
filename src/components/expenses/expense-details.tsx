import type { FC } from 'react'
import type { ExpenseOrder } from '~/types/expense'
import { LINE_CATEGORIES, expenseTypeLabel } from '~/constants/expenseLineCategories'
import { Card } from '~/global/components/card'
import { LabelValueListItem } from '~/global/components/label-value-list-item'
import { ExpenseStatusBadge } from '~/components/expenses/expense-status-badge'
import { PricePendingBadge } from '~/components/expenses/price-pending-badge'

const tzs = (value: string | number) => `TZS ${Number(value).toLocaleString()}`
const lineLabel = (value: string) => LINE_CATEGORIES.find((c) => c.value === value)?.label ?? value

/** Expense order "View" slide-over: order details, approval trail and lines. */
export const ExpenseDetails: FC<{ expense: ExpenseOrder }> = ({ expense }) => (
  <>
    <Card className="space-y-3 p-4">
      {expense.is_legacy_mixed && (
        <p className="rounded-lg bg-status-yellow-bg p-2 text-xs text-foreground">Saved before expense types were separated; it mixes types and can no longer be edited.</p>
      )}
      <LabelValueListItem
        label="Status"
        value={
          <span className="flex flex-wrap gap-1">
            <ExpenseStatusBadge status={expense.status} />
            <PricePendingBadge expense={expense} />
          </span>
        }
      />
      <LabelValueListItem label="Expense type" value={`${expenseTypeLabel(expense.expense_type)}${expense.subcategory ? ` · ${expense.subcategory.name}` : ''}`} />
      <LabelValueListItem label="Category" value={expense.category.charAt(0).toUpperCase() + expense.category.slice(1)} />
      <LabelValueListItem label="Reference no" value={expense.reference_no ?? '—'} />
      <LabelValueListItem
        label="For"
        value={expense.bookings.length ? expense.bookings.map((b) => `${b.booking_number} · ${b.client.company_name}`).join(', ') : (expense.truck?.reg_no ?? 'Office')}
      />
      <LabelValueListItem label="Initiated by" value={expense.initiated_by ?? '—'} />
      {expense.expense_type === 'fuel' && <LabelValueListItem label="Payment" value={expense.payment_mode === 'on_spot' ? 'On the spot' : 'Bill-based'} />}
      <LabelValueListItem label="Payment account" value={expense.payment_account ?? '—'} />
      <LabelValueListItem label="Payment date" value={expense.payment_date?.slice(0, 10) ?? '—'} />
      <LabelValueListItem label="Total" value={Number(expense.usd_total) !== 0 ? `${Number(expense.total_amount) !== 0 ? `${tzs(expense.total_amount)} + ` : ''}${Number(expense.usd_total) < 0 ? '-' : ''}$${Math.abs(Number(expense.usd_total)).toLocaleString()}` : tzs(expense.total_amount)} />
      {expense.zmk_rate && <LabelValueListItem label="ZMK → TSh rate" value={Number(expense.zmk_rate).toLocaleString()} />}
      {expense.outbound_border && <LabelValueListItem label="Borders" value={`Kwenda ${expense.outbound_border}${expense.return_border ? ` · Kurudi ${expense.return_border}` : ''}`} />}
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
                {line.driver_name ? ` · ${line.driver_name}` : ''}
                {line.line_category === 'fuel' && line.quantity ? ` · ${Number(line.quantity).toLocaleString()} L × ${line.unit_rate === null ? 'price pending' : Number(line.unit_rate).toLocaleString()}` : ''}
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

    {expense.price_changes.length > 0 && (
      <Card className="space-y-2 p-4">
        <h3 className="text-sm font-semibold text-foreground">Price history</h3>
        <ul className="divide-y divide-outline">
          {expense.price_changes.map((c) => (
            <li key={c.id} className="py-2 text-sm">
              <p className="text-foreground">
                {c.line_label}: {c.old_unit_rate === null ? 'set to' : `${Number(c.old_unit_rate).toLocaleString()} →`} {c.new_unit_rate === null ? 'removed' : Number(c.new_unit_rate).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {c.created_at.slice(0, 10)} · {c.user.name}
                {c.reason ? ` · ${c.reason}` : ''}
              </p>
            </li>
          ))}
        </ul>
      </Card>
    )}
  </>
)
