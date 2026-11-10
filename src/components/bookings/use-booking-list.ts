import { useMemo } from 'react'
import type { Booking } from '~/types/booking'
import { useSearchParamsState } from '~/global/utils/r3/hooks'

export const BOOKINGS_PAGE_SIZE = 10

type ListParams = {
  client?: string
  currentPage?: string
  direction?: 'go' | 'return'
  q?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const bookingTons = (booking: Booking) => booking.booking_trucks.reduce((sum, bt) => sum + Number(bt.capacity ?? 0), 0)

const SORT_VALUE: Record<string, (b: Booking) => string | number> = {
  booking_number: (b) => b.booking_number,
  client: (b) => b.client.company_name.toLowerCase(),
  created_at: (b) => b.created_at,
  eta: (b) => b.eta ?? '',
  tons: bookingTons,
  trucks: (b) => b.booking_trucks.length,
}

/**
 * Search, filter, sort and paginate the bookings list from URL search params
 * (`q`, `direction`, `client`, `sortBy`, `sortOrder`, `currentPage`) so the view survives refresh and can be shared.
 */
export function useBookingList(bookings: Booking[]) {
  const [params, setParams] = useSearchParamsState<ListParams>()

  return useMemo(() => {
    const term = params.q?.trim().toLowerCase() ?? ''
    const filtered = bookings.filter((booking) => {
      if (params.direction && booking.direction !== params.direction) return false
      if (params.client && booking.client.company_name !== params.client) return false
      if (!term) return true
      return [
        booking.booking_number,
        booking.client.company_name,
        booking.description,
        ...booking.booking_trucks.flatMap((bt) => [bt.truck.reg_no, bt.trailer?.reg_no, bt.driver?.full_name, bt.loading_point, bt.offloading_point]),
      ].some((value) => value?.toLowerCase().includes(term))
    })

    const sortKey = SORT_VALUE[params.sortBy ?? 'created_at'] ?? SORT_VALUE.created_at
    const factor = (params.sortOrder ?? (params.sortBy ? 'asc' : 'desc')) === 'asc' ? 1 : -1
    const sorted = [...filtered].sort((a, b) => {
      const [x, y] = [sortKey(a), sortKey(b)]
      return (x < y ? -1 : x > y ? 1 : 0) * factor
    })

    const totalPages = Math.max(1, Math.ceil(sorted.length / BOOKINGS_PAGE_SIZE))
    const page = Math.min(Math.max(1, Number(params.currentPage) || 1), totalPages)
    const pageRows = sorted.slice((page - 1) * BOOKINGS_PAGE_SIZE, page * BOOKINGS_PAGE_SIZE)
    const clients = [...new Set(bookings.map((b) => b.client.company_name))].sort()

    /** Apply a filter and go back to page 1. */
    const setFilter = (key: 'client' | 'direction', value: string | undefined) => setParams({ [key]: value, currentPage: undefined })

    return { clients, filteredCount: sorted.length, pageRows, setFilter, totalPages }
  }, [bookings, params, setParams])
}
