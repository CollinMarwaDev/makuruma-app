import type { RouteTemplate, RouteTemplateLine } from '~/types/expense'
import { apiClient } from '~/services/apiClient'

export interface RouteTemplateData {
  expense_type: RouteTemplate['expense_type']
  is_active?: boolean
  lines: RouteTemplateLine[]
  name: string
  outbound_border?: string
  return_border?: string
}

export function fetchRouteTemplates(expenseType?: RouteTemplate['expense_type']): Promise<RouteTemplate[]> {
  return apiClient(`/route-templates${expenseType ? `?expense_type=${expenseType}` : ''}`)
}

export function createRouteTemplate(data: RouteTemplateData): Promise<RouteTemplate> {
  return apiClient('/route-templates', { body: JSON.stringify(data), method: 'POST' })
}

/** Replaces the template's lines; saved orders keep their own copy. */
export function updateRouteTemplate(id: number, data: RouteTemplateData): Promise<RouteTemplate> {
  return apiClient(`/route-templates/${id}`, { body: JSON.stringify(data), method: 'PUT' })
}

/** Deletes an unused template; one used by an order comes back deactivated. */
export function deleteRouteTemplate(id: number): Promise<RouteTemplate | null> {
  return apiClient(`/route-templates/${id}`, { method: 'DELETE' })
}
