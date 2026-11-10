import type { FC } from 'react'
import { cn } from '~/global/utils/cn'
import {
  SHARED_FIELD_LABELS,
  SHARED_FIELDS,
  type FieldMode,
  type ModeState,
  type SharedField,
  type SharedValues,
} from '~/components/booking-form/booking-form-utils'

interface ModeFieldsProps {
  modes: ModeState
  onModeChange: (field: SharedField, mode: FieldMode) => void
  onSharedChange: (field: SharedField, value: string) => void
  shared: SharedValues
}

const inputClass =
  'w-full bg-secondary ring-1 ring-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground disabled:opacity-50'

/**
 * Nature of the booking (contract 2.1 B-6/B-7): for each field the user picks "Same for all trucks"
 * (one value here) or "Different per truck" (a column in the trucks table).
 */
export const ModeFields: FC<ModeFieldsProps> = ({ modes, onModeChange, onSharedChange, shared }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    {SHARED_FIELDS.map((field) => {
      const isSame = modes[field] === 'same'
      const isNumber = field === 'rate'
      return (
        <div key={field}>
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-foreground">{SHARED_FIELD_LABELS[field]}</span>
            <div role="radiogroup" aria-label={`${SHARED_FIELD_LABELS[field]} mode`} className="flex rounded-lg bg-secondary p-0.5 text-xs ring-1 ring-border">
              {(['same', 'different'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  role="radio"
                  aria-checked={modes[field] === mode}
                  onClick={() => onModeChange(field, mode)}
                  className={cn(
                    'rounded-md px-2.5 py-1 font-medium transition-colors',
                    modes[field] === mode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {mode === 'same' ? 'Same for all' : 'Different per truck'}
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            inputMode={isNumber ? 'decimal' : undefined}
            value={isSame ? shared[field] : ''}
            disabled={!isSame}
            onChange={(e) => onSharedChange(field, e.target.value)}
            placeholder={isSame ? `${SHARED_FIELD_LABELS[field]} for all trucks` : 'Entered per truck below'}
            className={inputClass}
          />
        </div>
      )
    })}
  </div>
)
