import type { Document } from './truck'

export type BorderRoute = 'kasumbalesa' | 'sakania'

export const BORDER_ROUTE_LABELS: Record<BorderRoute, string> = {
  kasumbalesa: 'Kasumbalesa',
  sakania: 'Sakania',
}

export interface Checkpoint {
  id: number
  name: string
  /** null = on both border routes. */
  route: BorderRoute | null
  sequence_order: number
}

export interface LegMilestone {
  arrival_at: string | null
  checkpoint_id: number
  dispatch_at: string | null
  id: number
}

export type StatusColor = 'default' | 'warning' | 'danger' | 'success' | 'disabled'

/** Admin-managed tracking status (contract 2.2 D-4). */
export interface TrackingStatusOption {
  color: StatusColor
  id: number
  is_active: boolean
  is_system: boolean
  key: string
  label: string
  sort_order: number
}

export const LEG_DATE_FIELDS = [
  { key: 'loading_point_arrival_date', label: 'Arrival at loading point' },
  { key: 'loading_date', label: 'Loading' },
  { key: 'loading_dispatch_date', label: 'Dispatch from loading point' },
  { key: 'offloading_point_arrival_date', label: 'Arrival at offloading point' },
  { key: 'offloading_date', label: 'Offloading' },
] as const

export type LegDateField = (typeof LEG_DATE_FIELDS)[number]['key']

/** One booking leg (Go or Return) of a truck — the unit tracking is recorded on (contract 2.2 D-1). */
export interface TrackingLeg extends Record<LegDateField, string | null> {
  auto_completed_at: string | null
  booking: {
    booking_number: string
    client: { company_name: string; id: number } | null
    direction: 'go' | 'return'
    id: number
  }
  cargo: string | null
  capacity: string | null
  completed_at: string | null
  current_location: string | null
  current_status: string
  documents: Document[]
  driver: { full_name: string; id: number; phone: string | null } | null
  eta: string | null
  id: number
  is_overdue: boolean
  loading_point: string | null
  milestones: LegMilestone[]
  offloading_point: string | null
  pod_overdue: boolean
  route: BorderRoute
  /** Only on the single-leg endpoints: checkpoints of the leg's route in travel order. */
  route_checkpoints?: Checkpoint[]
  trailer: { id: number; reg_no: string } | null
  trip: { id: number; trip_code: string } | null
  truck: { capacity: string; id: number; reg_no: string; trip_status: 'go' | 'return' | 'off_duty' }
}
