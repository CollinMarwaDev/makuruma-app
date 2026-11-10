import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import type { StatusColor, TrackingStatusOption } from '~/types/tracking'
import { createTrackingStatus, deleteTrackingStatus, updateTrackingStatus } from '~/services/trackingService'
import { useAuth } from '~/hooks/useAuth'
import { STATUS_COLOR_OPTIONS, StatusTable } from '~/components/tracking/tracking-status-options'
import { TrackingStatusRow } from '~/components/tracking/tracking-status-row'
import { useTrackingStatuses } from '~/components/tracking/use-tracking-statuses'
import { BackButton, Button } from '~/global/components/button'
import { Card } from '~/global/components/card'
import { ErrorFallback, GeneralErrorBoundary } from '~/global/components/error-boundary'
import { SelectInput } from '~/global/components/form-controls/select-input'
import { TextInputBasic } from '~/global/components/form-controls/text-input-fields'
import { ModalFormError } from '~/global/components/modal/modal-form-error'
import PageHeader from '~/global/components/page-header'
import type { ColumnHeader } from '~/global/components/table'
import { useConfirmation } from '~/global/providers/confirmation'
import { toast } from '~/global/utils/toast'

const HEADERS: ColumnHeader[] = [
  { canSort: false, id: 'label', label: 'Name' },
  { canSort: false, id: 'color', label: 'Colour' },
  { canSort: false, id: 'preview', label: 'Preview' },
  { canSort: false, id: 'active', label: 'Active' },
  { canSort: false, id: 'actions', label: '' },
]

/** Admin page for tracking statuses (contract 2.2 D-4). The API also refuses non-admin writes. */
function TrackingStatuses() {
  const { user } = useAuth()
  const confirm = useConfirmation()
  const { reload, statuses } = useTrackingStatuses()
  const [loadError, setLoadError] = useState<unknown>(null)
  const [label, setLabel] = useState('')
  const [color, setColor] = useState<StatusColor>('default')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    reload().catch(setLoadError)
  }, [reload])

  if (user && user.role?.slug !== 'admin') return <Navigate to="/tracking" replace />

  async function run(action: () => Promise<unknown>, success: string, fallback: string) {
    setError(null)
    try {
      await action()
      await reload()
      toast.success(success)
    } catch (err) {
      setError(err instanceof Error ? err.message : fallback)
    }
  }

  async function create() {
    setIsCreating(true)
    await run(() => createTrackingStatus({ color, label: label.trim() }), `Status "${label.trim()}" added`, 'Failed to add status')
    setLabel('')
    setIsCreating(false)
  }

  async function move(status: TrackingStatusOption, direction: -1 | 1) {
    const index = statuses.findIndex((s) => s.id === status.id)
    const other = statuses[index + direction]
    if (!other) return
    // Re-number both so equal sort_order values still swap.
    const [a, b] = direction === -1 ? [other, status] : [status, other]
    const base = Math.min(a.sort_order, b.sort_order)
    await run(
      () => Promise.all([updateTrackingStatus(b.id, { sort_order: base }), updateTrackingStatus(a.id, { sort_order: base + 1 })]),
      'Order updated',
      'Failed to reorder'
    )
  }

  async function remove(status: TrackingStatusOption) {
    const ok = await confirm({
      cancelText: 'Keep status',
      description: 'If any truck uses it, it is hidden instead so its history keeps the name.',
      okayText: 'Delete status',
      title: `Delete "${status.label}"?`,
      type: 'error',
    })
    if (ok) await run(() => deleteTrackingStatus(status.id), `Status "${status.label}" removed`, 'Failed to delete status')
  }

  return (
    <div className="min-h-screen space-y-6 bg-background p-4 md:p-8">
      <BackButton to="/tracking" label="Back to tracking" />
      <PageHeader
        title="Tracking statuses"
        subtitle="Add, rename, colour, hide and reorder the statuses used on the Tracking page."
        titleClassName="font-semibold tracking-tight text-foreground"
        subTitleClassName="text-muted-foreground"
      />

      {loadError ? (
        <ErrorFallback error={loadError} ctaLabel="Back to tracking" ctaLink="/tracking" />
      ) : (
        <GeneralErrorBoundary>
          <Card variant="panel">
            <form
              className="flex flex-wrap items-end gap-3"
              onSubmit={(e) => {
                e.preventDefault()
                void create()
              }}
            >
              <div className="min-w-56 flex-1">
                <TextInputBasic aria-label="New status name" placeholder="New status, e.g. Waiting for escort" value={label} maxLength={60} onChange={(e) => setLabel(e.target.value)} />
              </div>
              <div className="w-56">
                <SelectInput
                  aria-label="New status colour"
                  options={STATUS_COLOR_OPTIONS}
                  defaultValue={STATUS_COLOR_OPTIONS.find((o) => o.value === color)}
                  onChange={(option) => setColor(option.value as StatusColor)}
                />
              </div>
              <Button type="submit" disabled={!label.trim()} loading={isCreating} loadingText="Adding…" className="px-5">
                Add status
              </Button>
            </form>
            <ModalFormError className="mt-0" message={error ?? undefined} />

            <StatusTable data={statuses}>
              <StatusTable.Header headers={HEADERS} />
              <StatusTable.Body>
                {(status) => {
                  const index = statuses.findIndex((s) => s.id === status.id)
                  return (
                    <TrackingStatusRow
                      key={`${status.id}-${status.label}-${status.color}`}
                      status={status}
                      isFirst={index === 0}
                      isLast={index === statuses.length - 1}
                      onMove={(s, d) => void move(s, d)}
                      onDelete={(s) => void remove(s)}
                      onSave={(s, data) => run(() => updateTrackingStatus(s.id, data), `"${data.label ?? s.label}" saved`, 'Failed to save status')}
                    />
                  )
                }}
              </StatusTable.Body>
            </StatusTable>
          </Card>
        </GeneralErrorBoundary>
      )}
    </div>
  )
}

export default TrackingStatuses
