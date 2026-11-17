import type { FC } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { CURRENCIES } from '~/constants/expenseLineCategories'
import type { Currency } from '~/types/expense'
import { TruckSetField } from '~/components/expense-form/truck-set-field'
import { rowTotal, type LineRow } from '~/components/expense-form/expense-form-utils'
import type { ExpenseFormState } from '~/components/expense-form/use-expense-form'

interface FuelLinesProps {
  fieldClass: string
  form: ExpenseFormState
}

const small = 'w-full rounded-lg bg-secondary px-2 py-1.5 text-sm text-foreground ring-1 ring-border'
const tiny = 'rounded-lg bg-card px-2 py-1 text-xs text-foreground ring-1 ring-border'

/** Fuel lines: truck, driver and litres are required; the price per litre may come later (Expense UAT req. 7). */
export const FuelLines: FC<FuelLinesProps> = ({ form }) => {
  const isTrip = form.category === 'trip'
  const truckOptions = form.bookingTrucks.map(({ booking, bt }) => ({
    detail: [form.driverOf[String(bt.id)], booking.booking_number].filter(Boolean).join(' · '),
    id: String(bt.id),
    regNo: bt.truck.reg_no,
  }))

  /** Selecting trucks prefills their driver's name. */
  function pickTrucks(row: LineRow, truckIds: string[]) {
    const drivers = { ...row.drivers }
    truckIds.forEach((id) => {
      if (!drivers[id]) drivers[id] = form.driverOf[id] ?? ''
    })
    form.updateRow(row.key, { drivers, truckIds })
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Fuel lines</h3>
        <button type="button" onClick={form.addRow} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          <Plus size={12} /> Add line
        </button>
      </div>

      {form.rows.map((row, index) => {
        const id = (name: string) => `${name}-${row.key}`
        const total = rowTotal(row, form.category, form.type)
        const priceChanged = row.groupKey ? form.changedPriceGroups.includes(row.groupKey) : false
        return (
          <div key={row.key} className="space-y-2 rounded-lg bg-surface p-3 ring-1 ring-border">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <div>
                <label htmlFor={id('vendor')} className="mb-1 block text-xs text-muted-foreground">Vendor</label>
                <select
                  id={id('vendor')}
                  value={row.vendorId}
                  onChange={(e) => {
                    form.updateRow(row.key, { vendorId: e.target.value })
                    form.vendorChosen(e.target.value)
                  }}
                  className={small}
                >
                  <option value="">— Select —</option>
                  {form.lineVendors.map((v) => <option key={v.id} value={v.id}>{v.company_name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor={id('description')} className="mb-1 block text-xs text-muted-foreground">Description</label>
                <input id={id('description')} value={row.description} placeholder="e.g. Diesel" onChange={(e) => form.updateRow(row.key, { description: e.target.value })} className={small} />
              </div>
              <div>
                <label htmlFor={id('currency')} className="mb-1 block text-xs text-muted-foreground">Currency</label>
                <select id={id('currency')} value={row.currency} onChange={(e) => form.updateRow(row.key, { currency: e.target.value as Currency })} className={small}>
                  {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="w-48">
                <label htmlFor={id('price')} className="mb-1 block text-xs text-muted-foreground">
                  Price per litre <span className="text-muted-foreground">(optional)</span>
                </label>
                <input id={id('price')} inputMode="decimal" value={row.unitRate} placeholder="Leave empty if not known" onChange={(e) => form.updateRow(row.key, { unitRate: e.target.value })} className={small} />
                {priceChanged && <p className="mt-1 text-xs text-status-yellow-pc">Changed — give a reason below.</p>}
              </div>
              {row.currency !== 'TZS' && (
                <div className="w-40">
                  <label htmlFor={id('rate')} className="mb-1 block text-xs text-muted-foreground">Exchange rate</label>
                  <input id={id('rate')} inputMode="decimal" value={row.exchangeRate} onChange={(e) => form.updateRow(row.key, { exchangeRate: e.target.value })} className={small} />
                </div>
              )}
              {!isTrip && (
                <>
                  <div className="w-40">
                    <label htmlFor={id('litres')} className="mb-1 block text-xs text-muted-foreground">Litres</label>
                    <input id={id('litres')} inputMode="decimal" value={row.quantity} onChange={(e) => form.updateRow(row.key, { quantity: e.target.value })} className={small} />
                  </div>
                  <div className="min-w-48 flex-1">
                    <label htmlFor={id('driver')} className="mb-1 block text-xs text-muted-foreground">Driver's name</label>
                    <input id={id('driver')} value={row.driver} onChange={(e) => form.updateRow(row.key, { driver: e.target.value })} className={small} />
                  </div>
                </>
              )}
            </div>

            {isTrip && (
              <TruckSetField
                label="Trucks"
                emptyText="Select a booking first."
                options={truckOptions}
                value={row.truckIds}
                onChange={(truckIds) => pickTrucks(row, truckIds)}
                renderSelected={(truckId) => (
                  <div className="flex flex-wrap gap-2">
                    <input
                      aria-label="Litres"
                      inputMode="decimal"
                      placeholder="Litres"
                      value={row.litres[truckId] ?? ''}
                      onChange={(e) => form.updateRow(row.key, { litres: { ...row.litres, [truckId]: e.target.value } })}
                      className={`w-28 ${tiny}`}
                    />
                    <input
                      aria-label="Driver's name"
                      placeholder="Driver's name"
                      value={row.drivers[truckId] ?? ''}
                      onChange={(e) => form.updateRow(row.key, { drivers: { ...row.drivers, [truckId]: e.target.value } })}
                      className={`w-52 ${tiny}`}
                    />
                  </div>
                )}
              />
            )}

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Line total:{' '}
                {row.unitRate.trim() === '' ? (
                  <span className="font-semibold text-status-yellow-pc">price pending</span>
                ) : (
                  <span className="font-semibold text-foreground">TZS {total.toLocaleString()}</span>
                )}
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
