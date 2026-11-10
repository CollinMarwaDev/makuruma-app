import { useState } from 'react'
import { ArrowDownTrayIcon, BanknotesIcon, EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { Invoice } from '~/types/invoice'
import { deleteInvoice, downloadInvoice, fetchInvoices, markInvoicePaid } from '~/services/invoiceService'
import { INVOICE_TYPES, invoiceTypeLabel } from '~/constants/invoiceTypes'
import { useAuth } from '~/hooks/useAuth'
import InvoiceForm from '~/components/InvoiceForm'
import { DetailsSlideOver } from '~/components/common/details-slide-over'
import { FormModal } from '~/components/common/form-modal'
import { ListPage } from '~/components/common/list-page'
import { RecordCell, RecordTableSection } from '~/components/common/record-table-section'
import { useConfirmAction } from '~/components/common/use-confirm-action'
import { useDetailsParam } from '~/components/common/use-details-param'
import { useFetchList } from '~/components/common/use-fetch-list'
import { InvoiceDetails } from '~/components/invoices/invoice-details'
import { InvoiceStatusBadge } from '~/components/invoices/invoice-badges'
import { Button } from '~/global/components/button'
import type { ColumnHeader } from '~/global/components/table'
import { distinctValues, type ListConfig } from '~/global/hooks/use-list-params'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { toast } from '~/global/utils/toast'

const fetchAll = () => fetchInvoices()
const trucksOf = (inv: Invoice) => inv.lines.map((l) => l.booking_truck.truck.reg_no)

const HEADERS: ColumnHeader[] = [
  { id: 'number', label: 'Invoice' },
  { id: 'booking', label: 'Booking / client' },
  { canSort: false, id: 'trucks', label: 'Trucks' },
  { id: 'date', label: 'Date' },
  { id: 'total', label: 'Total ($)' },
  { id: 'status', label: 'Status' },
]

const LIST: ListConfig<Invoice> = {
  defaultSort: { by: 'date', order: 'desc' },
  filters: {
    client: (inv, v) => inv.booking.client.company_name === v,
    status: (inv, v) => inv.status === v,
    type: (inv, v) => inv.invoice_type === v,
  },
  search: (inv) => [inv.invoice_number, inv.booking.booking_number, inv.booking.client.company_name, inv.creator.name, ...trucksOf(inv)],
  sort: {
    booking: (inv) => inv.booking.booking_number,
    date: (inv) => inv.invoice_date,
    number: (inv) => inv.invoice_number,
    status: (inv) => inv.status,
    total: (inv) => Number(inv.total_amount),
  },
}

async function download(invoice: Invoice) {
  try {
    await downloadInvoice(invoice)
  } catch (err) {
    toast.error(getErrorMessage(err))
  }
}

function Invoices() {
  const { user } = useAuth()
  const canConfirmPayment = ['accountant', 'admin'].includes(user?.role?.slug ?? '')
  const confirmAction = useConfirmAction()
  const { data: invoices, error, loading, refresh } = useFetchList(fetchAll)
  const { closeDetails, openDetails } = useDetailsParam()
  const [form, setForm] = useState<{ invoice: Invoice | null } | null>(null)

  const edit = (invoice: Invoice | null) => {
    closeDetails()
    setForm({ invoice })
  }

  const remove = async (invoice: Invoice) => {
    const done = await confirmAction({
      action: () => deleteInvoice(invoice.id),
      description: 'Its trucks become available to invoice again for this type. This cannot be undone.',
      okayText: 'Delete invoice',
      success: `Invoice ${invoice.invoice_number} deleted`,
      title: `Delete invoice ${invoice.invoice_number}?`,
    })
    if (done) {
      closeDetails()
      refresh()
    }
  }

  const markPaid = async (invoice: Invoice) => {
    const done = await confirmAction({
      action: () => markInvoicePaid(invoice.id),
      description: `Confirm that $ ${Number(invoice.total_amount).toLocaleString()} was received from ${invoice.booking.client.company_name}. Paid invoices can no longer be edited.`,
      okayText: 'Confirm payment',
      success: `${invoice.invoice_number} marked as paid`,
      title: `Payment received for ${invoice.invoice_number}?`,
      type: 'success',
    })
    if (done) refresh()
  }

  return (
    <ListPage
      title="Invoices"
      subtitle="Advance, settlement, standing-time and adjustment invoices. A booking can be invoiced in parts."
      error={error}
      loading={loading}
      retryLink="/invoices"
      overlays={
        <>
          <DetailsSlideOver
            records={invoices}
            title={(inv) => `Invoice ${inv.invoice_number}`}
            footer={(inv) => (
              <>
                <Button variant="outline" onClick={() => void download(inv)}>Download PDF</Button>
                {inv.status === 'pending' && canConfirmPayment && (
                  <Button variant="success" onClick={() => void markPaid(inv)}>Confirm payment</Button>
                )}
                {inv.status === 'pending' && <Button onClick={() => edit(inv)}>Edit</Button>}
              </>
            )}
          >
            {(inv) => <InvoiceDetails key={inv.id} invoice={inv} />}
          </DetailsSlideOver>
          <FormModal open={!!form} size="wide" onClose={() => setForm(null)} title={form?.invoice ? `Edit Invoice — ${form.invoice.invoice_number}` : 'New Invoice'}>
            <InvoiceForm
              key={form?.invoice?.id ?? 'new'}
              invoice={form?.invoice ?? null}
              onSaved={() => {
                setForm(null)
                toast.success('Invoice saved')
                refresh()
              }}
            />
          </FormModal>
        </>
      }
    >
      <RecordTableSection
        rows={invoices}
        isLoading={loading}
        config={LIST}
        headers={HEADERS}
        searchPlaceholder="Search invoice, booking, client, truck"
        createLabel="New invoice"
        onCreate={() => edit(null)}
        onView={(inv) => openDetails(inv.id)}
        empty={{ notFound: 'No invoice matches your search or filters.', text: 'Create an invoice from a booking once its trucks are loaded or delivered.', title: 'No invoices yet' }}
        filters={(setFilter) => [
          { label: 'Type', onClick: () => undefined, subItems: INVOICE_TYPES.map((t) => ({ label: t.label, onClick: () => setFilter('type', t.value) })) },
          {
            label: 'Status',
            onClick: () => undefined,
            subItems: [
              { label: 'Pending', onClick: () => setFilter('status', 'pending') },
              { label: 'Paid', onClick: () => setFilter('status', 'paid') },
            ],
          },
          { label: 'Client', onClick: () => undefined, subItems: distinctValues(invoices, (i) => i.booking.client.company_name).map((c) => ({ label: c, onClick: () => setFilter('client', c) })) },
        ]}
        menuItems={(inv) => [
          { icon: EyeIcon, label: 'View', onClick: () => openDetails(inv.id) },
          { icon: ArrowDownTrayIcon, label: 'Download PDF', onClick: () => void download(inv) },
          ...(inv.status === 'pending' ? [{ icon: PencilSquareIcon, label: 'Edit', onClick: () => edit(inv) }] : []),
          ...(inv.status === 'pending' && canConfirmPayment ? [{ icon: BanknotesIcon, label: 'Confirm payment', onClick: () => void markPaid(inv) }] : []),
          { icon: TrashIcon, label: 'Delete', onClick: () => void remove(inv) },
        ]}
        cells={(inv) => (
          <>
            <RecordCell>
              <p className="font-medium">{inv.invoice_number}</p>
              <p className="text-xs text-muted-foreground">{invoiceTypeLabel(inv.invoice_type)}</p>
            </RecordCell>
            <RecordCell className="text-muted-foreground">
              <p>{inv.booking.booking_number}</p>
              <p className="text-xs">{inv.booking.client.company_name}</p>
            </RecordCell>
            <RecordCell className="max-w-xs truncate text-muted-foreground" title={trucksOf(inv).join(', ')}>
              {trucksOf(inv).join(', ')}
            </RecordCell>
            <RecordCell className="whitespace-nowrap text-muted-foreground">{inv.invoice_date.slice(0, 10)}</RecordCell>
            <RecordCell className="font-medium">{Number(inv.total_amount).toLocaleString()}</RecordCell>
            <RecordCell><InvoiceStatusBadge status={inv.status} /></RecordCell>
          </>
        )}
      />
    </ListPage>
  )
}

export default Invoices
