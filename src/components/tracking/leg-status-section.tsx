import { useState, type FC } from 'react'
import { BORDER_ROUTE_LABELS, type BorderRoute, type TrackingLeg } from '~/types/tracking'
import { updateLegStatus } from '~/services/trackingService'
import { Button } from '~/global/components/button'
import { useConfirmation } from '~/global/providers/confirmation'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'
import { useTrackingStatuses } from '~/components/tracking/use-tracking-statuses'
import { FieldContainer } from '~/global/components/form-controls/common'
import Label from '~/global/components/form-controls/label'
import { SelectInput } from '~/global/components/form-controls/select-input'
import { TextInputBasic } from '~/global/components/form-controls/text-input-fields'
import { InlineError, LegSection } from '~/components/tracking/leg-form-common'

const ROUTE_OPTIONS = (['kasumbalesa', 'sakania'] as const).map((r) => ({ label: BORDER_ROUTE_LABELS[r], value: r }))

/** Status, current location and border route of the leg (contract 2.2 D-1, D-3, D-4). */
export const LegStatusSection: FC<{ leg: TrackingLeg; onUpdated: (leg: TrackingLeg) => void }> = ({ leg, onUpdated }) => {
  const confirm = useConfirmation()
  const { activeStatuses, statusLabel } = useTrackingStatuses()
  const [status, setStatus] = useState(leg.current_status)
  const [location, setLocation] = useState(leg.current_location ?? '')
  const [route, setRoute] = useState<BorderRoute>(leg.route)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const statusOptions = activeStatuses.map((s) => ({ label: s.label, value: s.key }))

  async function save() {
    if (route !== leg.route && leg.milestones.length > 0) {
      const ok = await confirm({
        cancelText: 'Keep route',
        description: 'Checkpoint dates recorded on the other border stay saved but are hidden while this route is selected.',
        okayText: `Use ${BORDER_ROUTE_LABELS[route]}`,
        title: `Switch border route to ${BORDER_ROUTE_LABELS[route]}?`,
        type: 'warning',
      })
      if (!ok) return
    }
    setIsSaving(true)
    setError(null)
    try {
      const updated = await updateLegStatus(leg.id, { current_location: location || undefined, current_status: status, route })
      onUpdated(updated)
      toast.success(`${leg.truck.reg_no}: ${statusLabel(status)}`)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <LegSection title="Status" description="Statuses are managed by an administrator (Tracking → Manage statuses).">
      <InlineError message={error} />
      <div className="grid grid-cols-1 gap-3">
        <SelectInput
          label="Current status"
          options={statusOptions}
          defaultValue={{ label: statusLabel(status), value: status }}
          onChange={(option) => setStatus(String(option.value))}
        />
        <FieldContainer>
          <Label htmlFor="leg-location">Current location</Label>
          <TextInputBasic id="leg-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Tunduma" />
        </FieldContainer>
        <SelectInput
          label="Border route"
          options={ROUTE_OPTIONS}
          defaultValue={{ label: BORDER_ROUTE_LABELS[route], value: route }}
          onChange={(option) => setRoute(option.value as BorderRoute)}
        />
      </div>
      <Button onClick={() => void save()} loading={isSaving} loadingText="Saving…" className="px-4 py-2">
        Update status
      </Button>
    </LegSection>
  )
}
