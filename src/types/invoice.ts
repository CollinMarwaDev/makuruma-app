import type { Booking, BookingTruck } from './booking'

export type InvoiceType = 'advance' | 'settlement' | 'standing_time' | 'adjustment'

export interface InvoiceLine {
  id: number
  booking_truck: BookingTruck
  description: string
  quantity: string
  rate: string
  days: number | null
  amount: string
}

export interface Invoice {
  id: number
  /** Only on the single-invoice endpoint. */
  uninvoiced_trucks?: UninvoicedTruck[]
  invoice_number: string
  deal_no: string | null
  bivac_no: string | null
  invoice_type: InvoiceType
  booking: Booking
  invoice_date: string
  exchange_rate: string
  status: 'pending' | 'paid'
  paid_at: string | null
  payer: { id: number; name: string } | null
  mode_of_payment: string | null
  delivery_note_no: string | null
  delivery_note_date: string | null
  supplier_ref: string | null
  other_ref: string | null
  loading_con_no: string | null
  settlement_no: string | null
  dispatched_through: string | null
  destination: string | null
  terms_of_delivery: string | null
  total_amount: string
  creator: { id: number; name: string }
  lines: InvoiceLine[]
  created_at: string
}

export interface EligibleInvoiceTruck {
  id: number
  capacity: string | null
  rate: string | null
  truck: { id: number; reg_no: string }
  trailer: { id: number; reg_no: string } | null
  trip: { id: number; trip_code: string } | null
  /** Per-truck details (contract 2.4): trucks on one booking may differ. Absent in edit mode. */
  cargo?: string | null
  completed_at?: string | null
  current_status?: string
  eta?: string | null
  loading_point?: string | null
  offloading_date?: string | null
  offloading_point?: string | null
}

/** A truck of the invoice's booking not yet on an invoice of this type (partial invoicing). */
export interface UninvoicedTruck {
  current_status: string
  id: number
  offloading_date: string | null
  reg_no: string | null
}
