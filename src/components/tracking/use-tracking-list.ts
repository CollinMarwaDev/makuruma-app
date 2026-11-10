import { useMemo } from 'react'
import type { BorderRoute, TrackingLeg } from '~/types/tracking'
import { useSearchParamsState } from '~/global/utils/r3/hooks'

export const TRACKING_PAGE_SIZE = 15

export type TrackingView = 'active' | 'go' | 'return' | 'completed'

type ListParams = {
  attention?: 'yes'
  client?: string
  currentPage?: string
  q?: string
  route?: BorderRoute
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  status?: string
  view?: TrackingView
}

const isCompleted = (leg: TrackingLeg) => leg.current_status === 'completed'
export const needsAttention = (leg: TrackingLeg) => leg.is_overdue || leg.pod_overdue

const SORT_VALUE: Record<string, (leg: TrackingLeg) => string | number> = {
  booking: (l) => l.booking.booking_number,
  offloading: (l) => l.offloading_date ?? '',
  status: (l) => l.current_status,
  truck: (l) => l.truck.reg_no,
}

/** Tracking list state in the URL: view tab, search, filters, sort and page. */
export function useTrackingList(legs: TrackingLeg[]) {
  const [params, setParams] = useSearchParamsState<ListParams>()
  const view: TrackingView = params.view ?? 'active'

  return useMemo(() => {
    const inView = (leg: TrackingLeg) =>
      view === 'completed' ? isCompleted(leg) : !isCompleted(leg) && (view === 'active' || leg.booking.direction === view)

    const counts: Record<TrackingView, number> = {
      active: legs.filter((l) => !isCompleted(l)).length,
      completed: legs.filter(isCompleted).length,
      go: legs.filter((l) => !isCompleted(l) && l.booking.direction === 'go').length,
      return: legs.filter((l) => !isCompleted(l) && l.booking.direction === 'return').length,
    }

    const term = params.q?.trim().toLowerCase() ?? ''
    const filtered = legs.filter((leg) => {
      if (!inView(leg)) return false
      if (params.status && leg.current_status !== params.status) return false
      if (params.client && leg.booking.client?.company_name !== params.client) return false
      if (params.route && leg.route !== params.route) return false
      if (params.attention && !needsAttention(leg)) return false
      if (!term) return true
      return [leg.truck.reg_no, leg.trailer?.reg_no, leg.driver?.full_name, leg.trip?.trip_code, leg.booking.booking_number, leg.current_location]
        .some((value) => value?.toLowerCase().includes(term))
    })

    const sortKey = params.sortBy ? SORT_VALUE[params.sortBy] : undefined
    const factor = params.sortOrder === 'desc' ? -1 : 1
    const sorted = sortKey
      ? [...filtered].sort((a, b) => {
          const [x, y] = [sortKey(a), sortKey(b)]
          return (x < y ? -1 : x > y ? 1 : 0) * factor
        })
      : filtered

    const totalPages = Math.max(1, Math.ceil(sorted.length / TRACKING_PAGE_SIZE))
    const page = Math.min(Math.max(1, Number(params.currentPage) || 1), totalPages)

    return {
      clients: [...new Set(legs.map((l) => l.booking.client?.company_name).filter(Boolean) as string[])].sort(),
      counts,
      filtered: sorted,
      pageRows: sorted.slice((page - 1) * TRACKING_PAGE_SIZE, page * TRACKING_PAGE_SIZE),
      setFilter: (key: keyof ListParams, value: string | undefined) => setParams({ [key]: value, currentPage: undefined }),
      totalPages,
      view,
    }
  }, [legs, params, setParams, view])
}
