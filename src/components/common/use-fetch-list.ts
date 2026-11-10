import { useEffect, useState } from 'react'

/** Loads a list once and again after `refresh()`; keeps the last data while reloading. */
export function useFetchList<T>(fetcher: () => Promise<T[]>) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetcher()
      .then((rows) => {
        if (cancelled) return
        setData(rows)
        setError(null)
      })
      .catch((err: unknown) => !cancelled && setError(err))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
    // The fetcher is a module-level service function; reloading is driven by `refresh()`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey])

  return { data, error, loading, refresh: () => setReloadKey((k) => k + 1) }
}
