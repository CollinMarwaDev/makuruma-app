import type { LegDateField, TrackingLeg, TrackingStatusOption } from '../types/tracking'
import { z } from 'zod'
import { apiClient, API_BASE_URL } from './apiClient'

const authHeaders = (accept: string): HeadersInit => {
  const token = localStorage.getItem('auth_token')
  return { Accept: accept, ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

async function downloadBlob(path: string, accept: string, filename: string) {
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: authHeaders(accept) })
  if (!response.ok) throw new Error('Download failed')
  const url = window.URL.createObjectURL(await response.blob())
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

// --- Legs -------------------------------------------------------------------

export async function fetchTrackingLegs(scope: 'active' | 'offloaded' | 'all' = 'all'): Promise<TrackingLeg[]> {
  return apiClient(`/tracking?scope=${scope}`)
}

export async function fetchTrackingLeg(legId: number): Promise<TrackingLeg> {
  return apiClient(`/tracking/${legId}`)
}

export async function updateLegStatus(
  legId: number,
  data: { current_location?: string; current_status: string; route?: string }
): Promise<TrackingLeg> {
  return apiClient(`/tracking/${legId}/status`, { body: JSON.stringify(data), method: 'PUT' })
}

export async function upsertLegMilestone(
  legId: number,
  data: { arrival_at?: string; checkpoint_id: number; dispatch_at?: string }
): Promise<TrackingLeg> {
  return apiClient(`/tracking/${legId}/milestones`, { body: JSON.stringify(data), method: 'POST' })
}

export async function updateLegDates(legId: number, data: Partial<Record<LegDateField, string>>): Promise<TrackingLeg> {
  return apiClient(`/booking-trucks/${legId}/dates`, { body: JSON.stringify(data), method: 'PUT' })
}

// --- Proof of delivery (contract 2.2 D-5) -------------------------------------

export async function uploadProofOfDelivery(legId: number, file: File) {
  const formData = new FormData()
  formData.append('document_type', 'POD')
  formData.append('attachment', file)
  const response = await fetch(`${API_BASE_URL}/booking-trucks/${legId}/documents`, {
    body: formData,
    headers: authHeaders('application/json'),
    method: 'POST',
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'Failed to upload proof of delivery')
  }
  return response.json()
}

export async function deleteProofOfDelivery(legId: number, documentId: number): Promise<void> {
  return apiClient(`/booking-trucks/${legId}/documents/${documentId}`, { method: 'DELETE' })
}

/** Opens an uploaded document in a new tab (the file needs the auth token, so it is fetched first). */
export async function viewDocument(documentId: number): Promise<void> {
  const preview = window.open('', '_blank')
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}/file`, { headers: authHeaders('*/*') })
  if (!response.ok) {
    preview?.close()
    throw new Error('Could not open the file')
  }
  const url = window.URL.createObjectURL(await response.blob())
  if (preview) preview.location.href = url
  else window.open(url, '_blank')
}

// --- Reports ------------------------------------------------------------------

export async function downloadTrackingReport(leg: TrackingLeg): Promise<void> {
  return downloadBlob(`/tracking/${leg.id}/download`, 'application/pdf', `tracking-${leg.truck.reg_no}-${leg.booking.booking_number}.pdf`)
}

/**
 * The client's GOING / RETURN tracking sheet for the given legs (the ones on screen) — the one format for every
 * tracking download, ready to edit and upload (contract 2.2 A; tracking req. 10).
 */
export async function downloadTrackingExcel(legIds: number[]): Promise<void> {
  const today = new Date().toLocaleDateString('en-GB').replaceAll('/', '.')
  const response = await fetch(`${API_BASE_URL}/tracking/export-excel`, {
    body: JSON.stringify({ ids: legIds }),
    headers: { ...authHeaders('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'), 'Content-Type': 'application/json' },
    method: 'POST',
  })
  if (!response.ok) throw new Error('Download failed')
  const url = window.URL.createObjectURL(await response.blob())
  const link = document.createElement('a')
  link.href = url
  link.download = `MAKURUMA TRACKING ${today}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

const importResultSchema = z.object({
  applied: z.boolean(),
  rows: z.array(
    z.object({
      booking_number: z.string().nullable(),
      changes: z.array(z.object({ field: z.string(), from: z.string().nullable(), to: z.string().nullable() })),
      errors: z.array(z.string()),
      result: z.enum(['update', 'unchanged', 'rejected']),
      row: z.number(),
      sheet: z.string(),
      trip_code: z.string().nullable(),
      truck: z.string(),
    })
  ),
  summary: z.object({ rejected: z.number(), unchanged: z.number(), updated: z.number() }),
})

export type TrackingImportResult = z.infer<typeof importResultSchema>

/** Bulk update from the edited sheet (contract 2.2 B). `apply: false` only previews; nothing is saved. */
export async function importTrackingExcel(file: File, apply: boolean): Promise<TrackingImportResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('apply', apply ? '1' : '0')
  const response = await fetch(`${API_BASE_URL}/tracking/import`, { body: formData, headers: authHeaders('application/json'), method: 'POST' })
  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const message = body && typeof body === 'object' && 'message' in body ? String(body.message) : 'The file could not be imported'
    throw new Error(message)
  }
  return importResultSchema.parse(body)
}

// --- Booking needs (UAT 20 Nov) ----------------------------------------------

const lastLegSchema = z.object({
  booking_number: z.string().nullable(),
  direction: z.enum(['go', 'return']).nullable(),
  id: z.number(),
  offloading_date: z.string().nullable(),
  offloading_point: z.string().nullable(),
})

const bookingNeedsSchema = z.object({
  unbooked: z.array(
    z.object({
      days_idle: z.number().nullable(),
      driver: z.string().nullable(),
      driver_phone: z.string().nullable(),
      last_leg: lastLegSchema.nullable(),
      location: z.string().nullable(),
      needs: z.enum(['go', 'return']),
      trailer: z.string().nullable(),
      truck: z.object({ id: z.number(), reg_no: z.string() }),
    })
  ),
  urgent: z.array(
    z.object({
      booking_number: z.string().nullable(),
      client: z.string().nullable(),
      direction: z.enum(['go', 'return']),
      driver: z.string().nullable(),
      driver_phone: z.string().nullable(),
      leg_id: z.number(),
      location: z.string().nullable(),
      needs: z.enum(['go', 'return']),
      reached: z.string(),
      reached_at: z.string().nullable(),
      status: z.string(),
      truck: z.object({ id: z.number(), reg_no: z.string() }),
    })
  ),
})

export type BookingNeeds = z.infer<typeof bookingNeedsSchema>

/** Trucks with no booking, and trucks near the border that need their next booking (UAT 20 Nov). */
export async function fetchBookingNeeds(): Promise<BookingNeeds> {
  return bookingNeedsSchema.parse(await apiClient('/tracking/booking-needs'))
}

// --- Statuses (contract 2.2 D-4) ----------------------------------------------

export async function fetchTrackingStatuses(): Promise<TrackingStatusOption[]> {
  return apiClient('/tracking-statuses')
}

export async function createTrackingStatus(data: Pick<TrackingStatusOption, 'label' | 'color'>): Promise<TrackingStatusOption> {
  return apiClient('/tracking-statuses', { body: JSON.stringify(data), method: 'POST' })
}

export async function updateTrackingStatus(
  id: number,
  data: Partial<Pick<TrackingStatusOption, 'label' | 'color' | 'is_active' | 'sort_order'>>
): Promise<TrackingStatusOption> {
  return apiClient(`/tracking-statuses/${id}`, { body: JSON.stringify(data), method: 'PUT' })
}

/** Deletes an unused custom status; a status still in use is deactivated instead (returned). */
export async function deleteTrackingStatus(id: number): Promise<TrackingStatusOption | null> {
  return apiClient(`/tracking-statuses/${id}`, { method: 'DELETE' })
}
