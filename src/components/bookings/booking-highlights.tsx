import type { FC } from 'react'
import { ClipboardList, Truck, Weight } from 'lucide-react'
import type { Booking } from '~/types/booking'
import { StatsCard } from '~/global/components/stats-card'

interface BookingHighlightsProps {
  bookings: Booking[]
  isLoading: boolean
}

const format = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 2 })

/** Booking listing highlight cards (contract 2.1 B listing): bookings, trucks and tons. */
export const BookingHighlights: FC<BookingHighlightsProps> = ({ bookings, isLoading }) => {
  const trucks = bookings.flatMap((booking) => booking.booking_trucks)
  const count = (direction: 'go' | 'return') => bookings.filter((booking) => booking.direction === direction).length
  const tons = (list: typeof trucks) => list.reduce((sum, bt) => sum + Number(bt.capacity ?? 0), 0)
  const goTrucks = bookings.filter((b) => b.direction === 'go').flatMap((b) => b.booking_trucks)
  const returnTrucks = bookings.filter((b) => b.direction === 'return').flatMap((b) => b.booking_trucks)
  const placeholder = isLoading ? '…' : undefined

  const cards = [
    { content: `${count('go')} Go · ${count('return')} Return`, icon: ClipboardList, title: 'Total bookings', value: placeholder ?? format(bookings.length) },
    { content: `${goTrucks.length} on Go · ${returnTrucks.length} on Return`, icon: Truck, title: 'Trucks assigned', value: placeholder ?? format(trucks.length) },
    { content: `${format(tons(goTrucks))} Go · ${format(tons(returnTrucks))} Return`, icon: Weight, title: 'Total tons', value: placeholder ?? format(tons(trucks)) },
  ]

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <StatsCard
          key={card.title}
          icon={card.icon}
          title={card.title}
          value={card.value}
          content={<p className="text-xs text-muted-foreground">{card.content}</p>}
        />
      ))}
    </div>
  )
}
