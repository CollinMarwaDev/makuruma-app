import type { FC } from 'react'
import type { Vendor } from '~/types/partner'
import { Card } from '~/global/components/card'
import { LabelValueListItem } from '~/global/components/label-value-list-item'
import { VendorTypeBadge } from '~/components/vendors/vendors-table-section'

/** Body of the vendor "View" slide-over. */
export const VendorDetails: FC<{ vendor: Vendor }> = ({ vendor }) => (
  <Card className="space-y-3 p-4">
    <LabelValueListItem label="Company" value={vendor.company_name} />
    <LabelValueListItem label="Type" value={<VendorTypeBadge type={vendor.vendor_type} />} />
    <LabelValueListItem label="Phone" value={vendor.phone ?? '—'} />
    <LabelValueListItem label="Location" value={vendor.location ?? '—'} />
  </Card>
)
