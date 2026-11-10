import { useSearchParams } from 'react-router-dom'
import { ClientBalances } from '~/components/reconciliation/client-balances'
import { VendorBalances } from '~/components/reconciliation/vendor-balances'
import PageHeader from '~/global/components/page-header'
import { TabLinks } from '~/global/components/tab-link'

/** Client revenue and vendor balances as global TabLinks (`?tab=clients|vendors`). */
function Reconciliation() {
  const [searchParams] = useSearchParams()
  const isVendors = searchParams.get('tab') === 'vendors'

  return (
    <div className="min-h-screen space-y-6 bg-background p-4 md:p-8">
      <PageHeader
        title="Reconciliation"
        subtitle="Outstanding revenue from clients and outstanding debt to vendors."
        titleClassName="font-semibold tracking-tight text-foreground"
        subTitleClassName="text-muted-foreground"
      />
      <TabLinks
        containerClassName="px-0"
        tabs={[
          { matchPattern: /^\/reconciliation(?![^#]*[?&]tab=vendors\b)/, name: 'Client revenue', url: '/reconciliation' },
          { matchPattern: /^\/reconciliation\?(.*&)?tab=vendors\b/, name: 'Vendor expenses', url: '/reconciliation?tab=vendors' },
        ]}
      />
      {isVendors ? <VendorBalances key="vendors" /> : <ClientBalances key="clients" />}
    </div>
  )
}

export default Reconciliation
