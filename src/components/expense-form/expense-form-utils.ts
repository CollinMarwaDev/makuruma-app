import type { Currency, ExpenseCategory, ExpenseLine, LineCategory } from '~/types/expense'
import type { ExpenseLineInput } from '~/services/expenseService'

/** One logical expense line in the form; saved as one API line per selected truck (same group_key). */
export interface LineRow {
  amount: string
  /** Vibali: printed amount text; empty = automatic, e.g. "300 X 10 = 3,000". */
  amountDescription: string
  currency: Currency
  description: string
  /** Fuel on a Truck order: the driver's name. */
  driver: string
  /** Fuel on a Trip order: driver's name per booking truck id. */
  drivers: Record<string, string>
  exchangeRate: string
  /** Saved group_key, kept so the API can match lines and log price changes. */
  groupKey?: string
  key: string
  /** Vibali Congo 165: extra cost printed after the route subtotal (e.g. pulling entry card). */
  isAdditional: boolean
  /** Vibali: one amount for the order, not per truck (e.g. Pesa ya kutolea). */
  isFlat: boolean
  /** Fuel on a Trip order: litres per booking truck id. */
  litres: Record<string, string>
  /** Vibali: e.g. 10 gates; 1 when not used. */
  multiplier: string
  /** Vibali form 129: who receives the money (not printed). */
  payee: '' | 'driver' | 'agent'
  quantity: string
  truckIds: string[]
  unitRate: string
  vendorId: string
}

export const newRow = (): LineRow => ({
  amount: '',
  amountDescription: '',
  currency: 'TZS',
  description: '',
  driver: '',
  drivers: {},
  exchangeRate: '1',
  isAdditional: false,
  isFlat: false,
  key: crypto.randomUUID(),
  litres: {},
  multiplier: '1',
  payee: '',
  quantity: '',
  truckIds: [],
  unitRate: '',
  vendorId: '',
})

export const num = (value: string | undefined) => parseFloat(value ?? '') || 0

/** Line total in TZS, following the category rules: Trip per truck, Office quantity × rate, Truck one amount. */
export function rowTotal(row: LineRow, category: ExpenseCategory, type: LineCategory): number {
  const rate = row.currency === 'TZS' ? 1 : num(row.exchangeRate)
  if (category === 'trip') {
    if (type === 'fuel') return row.truckIds.reduce((sum, id) => sum + num(row.litres[id]), 0) * num(row.unitRate) * rate
    return num(row.amount) * row.truckIds.length * rate
  }
  if (category === 'office' || type === 'fuel') return num(row.quantity) * num(row.unitRate) * rate
  return num(row.amount) * rate
}

/** Rebuild form rows from saved lines (grouped by group_key). */
export function rowsFromLines(lines: ExpenseLine[]): LineRow[] {
  const groups = new Map<string, ExpenseLine[]>()
  lines.forEach((line, index) => {
    const key = line.group_key ?? `single-${index}`
    groups.set(key, [...(groups.get(key) ?? []), line])
  })

  return [...groups.values()].map((group) => {
    const first = group[0]
    const litres: Record<string, string> = {}
    const drivers: Record<string, string> = {}
    group.forEach((l) => {
      if (!l.booking_truck) return
      litres[String(l.booking_truck.id)] = l.quantity ?? ''
      drivers[String(l.booking_truck.id)] = l.driver_name ?? ''
    })
    return {
      amount: first.original_amount,
      amountDescription: first.amount_description ?? '',
      currency: first.currency,
      description: first.description,
      driver: first.driver_name ?? '',
      drivers,
      exchangeRate: first.exchange_rate,
      groupKey: first.group_key ?? undefined,
      isAdditional: first.is_additional,
      isFlat: first.is_flat,
      key: crypto.randomUUID(),
      litres,
      multiplier: first.multiplier ?? '1',
      payee: first.payee ?? '',
      quantity: first.quantity ?? '',
      truckIds: group.flatMap((l) => (l.booking_truck ? [String(l.booking_truck.id)] : [])),
      unitRate: first.unit_rate ?? '',
      vendorId: first.vendor ? String(first.vendor.id) : '',
    }
  })
}

/** API lines for the rows; a Trip row becomes one line per selected truck. */
export function buildLines(rows: LineRow[], category: ExpenseCategory, type: LineCategory): ExpenseLineInput[] {
  return rows.flatMap((row): ExpenseLineInput[] => {
    const base: ExpenseLineInput = {
      currency: row.currency,
      description: row.description.trim(),
      exchange_rate: row.currency === 'TZS' ? '1' : row.exchangeRate,
      group_key: row.groupKey ?? crypto.randomUUID(),
      line_category: type,
      vendor_id: row.vendorId || undefined,
    }
    if (category === 'trip') {
      return row.truckIds.map((id) =>
        type === 'fuel'
          ? { ...base, booking_truck_id: id, driver_name: row.drivers[id]?.trim(), quantity: row.litres[id] || '0', unit_rate: row.unitRate || undefined }
          : { ...base, booking_truck_id: id, original_amount: row.amount || '0' }
      )
    }
    if (type === 'fuel') return [{ ...base, driver_name: row.driver.trim(), quantity: row.quantity || '0', unit_rate: row.unitRate || undefined }]
    if (category === 'office') return [{ ...base, quantity: row.quantity || '0', unit_rate: row.unitRate || '0' }]
    return [{ ...base, original_amount: row.amount || '0' }]
  })
}

/** Why the rows cannot be saved yet, or null. */
export function rowsProblem(rows: LineRow[], category: ExpenseCategory, type: LineCategory): string | null {
  if (rows.length === 0) return 'Add at least one expense line.'
  if (rows.some((r) => !r.description.trim())) return 'Every line needs a description.'
  if (category === 'trip' && rows.some((r) => r.truckIds.length === 0)) return 'Select at least one truck on every line.'
  if (type !== 'fuel') return null
  if (category === 'office') return 'Fuel is for a truck: choose Trip or Truck, not Office.'
  const perTruck = (r: LineRow) => (category === 'trip' ? r.truckIds.map((id) => [r.litres[id], r.drivers[id]]) : [[r.quantity, r.driver]])
  if (rows.some((r) => perTruck(r).some(([litres]) => num(litres) <= 0))) return 'Enter the litres for every truck.'
  if (rows.some((r) => perTruck(r).some(([, driver]) => !driver?.trim()))) return "Enter the driver's name for every truck."
  return null
}

/** Group keys whose saved price per litre is being changed (a reason is needed, req. 9). */
export function changedPrices(initial: LineRow[], rows: LineRow[]): string[] {
  const saved = new Map(initial.filter((r) => r.groupKey && r.unitRate !== '').map((r) => [r.groupKey, num(r.unitRate)]))
  return rows.filter((r) => r.groupKey && saved.has(r.groupKey) && (r.unitRate === '' || Math.abs(num(r.unitRate) - (saved.get(r.groupKey) ?? 0)) > 0.001)).map((r) => r.groupKey ?? '')
}
