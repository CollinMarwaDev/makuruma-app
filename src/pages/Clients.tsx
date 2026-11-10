import { deleteClient, fetchClients } from '~/services/clientService'
import ClientForm from '~/components/ClientForm'
import { ClientDetails } from '~/components/clients/client-details'
import { ClientsTableSection } from '~/components/clients/clients-table-section'
import { CrudListPage } from '~/components/common/crud-list-page'

function Clients() {
  return (
    <CrudListPage
      title="Clients"
      subtitle="Companies you carry cargo for, and whether they can be invoiced in advance."
      entity="client"
      retryLink="/clients"
      fetchRows={fetchClients}
      removeRow={deleteClient}
      name={(c) => c.company_name}
      deleteDescription="This cannot be undone. Clients with bookings or invoices cannot be deleted."
      renderDetails={(c) => <ClientDetails client={c} />}
      renderForm={(c, onSaved) => <ClientForm key={c?.id ?? 'new'} client={c} onSaved={onSaved} />}
      renderList={(h) => <ClientsTableSection clients={h.rows} {...h} />}
    />
  )
}

export default Clients
