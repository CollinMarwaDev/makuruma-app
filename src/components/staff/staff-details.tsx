import type { FC } from 'react'
import type { Staff } from '~/types/employee'
import { STAFF_DOCUMENT_TYPES } from '~/constants/employeeCompliance'
import { Card } from '~/global/components/card'
import { LabelValueListItem } from '~/global/components/label-value-list-item'
import { DocumentsCard } from '~/components/common/documents-card'

/** Body of the staff "View" slide-over. */
export const StaffDetails: FC<{ member: Staff }> = ({ member }) => (
  <>
    <Card className="space-y-3 p-4">
      <LabelValueListItem label="Full name" value={member.full_name} />
      <LabelValueListItem label="Phone" value={member.phone ?? '—'} />
      <LabelValueListItem label="TIN" value={member.tin_number ?? '—'} />
      <LabelValueListItem label="Payment account" value={member.payment_account ?? '—'} />
    </Card>
    <DocumentsCard documents={member.documents} types={STAFF_DOCUMENT_TYPES} />
  </>
)
