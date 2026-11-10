import type { LegDateField, TrackingLeg, TrackingStatusOption } from '../types/tracking'
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

export async function fetchTrackingLegs(scope: 'active' | 'completed' | 'all' = 'all'): Promise<TrackingLeg[]> {
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

export async function downloadTrackingExcel(): Promise<void> {
  return downloadBlob(
    '/tracking/export-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    `tracking-export-${new Date().toISOString().slice(0, 10)}.xlsx`
  )
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
