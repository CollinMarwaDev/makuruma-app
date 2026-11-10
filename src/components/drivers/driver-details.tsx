import type { FC } from 'react'
import type { Driver } from '~/types/employee'
import { DRIVER_DOCUMENT_TYPES } from '~/constants/employeeCompliance'
import { Card } from '~/global/components/card'
import { LabelValueListItem } from '~/global/components/label-value-list-item'
import { DocumentsCard } from '~/components/common/documents-card'

/** Body of the driver "View" slide-over. */
export const DriverDetails: FC<{ driver: Driver }> = ({ driver }) => (
  <>
    <Card className="space-y-3 p-4">
      <LabelValueListItem label="Full name" value={driver.full_name} />
      <LabelValueListItem label="Phone" value={driver.phone ?? '—'} />
    </Card>
    <DocumentsCard documents={driver.documents} types={DRIVER_DOCUMENT_TYPES} />
  </>
)
