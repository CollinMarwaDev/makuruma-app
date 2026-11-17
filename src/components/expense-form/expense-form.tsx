import type { FC, FormEvent } from 'react'
import type { ExpenseCategory, PaymentMode } from '~/types/expense'
import { LINE_CATEGORIES, expenseTypeLabel } from '~/constants/expenseLineCategories'
import { Button } from '~/global/components/button'
import { cn } from '~/global/utils/cn'
import { BookingsField } from '~/components/expense-form/bookings-field'
import { ExpenseLines } from '~/components/expense-form/expense-lines'
import { FuelLines } from '~/components/expense-form/fuel-lines'
import { VibaliHeader } from '~/components/expense-form/vibali-header'
import { VibaliLines } from '~/components/expense-form/vibali-lines'
import { PaymentAccountField } from '~/components/expense-form/payment-account-field'
import { TruckSetField } from '~/components/expense-form/truck-set-field'
import { useExpenseForm, type ExpenseFormOptions } from '~/components/expense-form/use-expense-form'

const fieldClass = 'w-full bg-secondary ring-1 ring-border rounded-lg px-3 py-2 text-sm text-foreground disabled:opacity-60'
const labelClass = 'mb-1 block text-sm font-medium text-foreground'

const PAYMENT_MODES: { hint: string; label: string; value: PaymentMode }[] = [
  { hint: 'Paid now (e.g. Zambia vendors, cash); price must be known', label: 'On the spot', value: 'on_spot' },
  { hint: 'Order now, pay later or in parts; price can be filled in later', label: 'Bill-based', value: 'bill' },
]

const CATEGORIES: { hint: string; label: string; value: ExpenseCategory }[] = [
  { hint: 'Bookings and their trucks; shows on the trip report', label: 'Trip', value: 'trip' },
  { hint: 'One or more trucks; each line counts in its truck’s annual report', label: 'Truck', value: 'truck' },
  { hint: 'No truck or trip', label: 'Office', value: 'office' },
]

/** Create or edit an expense order: one expense type per order, its own number series (Expense UAT req. 1–6). */
const ExpenseForm: FC<ExpenseFormOptions> = (props) => {
  const form = useExpenseForm(props)
  const isVibali = form.type === 'vibali_tunduma' || form.type === 'vibali_congo'

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    void form.submit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {form.error && (
        <div role="alert" className="rounded-lg bg-status-red-bg p-3 text-sm text-status-red-pc ring-1 ring-status-red-pc/30">
          {form.error}
        </div>
      )}

      <section className="space-y-2">
        <span className={labelClass}>Expense type</span>
        {form.isEditMode ? (
          <p className="text-sm text-muted-foreground">
            {expenseTypeLabel(form.type)} · {form.category.charAt(0).toUpperCase() + form.category.slice(1)} — type and category cannot change after saving.
          </p>
        ) : (
          <div role="radiogroup" aria-label="Expense type" className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {LINE_CATEGORIES.map((t) => (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={form.type === t.value}
                onClick={() => form.changeType(t.value)}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium ring-1 transition-colors',
                  form.type === t.value ? 'bg-primary text-primary-foreground ring-primary' : 'bg-secondary text-foreground ring-border hover:bg-surface-2'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
        {!form.isEditMode && <p className="text-xs text-muted-foreground">Each type has its own order and number series. Create a separate order for another type.</p>}
      </section>

      {!form.isEditMode && (
        <section className="grid grid-cols-1 gap-2 md:grid-cols-3" role="radiogroup" aria-label="Category">
          {CATEGORIES.filter((c) => !(form.isFuel && c.value === 'office')).map((c) => (
            <label key={c.value} className={cn('flex cursor-pointer gap-2 rounded-lg p-3 ring-1', form.category === c.value ? 'bg-primary/5 ring-primary' : 'ring-border')}>
              <input type="radio" name="category" checked={form.category === c.value} onChange={() => form.changeCategory(c.value)} className="mt-0.5" />
              <span>
                <span className="block text-sm font-medium text-foreground">{c.label}</span>
                <span className="block text-xs text-muted-foreground">{c.hint}</span>
              </span>
            </label>
          ))}
        </section>
      )}

      {form.category === 'trip' && <BookingsField bookings={form.bookings} loading={form.isLoadingBookings} value={form.bookingIds} onChange={form.changeBookings} />}
      {form.category === 'truck' && (
        <TruckSetField
          label="Trucks"
          emptyText="No trucks found."
          options={form.trucks.map((t) => ({ detail: t.driver?.full_name, id: String(t.id), regNo: t.reg_no }))}
          value={form.truckIds}
          onChange={form.changeTrucks}
        />
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="reference-no" className={labelClass}>Reference no.</label>
          <input id="reference-no" value={form.referenceNo} onChange={(e) => form.setReferenceNo(e.target.value)} placeholder="e.g. 82" className={fieldClass} />
          <p className="mt-1 text-xs text-muted-foreground">Must be unique across all expense orders.</p>
        </div>
        <div>
          <label htmlFor="initiated-by" className={labelClass}>Initiated by</label>
          <input id="initiated-by" value={form.initiatedBy} disabled className={fieldClass} />
        </div>
        <PaymentAccountField accounts={form.accounts} value={form.paymentAccountId} onChange={form.setPaymentAccountId} onAdded={form.addAccount} className={fieldClass} />
        <div>
          <label htmlFor="payment-date" className={labelClass}>Payment date</label>
          <input id="payment-date" type="date" value={form.paymentDate} onChange={(e) => form.setPaymentDate(e.target.value)} className={fieldClass} />
        </div>
        {form.type === 'mengine' && (
          <div>
            <label htmlFor="subcategory" className={labelClass}>Subcategory</label>
            <select id="subcategory" value={form.subcategoryId} onChange={(e) => form.setSubcategoryId(e.target.value)} className={fieldClass}>
              <option value="">— Select —</option>
              {form.subcategories.filter((c) => c.is_active || String(c.id) === form.subcategoryId).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">The profit report groups Other expenses by subcategory. Add new ones in Expense settings.</p>
          </div>
        )}
        {isVibali && (
          <div>
            <label htmlFor="order-vendor" className={labelClass}>
              Vendor <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <select id="order-vendor" value={form.vendorId} onChange={(e) => form.setVendorId(e.target.value)} className={fieldClass}>
              <option value="">— None —</option>
              {form.vendors.map((v) => <option key={v.id} value={v.id}>{v.company_name}</option>)}
            </select>
          </div>
        )}
      </section>

      {form.isFuel && (
        <section className="space-y-2">
          <span className={labelClass}>Payment</span>
          <div role="radiogroup" aria-label="Payment" className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {PAYMENT_MODES.map((m) => (
              <label key={m.value} className={cn('flex cursor-pointer gap-2 rounded-lg p-3 ring-1', form.paymentMode === m.value ? 'bg-primary/5 ring-primary' : 'ring-border')}>
                <input type="radio" name="payment-mode" checked={form.paymentMode === m.value} onChange={() => form.changePaymentMode(m.value)} className="mt-0.5" />
                <span>
                  <span className="block text-sm font-medium text-foreground">{m.label}</span>
                  <span className="block text-xs text-muted-foreground">{m.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </section>
      )}

      {form.isVibaliForm && <VibaliHeader form={form} fieldClass={fieldClass} labelClass={labelClass} />}

      {form.isFuel ? (
        <FuelLines form={form} fieldClass={fieldClass} />
      ) : form.isVibaliForm ? (
        <VibaliLines form={form} />
      ) : (
        <ExpenseLines form={form} fieldClass={fieldClass} />
      )}

      {form.changedPriceGroups.length > 0 && (
        <div>
          <label htmlFor="price-reason" className={labelClass}>Reason for changing the price</label>
          <input id="price-reason" value={form.priceChangeReason} onChange={(e) => form.setPriceChangeReason(e.target.value)} placeholder="e.g. New price from the first Wednesday of the month" maxLength={255} className={fieldClass} />
        </div>
      )}

      <div className="flex items-center justify-between rounded-lg bg-surface-2 p-3 ring-1 ring-border">
        <span className="text-sm font-medium text-muted-foreground">{form.isCongo && form.isVibaliForm ? 'Total (USD)' : form.isVibaliForm ? 'Grand total (TSh)' : 'Total (TZS)'}</span>
        <span className="text-right">
          <span className="block text-lg font-bold text-foreground">
            {form.isCongo && form.isVibaliForm ? `$${form.totals.perCurrency.USD.toLocaleString()}` : `TZS ${form.total.toLocaleString()}`}
          </span>
          {form.activeForm === 'route' && form.totals.perCurrency.USD > 0 && <span className="block text-xs text-muted-foreground">+ ${form.totals.perCurrency.USD.toLocaleString()} kept in USD</span>}
          {form.missingPrice && <span className="block text-xs text-status-yellow-pc">Some prices are pending; the total grows when they are entered.</span>}
        </span>
      </div>

      <Button type="submit" className="w-full" loading={form.isSubmitting} loadingText="Saving…" disabled={form.isLegacyMixed}>
        {form.isEditMode ? 'Save changes' : `Create ${expenseTypeLabel(form.type)} order`}
      </Button>
    </form>
  )
}

export default ExpenseForm
