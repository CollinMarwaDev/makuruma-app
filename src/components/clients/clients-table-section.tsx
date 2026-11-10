import type { FC } from 'react'
import { EyeIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { Client } from '~/types/partner'
import { Badge } from '~/global/components/badge'
import { Button } from '~/global/components/button'
import { EllipsisMenu } from '~/global/components/ellipsis-menu'
import { EmptyState } from '~/global/components/empty-state'
import { Pagination } from '~/global/components/pagination'
import { createTable, type ColumnHeader } from '~/global/components/table'
import { TableSection, type Filter } from '~/global/components/table-section'
import { useListParams, type ListConfig } from '~/global/hooks/use-list-params'
import { DETAILS_PARAM } from '~/components/common/details-slide-over'

interface ClientsTableSectionProps {
  clients: Client[]
  isLoading: boolean
  onCreate: () => void
  onDelete: (client: Client) => void
  onEdit: (client: Client) => void
  onView: (client: Client) => void
}

const ClientTable = createTable<Client>()

const HEADERS: ColumnHeader[] = [
  { id: 'company', label: 'Company' },
  { canSort: false, id: 'email', label: 'Email' },
  { canSort: false, id: 'phone', label: 'Phone' },
  { id: 'advance', label: 'Advance invoicing' },
  { canSort: false, id: 'actions', label: '' },
]

const LIST: ListConfig<Client> = {
  defaultSort: { by: 'company', order: 'asc' },
  filters: { advance: (c, v) => (v === 'allowed') === c.allows_advance_invoice },
  search: (c) => [c.company_name, c.short_code, c.email, c.phone],
  sort: { advance: (c) => Number(c.allows_advance_invoice), company: (c) => c.company_name.toLowerCase() },
}

/** Clients list on the global TableSection: search, filters, sortable table, empty state, pagination. */
export const ClientsTableSection: FC<ClientsTableSectionProps> = ({ clients, isLoading, onCreate, onDelete, onEdit, onView }) => {
  const { filteredCount, pageRows, setFilter, totalPages } = useListParams(clients, LIST)

  const filters: Filter[] = [
    {
      label: 'Advance invoicing',
      onClick: () => undefined,
      subItems: [
        { label: 'Allowed', onClick: () => setFilter('advance', 'allowed') },
        { label: 'Not allowed', onClick: () => setFilter('advance', 'not-allowed') },
      ],
    },
  ]

  return (
    <TableSection>
      <TableSection.Header className="flex-wrap gap-3 pb-0">
        <TableSection.SearchAndFilter filters={filters} placeholder="Search company, code, email, phone" />
        <TableSection.Actions>
          <Button className="flex items-center gap-2 py-2.5" onClick={onCreate}>
            <PlusIcon strokeWidth={2.5} className="size-4" /> Add client
          </Button>
        </TableSection.Actions>
      </TableSection.Header>
      <TableSection.ActiveFilters exclude={['sortBy', 'sortOrder', DETAILS_PARAM]} className="pb-3" />

      {isLoading ? (
        <ClientTable.Loading columns={5} rows={6} className="pt-4" />
      ) : filteredCount === 0 ? (
        <EmptyState
          className="py-10"
          ignoreParams={['currentPage', 'sortBy', 'sortOrder', DETAILS_PARAM]}
          noDataTitle="No clients yet"
          noDataText="Add a client to start taking bookings for them."
          searchNotFoundText="No client matches your search or filters. Clear a filter chip to see more."
        />
      ) : (
        <ClientTable data={pageRows}>
          <ClientTable.Header headers={HEADERS} />
          <ClientTable.Body>
            {(client) => (
              <ClientTable.Row rowId={String(client.id)} className="cursor-pointer hover:bg-primary-50" onClick={() => onView(client)}>
                <ClientTable.Cell>
                  <p className="font-medium">{client.company_name}</p>
                  {client.short_code && <p className="text-xs text-muted-foreground">{client.short_code}</p>}
                </ClientTable.Cell>
                <ClientTable.Cell className="text-muted-foreground">{client.email ?? '—'}</ClientTable.Cell>
                <ClientTable.Cell className="text-muted-foreground">{client.phone ?? '—'}</ClientTable.Cell>
                <ClientTable.Cell>
                  <Badge
                    variant={client.allows_advance_invoice ? 'success' : 'disabled'}
                    label={client.allows_advance_invoice ? 'Allowed' : 'Not allowed'}
                  />
                </ClientTable.Cell>
                <ClientTable.Cell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <EllipsisMenu
                    title="Client actions"
                    menuItems={[
                      { icon: EyeIcon, label: 'View', onClick: () => onView(client) },
                      { icon: PencilSquareIcon, label: 'Edit', onClick: () => onEdit(client) },
                      { icon: TrashIcon, label: 'Delete', onClick: () => onDelete(client) },
                    ]}
                  />
                </ClientTable.Cell>
              </ClientTable.Row>
            )}
          </ClientTable.Body>
        </ClientTable>
      )}

      {!isLoading && totalPages > 1 && (
        <TableSection.Footer>
          <Pagination totalPages={totalPages} />
        </TableSection.Footer>
      )}
    </TableSection>
  )
}
