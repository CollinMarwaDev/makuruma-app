import type { ReactNode } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { Button } from '~/global/components/button'
import type { DropdownMenuType } from '~/global/components/dropdown'
import { EllipsisMenu } from '~/global/components/ellipsis-menu'
import { EmptyState } from '~/global/components/empty-state'
import { Pagination } from '~/global/components/pagination'
import { createTable, type ColumnHeader } from '~/global/components/table'
import { TableSection, type Filter } from '~/global/components/table-section'
import { useListParams, type ListConfig } from '~/global/hooks/use-list-params'
import { DETAILS_PARAM } from '~/components/common/details-slide-over'

type Row = { id: number }

// One table instance for every list (createTable must not run during render).
const RecordTable = createTable<Row>()

export interface RecordTableSectionProps<T extends Row> {
  /** Extra controls in the header, right side (e.g. a second create button). */
  actions?: ReactNode
  /** Table cells for one row, in the same order as `headers` (without the actions column). */
  cells: (row: T) => ReactNode
  config: ListConfig<T>
  createLabel?: string
  empty: { notFound: string; text: string; title: string }
  /** Query params that are not filters on this page (tabs), hidden from chips and the empty state. */
  excludeParams?: string[]
  filters?: (setFilter: (key: string, value: string | undefined) => void) => Filter[]
  headers: ColumnHeader[]
  isLoading: boolean
  menuItems?: (row: T) => DropdownMenuType[]
  onCreate?: () => void
  onView?: (row: T) => void
  rows: T[]
  searchPlaceholder: string
}

/**
 * Standard list on the global kit: search + Filter button, active filter chips, sortable table,
 * row "…" menu, EmptyState (no data / no match) and Pagination. State lives in the URL (`useListParams`).
 */
export function RecordTableSection<T extends Row>({
  actions,
  cells,
  config,
  createLabel,
  empty,
  excludeParams = [],
  filters,
  headers,
  isLoading,
  menuItems,
  onCreate,
  onView,
  rows,
  searchPlaceholder,
}: RecordTableSectionProps<T>) {
  const { filteredCount, pageRows, setFilter, totalPages } = useListParams(rows, config)
  const hidden = ['sortBy', 'sortOrder', DETAILS_PARAM, ...excludeParams]
  const allHeaders: ColumnHeader[] = menuItems ? [...headers, { canSort: false, id: 'actions', label: '' }] : headers

  return (
    <TableSection>
      <TableSection.Header className="flex-wrap gap-3 pb-0">
        <TableSection.SearchAndFilter filters={filters?.(setFilter) ?? []} placeholder={searchPlaceholder} />
        {(actions || onCreate) && (
          <TableSection.Actions>
            {actions}
            {onCreate && (
              <Button className="flex items-center gap-2 py-2.5" onClick={onCreate}>
                <PlusIcon strokeWidth={2.5} className="size-4" /> {createLabel}
              </Button>
            )}
          </TableSection.Actions>
        )}
      </TableSection.Header>
      <TableSection.ActiveFilters exclude={hidden} className="pb-3" />

      {isLoading ? (
        <RecordTable.Loading columns={allHeaders.length} rows={6} className="pt-4" />
      ) : filteredCount === 0 ? (
        <EmptyState
          className="py-10"
          ignoreParams={['currentPage', ...hidden]}
          noDataTitle={empty.title}
          noDataText={empty.text}
          searchNotFoundText={empty.notFound}
        />
      ) : (
        <RecordTable data={pageRows}>
          <RecordTable.Header headers={allHeaders} />
          <RecordTable.Body>
            {(row) => (
              <RecordTable.Row
                rowId={String(row.id)}
                className={onView ? 'cursor-pointer hover:bg-primary-50' : undefined}
                onClick={onView ? () => onView(row as T) : undefined}
              >
                {cells(row as T)}
                {menuItems && (
                  <RecordTable.Cell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <EllipsisMenu title="Actions" menuItems={menuItems(row as T)} />
                  </RecordTable.Cell>
                )}
              </RecordTable.Row>
            )}
          </RecordTable.Body>
        </RecordTable>
      )}

      {!isLoading && totalPages > 1 && (
        <TableSection.Footer>
          <Pagination totalPages={totalPages} />
        </TableSection.Footer>
      )}
    </TableSection>
  )
}

/** Cell component for `cells` render functions. */
export const RecordCell = RecordTable.Cell
