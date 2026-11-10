import { useState, type FC } from 'react'
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { StatusColor, TrackingStatusOption } from '~/types/tracking'
import { Badge } from '~/global/components/badge'
import { Button, ButtonIcon } from '~/global/components/button'
import { SelectInput } from '~/global/components/form-controls/select-input'
import { TextInputBasic } from '~/global/components/form-controls/text-input-fields'
import { Switch } from '~/global/components/switch'
import { STATUS_COLOR_OPTIONS, StatusTable, colorOption } from '~/components/tracking/tracking-status-options'

interface TrackingStatusRowProps {
  isFirst: boolean
  isLast: boolean
  onDelete: (status: TrackingStatusOption) => void
  onMove: (status: TrackingStatusOption, direction: -1 | 1) => void
  onSave: (status: TrackingStatusOption, data: Partial<TrackingStatusOption>) => Promise<void>
  status: TrackingStatusOption
}

/** One editable status: label, colour, active switch, order and delete (contract 2.2 D-4). */
export const TrackingStatusRow: FC<TrackingStatusRowProps> = ({ isFirst, isLast, onDelete, onMove, onSave, status }) => {
  const [label, setLabel] = useState(status.label)
  const [color, setColor] = useState<StatusColor>(status.color)
  const [isSaving, setIsSaving] = useState(false)
  const isDirty = label.trim() !== status.label || color !== status.color

  async function save(data: Partial<TrackingStatusOption>) {
    setIsSaving(true)
    try {
      await onSave(status, data)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <StatusTable.Row rowId={String(status.id)}>
      <StatusTable.Cell className="min-w-56">
        <TextInputBasic aria-label={`Name of ${status.label}`} value={label} maxLength={60} onChange={(e) => setLabel(e.target.value)} />
        {status.is_system && <p className="mt-1 text-xs text-muted-foreground">System status · used by tracking rules</p>}
      </StatusTable.Cell>
      <StatusTable.Cell className="min-w-48">
        <SelectInput
          aria-label={`Colour of ${status.label}`}
          options={STATUS_COLOR_OPTIONS}
          defaultValue={colorOption(color)}
          onChange={(option) => setColor(option.value as StatusColor)}
        />
      </StatusTable.Cell>
      <StatusTable.Cell>
        <Badge variant={color} label={label.trim() || status.label} />
      </StatusTable.Cell>
      <StatusTable.Cell>
        <Switch
          checked={status.is_active}
          onCheckedChange={(checked) => void save({ is_active: checked })}
          title={status.is_system ? 'System statuses stay active' : undefined}
        >
          <Switch.Switcher aria-label={`${status.label} active`} disabled={status.is_system || isSaving} />
        </Switch>
      </StatusTable.Cell>
      <StatusTable.Cell className="whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="tonal"
            disabled={!isDirty || !label.trim()}
            loading={isSaving}
            loadingText="Saving…"
            onClick={() => void save({ color, label: label.trim() })}
            className="px-4 py-1.5"
          >
            Save
          </Button>
          <ButtonIcon icon={ArrowUpIcon} title="Move up" disabled={isFirst} onClick={() => onMove(status, -1)} className="size-8 p-1.5" />
          <ButtonIcon icon={ArrowDownIcon} title="Move down" disabled={isLast} onClick={() => onMove(status, 1)} className="size-8 p-1.5" />
          {status.is_system ? (
            <span className="size-8" aria-hidden />
          ) : (
            <ButtonIcon icon={TrashIcon} title="Delete status" onClick={() => onDelete(status)} className="size-8 p-1.5 text-status-red-pc" />
          )}
        </div>
      </StatusTable.Cell>
    </StatusTable.Row>
  )
}
