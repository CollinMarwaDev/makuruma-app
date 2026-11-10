import type { StatusColor, TrackingStatusOption } from '~/types/tracking'
import { createTable } from '~/global/components/table'

export const STATUS_COLOR_OPTIONS: { label: string; value: StatusColor }[] = [
  { label: 'Blue (default)', value: 'default' },
  { label: 'Orange (warning)', value: 'warning' },
  { label: 'Red (danger)', value: 'danger' },
  { label: 'Green (success)', value: 'success' },
  { label: 'Grey (inactive)', value: 'disabled' },
]

export const colorOption = (color: StatusColor) => STATUS_COLOR_OPTIONS.find((o) => o.value === color) ?? STATUS_COLOR_OPTIONS[0]

export const StatusTable = createTable<TrackingStatusOption>()
