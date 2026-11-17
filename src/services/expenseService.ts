import type { Currency, ExpenseCategory, ExpenseFormKind, ExpenseOrder, LineCategory, PaymentMode } from '../types/expense'
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

export async function fetchExpenseOrders(filters?: { date_from?: string; date_to?: string }): Promise<ExpenseOrder[]> {
  const params = new URLSearchParams()
  if (filters?.date_from) params.set('date_from', filters.date_from)
  if (filters?.date_to) params.set('date_to', filters.date_to)
  const query = params.toString()
  return apiClient(`/expense-orders${query ? `?${query}` : ''}`)
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

export async function markExpensePaid(id: number): Promise<ExpenseOrder> {
  return apiClient(`/expense-orders/${id}/mark-paid`, { method: 'POST' })
}

export async function deleteExpenseOrder(id: number): Promise<void> {
  return apiClient(`/expense-orders/${id}`, { method: 'DELETE' })
}

/** PDF of the order; fuel orders can leave out the price columns (req. 11). */
export async function downloadExpenseOrder(expense: ExpenseOrder, showPrice = true): Promise<void> {
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
  link.download = `expense-${expense.order_number}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export async function downloadExpenseCategory(expense: ExpenseOrder, category: string): Promise<void> {
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
  link.download = `${expense.order_number}-${category}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export async function downloadExpenseOrderExcel(expense: ExpenseOrder): Promise<void> {
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
  link.download = `expense-${expense.order_number}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
