import type { FC } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { CURRENCIES } from '~/constants/expenseLineCategories'
import type { Currency } from '~/types/expense'
import { cn } from '~/global/utils/cn'
import { TruckSetField } from '~/components/expense-form/truck-set-field'
import { CURRENCY_ORDER, autoAmountText, vibaliRowTotal } from '~/components/expense-form/vibali-form-utils'
import type { ExpenseFormState } from '~/components/expense-form/use-expense-form'

const small = 'w-full rounded-lg bg-secondary px-2 py-1.5 text-sm text-foreground ring-1 ring-border'
const label = 'mb-1 block text-xs text-muted-foreground'
const SYMBOL: Record<Currency, string> = { TZS: 'TSh ', USD: '$', ZMK: 'ZMK ' }
const money = (currency: Currency, value: number) => `${SYMBOL[currency]}${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`

/**
 * Lines of the Vibali Tunduma forms 123 (route) and 129 (general): unit × multiplier per truck, a truck set
 * per line with "Same for all", or one flat amount for the order (Expense UAT req. 13–15, 19–20).
 */
export const VibaliLines: FC<{ form: ExpenseFormState }> = ({ form }) => {
  const isGeneral = form.activeForm === 'general'
  const isGo = form.activeForm === 'go'
  const isReturn = form.activeForm === 'return'
  const truckOptions = form.bookingTrucks.map(({ booking, bt }) => ({
    detail: [bt.driver?.full_name ?? bt.truck.driver?.full_name, booking.booking_number].filter(Boolean).join(' · '),
    id: String(bt.id),
    regNo: bt.truck.reg_no,
  }))
  const { perCurrency, usdConverted, zmkConverted } = form.totals

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Lines</h3>
        <div className="flex gap-4">
          <button type="button" onClick={form.addRow} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            <Plus size={12} /> Add line
          </button>
          {isGo && (
            <button type="button" onClick={form.addExtraRow} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              <Plus size={12} /> Add extra cost
            </button>
          )}
        </div>
      </div>
      {isGo && <p className="text-xs text-muted-foreground">Extra costs (e.g. pulling entry card for capacity 37/38) print after the route subtotal; pick only the trucks they apply to.</p>}

      {form.rows.map((row, index) => {
        const id = (name: string) => `${name}-${row.key}`
        return (
          <div key={row.key} className={cn('space-y-2 rounded-lg bg-surface p-3 ring-1', row.isAdditional ? 'ring-status-yellow-pc/50' : 'ring-border')}>
            {row.isAdditional && <span className="text-xs font-medium text-status-yellow-pc">Extra cost</span>}
            <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
              <div className="col-span-2 md:col-span-3">
                <label htmlFor={id('description')} className={label}>Details</label>
                <input id={id('description')} value={row.description} placeholder="e.g. TOLL GATE (kwenda 5, kurudi 5)" onChange={(e) => form.updateRow(row.key, { description: e.target.value })} className={small} />
              </div>
              <div>
                <label htmlFor={id('currency')} className={label}>Currency</label>
                {form.isCongo ? (
                  <input id={id('currency')} value="USD ($)" disabled className={small} />
                ) : (
                  <select id={id('currency')} value={row.currency} onChange={(e) => form.updateRow(row.key, { currency: e.target.value as Currency })} className={small}>
                    {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                )}
              </div>
              <div>
                <label htmlFor={id('unit')} className={label}>{isReturn ? 'Amount (− returned)' : 'Amount'}</label>
                <input id={id('unit')} inputMode="decimal" value={row.unitRate} placeholder="e.g. 300" onChange={(e) => form.updateRow(row.key, { unitRate: e.target.value })} className={small} />
              </div>
              <div>
                <label htmlFor={id('multiplier')} className={label}>× (gates, days…)</label>
                <input id={id('multiplier')} inputMode="decimal" value={row.multiplier} onChange={(e) => form.updateRow(row.key, { multiplier: e.target.value })} className={small} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <div className="md:col-span-2">
                <label htmlFor={id('amount-text')} className={label}>Amount description (printed)</label>
                <input id={id('amount-text')} value={row.amountDescription} placeholder={autoAmountText(row)} onChange={(e) => form.updateRow(row.key, { amountDescription: e.target.value })} className={small} />
              </div>
              {isGeneral && (
                <div>
                  <label htmlFor={id('payee')} className={label}>Money goes to (not printed)</label>
                  <select id={id('payee')} value={row.payee} onChange={(e) => form.updateRow(row.key, { payee: e.target.value as '' | 'driver' | 'agent' })} className={small}>
                    <option value="">—</option>
                    <option value="driver">Driver</option>
                    <option value="agent">Agent</option>
                  </select>
                </div>
              )}
            </div>

            <label className="flex w-fit cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={row.isFlat} onChange={(e) => form.updateRow(row.key, { isFlat: e.target.checked, truckIds: e.target.checked ? [] : row.truckIds })} />
              {isReturn ? 'Not per truck (e.g. fare for the driver collecting money — split over the trucks in reports)' : 'One amount for the order, not per truck (e.g. Pesa ya kutolea)'}
            </label>

            {!row.isFlat && (
              <TruckSetField label="Trucks" emptyText="Select a booking first." options={truckOptions} value={row.truckIds} onChange={(truckIds) => form.updateRow(row.key, { truckIds })} />
            )}

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Line total: <span className="font-semibold text-foreground">{money(row.currency, vibaliRowTotal(row))}</span>
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

      <dl className="grid grid-cols-1 gap-2 rounded-lg bg-surface-2 p-3 text-sm ring-1 ring-border md:grid-cols-3">
        {CURRENCY_ORDER.filter((c) => perCurrency[c] > 0).map((c) => (
          <div key={c}>
            <dt className="text-xs text-muted-foreground">{c === 'TZS' ? 'TSh lines' : `${c} lines`}</dt>
            <dd className={cn('font-semibold text-foreground')}>
              {money(c, perCurrency[c])}
              {c === 'ZMK' && zmkConverted > 0 && <span className="block text-xs font-normal text-muted-foreground">× {form.zmkRate} = {money('TZS', zmkConverted)}</span>}
              {c === 'USD' && (usdConverted > 0 ? <span className="block text-xs font-normal text-muted-foreground">× {form.usdRate} = {money('TZS', usdConverted)}</span> : <span className="block text-xs font-normal text-muted-foreground">kept in USD, not converted</span>)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
