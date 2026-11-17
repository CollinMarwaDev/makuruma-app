import type { FC } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { CURRENCIES, LINE_CATEGORIES } from '~/constants/expenseLineCategories'
import type { Currency } from '~/types/expense'
import { TruckSetField } from '~/components/expense-form/truck-set-field'
import { rowTotal } from '~/components/expense-form/expense-form-utils'
import type { ExpenseFormState } from '~/components/expense-form/use-expense-form'

interface ExpenseLinesProps {
  fieldClass: string
  form: ExpenseFormState
}

const tzs = (value: number) => `TZS ${value.toLocaleString()}`

/** Lines of a non-fuel order (fuel uses FuelLines). Trip lines pick from the bookings' trucks, Truck lines from the order's trucks. */
export const ExpenseLines: FC<ExpenseLinesProps> = ({ fieldClass, form }) => {
  const { category, type } = form
  const meta = LINE_CATEGORIES.find((c) => c.value === type)
  const truckOptions = form.lineTruckOptions
  const perTruck = category === 'trip' || category === 'truck'
  const small = fieldClass.replace('px-3 py-2', 'px-2 py-1.5')

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{meta?.label} lines</h3>
        <button type="button" onClick={form.addRow} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          <Plus size={12} /> Add line
        </button>
      </div>

      {form.rows.map((row, index) => {
        const id = (name: string) => `${name}-${row.key}`
        return (
          <div key={row.key} className="space-y-2 rounded-lg bg-surface p-3 ring-1 ring-border">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              {meta?.needsVendor && (
                <div>
                  <label htmlFor={id('vendor')} className="mb-1 block text-xs text-muted-foreground">Vendor</label>
                  <select id={id('vendor')} value={row.vendorId} onChange={(e) => form.updateRow(row.key, { vendorId: e.target.value })} className={small}>
                    <option value="">— Select —</option>
                    {form.lineVendors.map((v) => <option key={v.id} value={v.id}>{v.company_name}</option>)}
                  </select>
                </div>
              )}
              <div className={meta?.needsVendor ? '' : 'md:col-span-2'}>
                <label htmlFor={id('description')} className="mb-1 block text-xs text-muted-foreground">Description</label>
                <input id={id('description')} value={row.description} onChange={(e) => form.updateRow(row.key, { description: e.target.value })} className={small} />
              </div>
              <div>
                <label htmlFor={id('currency')} className="mb-1 block text-xs text-muted-foreground">Currency</label>
                <select id={id('currency')} value={row.currency} onChange={(e) => form.updateRow(row.key, { currency: e.target.value as Currency })} className={small}>
                  {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {row.currency !== 'TZS' && (
                <NumberField id={id('rate')} label="Exchange rate" value={row.exchangeRate} className={small} onChange={(v) => form.updateRow(row.key, { exchangeRate: v })} />
              )}
              {perTruck && (
                <NumberField id={id('amount')} label="Amount per truck" value={row.amount} className={small} onChange={(v) => form.updateRow(row.key, { amount: v })} />
              )}
              {category === 'office' && (
                <>
                  <NumberField id={id('qty')} label="Quantity" value={row.quantity} className={small} onChange={(v) => form.updateRow(row.key, { quantity: v })} />
                  <NumberField id={id('unit')} label="Rate" value={row.unitRate} className={small} onChange={(v) => form.updateRow(row.key, { unitRate: v })} />
                </>
              )}
            </div>

            {perTruck && (
              <TruckSetField
                label="Applies to"
                emptyText={category === 'truck' ? 'Select the trucks above first.' : 'Select a booking first.'}
                options={truckOptions}
                value={row.truckIds}
                onChange={(truckIds) => form.updateRow(row.key, { truckIds })}
              />
            )}

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Line total: <span className="font-semibold text-foreground">{tzs(rowTotal(row, category, type))}</span>
              </p>
              {form.rows.length > 1 && (
                <button type="button" onClick={() => form.removeRow(row.key)} aria-label={`Remove line ${index + 1}`} className="rounded-lg p-1.5 text-muted-foreground hover:bg-status-red-bg hover:text-status-red-pc">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        )
      })}
    </section>
  )
}

interface NumberFieldProps {
  className: string
  id: string
  label: string
  onChange: (value: string) => void
  value: string
}

/** Decimal text input: the mouse wheel cannot change it (contract 2.1 B-8). */
const NumberField: FC<NumberFieldProps> = ({ className, id, label, onChange, value }) => (
  <div className="w-40">
    <label htmlFor={id} className="mb-1 block text-xs text-muted-foreground">{label}</label>
    <input id={id} inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} className={className} />
  </div>
)
