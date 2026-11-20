import type { Currency, LineCategory, RouteTemplate } from '~/types/expense'
import type { ExpenseLineInput } from '~/services/expenseService'
import { newRow, num, type LineRow } from '~/components/expense-form/expense-form-utils'

/** Currencies in the order the Vibali forms print them (req. 16). */
export const CURRENCY_ORDER: Currency[] = ['USD', 'ZMK', 'TZS']

export const BORDERS = ['KASUMBALESA', 'SAKANIA']

const fmt = (v: number) => v.toLocaleString(undefined, { maximumFractionDigits: 2 })

/** Amount per truck (or the flat amount): unit × multiplier. */
export const perTruck = (row: LineRow) => num(row.unitRate) * (num(row.multiplier) || 1)

/** Line total in its own currency. */
export const vibaliRowTotal = (row: LineRow) => perTruck(row) * (row.isFlat ? 1 : row.truckIds.length)

/** Default printed amount text, e.g. "300 X 10 = 3,000" (req. 15). */
export function autoAmountText(row: LineRow): string {
  const multiplier = num(row.multiplier) || 1
  return multiplier === 1 ? fmt(perTruck(row)) : `${fmt(num(row.unitRate))} X ${fmt(multiplier)} = ${fmt(perTruck(row))}`
}

/** Rows copied from a template; non-flat lines start on every truck ("same for all", req. 13–14). */
export const rowsFromTemplate = (template: RouteTemplate, truckIds: string[]): LineRow[] =>
  template.lines.map((line) => ({
    ...newRow(),
    currency: line.currency,
    description: line.description,
    isFlat: line.is_flat,
    multiplier: line.multiplier ?? '1',
    truckIds: line.is_flat ? [] : truckIds,
    unitRate: String(Number(line.unit_amount)),
  }))

/** API lines: one per truck with the same group_key, one line for a flat amount. */
export function buildVibaliLines(rows: LineRow[], type: LineCategory): ExpenseLineInput[] {
  return rows.flatMap((row): ExpenseLineInput[] => {
    const base: ExpenseLineInput = {
      amount_description: row.amountDescription.trim() || undefined,
      currency: row.currency,
      description: row.description.trim(),
      exchange_rate: '1',
      group_key: row.groupKey ?? crypto.randomUUID(),
      is_additional: row.isAdditional || undefined,
      line_category: type,
      multiplier: row.multiplier || '1',
      payee: row.payee || undefined,
      unit_rate: row.unitRate,
    }
    return row.isFlat ? [{ ...base, is_flat: true }] : row.truckIds.map((id) => ({ ...base, booking_truck_id: id }))
  })
}

/** Why the lines cannot be saved; return settlements (163) may have negative amounts. */
export function vibaliProblem(rows: LineRow[], allowNegative = false): string | null {
  if (rows.length === 0) return 'Add at least one line.'
  if (rows.some((r) => !r.description.trim())) return 'Every line needs a description.'
  if (rows.some((r) => (allowNegative ? num(r.unitRate) === 0 : num(r.unitRate) <= 0))) return 'Every line needs an amount.'
  if (rows.some((r) => !r.isFlat && r.truckIds.length === 0)) return 'Select the trucks of every line, or mark it as one amount for the order.'
  if (rows.some((r) => !r.payee)) return 'Choose on every line whether the money goes to the driver or stays with the agent.'
  return null
}

export interface VibaliTotals {
  grand: number
  perCurrency: Record<Currency, number>
  usdConverted: number
  zmkConverted: number
}

/** Totals as printed: ZMK (and USD on form 129) converted to TSh at the order's rates. */
export function vibaliTotals(rows: LineRow[], zmkRate: string, usdRate: string, keepUsd: boolean): VibaliTotals {
  const perCurrency = { TZS: 0, USD: 0, ZMK: 0 } as Record<Currency, number>
  rows.forEach((r) => (perCurrency[r.currency] += vibaliRowTotal(r)))
  const zmkConverted = perCurrency.ZMK * num(zmkRate)
  const usdConverted = keepUsd ? 0 : perCurrency.USD * num(usdRate)
  return { grand: perCurrency.TZS + zmkConverted + usdConverted, perCurrency, usdConverted, zmkConverted }
}
