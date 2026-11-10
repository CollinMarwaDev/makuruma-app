import { useState } from 'react'
import type { Client } from '~/types/partner'
import { deleteClient, fetchClients } from '~/services/clientService'
import ClientForm from '~/components/ClientForm'
import { ClientDetails } from '~/components/clients/client-details'
import { ClientsTableSection } from '~/components/clients/clients-table-section'
import { DetailsSlideOver } from '~/components/common/details-slide-over'
import { useDetailsParam } from '~/components/common/use-details-param'
import { useFetchList } from '~/components/common/use-fetch-list'
import Modal from '~/components/ui/Modal'
import { Button } from '~/global/components/button'
import { ErrorFallback, GeneralErrorBoundary } from '~/global/components/error-boundary'
import PageHeader from '~/global/components/page-header'
import { useConfirmation } from '~/global/providers/confirmation'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

function Clients() {
  const confirm = useConfirmation()
  const { data: clients, error, loading, refresh } = useFetchList(fetchClients)
  const { closeDetails, openDetails } = useDetailsParam()
  const [form, setForm] = useState<{ client: Client | null } | null>(null)

  async function handleDelete(client: Client) {
    const ok = await confirm({
      cancelText: 'Keep client',
      description: 'This cannot be undone. Clients with bookings or invoices cannot be deleted.',
      okayText: 'Delete client',
      title: `Delete ${client.company_name}?`,
      type: 'error',
    })
    if (!ok) return
    try {
      await deleteClient(client.id)
      closeDetails()
      toast.success(`${client.company_name} deleted`)
      refresh()
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  function edit(client: Client) {
    closeDetails()
    setForm({ client })
  }

  return (
    <div className="min-h-screen space-y-6 bg-background p-4 md:p-8">
      <PageHeader
        title="Clients"
        subtitle="Companies you carry cargo for, and whether they can be invoiced in advance."
        titleClassName="font-semibold tracking-tight text-foreground"
        subTitleClassName="text-muted-foreground"
      />

      {error && !loading ? (
        <ErrorFallback error={error} ctaLabel="Try again" ctaLink="/clients" />
      ) : (
        <GeneralErrorBoundary>
          <ClientsTableSection
            clients={clients}
            isLoading={loading}
            onCreate={() => setForm({ client: null })}
            onDelete={handleDelete}
            onEdit={edit}
            onView={(client) => openDetails(client.id)}
          />
        </GeneralErrorBoundary>
      )}

      <DetailsSlideOver
        records={clients}
        title={(client) => client.company_name}
        footer={(client) => (
          <>
            <Button variant="outline" onClick={() => void handleDelete(client)}>Delete</Button>
            <Button onClick={() => edit(client)}>Edit client</Button>
          </>
        )}
      >
        {(client) => <ClientDetails client={client} />}
      </DetailsSlideOver>

      <Modal
        isOpen={!!form}
        onClose={() => setForm(null)}
        title={form?.client ? `Edit Client — ${form.client.company_name}` : 'Add Client'}
      >
        <GeneralErrorBoundary>
          {form && (
            <ClientForm
              key={form.client?.id ?? 'new'}
              client={form.client}
              onSaved={() => {
                setForm(null)
                toast.success('Client saved')
                refresh()
              }}
            />
          )}
        </GeneralErrorBoundary>
      </Modal>
    </div>
  )
}

export default Clients
