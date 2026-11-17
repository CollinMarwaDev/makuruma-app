import type { LineCategory } from '../types/expense'

export const LINE_CATEGORIES: { value: LineCategory; label: string; needsVendor: boolean }[] = [
  { value: 'fuel', label: 'Fuel', needsVendor: true },
  { value: 'vibali_tunduma', label: 'Vibali Tunduma', needsVendor: false },
  { value: 'vibali_congo', label: 'Vibali Congo', needsVendor: false },
  { value: 'mengine', label: 'Other (Mengine)', needsVendor: false },
]

/** Label of an expense type, e.g. "Vibali Tunduma". */
export const expenseTypeLabel = (value: LineCategory) => LINE_CATEGORIES.find((c) => c.value === value)?.label ?? value

export const CURRENCIES: { value: 'TZS' | 'USD' | 'ZMK'; label: string }[] = [
  { value: 'TZS', label: 'TZS' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'ZMK', label: 'ZMK' },
]
