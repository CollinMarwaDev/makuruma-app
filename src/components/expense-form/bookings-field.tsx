import { useState, type FC } from 'react'
import type { ExpensePickBooking } from '~/types/expense'
import { SearchBox } from '~/global/components/search-box'
import { cn } from '~/global/utils/cn'

interface BookingsFieldProps {
  bookings: ExpensePickBooking[]
  disabled?: boolean
  loading?: boolean
  onChange: (ids: number[]) => void
  value: number[]
}

/** Pick one or more bookings for a Trip expense (Expense UAT req. 3). */
export const BookingsField: FC<BookingsFieldProps> = ({ bookings, disabled, loading, onChange, value }) => {
  const [query, setQuery] = useState('')
  const term = query.trim().toLowerCase()
  const selected = bookings.filter((b) => value.includes(b.id))
  const visible = bookings.filter((b) =>
    [b.booking_number, b.client.company_name, ...b.booking_trucks.map((bt) => bt.truck.reg_no)].some((v) => v.toLowerCase().includes(term))
  )

  const toggle = (id: number) => onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-foreground">Bookings</span>
      {selected.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Selected bookings">
          {selected.map((b) => (
            <li key={b.id} className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs text-foreground ring-1 ring-primary/30">
              {b.booking_number} · {b.client.company_name} · {b.booking_trucks.length} truck(s)
              {!disabled && (
                <button type="button" onClick={() => toggle(b.id)} aria-label={`Remove ${b.booking_number}`} className="text-muted-foreground hover:text-foreground">
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {!disabled && (
        <div className="rounded-lg bg-secondary ring-1 ring-border">
          <div className="border-b border-hairline p-2">
            <SearchBox onChange={setQuery} defaultValue="" placeholder="Search booking, client or truck" aria-label="Search bookings" className="w-full" />
          </div>
          <ul className="max-h-40 divide-y divide-hairline overflow-y-auto">
            {visible.map((b) => (
              <li key={b.id} className={cn('px-3 py-1.5', value.includes(b.id) && 'bg-primary/5')}>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="checkbox" checked={value.includes(b.id)} onChange={() => toggle(b.id)} className="cursor-pointer" />
                  <span className="font-medium text-foreground">{b.booking_number}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {b.direction === 'go' ? 'Go' : 'Return'} · {b.client.company_name} · {b.booking_trucks.length} truck(s)
                  </span>
                </label>
              </li>
            ))}
            {visible.length === 0 && <li className="px-3 py-3 text-center text-sm text-muted-foreground">{loading ? 'Loading bookings…' : term ? 'No booking matches your search.' : 'No bookings yet.'}</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
