import type { Booking, BookingTruck, EligibleTruck } from '~/types/booking'
import type { TruckDetails } from '~/services/bookingService'

/** Fields the user can set once for all trucks ("Same") or per truck ("Different"). */
export const SHARED_FIELDS = ['loading_point', 'offloading_point', 'cargo', 'rate'] as const
export type SharedField = (typeof SHARED_FIELDS)[number]
export type FieldMode = 'same' | 'different'

export const SHARED_FIELD_LABELS: Record<SharedField, string> = {
  cargo: 'Cargo',
  loading_point: 'Loading location',
  offloading_point: 'Offloading point',
  rate: 'Rate ($/mt)',
}

export type SortOption = 'added' | 'tons-asc' | 'tons-desc' | 'eta-asc' | 'eta-desc'

export const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Order added', value: 'added' },
  { label: 'Tons (low → high)', value: 'tons-asc' },
  { label: 'Tons (high → low)', value: 'tons-desc' },
  { label: 'ETA (earliest first)', value: 'eta-asc' },
  { label: 'ETA (latest first)', value: 'eta-desc' },
]

/** One truck line on the form. `bookingTruckId` is set once the truck is saved on the booking. */
export interface TruckRow extends Record<SharedField, string> {
  bookingTruckId?: number
  eta: string
  tons: string
  truck: EligibleTruck
}

export type ModeState = Record<SharedField, FieldMode>
export type SharedValues = Record<SharedField, string>

export const EMPTY_SHARED: SharedValues = { cargo: '', loading_point: '', offloading_point: '', rate: '' }
export const ALL_SAME: ModeState = { cargo: 'same', loading_point: 'same', offloading_point: 'same', rate: 'same' }

const text = (value: string | number | null | undefined) => (value === null || value === undefined ? '' : String(value))

/** Strip trailing zeros the API adds to decimals ("30.50" → "30.5"). */
export const decimalText = (value: string | null | undefined) => (value ? String(Number(value)) : '')

export function rowFromTruck(truck: EligibleTruck, details: Partial<TruckRow> = {}): TruckRow {
  return {
    cargo: '',
    eta: '',
    loading_point: '',
    offloading_point: '',
    rate: '',
    tons: decimalText(truck.capacity),
    ...details,
    truck,
  }
}

export function rowFromBookingTruck(bt: BookingTruck): TruckRow {
  return {
    bookingTruckId: bt.id,
    cargo: text(bt.cargo),
    eta: text(bt.eta).slice(0, 10),
    loading_point: text(bt.loading_point),
    offloading_point: text(bt.offloading_point),
    rate: decimalText(bt.rate),
    tons: decimalText(bt.capacity),
    truck: { ...bt.truck, driver: bt.driver, is_bookable: true, trailer: bt.trailer },
  }
}

/** A field is "Same" when every truck has the same value; then that value becomes the shared one. */
export function deriveModes(rows: TruckRow[]): { modes: ModeState; shared: SharedValues } {
  const modes = { ...ALL_SAME }
  const shared = { ...EMPTY_SHARED }
  SHARED_FIELDS.forEach((field) => {
    const values = new Set(rows.map((row) => row[field]))
    modes[field] = values.size > 1 ? 'different' : 'same'
    shared[field] = values.size === 1 ? [...values][0] : ''
  })
  return { modes, shared }
}

/** Values a row will be saved with, after applying Same/Different modes. */
export function resolveRow(row: TruckRow, modes: ModeState, shared: SharedValues): TruckDetails {
  const pick = (field: SharedField) => (modes[field] === 'same' ? shared[field] : row[field]) || undefined
  return {
    cargo: pick('cargo'),
    eta: row.eta || undefined,
    loading_point: pick('loading_point'),
    offloading_point: pick('offloading_point'),
    rate: pick('rate'),
    tons: row.tons || undefined,
  }
}

export function sortRows(rows: TruckRow[], sort: SortOption): TruckRow[] {
  if (sort === 'added') return rows
  const [field, direction] = sort.split('-') as ['tons' | 'eta', 'asc' | 'desc']
  const factor = direction === 'asc' ? 1 : -1
  const key = (row: TruckRow) => (field === 'tons' ? Number(row.tons || 0) : row.eta || (direction === 'asc' ? '9999' : '0000'))

  return [...rows].sort((a, b) => {
    const [x, y] = [key(a), key(b)]
    return (x < y ? -1 : x > y ? 1 : 0) * factor
  })
}

export const totalTons = (rows: TruckRow[]) => rows.reduce((sum, row) => sum + Number(row.tons || 0), 0)

export const isDecimal = (value: string) => value === '' || /^\d+(\.\d+)?$/.test(value)

/** Why a truck can't be booked, or null when it can (contract 2.1 B-9). */
export function unbookableReason(truck: EligibleTruck): string | null {
  const missing = [!truck.trailer && 'trailer', !truck.driver && 'driver'].filter(Boolean)
  return missing.length ? `No ${missing.join(' or ')} assigned` : null
}

export interface Prefill {
  clientId: string
  description: string
  modes: ModeState
  rows: TruckRow[]
  shared: SharedValues
}

/**
 * Copy & edit (contract 2.1 B-1/B-2). Same direction: reuse client, description and per-truck details
 * for source trucks that are free again. Return from Go: keep client and the same trucks, swap the
 * route (Go offloading becomes Return loading) and leave cargo, rate and ETA for the user to fill.
 */
export function prefillFromBooking(source: Booking, direction: 'go' | 'return', eligible: EligibleTruck[]): Prefill {
  const isReturnFromGo = direction === 'return' && source.direction === 'go'
  const eligibleById = new Map(eligible.map((truck) => [truck.id, truck]))

  const rows = source.booking_trucks
    .map((bt) => {
      const truck = eligibleById.get(bt.truck.id)
      if (!truck) return null
      const saved = rowFromBookingTruck(bt)
      return isReturnFromGo
        ? rowFromTruck(truck, { loading_point: saved.offloading_point, offloading_point: saved.loading_point, tons: saved.tons })
        : rowFromTruck(truck, { ...saved, bookingTruckId: undefined, eta: '', truck })
    })
    .filter((row): row is TruckRow => row !== null)

  return {
    clientId: String(source.client.id),
    description: source.description ?? '',
    rows,
    ...deriveModes(rows),
  }
}
