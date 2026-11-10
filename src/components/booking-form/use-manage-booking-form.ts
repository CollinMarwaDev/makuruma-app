import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Booking, EligibleTruck } from '~/types/booking'
import type { Client } from '~/types/partner'
import { fetchClients } from '~/services/clientService'
import {
  addTruckToBooking,
  createBooking,
  fetchBookings,
  fetchEligibleTrucks,
  removeTruckFromBooking,
  swapBookingTruck,
  updateBooking,
} from '~/services/bookingService'
import { useConfirmation } from '~/global/providers/confirmation'
import { toast } from '~/global/utils/toast'
import {
  ALL_SAME,
  EMPTY_SHARED,
  SHARED_FIELD_LABELS,
  deriveModes,
  isDecimal,
  prefillFromBooking,
  resolveRow,
  rowFromBookingTruck,
  rowFromTruck,
  sortRows,
  type FieldMode,
  type ModeState,
  type SharedField,
  type SharedValues,
  type SortOption,
  type TruckRow,
} from '~/components/booking-form/booking-form-utils'

export interface ManageBookingFormOptions {
  /** Saved booking being edited; undefined when creating. */
  booking?: Booking | null
  direction: 'go' | 'return'
  /** Called after a truck is added, swapped or removed on a saved booking (list must refresh). */
  onChanged: () => void
  onSaved: () => void
  /** Booking to copy from when the form opens (Copy & edit / Create return). */
  sourceBooking?: Booking | null
}

const errorMessage = (err: unknown, fallback: string) => (err instanceof Error ? err.message : fallback)

/** State and actions for the booking form (contract 2.1 A and B). */
export function useManageBookingForm({ booking, direction, onChanged, onSaved, sourceBooking }: ManageBookingFormOptions) {
  const confirm = useConfirmation()
  const isEditMode = !!booking
  const bookingDirection = booking?.direction ?? direction

  const initial = useMemo(() => {
    const rows = booking?.booking_trucks.map(rowFromBookingTruck) ?? []
    return rows.length ? { rows, ...deriveModes(rows) } : { modes: ALL_SAME, rows, shared: EMPTY_SHARED }
  }, [booking])

  const [clients, setClients] = useState<Client[]>([])
  const [copyCandidates, setCopyCandidates] = useState<Booking[]>([])
  const [eligibleTrucks, setEligibleTrucks] = useState<EligibleTruck[]>([])
  const [isLoadingTrucks, setIsLoadingTrucks] = useState(true)

  const [clientId, setClientId] = useState(booking ? String(booking.client.id) : '')
  const [description, setDescription] = useState(booking?.description ?? '')
  const [modes, setModes] = useState<ModeState>(initial.modes)
  const [shared, setShared] = useState<SharedValues>(initial.shared)
  const [rows, setRows] = useState<TruckRow[]>(initial.rows)
  const [sort, setSort] = useState<SortOption>('added')
  const [sourceId, setSourceId] = useState<number | null>(sourceBooking?.id ?? null)

  const [swappingRow, setSwappingRow] = useState<TruckRow | null>(null)
  const [busyTruckId, setBusyTruckId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshEligibleTrucks = useCallback(
    () =>
      fetchEligibleTrucks(bookingDirection)
        .catch(() => [] as EligibleTruck[])
        .then((trucks) => {
          setEligibleTrucks(trucks)
          return trucks
        }),
    [bookingDirection]
  )

  /** Fill the form from another booking; only trucks that are free for this direction are copied in. */
  const applySource = useCallback(
    (source: Booking, available: EligibleTruck[]) => {
      const prefill = prefillFromBooking(source, direction, available)
      setClientId(prefill.clientId)
      setDescription(prefill.description)
      setRows(prefill.rows)
      setModes(prefill.modes)
      setShared(prefill.shared)
      const skipped = source.booking_trucks.length - prefill.rows.length
      if (skipped > 0) toast.info(`${skipped} truck(s) from ${source.booking_number} are not available for this booking and were left out.`)
    },
    [direction]
  )

  useEffect(() => {
    fetchClients().then(setClients).catch(() => setClients([]))
    refreshEligibleTrucks().then((trucks) => {
      setIsLoadingTrucks(false)
      if (sourceBooking) applySource(sourceBooking, trucks)
    })
    if (!isEditMode) {
      fetchBookings()
        .then((all) => setCopyCandidates(direction === 'return' ? all.filter((b) => b.direction === 'go') : all))
        .catch(() => setCopyCandidates([]))
    }
  }, [applySource, direction, isEditMode, refreshEligibleTrucks, sourceBooking])

  function chooseSource(id: string) {
    const source = copyCandidates.find((b) => String(b.id) === id) ?? null
    setSourceId(source?.id ?? null)
    if (source) applySource(source, eligibleTrucks)
  }

  function updateRow(truckId: number, field: keyof TruckRow, value: string) {
    setRows((prev) => prev.map((row) => (row.truck.id === truckId ? { ...row, [field]: value } : row)))
  }

  async function changeMode(field: SharedField, mode: FieldMode) {
    if (modes[field] === mode) return

    if (mode === 'different') {
      // Start every truck from the shared value so nothing typed is lost.
      setRows((prev) => prev.map((row) => ({ ...row, [field]: shared[field] })))
    } else {
      const values = new Set(rows.map((row) => row[field]).filter(Boolean))
      if (values.size > 1) {
        const ok = await confirm({
          cancelText: 'Keep per-truck values',
          description: `The trucks have different ${SHARED_FIELD_LABELS[field].toLowerCase()} values. Switching to "Same for all" will replace them with one value.`,
          okayText: 'Use one value',
          title: `Use the same ${SHARED_FIELD_LABELS[field].toLowerCase()} for all trucks?`,
          type: 'warning',
        })
        if (!ok) return
      }
      setShared((prev) => ({ ...prev, [field]: rows.find((row) => row[field])?.[field] ?? prev[field] }))
    }
    setModes((prev) => ({ ...prev, [field]: mode }))
  }

  const changeShared = (field: SharedField, value: string) => setShared((prev) => ({ ...prev, [field]: value }))

  /** Create mode: select a truck. Edit mode: add it to the saved booking right away. */
  async function pickTruck(truck: EligibleTruck) {
    if (!isEditMode) {
      setRows((prev) => [...prev, rowFromTruck(truck)])
      return
    }
    setBusyTruckId(truck.id)
    try {
      const updated = await addTruckToBooking(booking!.id, { truck_id: truck.id, ...resolveRow(rowFromTruck(truck), modes, shared) })
      const added = updated.booking_trucks.find((bt) => bt.truck.id === truck.id)
      if (added) setRows((prev) => [...prev, rowFromBookingTruck(added)])
      toast.success(`${truck.reg_no} added to ${booking!.booking_number}`)
      void refreshEligibleTrucks()
      onChanged()
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to add truck'))
    } finally {
      setBusyTruckId(null)
    }
  }

  /** Edit mode: replace a mistaken truck (contract 2.1 B-4). */
  async function swapTruck(newTruck: EligibleTruck) {
    if (!swappingRow?.bookingTruckId) return
    setBusyTruckId(newTruck.id)
    try {
      await swapBookingTruck(booking!.id, swappingRow.bookingTruckId, newTruck.id)
      const oldRegNo = swappingRow.truck.reg_no
      setRows((prev) => prev.map((row) => (row.truck.id === swappingRow.truck.id ? { ...row, truck: newTruck } : row)))
      setSwappingRow(null)
      toast.success(`${oldRegNo} replaced by ${newTruck.reg_no}`)
      void refreshEligibleTrucks()
      onChanged()
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to change truck'))
    } finally {
      setBusyTruckId(null)
    }
  }

  async function removeRow(row: TruckRow) {
    if (!row.bookingTruckId) {
      setRows((prev) => prev.filter((r) => r.truck.id !== row.truck.id))
      return
    }
    const ok = await confirm({
      cancelText: 'Keep truck',
      description: `This frees ${row.truck.reg_no} (e.g. after an accident) but keeps its expense and invoice history.`,
      okayText: 'Remove truck',
      title: `Remove ${row.truck.reg_no} from this booking?`,
      type: 'error',
    })
    if (!ok) return
    try {
      await removeTruckFromBooking(booking!.id, row.bookingTruckId)
      setRows((prev) => prev.filter((r) => r.truck.id !== row.truck.id))
      toast.success(`${row.truck.reg_no} removed`)
      void refreshEligibleTrucks()
      onChanged()
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to remove truck'))
    }
  }

  function validate(): string | null {
    if (!clientId) return 'Select a client'
    if (rows.length === 0) return 'Add at least one truck'
    const badNumber = rows.find((row) => !isDecimal(row.tons) || (modes.rate === 'different' && !isDecimal(row.rate)))
    if (badNumber) return `Check the tons/rate for ${badNumber.truck.reg_no}: use numbers only (e.g. 30 or 30.5)`
    if (modes.rate === 'same' && !isDecimal(shared.rate)) return 'Rate must be a number (e.g. 95 or 95.5)'
    return null
  }

  async function submit() {
    setError(null)
    const problem = validate()
    if (problem) {
      setError(problem)
      return
    }

    setIsSubmitting(true)
    try {
      if (isEditMode) {
        await updateBooking(booking!.id, {
          description: description || undefined,
          trucks: rows.map((row) => ({ booking_truck_id: row.bookingTruckId!, ...resolveRow(row, modes, shared) })),
        })
      } else {
        await createBooking({
          client_id: clientId,
          description: description || undefined,
          direction,
          source_booking_id: sourceId ?? undefined,
          trucks: rows.map((row) => ({ truck_id: row.truck.id, ...resolveRow(row, modes, shared) })),
        })
      }
      toast.success(isEditMode ? 'Booking updated' : 'Booking created')
      onSaved()
    } catch (err) {
      setError(errorMessage(err, 'Failed to save booking'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    bookingDirection,
    busyTruckId,
    changeMode,
    changeShared,
    chooseSource,
    clientId,
    clients,
    copyCandidates,
    description,
    eligibleTrucks,
    error,
    isEditMode,
    isLoadingTrucks,
    isSubmitting,
    modes,
    pickTruck,
    removeRow,
    rows: sortRows(rows, sort),
    setClientId,
    setDescription,
    setSort,
    setSwappingRow,
    shared,
    sort,
    sourceId,
    submit,
    swapTruck,
    swappingRow,
    updateRow,
  }
}
