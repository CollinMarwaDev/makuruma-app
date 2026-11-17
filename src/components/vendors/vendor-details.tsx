import type { FC } from 'react'
import type { Vendor } from '~/types/partner'
import { Card } from '~/global/components/card'
import { LabelValueListItem } from '~/global/components/label-value-list-item'
import { VendorTypeBadge } from '~/components/vendors/vendors-table-section'
import { useVendorTypes } from '~/components/vendors/use-vendor-types'

/** Body of the vendor "View" slide-over. */
export const VendorDetails: FC<{ vendor: Vendor }> = ({ vendor }) => {
  const { typeName } = useVendorTypes()

  return (
  <Card className="space-y-3 p-4">
    <LabelValueListItem label="Company" value={vendor.company_name} />
    <LabelValueListItem label="Type" value={<VendorTypeBadge type={vendor.vendor_type} name={typeName(vendor.vendor_type)} />} />
    <LabelValueListItem label="Usual payment" value={vendor.payment_mode === 'on_spot' ? 'On the spot' : 'Bill-based'} />
    <LabelValueListItem label="Phone" value={vendor.phone ?? '—'} />
    <LabelValueListItem label="Location" value={vendor.location ?? '—'} />
  </Card>
  )
}
