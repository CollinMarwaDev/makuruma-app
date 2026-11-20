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
  /** Truck of a Truck-category line (an order may cover several trucks). */
  truck: { id: number; reg_no: string } | null
  currency: Currency
  description: string
  driver_name: string | null
  exchange_rate: string
  /** Fuel: the day the truck was filled, when the vendor gives it (UAT 20 Nov). */
  filled_at: string | null
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
  /** The typed reference number (UAT 20 Nov); the system number when there is none. */
  form_number: string
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

/** A row of the Expenses list (UAT 20 Nov: the list no longer loads lines; open an order for the details). */
export interface ExpenseListItem
  extends Pick<
    ExpenseOrder,
    | 'category' | 'created_at' | 'expense_type' | 'form' | 'form_number' | 'id' | 'initiated_by' | 'is_legacy_mixed' | 'order_number'
    | 'paid_at' | 'payment_date' | 'pending_price' | 'price_overdue' | 'reference_no' | 'status' | 'subcategory' | 'total_amount' | 'usd_total'
  > {
  approver: ExpenseUser | null
  bookings: { booking_number: string; client: { company_name: string | null }; direction: 'go' | 'return'; id: number }[]
  creator: ExpenseUser | null
  line_categories: LineCategory[]
  /** Trucks on the order's lines. */
  truck_reg_nos: string[]
}

/** Booking as the expense form picks it: number, client and its trucks with drivers. */
export interface ExpensePickBooking {
  booking_number: string
  booking_trucks: { driver: { full_name: string } | null; id: number; truck: { driver: { full_name: string } | null; id: number; reg_no: string } }[]
  client: { company_name: string }
  direction: 'go' | 'return'
  id: number
}

/** Truck as the expense form picks it. */
export interface ExpensePickTruck {
  driver: { full_name: string } | null
  id: number
  reg_no: string
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
