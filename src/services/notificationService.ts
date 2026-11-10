import { apiClient } from './apiClient'

export interface AppNotification {
  created_at: string
  data: { booking_number?: string; booking_truck_id?: number; kind: string; message: string; title: string; truck?: string }
  id: string
  read_at: string | null
}

export async function fetchNotifications(): Promise<{ data: AppNotification[]; unread_count: number }> {
  return apiClient('/notifications')
}

export async function markNotificationRead(id: string): Promise<void> {
  return apiClient(`/notifications/${id}/read`, { method: 'POST' })
}

export async function markAllNotificationsRead(): Promise<void> {
  return apiClient('/notifications/read-all', { method: 'POST' })
}
