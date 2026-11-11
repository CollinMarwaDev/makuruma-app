export interface DashboardSummary {
  fleet: {
    total: number
    active: number
    maintenance: number
    decommissioned: number
  }
  compliance: {
    expired: number
    expiring_soon: number
    upcoming: {
      id: number
      documentable_type: string
      documentable_id: number
      document_type: string
      expiry_date: string
      /** Truck / trailer reg no, or driver / staff name. */
      owner_name: string | null
    }[]
  }
  bookings: {
    total: number
    awaiting_return: number
    completed: number
    this_month: number
    /** Bookings created per month (last 6 months), by direction. Optional so older API builds still render. */
    monthly_trend?: { month: string; go: number; return: number }[]
  }
  /** Trucks per tracking status key. Fixed keys are always present; admin-added statuses appear as extra keys. */
  tracking: Record<string, number> & {
    pending: number
    on_route_to_loading: number
    loading: number
    in_transit: number
    at_border: number
    offloading: number
    delayed: number
    breakdown: number
    completed: number
  }
  expenses: {
    pending_count: number
    pending_total: number
    paid_this_month: number
    by_category: { trip: number; office: number; truck: number }
  }
  /** Last 6 months, both in USD (expenses converted with that month's average invoice rate). */
  finance_trend: { month: string; revenue: number; expenses: number | null; expenses_tzs: number; rate: number | null }[]
  invoicing: {
    total_invoiced: number
    this_month: number
    monthly_trend: { month: string; total: string }[]
  }
}
