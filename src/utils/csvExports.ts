import type { TrackingLeg } from '../types/tracking'

function escapeCsvCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function exportTrackingCsv(legs: TrackingLeg[], statusLabel: (key: string) => string) {
  const headers = [
    'Trip Code', 'Booking', 'Direction', 'Truck', 'Trailer', 'Driver', 'Driver Contact',
    'Current Location', 'Current Status', 'Border Route',
    'Loading Point', 'Loading Arrival', 'Loading Date',
    'Offloading Point', 'Dispatch', 'Offloading Arrival', 'Offloading Date', 'POD',
  ]

  const rows = legs.map((leg) =>
    [
      leg.trip?.trip_code ?? '',
      leg.booking.booking_number,
      leg.booking.direction,
      leg.truck.reg_no,
      leg.trailer?.reg_no ?? '',
      leg.driver?.full_name ?? '',
      leg.driver?.phone ?? '',
      leg.current_location ?? '',
      statusLabel(leg.current_status),
      leg.route,
      leg.loading_point ?? '',
      leg.loading_point_arrival_date?.slice(0, 10) ?? '',
      leg.loading_date?.slice(0, 10) ?? '',
      leg.offloading_point ?? '',
      leg.loading_dispatch_date?.slice(0, 10) ?? '',
      leg.offloading_point_arrival_date?.slice(0, 10) ?? '',
      leg.offloading_date?.slice(0, 10) ?? '',
      leg.documents.some((d) => d.document_type === 'POD') ? 'Uploaded' : leg.pod_overdue ? 'Overdue' : 'Pending',
    ].map((cell) => escapeCsvCell(String(cell)))
  )

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `tracking-export-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
