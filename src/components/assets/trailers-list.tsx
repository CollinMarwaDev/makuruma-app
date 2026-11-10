import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { Trailer } from '~/types/trailer'
import { deleteTrailer, fetchTrailers } from '~/services/trailerService'
import { TRAILER_COMPLIANCE_TYPES } from '~/constants/compliance'
import TrailerForm from '~/components/TrailerForm'
import type { ColumnHeader } from '~/global/components/table'
import type { ListConfig } from '~/global/hooks/use-list-params'
import { getExpiryStatus } from '~/utils/documentHelpers'
import { CrudListPage } from '~/components/common/crud-list-page'
import { DocumentsCard } from '~/components/common/documents-card'
import { ExpiryBadge } from '~/components/common/expiry-badge'
import { RecordCell, RecordTableSection } from '~/components/common/record-table-section'

const HEADERS: ColumnHeader[] = [
  { id: 'reg_no', label: 'Reg no' },
  ...TRAILER_COMPLIANCE_TYPES.map(({ key, label }) => ({ canSort: false, id: key, label })),
]

const LIST: ListConfig<Trailer> = {
  defaultSort: { by: 'reg_no', order: 'asc' },
  filters: { documents: (t, v) => t.documents.some((d) => getExpiryStatus(d) === v) },
  search: (t) => [t.reg_no, ...t.documents.map((d) => d.number)],
  sort: { reg_no: (t) => t.reg_no },
}

/** Trailers tab of Assets. */
export function TrailersList() {
  return (
    <CrudListPage<Trailer>
      embedded
      title="Trailers"
      subtitle=""
      entity="trailer"
      retryLink="/assets?tab=trailers"
      fetchRows={fetchTrailers}
      removeRow={deleteTrailer}
      name={(t) => t.reg_no}
      deleteDescription="This cannot be undone. A trailer assigned to a truck must be unassigned first."
      renderForm={(t, onSaved) => <TrailerForm key={t?.id ?? 'new'} trailer={t} onSaved={onSaved} />}
      renderDetails={(t) => <DocumentsCard documents={t.documents} types={TRAILER_COMPLIANCE_TYPES} />}
      renderList={(h) => (
        <RecordTableSection
          rows={h.rows}
          isLoading={h.isLoading}
          config={LIST}
          headers={HEADERS}
          excludeParams={['tab']}
          searchPlaceholder="Search reg no or document number"
          createLabel="Add trailer"
          onCreate={h.onCreate}
          onView={h.onView}
          empty={{ notFound: 'No trailer matches your search or filters.', text: 'Add trailers with their permits to attach them to trucks.', title: 'No trailers yet' }}
          filters={(setFilter) => [
            {
              label: 'Documents',
              onClick: () => undefined,
              subItems: [
                { label: 'Expired', onClick: () => setFilter('documents', 'expired') },
                { label: 'Expiring in 30 days', onClick: () => setFilter('documents', 'expiring-soon') },
              ],
            },
          ]}
          menuItems={(t) => [
            { icon: EyeIcon, label: 'View', onClick: () => h.onView(t) },
            { icon: PencilSquareIcon, label: 'Edit', onClick: () => h.onEdit(t) },
            { icon: TrashIcon, label: 'Delete', onClick: () => h.onDelete(t) },
          ]}
          cells={(t) => (
            <>
              <RecordCell className="font-medium">{t.reg_no}</RecordCell>
              {TRAILER_COMPLIANCE_TYPES.map(({ key }) => (
                <RecordCell key={key}>
                  <ExpiryBadge doc={t.documents.find((d) => d.document_type === key)} />
                </RecordCell>
              ))}
            </>
          )}
        />
      )}
    />
  )
}
