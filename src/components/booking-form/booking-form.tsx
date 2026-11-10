import type { FC, FormEvent } from 'react'
import { Copy, Loader2 } from 'lucide-react'
import { Button } from '~/global/components/button'
import { EmptyStateIcon } from '~/global/components/error-boundary/icons'
import { BookingTrucksTable } from '~/components/booking-form/booking-trucks-table'
import { ModeFields } from '~/components/booking-form/mode-fields'
import { TruckPicker } from '~/components/booking-form/truck-picker'
import { SORT_OPTIONS, type SortOption } from '~/components/booking-form/booking-form-utils'
import { useManageBookingForm, type ManageBookingFormOptions } from '~/components/booking-form/use-manage-booking-form'

const fieldClass = 'w-full bg-secondary ring-1 ring-border rounded-lg px-3 py-2 text-sm text-foreground disabled:opacity-60'
const sectionTitle = 'text-sm font-semibold text-foreground'

/** Create, copy or edit a Go/Return booking (contract 2.1 A and B). */
const BookingForm: FC<ManageBookingFormOptions> = (props) => {
  const form = useManageBookingForm(props)
  const directionLabel = form.bookingDirection === 'go' ? 'Go' : 'Return'
  const selectedIds = form.rows.map((row) => row.truck.id)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    void form.submit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {form.error && (
        <div role="alert" className="rounded-lg bg-status-red-bg p-3 text-sm text-status-red-pc ring-1 ring-status-red-pc/30">
          {form.error}
        </div>
      )}

      {!form.isEditMode && (
        <section className="rounded-lg bg-surface-2 p-4 ring-1 ring-border">
          <label htmlFor="copy-source" className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
            <Copy size={14} />
            {props.direction === 'return' ? 'Copy & edit from a Go booking' : 'Copy & edit from an existing booking'}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <select id="copy-source" value={form.sourceId ?? ''} onChange={(e) => form.chooseSource(e.target.value)} disabled={form.isLoadingTrucks} className={fieldClass}>
            <option value="">— Start from a blank booking —</option>
            {form.copyCandidates.map((b) => (
              <option key={b.id} value={b.id}>
                {b.booking_number} · {b.direction === 'go' ? 'Go' : 'Return'} · {b.client.company_name} · {b.booking_trucks.length} truck(s)
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            Fills the form from the selected booking. You can change anything before saving; the original booking is not changed.
          </p>
        </section>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="client" className="mb-1 block text-sm font-medium text-foreground">Client</label>
          <select id="client" value={form.clientId} onChange={(e) => form.setClientId(e.target.value)} disabled={form.isEditMode} className={fieldClass}>
            <option value="">— Select —</option>
            {form.clients.map((c) => (
              <option key={c.id} value={c.id}>{c.company_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="transporter" className="mb-1 block text-sm font-medium text-foreground">Transporter</label>
          <input id="transporter" type="text" value="Makuruma Logistics" disabled className={fieldClass} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-foreground">Description of Goods/Services</label>
          <textarea id="description" value={form.description} onChange={(e) => form.setDescription(e.target.value)} rows={2} className={fieldClass} />
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h3 className={sectionTitle}>Nature of the booking</h3>
          <p className="text-xs text-muted-foreground">Choose per field whether all trucks share one value or each truck has its own. ETA is always per truck.</p>
        </div>
        <ModeFields modes={form.modes} shared={form.shared} onModeChange={form.changeMode} onSharedChange={form.changeShared} />
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className={sectionTitle}>Trucks on this {directionLabel} booking ({form.rows.length})</h3>
            <p className="text-xs text-muted-foreground">Set tons and ETA for each truck.</p>
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Arrange by
            <select value={form.sort} onChange={(e) => form.setSort(e.target.value as SortOption)} className="rounded-lg bg-secondary px-2 py-1.5 text-sm text-foreground ring-1 ring-border">
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        {form.rows.length > 0 ? (
          <BookingTrucksTable
            rows={form.rows}
            modes={form.modes}
            onChange={form.updateRow}
            renderActions={(row) => (
              <div className="flex justify-end gap-3 text-xs font-medium">
                {row.bookingTruckId && (
                  <button type="button" onClick={() => form.setSwappingRow(row)} className="text-primary hover:underline">
                    Change truck
                  </button>
                )}
                <button type="button" onClick={() => void form.removeRow(row)} className="text-status-red-pc hover:underline">
                  Remove
                </button>
              </div>
            )}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 rounded-lg py-4 text-center ring-1 ring-border">
            <EmptyStateIcon className="w-20" />
            <p className="text-sm font-medium text-foreground">No trucks on this booking yet</p>
            <p className="text-xs text-muted-foreground">Search and add trucks below.</p>
          </div>
        )}

        {form.swappingRow ? (
          <div className="space-y-2 rounded-lg bg-status-yellow-bg/40 p-3 ring-1 ring-status-yellow-pc/30">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-foreground">
                Replace <strong>{form.swappingRow.truck.reg_no}</strong> with:
              </p>
              <button type="button" onClick={() => form.setSwappingRow(null)} className="text-xs text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            </div>
            <TruckPicker
              trucks={form.eligibleTrucks}
              excludeIds={selectedIds}
              actionLabel="Use this truck"
              busyTruckId={form.busyTruckId}
              emptyText="No other trucks are available."
              onPick={(truck) => void form.swapTruck(truck)}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {form.isEditMode ? 'Add a truck to this booking' : `Available trucks — ${form.bookingDirection === 'go' ? 'off duty' : 'awaiting return'}`}
            </h4>
            {form.isLoadingTrucks ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={14} className="animate-spin" /> Loading trucks…</p>
            ) : (
              <TruckPicker
                trucks={form.eligibleTrucks}
                excludeIds={selectedIds}
                actionLabel="Add"
                busyTruckId={form.busyTruckId}
                emptyText={`No trucks are available for a ${directionLabel} booking right now.`}
                onPick={(truck) => void form.pickTruck(truck)}
              />
            )}
          </div>
        )}
      </section>

      <Button type="submit" className="w-full" loading={form.isSubmitting} loadingText="Saving…" disabled={form.rows.length === 0}>
        {form.isEditMode ? 'Save changes' : `Create ${directionLabel} booking`}
      </Button>
    </form>
  )
}

export default BookingForm
