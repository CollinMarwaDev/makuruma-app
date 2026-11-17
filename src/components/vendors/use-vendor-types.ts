import { useEffect, useState } from 'react'
import type { LookupItem } from '~/types/expense'
import { fetchLookup } from '~/services/expenseSettingsService'

/** Vendor types from the managed list (Expense UAT req. 28) and a slug → name lookup. */
export function useVendorTypes() {
  const [types, setTypes] = useState<LookupItem[]>([])

  useEffect(() => {
    fetchLookup('vendor-types').then(setTypes).catch(() => setTypes([]))
  }, [])

  const typeName = (slug: string) => types.find((t) => t.slug === slug)?.name ?? slug

  return { typeName, types }
}
