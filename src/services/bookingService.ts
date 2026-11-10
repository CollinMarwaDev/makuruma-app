import type { Booking, EligibleTruck } from '../types/booking'
import { apiClient } from './apiClient'

import { API_BASE_URL } from './apiClient'

/** Per-truck booking details (contract 2.1: these can differ between trucks). */
export interface TruckDetails {
  tons?: string
  cargo?: string
  rate?: string
  loading_point?: string
  offloading_point?: string
  eta?: string
}

export interface CreateBookingData {
  direction: 'go' | 'return'
  client_id: string
  source_booking_id?: number
  description?: string
  trucks: (TruckDetails & { truck_id: number })[]
}

export interface UpdateBookingData {
  description?: string
  trucks: (TruckDetails & { booking_truck_id: number })[]
}

export async function fetchBookings(): Promise<Booking[]> {
  return apiClient('/bookings')
}

export async function fetchEligibleTrucks(direction: 'go' | 'return'): Promise<EligibleTruck[]> {
  return apiClient(`/bookings/eligible-trucks?direction=${direction}`)
}

export async function createBooking(data: CreateBookingData): Promise<Booking> {
  return apiClient('/bookings', { method: 'POST', body: JSON.stringify(data) })
}

export async function updateBooking(id: number, data: UpdateBookingData): Promise<Booking> {
  return apiClient(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function deleteBooking(id: number): Promise<void> {
  return apiClient(`/bookings/${id}`, { method: 'DELETE' })
}
export async function addTruckToBooking(bookingId: number, data: TruckDetails & { truck_id: number }): Promise<Booking> {
  return apiClient(`/bookings/${bookingId}/trucks`, { method: 'POST', body: JSON.stringify(data) })
}

export async function swapBookingTruck(bookingId: number, bookingTruckId: number, truckId: number): Promise<Booking> {
  return apiClient(`/bookings/${bookingId}/trucks/${bookingTruckId}`, { method: 'PUT', body: JSON.stringify({ truck_id: truckId }) })
}

export async function removeTruckFromBooking(bookingId: number, bookingTruckId: number): Promise<void> {
  return apiClient(`/bookings/${bookingId}/trucks/${bookingTruckId}`, { method: 'DELETE' })
}

export async function downloadBookingAccessList(booking: Booking): Promise<void> {
  const token = localStorage.getItem('auth_token')

  const response = await fetch(`${API_BASE_URL}/bookings/${booking.id}/download`, {
    headers: {
      Accept: 'application/pdf',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) throw new Error('Failed to download access list')

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `booking-${booking.booking_number}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
