import { useState, type FC } from 'react'
import { LEG_DATE_FIELDS, type LegDateField, type TrackingLeg } from '~/types/tracking'
import { updateLegDates } from '~/services/trackingService'
import { Button } from '~/global/components/button'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'
import { DatePicker } from '~/global/components/date-picker/date-picker'
import { FieldContainer } from '~/global/components/form-controls/common'
import Label from '~/global/components/form-controls/label'
import { InlineError, LegSection } from '~/components/tracking/leg-form-common'

const initialDates = (leg: TrackingLeg) =>
  Object.fromEntries(LEG_DATE_FIELDS.map(({ key }) => [key, leg[key]?.slice(0, 10) ?? ''])) as Record<LegDateField, string>

/** Loading and offloading dates. The API rejects a date earlier than any earlier step (contract 2.2 D-2). */
export const LegDatesSection: FC<{ leg: TrackingLeg; onUpdated: (leg: TrackingLeg) => void }> = ({ leg, onUpdated }) => {
  const [dates, setDates] = useState(() => initialDates(leg))
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save() {
    setIsSaving(true)
    setError(null)
    try {
      const payload = Object.fromEntries(Object.entries(dates).map(([k, v]) => [k, v || undefined]))
      onUpdated(await updateLegDates(leg.id, payload))
      toast.success('Dates saved')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <LegSection
      title="Loading & offloading"
      description="Dates must follow the trip order. Offloading starts the 5-day POD and auto-complete countdown."
    >
      <InlineError message={error} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 ">
        {LEG_DATE_FIELDS.map(({ key, label }) => (
          <FieldContainer key={key}>
            <Label>{label}</Label>
            <DatePicker defaultValue={dates[key] || undefined} onChange={(value) => setDates((prev) => ({ ...prev, [key]: value }))} />
          </FieldContainer>
        ))}
      </div>
      <Button variant="tonal" onClick={() => void save()} loading={isSaving} loadingText="Saving…" className="px-4 py-2">
        Save dates
      </Button>
    </LegSection>
  )
}
