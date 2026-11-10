import type { FC } from 'react'
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { Client } from '~/types/partner'
import { Badge } from '~/global/components/badge'
import type { ColumnHeader } from '~/global/components/table'
import type { ListConfig } from '~/global/hooks/use-list-params'
import { RecordCell, RecordTableSection } from '~/components/common/record-table-section'

interface ClientsTableSectionProps {
  clients: Client[]
  isLoading: boolean
  onCreate: () => void
  onDelete: (client: Client) => void
  onEdit: (client: Client) => void
  onView: (client: Client) => void
}

const HEADERS: ColumnHeader[] = [
  { id: 'company', label: 'Company' },
  { canSort: false, id: 'email', label: 'Email' },
  { canSort: false, id: 'phone', label: 'Phone' },
  { id: 'advance', label: 'Advance invoicing' },
]

const LIST: ListConfig<Client> = {
  defaultSort: { by: 'company', order: 'asc' },
  filters: { advance: (c, v) => (v === 'allowed') === c.allows_advance_invoice },
  search: (c) => [c.company_name, c.short_code, c.email, c.phone],
  sort: { advance: (c) => Number(c.allows_advance_invoice), company: (c) => c.company_name.toLowerCase() },
}

export const AdvanceBadge: FC<{ allowed: boolean }> = ({ allowed }) => (
  <Badge variant={allowed ? 'success' : 'disabled'} label={allowed ? 'Allowed' : 'Not allowed'} />
)

/** Clients list: search, advance-invoicing filter, sortable table, View / Edit / Delete. */
export const ClientsTableSection: FC<ClientsTableSectionProps> = ({ clients, isLoading, onCreate, onDelete, onEdit, onView }) => (
  <RecordTableSection
    rows={clients}
    isLoading={isLoading}
    config={LIST}
    headers={HEADERS}
    searchPlaceholder="Search company, code, email, phone"
    createLabel="Add client"
    onCreate={onCreate}
    onView={onView}
    empty={{ notFound: 'No client matches your search or filters.', text: 'Add a client to start taking bookings for them.', title: 'No clients yet' }}
    filters={(setFilter) => [
      {
        label: 'Advance invoicing',
        onClick: () => undefined,
        subItems: [
          { label: 'Allowed', onClick: () => setFilter('advance', 'allowed') },
          { label: 'Not allowed', onClick: () => setFilter('advance', 'not-allowed') },
        ],
      },
    ]}
    menuItems={(client) => [
      { icon: EyeIcon, label: 'View', onClick: () => onView(client) },
      { icon: PencilSquareIcon, label: 'Edit', onClick: () => onEdit(client) },
      { icon: TrashIcon, label: 'Delete', onClick: () => onDelete(client) },
    ]}
    cells={(client) => (
      <>
        <RecordCell>
          <p className="font-medium">{client.company_name}</p>
          {client.short_code && <p className="text-xs text-muted-foreground">{client.short_code}</p>}
        </RecordCell>
        <RecordCell className="text-muted-foreground">{client.email ?? '—'}</RecordCell>
        <RecordCell className="text-muted-foreground">{client.phone ?? '—'}</RecordCell>
        <RecordCell>
          <AdvanceBadge allowed={client.allows_advance_invoice} />
        </RecordCell>
      </>
    )}
  />
)
