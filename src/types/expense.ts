import type { Truck } from './truck'

export type ExpenseCategory = 'trip' | 'office' | 'truck'
export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'paid'
/** Expense type of an order; every line of the order has the same value. */
export type LineCategory = 'fuel' | 'vibali_tunduma' | 'vibali_congo' | 'mengine'
export type Currency = 'TZS' | 'USD' | 'ZMK'
export type ExpenseFormKind = 'route' | 'general' | 'go' | 'return' | 'emergency'
export type PaymentMode = 'on_spot' | 'bill'

export interface ExpenseLine {
  id: number
  amount: string
  amount_description: string | null
  booking_truck: { id: number; truck: { reg_no: string }; trip: { trip_code: string } | null } | null
  currency: Currency
  description: string
  driver_name: string | null
  exchange_rate: string
  group_key: string | null
  is_additional: boolean
  is_flat: boolean
  line_category: LineCategory
  multiplier: string | null
  original_amount: string
  payee: 'driver' | 'agent' | null
  quantity: string | null
  unit_rate: string | null
  vendor: { id: number; company_name: string } | null
}

export interface ExpenseBooking {
  id: number
  booking_number: string
  client: { company_name: string }
  direction: 'go' | 'return'
}

export interface ExpenseOrder {
  id: number
  approved_at: string | null
  approver: ExpenseUser | null
  /** First linked booking; `bookings` holds all of them. */
  booking: ExpenseBooking | null
  bookings: ExpenseBooking[]
  category: ExpenseCategory
  created_at: string
  creator: ExpenseUser
  expense_type: LineCategory
  form: ExpenseFormKind | null
  initiated_by: string | null
  /** Saved before types were separated and mixes line types: view and download only. */
  is_legacy_mixed: boolean
  lines: ExpenseLine[]
  order_number: string
  other_subcategory_id: number | null
  outbound_border: string | null
  paid_at: string | null
  /** Return settlement (163): the going order (165) it settles. */
  parent_order_id: number | null
  payer: ExpenseUser | null
  payment_account: string | null
  payment_account_id: number | null
  payment_date: string | null
  payment_mode: PaymentMode
  /** Fuel order with a line still waiting for its price. */
  pending_price: boolean
  price_changes: PriceChange[]
  /** Price still missing after 14 days. */
  price_overdue: boolean
  reference_no: string | null
  return_border: string | null
  route_template_id: number | null
  serial: number | null
  status: ExpenseStatus
  /** Other expenses: e.g. Weighbridge (Mizani), GCLA. */
  subcategory: { id: number; name: string } | null
  total_amount: string
  truck: Truck | null
  usd_rate: string | null
  usd_total: string
  vendor_id: number | null
  zmk_rate: string | null
}

export interface PriceChange {
  id: number
  created_at: string
  line_label: string
  new_unit_rate: string | null
  old_unit_rate: string | null
  reason: string | null
  user: ExpenseUser
}

export interface ExpenseUser {
  id: number
  name: string
}

/** An entry of a list users manage (payment accounts, vendor types, subcategories). */
export interface LookupItem {
  id: number
  is_active: boolean
  name: string
  /** Vendor types only. */
  slug?: string
}

export type LookupKind = 'payment-accounts' | 'vendor-types' | 'expense-subcategories'

export interface UsdRate {
  id: number
  ends_on: string
  rate: string
  starts_on: string
}

export interface RouteTemplateLine {
  id?: number
  currency: Currency
  description: string
  is_flat: boolean
  multiplier: string | null
  segment: 'dar_tunduma' | 'zambia' | 'border_drc' | null
  unit_amount: string
}

/** User-editable list of route costs an order starts from (req. 12). */
export interface RouteTemplate {
  id: number
  expense_type: 'vibali_tunduma' | 'vibali_congo'
  is_active: boolean
  lines: RouteTemplateLine[]
  name: string
  outbound_border: string | null
  return_border: string | null
}
