import { useState, type FC } from 'react'
import { BORDER_ROUTE_LABELS, type Checkpoint, type TrackingLeg } from '~/types/tracking'
import { upsertLegMilestone } from '~/services/trackingService'
import { Button } from '~/global/components/button'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'
import { FieldContainer } from '~/global/components/form-controls/common'
import Label from '~/global/components/form-controls/label'
import { TextInputBasic } from '~/global/components/form-controls/text-input-fields'
import { InlineError, LegSection } from '~/components/tracking/leg-form-common'

type Times = { arrival_at: string; dispatch_at: string }

/** `2026-11-10 08:30:00` / ISO → value for a datetime-local input. */
const toInput = (value: string | null) => (value ? value.replace(' ', 'T').slice(0, 16) : '')

const initialTimes = (leg: TrackingLeg) =>
  Object.fromEntries(
    leg.milestones.map((m) => [m.checkpoint_id, { arrival_at: toInput(m.arrival_at), dispatch_at: toInput(m.dispatch_at) }])
  ) as Record<number, Times>

/** Arrival and dispatch per checkpoint on the leg's border route, in travel order (contract 2.2 D-2, D-3). */
export const LegCheckpointsSection: FC<{ leg: TrackingLeg; onUpdated: (leg: TrackingLeg) => void }> = ({ leg, onUpdated }) => {
  const [times, setTimes] = useState(() => initialTimes(leg))
  const [savingId, setSavingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const checkpoints = leg.route_checkpoints ?? []

  const valueOf = (cp: Checkpoint): Times => times[cp.id] ?? { arrival_at: '', dispatch_at: '' }
  const saved = (cp: Checkpoint) => {
    const m = leg.milestones.find((x) => x.checkpoint_id === cp.id)
    return { arrival_at: toInput(m?.arrival_at ?? null), dispatch_at: toInput(m?.dispatch_at ?? null) }
  }
  const isDirty = (cp: Checkpoint) => {
    const now = valueOf(cp)
    const before = saved(cp)
    return now.arrival_at !== before.arrival_at || now.dispatch_at !== before.dispatch_at
  }

  function setTime(id: number, field: keyof Times, value: string) {
    setTimes((prev) => ({ ...prev, [id]: { ...(prev[id] ?? { arrival_at: '', dispatch_at: '' }), [field]: value } }))
  }

  async function save(cp: Checkpoint) {
    const value = valueOf(cp)
    setSavingId(cp.id)
    setError(null)
    try {
      onUpdated(
        await upsertLegMilestone(leg.id, {
          arrival_at: value.arrival_at || undefined,
          checkpoint_id: cp.id,
          dispatch_at: value.dispatch_at || undefined,
        })
      )
      toast.success(`${cp.name} saved`)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSavingId(null)
    }
  }

  return (
    <LegSection
      title={`Checkpoints · via ${BORDER_ROUTE_LABELS[leg.route]}`}
      description={
        leg.booking.direction === 'go'
          ? 'Going to DRC. Each time must be on or after the previous checkpoint.'
          : 'Returning from DRC (route reversed). Each time must be on or after the previous checkpoint.'
      }
    >
      <InlineError message={error} />
      {checkpoints.length === 0 ? (
        <p className="text-sm text-muted-foreground">No checkpoints are set up for this route.</p>
      ) : (
        <ol className="space-y-2">
          {checkpoints.map((cp, index) => (
            <li key={cp.id} className="grid grid-cols-1 items-end gap-2 rounded-lg border border-outline p-3 sm:grid-cols-2">
              <p className="text-sm font-medium text-foreground sm:col-span-2">
                <span className="mr-2 text-xs text-muted-foreground">{index + 1}.</span>
                {cp.name}
              </p>
              <FieldContainer>
                <Label htmlFor={`cp-${cp.id}-arrival_at`}>Arrival</Label>
                <TextInputBasic
                  id={`cp-${cp.id}-arrival_at`}
                  type="datetime-local"
                  className="px-3 tracking-normal"
                  value={valueOf(cp).arrival_at}
                  onChange={(e) => setTime(cp.id, 'arrival_at', e.target.value)}
                />
              </FieldContainer>
              <FieldContainer>
                <Label htmlFor={`cp-${cp.id}-dispatch_at`}>Dispatch</Label>
                <TextInputBasic
                  id={`cp-${cp.id}-dispatch_at`}
                  type="datetime-local"
                  className="px-3 tracking-normal"
                  value={valueOf(cp).dispatch_at}
                  onChange={(e) => setTime(cp.id, 'dispatch_at', e.target.value)}
                />
              </FieldContainer>
              <Button
                variant="tonal"
                disabled={!isDirty(cp) || savingId !== null}
                loading={savingId === cp.id}
                loadingText="Saving…"
                onClick={() => void save(cp)}
                className="px-4 py-2 sm:col-span-2 sm:justify-self-end"
              >
                Save
              </Button>
            </li>
          ))}
        </ol>
      )}
    </LegSection>
  )
}
