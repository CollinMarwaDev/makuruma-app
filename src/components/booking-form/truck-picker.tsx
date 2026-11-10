import { useState, type FC } from 'react'
import type { EligibleTruck } from '~/types/booking'
import { cn } from '~/global/utils/cn'
import { SearchBox } from '~/global/components/search-box'
import { unbookableReason } from '~/components/booking-form/booking-form-utils'

interface TruckPickerProps {
  /** Label on each truck's button, e.g. "Add" or "Use this truck". */
  actionLabel: string
  busyTruckId?: number | null
  emptyText: string
  excludeIds: number[]
  onPick: (truck: EligibleTruck) => void
  trucks: EligibleTruck[]
}

/** Searchable list of trucks that can join the booking (contract 2.1 B-3). */
export const TruckPicker: FC<TruckPickerProps> = ({ actionLabel, busyTruckId, emptyText, excludeIds, onPick, trucks }) => {
  const [query, setQuery] = useState('')
  const term = query.trim().toLowerCase()

  const visible = trucks.filter(
    (truck) =>
      !excludeIds.includes(truck.id) &&
      [truck.reg_no, truck.trailer?.reg_no, truck.driver?.full_name].some((value) => value?.toLowerCase().includes(term))
  )

  return (
    <div className="rounded-lg ring-1 ring-border">
      <div className="border-b border-hairline p-2">
        {/* With onChange the global SearchBox filters locally (debounced) instead of writing to the URL. */}
        <SearchBox onChange={setQuery} defaultValue="" placeholder="Search by truck, trailer or driver" aria-label="Search trucks" className="w-full" />
      </div>

      <ul className="max-h-56 divide-y divide-hairline overflow-y-auto">
        {visible.map((truck) => {
          const reason = unbookableReason(truck)
          return (
            <li key={truck.id} className={cn('flex items-center gap-3 px-3 py-2 text-sm', reason && 'opacity-60')}>
              <div className="min-w-0 flex-1">
                <span className="font-medium text-foreground">{truck.reg_no}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {truck.trailer?.reg_no ?? 'no trailer'} · {Number(truck.capacity)} tons · {truck.driver?.full_name ?? 'no driver'}
                </span>
                {reason && <p className="text-xs text-status-red-pc">{reason} — can't be booked</p>}
              </div>
              <button
                type="button"
                disabled={!!reason || busyTruckId === truck.id}
                onClick={() => onPick(truck)}
                className="rounded-lg px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/40 hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busyTruckId === truck.id ? 'Saving…' : actionLabel}
              </button>
            </li>
          )
        })}
        {visible.length === 0 && <li className="px-3 py-4 text-center text-sm text-muted-foreground">{term ? 'No truck matches your search.' : emptyText}</li>}
      </ul>
    </div>
  )
}
