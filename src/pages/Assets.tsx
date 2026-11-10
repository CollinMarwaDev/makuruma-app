import { useSearchParams } from 'react-router-dom'
import { OfficeAssetsList } from '~/components/assets/office-assets-list'
import { TrailersList } from '~/components/assets/trailers-list'
import { TrucksList } from '~/components/assets/trucks-list'
import PageHeader from '~/global/components/page-header'
import { TabLinks } from '~/global/components/tab-link'

const TABS = [
  { label: 'Trucks', matchPattern: /^\/assets(?![^#]*[?&]tab=(trailers|office)\b)/, value: 'trucks' },
  { label: 'Trailers', matchPattern: /^\/assets\?(.*&)?tab=trailers\b/, value: 'trailers' },
  { label: 'Office assets', matchPattern: /^\/assets\?(.*&)?tab=office\b/, value: 'office' },
]

/** Trucks, trailers and office assets as global TabLinks (`?tab=`); each tab is a full list. */
function Assets() {
  const [searchParams] = useSearchParams()
  const tab = searchParams.get('tab') ?? 'trucks'

  return (
    <div className="min-h-screen space-y-6 bg-background p-4 md:p-8">
      <PageHeader
        title="Assets"
        subtitle="Trucks, trailers and office equipment, with permit and document expiry."
        titleClassName="font-semibold tracking-tight text-foreground"
        subTitleClassName="text-muted-foreground"
      />
      <TabLinks
        containerClassName="px-0"
        tabs={TABS.map((t) => ({ matchPattern: t.matchPattern, name: t.label, url: t.value === 'trucks' ? '/assets' : `/assets?tab=${t.value}` }))}
      />
      {tab === 'trailers' ? <TrailersList key="trailers" /> : tab === 'office' ? <OfficeAssetsList key="office" /> : <TrucksList key="trucks" />}
    </div>
  )
}

export default Assets
