import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { OfficeAsset } from '~/types/OfficeAsset'
import { deleteOfficeAsset, fetchOfficeAssets } from '~/services/officeAssetService'
import { OFFICE_ASSET_CATEGORIES, OFFICE_ASSET_CONDITIONS } from '~/constants/officeAssetOptions'
import OfficeAssetForm from '~/components/OfficeAssetForm'
import { Card } from '~/global/components/card'
import { LabelValueListItem } from '~/global/components/label-value-list-item'
import type { ColumnHeader } from '~/global/components/table'
import type { ListConfig } from '~/global/hooks/use-list-params'
import { ConditionBadge } from '~/components/assets/asset-badges'
import { CrudListPage } from '~/components/common/crud-list-page'
import { RecordCell, RecordTableSection } from '~/components/common/record-table-section'

const categoryLabel = (value: string) => OFFICE_ASSET_CATEGORIES.find((c) => c.value === value)?.label ?? value
const money = (value: string | null) => (value ? Number(value).toLocaleString() : '—')

const HEADERS: ColumnHeader[] = [
  { id: 'name', label: 'Name' },
  { id: 'category', label: 'Category' },
  { canSort: false, id: 'serial', label: 'Serial no' },
  { id: 'price', label: 'Buying price' },
  { id: 'purchase_date', label: 'Purchased' },
  { canSort: false, id: 'location', label: 'Location' },
  { id: 'condition', label: 'Condition' },
]

const LIST: ListConfig<OfficeAsset> = {
  defaultSort: { by: 'name', order: 'asc' },
  filters: { category: (a, v) => a.category === v, condition: (a, v) => a.condition === v },
  search: (a) => [a.name, a.serial_number, a.location, a.notes],
  sort: {
    category: (a) => a.category,
    condition: (a) => a.condition,
    name: (a) => a.name.toLowerCase(),
    price: (a) => Number(a.buying_price ?? 0),
    purchase_date: (a) => a.purchase_date ?? '',
  },
}

/** Office assets tab of Assets. */
export function OfficeAssetsList() {
  return (
    <CrudListPage<OfficeAsset>
      embedded
      title="Office assets"
      subtitle=""
      entity="asset"
      retryLink="/assets?tab=office"
      fetchRows={fetchOfficeAssets}
      removeRow={deleteOfficeAsset}
      name={(a) => a.name}
      deleteDescription="This cannot be undone. Mark it as disposed instead if you want to keep its history."
      renderForm={(a, onSaved) => <OfficeAssetForm key={a?.id ?? 'new'} asset={a} onSaved={onSaved} />}
      renderDetails={(a) => (
        <Card className="space-y-3 p-4">
          <LabelValueListItem label="Name" value={a.name} />
          <LabelValueListItem label="Category" value={categoryLabel(a.category)} />
          <LabelValueListItem label="Serial no" value={a.serial_number ?? '—'} />
          <LabelValueListItem label="Buying price" value={money(a.buying_price)} />
          <LabelValueListItem label="Purchased" value={a.purchase_date?.slice(0, 10) ?? '—'} />
          <LabelValueListItem label="Location" value={a.location ?? '—'} />
          <LabelValueListItem label="Condition" value={<ConditionBadge condition={a.condition} />} />
          <LabelValueListItem label="Notes" value={a.notes ?? '—'} />
        </Card>
      )}
      renderList={(h) => (
        <RecordTableSection
          rows={h.rows}
          isLoading={h.isLoading}
          config={LIST}
          headers={HEADERS}
          excludeParams={['tab']}
          searchPlaceholder="Search name, serial no, location"
          createLabel="Add asset"
          onCreate={h.onCreate}
          onView={h.onView}
          empty={{ notFound: 'No asset matches your search or filters.', text: 'Record furniture, electronics and equipment the office owns.', title: 'No office assets yet' }}
          filters={(setFilter) => [
            { label: 'Category', onClick: () => undefined, subItems: OFFICE_ASSET_CATEGORIES.map((c) => ({ label: c.label, onClick: () => setFilter('category', c.value) })) },
            { label: 'Condition', onClick: () => undefined, subItems: OFFICE_ASSET_CONDITIONS.map((c) => ({ label: c.label, onClick: () => setFilter('condition', c.value) })) },
          ]}
          menuItems={(a) => [
            { icon: EyeIcon, label: 'View', onClick: () => h.onView(a) },
            { icon: PencilSquareIcon, label: 'Edit', onClick: () => h.onEdit(a) },
            { icon: TrashIcon, label: 'Delete', onClick: () => h.onDelete(a) },
          ]}
          cells={(a) => (
            <>
              <RecordCell className="font-medium">{a.name}</RecordCell>
              <RecordCell className="text-muted-foreground">{categoryLabel(a.category)}</RecordCell>
              <RecordCell className="text-muted-foreground">{a.serial_number ?? '—'}</RecordCell>
              <RecordCell className="text-muted-foreground">{money(a.buying_price)}</RecordCell>
              <RecordCell className="whitespace-nowrap text-muted-foreground">{a.purchase_date?.slice(0, 10) ?? '—'}</RecordCell>
              <RecordCell className="text-muted-foreground">{a.location ?? '—'}</RecordCell>
              <RecordCell><ConditionBadge condition={a.condition} /></RecordCell>
            </>
          )}
        />
      )}
    />
  )
}
