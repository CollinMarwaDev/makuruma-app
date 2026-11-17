import type { LookupItem, LookupKind, UsdRate } from '~/types/expense'
import { apiClient } from '~/services/apiClient'

/** Lists users manage for expenses: payment accounts, vendor types and Other subcategories. */
export function fetchLookup(kind: LookupKind): Promise<LookupItem[]> {
  return apiClient(`/${kind}`)
}

export function createLookup(kind: LookupKind, name: string): Promise<LookupItem> {
  return apiClient(`/${kind}`, { body: JSON.stringify({ name }), method: 'POST' })
}

export function updateLookup(kind: LookupKind, id: number, data: Partial<Pick<LookupItem, 'is_active' | 'name'>>): Promise<LookupItem> {
  return apiClient(`/${kind}/${id}`, { body: JSON.stringify(data), method: 'PUT' })
}

/** Deletes an unused entry; a used one comes back deactivated. */
export function deleteLookup(kind: LookupKind, id: number): Promise<LookupItem | null> {
  return apiClient(`/${kind}/${id}`, { method: 'DELETE' })
}

export function fetchUsdRates(): Promise<UsdRate[]> {
  return apiClient('/usd-rates')
}

export function createUsdRate(data: Omit<UsdRate, 'id'>): Promise<UsdRate> {
  return apiClient('/usd-rates', { body: JSON.stringify(data), method: 'POST' })
}

export function deleteUsdRate(id: number): Promise<void> {
  return apiClient(`/usd-rates/${id}`, { method: 'DELETE' })
}
