export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function getToken(): string | null {
  return localStorage.getItem('auth_token')
}

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const token = getToken()

  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new Error(errorBody?.message || `Request failed: ${response.status}`)
  }

  if (response.status === 204) return null

  return response.json()
}
