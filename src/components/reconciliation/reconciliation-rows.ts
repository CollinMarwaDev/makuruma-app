import { fetchClients } from '~/services/clientService'
import { fetchVendors } from '~/services/vendorService'
import { fetchClientSummary, fetchVendorSummary } from '~/services/reconciliationService'
import type { ClientReconciliationSummary, VendorReconciliationSummary } from '~/types/reconciliation'

export type ClientBalanceRow = ClientReconciliationSummary & { id: number; name: string }
export type VendorBalanceRow = VendorReconciliationSummary & { id: number; name: string }

/** Clients with their invoiced / paid / outstanding totals (one summary call per client, as the API offers). */
export async function fetchClientBalances(): Promise<ClientBalanceRow[]> {
  const clients = await fetchClients()
  return Promise.all(clients.map(async (c) => ({ ...(await fetchClientSummary(c.id)), id: c.id, name: c.company_name })))
}

/** Vendors with their debt / paid / balance totals. */
export async function fetchVendorBalances(): Promise<VendorBalanceRow[]> {
  const vendors = await fetchVendors()
  return Promise.all(vendors.map(async (v) => ({ ...(await fetchVendorSummary(v.id)), id: v.id, name: v.company_name })))
}
