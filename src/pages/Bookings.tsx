import { useEffect, useState } from 'react'
import type { Booking } from '~/types/booking'
import { fetchBookings, deleteBooking, downloadBookingAccessList } from '~/services/bookingService'
import BookingForm from '~/components/booking-form/booking-form'
import { BookingHighlights } from '~/components/bookings/booking-highlights'
import { BookingsTableSection } from '~/components/bookings/bookings-table-section'
import Modal from '~/components/ui/Modal'
import PageHeader from '~/global/components/page-header'
import { ErrorFallback, GeneralErrorBoundary } from '~/global/components/error-boundary'
import { useConfirmation } from '~/global/providers/confirmation'
import { toast } from '~/global/utils/toast'

const errorMessage = (err: unknown, fallback: string) => (err instanceof Error ? err.message : fallback)

function Bookings() {
  const confirm = useConfirmation()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)
  const [reloadTrigger, setReloadTrigger] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [newDirection, setNewDirection] = useState<'go' | 'return'>('go')
  const [sourceBooking, setSourceBooking] = useState<Booking | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchBookings()
      .then((data) => {
        if (cancelled) return
        setBookings(data)
        setError(null)
      })
      .catch((err: unknown) => !cancelled && setError(err))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [reloadTrigger])

  const refresh = () => setReloadTrigger((prev) => prev + 1)

  /** New booking, optionally copied from `source` (Copy & edit, or Return from a Go booking). */
  function openAddModal(direction: 'go' | 'return', source: Booking | null = null) {
    setNewDirection(direction)
    setSourceBooking(source)
    setEditingBooking(null)
    setIsModalOpen(true)
  }

  function openEditModal(booking: Booking) {
    setSourceBooking(null)
    setEditingBooking(booking)
    setIsModalOpen(true)
  }

  function handleSaved() {
    setIsModalOpen(false)
    refresh()
  }

  async function handleDelete(booking: Booking) {
    const ok = await confirm({
      cancelText: 'Keep booking',
      description: 'Its trucks are released (Go) or returned to "awaiting return" (Return). This cannot be undone.',
      okayText: 'Delete booking',
      title: `Delete booking ${booking.booking_number}?`,
      type: 'error',
    })
    if (!ok) return
    try {
      await deleteBooking(booking.id)
      toast.success(`Booking ${booking.booking_number} deleted`)
      refresh()
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to delete booking'))
    }
  }

  async function handleDownload(booking: Booking) {
    try {
      await downloadBookingAccessList(booking)
    } catch (err) {
      toast.error(errorMessage(err, 'Download failed'))
    }
  }

  return (
    <div className="min-h-screen space-y-6 bg-background p-4 md:p-8">
      <PageHeader
        title="Bookings"
        subtitle="Go and Return bookings, their trucks, tons and routes."
        titleClassName="font-semibold tracking-tight text-foreground"
        subTitleClassName="text-muted-foreground"
      />

      {error && !loading ? (
        <ErrorFallback error={error} ctaLabel="Try again" ctaLink="/bookings" />
      ) : (
        <GeneralErrorBoundary>
          <BookingHighlights bookings={bookings} isLoading={loading} />
          <BookingsTableSection
            bookings={bookings}
            isLoading={loading}
            onCreate={(direction) => openAddModal(direction)}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onCopy={(booking) => openAddModal(booking.direction, booking)}
            onCreateReturn={(booking) => openAddModal('return', booking)}
          />
        </GeneralErrorBoundary>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="wide"
        title={
          editingBooking
            ? `Edit Booking — ${editingBooking.booking_number}`
            : `New ${newDirection === 'go' ? 'Go' : 'Return'} Booking${sourceBooking ? ` (from ${sourceBooking.booking_number})` : ''}`
        }
      >
        <GeneralErrorBoundary>
          <BookingForm
            key={editingBooking?.id ?? `new-${newDirection}-${sourceBooking?.id ?? 'blank'}`}
            booking={editingBooking}
            direction={newDirection}
            sourceBooking={sourceBooking}
            onSaved={handleSaved}
            onChanged={refresh}
          />
        </GeneralErrorBoundary>
      </Modal>
    </div>
  )
}

export default Bookings
