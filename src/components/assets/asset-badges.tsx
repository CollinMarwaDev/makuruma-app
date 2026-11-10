import type { FC } from 'react'
import type { Truck } from '~/types/truck'
import type { OfficeAssetCondition } from '~/types/OfficeAsset'
import { OFFICE_ASSET_CONDITIONS } from '~/constants/officeAssetOptions'
import { Badge } from '~/global/components/badge'

const TRUCK_STATUS = { active: 'success', decommissioned: 'disabled', maintenance: 'warning' } as const
const TRIP_STATUS = { go: ['warning', 'Go trip'], off_duty: ['disabled', 'Off duty'], return: ['default', 'Return trip'] } as const
const CONDITION = { active: 'success', disposed: 'danger', under_repair: 'warning' } as const

export const TruckStatusBadge: FC<{ status: Truck['status'] }> = ({ status }) => (
  <Badge variant={TRUCK_STATUS[status]} label={status.charAt(0).toUpperCase() + status.slice(1)} />
)

export const TripStatusBadge: FC<{ status: Truck['trip_status'] }> = ({ status }) => (
  <Badge hideDotIndicator variant={TRIP_STATUS[status][0]} label={TRIP_STATUS[status][1]} />
)

export const ConditionBadge: FC<{ condition: OfficeAssetCondition }> = ({ condition }) => (
  <Badge variant={CONDITION[condition]} label={OFFICE_ASSET_CONDITIONS.find((c) => c.value === condition)?.label ?? condition} />
)
