import { useCallback, useEffect, useState } from 'react'
import type { StatusColor, TrackingStatusOption } from '~/types/tracking'
import { fetchTrackingStatuses } from '~/services/trackingService'

let cache: TrackingStatusOption[] | null = null

const humanize = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

/** Tracking statuses from the API (admin-managed), cached for the session. */
export function useTrackingStatuses() {
  const [statuses, setStatuses] = useState<TrackingStatusOption[]>(cache ?? [])

  const reload = useCallback(async () => {
    cache = await fetchTrackingStatuses()
    setStatuses(cache)
    return cache
  }, [])

  useEffect(() => {
    if (cache) return
    let cancelled = false
    fetchTrackingStatuses()
      .then((data) => {
        cache = data
        if (!cancelled) setStatuses(data)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  const find = (key: string) => statuses.find((s) => s.key === key)

  return {
    activeStatuses: statuses.filter((s) => s.is_active),
    reload,
    statusColor: (key: string): StatusColor => find(key)?.color ?? 'default',
    statusLabel: (key: string) => find(key)?.label ?? humanize(key),
    statuses,
  }
}
