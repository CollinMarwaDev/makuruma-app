import { z } from 'zod'
import type {
  Currency,
  ExpenseCategory,
  ExpenseFormKind,
  ExpenseListItem,
  ExpenseOrder,
  ExpensePickBooking,
  ExpensePickTruck,
  LineCategory,
  PaymentMode,
} from '../types/expense'
import { apiClient } from './apiClient'

import { API_BASE_URL } from './apiClient'

export interface ExpenseLineInput {
  amount_description?: string
  booking_truck_id?: string
  /** Truck of a Truck-category line. */
  truck_id?: string
  currency: Currency
  description: string
  driver_name?: string
  exchange_rate: string
  filled_at?: string
  group_key?: string
  is_additional?: boolean
  is_flat?: boolean
  line_category: LineCategory
  multiplier?: string
  original_amount?: string
  payee?: 'driver' | 'agent'
  quantity?: string
  unit_rate?: string
  vendor_id?: string
}

/** Header fields that can be set on create and changed while the order is pending. */
export interface ExpenseHeaderData {
  booking_ids: number[]
  lines: ExpenseLineInput[]
  form?: ExpenseFormKind
  other_subcategory_id?: number
  outbound_border?: string
  parent_order_id?: number
  payment_account_id?: number
  payment_date?: string
  payment_mode?: PaymentMode
  /** Needed when a fuel price that was already set changes. */
  price_change_reason?: string
  reference_no: string
  return_border?: string
  route_template_id?: number
  truck_id?: string
  usd_rate?: string
  vendor_id?: number
  zmk_rate?: string
}

export interface CreateExpenseData extends ExpenseHeaderData {
  category: ExpenseCategory
  expense_type: LineCategory
}

/** Download name like the API's: "expense-0125.pdf" from the form number. */
const expenseFileName = (expense: Pick<ExpenseOrder, 'form_number'>, extension: string, suffix = '') =>
  `expense-${expense.form_number.replace(/[\\/:*?"<>|]+/g, '-')}${suffix}.${extension}`

const lineCategory = z.enum(['fuel', 'vibali_tunduma', 'vibali_congo', 'mengine'])
const person = z.object({ id: z.number(), name: z.string() })

const listItemSchema: z.ZodType<ExpenseListItem> = z.object({
  approver: person.nullable(),
  bookings: z.array(z.object({ booking_number: z.string(), client: z.object({ company_name: z.string().nullable() }), direction: z.enum(['go', 'return']), id: z.number() })),
  category: z.enum(['trip', 'office', 'truck']),
  created_at: z.string(),
  creator: person.nullable(),
  expense_type: lineCategory,
  form: z.enum(['route', 'general', 'go', 'return', 'emergency']).nullable(),
  form_number: z.coerce.string(),
  id: z.number(),
  initiated_by: z.string().nullable(),
  is_legacy_mixed: z.boolean(),
  line_categories: z.array(lineCategory),
  order_number: z.string(),
  paid_at: z.string().nullable(),
  payment_date: z.string().nullable(),
  pending_price: z.boolean(),
  price_overdue: z.boolean(),
  reference_no: z.string().nullable(),
  status: z.enum(['pending', 'approved', 'rejected', 'paid']),
  subcategory: z.object({ id: z.number(), name: z.string() }).nullable(),
  total_amount: z.string(),
  truck_reg_nos: z.array(z.string()),
  usd_total: z.string(),
})

const driverSchema = z.object({ full_name: z.string() }).nullable()

const pickBookingSchema: z.ZodType<ExpensePickBooking> = z.object({
  booking_number: z.string(),
  booking_trucks: z.array(z.object({ driver: driverSchema, id: z.number(), truck: z.object({ driver: driverSchema, id: z.number(), reg_no: z.string() }) })),
  client: z.object({ company_name: z.string() }),
  direction: z.enum(['go', 'return']),
  id: z.number(),
})

const pickTruckSchema: z.ZodType<ExpensePickTruck> = z.object({ driver: driverSchema, id: z.number(), reg_no: z.string() })

/** List rows only (UAT 20 Nov); open an order with `fetchExpenseOrder` for its lines and history. */
export async function fetchExpenseOrders(filters: { expense_type?: LineCategory; form?: ExpenseFormKind; status?: ExpenseOrder['status'] } = {}): Promise<ExpenseListItem[]> {
  const params = new URLSearchParams(Object.entries(filters).flatMap(([key, value]): [string, string][] => (value ? [[key, value]] : [])))
  const query = params.toString()
  return z.array(listItemSchema).parse(await apiClient(`/expense-orders${query ? `?${query}` : ''}`))
}

export async function fetchExpenseOrder(id: number): Promise<ExpenseOrder> {
  return apiClient(`/expense-orders/${id}`)
}

/** Bookings and trucks for the expense form's pickers, without documents and history (UAT 20 Nov). */
export async function fetchExpensePickLists(): Promise<{ bookings: ExpensePickBooking[]; trucks: ExpensePickTruck[] }> {
  const [bookings, trucks] = await Promise.all([apiClient('/bookings?for=expense'), apiClient('/trucks?for=expense')])
  return { bookings: z.array(pickBookingSchema).parse(bookings), trucks: z.array(pickTruckSchema).parse(trucks) }
}

export async function createExpenseOrder(data: CreateExpenseData): Promise<ExpenseOrder> {
  return apiClient('/expense-orders', { method: 'POST', body: JSON.stringify(data) })
}

export async function updateExpenseOrder(id: number, data: ExpenseHeaderData): Promise<ExpenseOrder> {
  return apiClient(`/expense-orders/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

/** Fill in or correct fuel prices (pending or approved orders); a reason is needed to change a set price. */
export async function updateExpensePrices(id: number, data: { prices: { line_id: number; unit_rate: string }[]; reason?: string }): Promise<ExpenseOrder> {
  return apiClient(`/expense-orders/${id}/prices`, { method: 'PATCH', body: JSON.stringify(data) })
}

export async function approveExpenseOrder(id: number): Promise<ExpenseOrder> {
  return apiClient(`/expense-orders/${id}/approve`, { method: 'POST' })
}

export async function rejectExpenseOrder(id: number): Promise<ExpenseOrder> {
  return apiClient(`/expense-orders/${id}/reject`, { method: 'POST' })
}

/** `paidAt`: the day it was paid (UAT 20 Nov). */
export async function markExpensePaid(id: number, paidAt: string): Promise<ExpenseOrder> {
  return apiClient(`/expense-orders/${id}/mark-paid`, { body: JSON.stringify({ paid_at: paidAt }), method: 'POST' })
}

export async function deleteExpenseOrder(id: number): Promise<void> {
  return apiClient(`/expense-orders/${id}`, { method: 'DELETE' })
}

/** PDF of the order; fuel orders can leave out the price columns (req. 11). */
export async function downloadExpenseOrder(expense: Pick<ExpenseOrder, 'form_number' | 'id'>, showPrice = true): Promise<void> {
  const token = localStorage.getItem('auth_token')

  const response = await fetch(`${API_BASE_URL}/expense-orders/${expense.id}/download?show_price=${showPrice ? 1 : 0}`, {
    headers: {
      Accept: 'application/pdf',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) throw new Error('Failed to download expense order')

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = expenseFileName(expense, 'pdf')
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export async function downloadExpenseCategory(expense: Pick<ExpenseOrder, 'form_number' | 'id'>, category: string): Promise<void> {
  const token = localStorage.getItem('auth_token')

  const response = await fetch(`${API_BASE_URL}/expense-orders/${expense.id}/download-category/${category}`, {
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    const err = await response.json().catch(() => null)
    throw new Error(err?.message || 'Failed to download category export')
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = expenseFileName(expense, 'xlsx', `-${category}`)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export async function downloadExpenseOrderExcel(expense: Pick<ExpenseOrder, 'form_number' | 'id'>): Promise<void> {
  const token = localStorage.getItem('auth_token')

  const response = await fetch(`${API_BASE_URL}/expense-orders/${expense.id}/download-excel`, {
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) throw new Error('Failed to download Excel export')

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = expenseFileName(expense, 'xlsx')
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
