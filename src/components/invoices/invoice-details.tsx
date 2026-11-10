import { useEffect, useState, type FC } from 'react'
import type { Invoice } from '~/types/invoice'
import { fetchInvoice } from '~/services/invoiceService'
import { Card } from '~/global/components/card'
import { LabelValueListItem } from '~/global/components/label-value-list-item'
import { ParagraphLoading } from '~/global/components/loaders/paragraph-loader'
import { ModalFormError } from '~/global/components/modal/modal-form-error'
import { getErrorMessage } from '~/global/utils/r3/utils'
import { StatusBadge } from '~/components/tracking/status-badge'
import { InvoiceStatusBadge } from '~/components/invoices/invoice-badges'
import { invoiceTypeLabel } from '~/constants/invoiceTypes'

const money = (value: string | number) => `$ ${Number(value).toLocaleString()}`

/** Invoice "View" slide-over: header, per-truck lines (route, cargo, ETA) and trucks still to invoice (contract 2.4). */
export const InvoiceDetails: FC<{ invoice: Invoice }> = ({ invoice: listInvoice }) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [error, setError] = useState<string>()

  useEffect(() => {
    let cancelled = false
    fetchInvoice(listInvoice.id)
      .then((data) => !cancelled && setInvoice(data))
      .catch((err: unknown) => !cancelled && setError(getErrorMessage(err)))
    return () => {
      cancelled = true
    }
  }, [listInvoice.id])

  const shown = invoice ?? listInvoice

  return (
    <>
      <Card className="space-y-3 p-4">
        <LabelValueListItem label="Type" value={invoiceTypeLabel(shown.invoice_type)} />
        <LabelValueListItem label="Status" value={<InvoiceStatusBadge status={shown.status} />} />
        <LabelValueListItem label="Booking" value={shown.booking.booking_number} />
        <LabelValueListItem label="Client" value={shown.booking.client.company_name} />
        <LabelValueListItem label="Date" value={shown.invoice_date.slice(0, 10)} />
        <LabelValueListItem label="Exchange rate" value={Number(shown.exchange_rate).toLocaleString()} />
        <LabelValueListItem label="Total" value={money(shown.total_amount)} />
        <LabelValueListItem label="Created by" value={shown.creator.name} />
        {shown.payer && <LabelValueListItem label="Paid" value={`${shown.paid_at?.slice(0, 10) ?? ''} · ${shown.payer.name}`} />}
      </Card>

      <Card className="space-y-2 p-4">
        <h3 className="text-sm font-semibold text-foreground">Trucks on this invoice</h3>
        <ul className="divide-y divide-outline">
          {shown.lines.map((line) => {
            const bt = line.booking_truck
            const from = bt.loading_point ?? shown.booking.loading_point
            const to = bt.offloading_point ?? shown.booking.offloading_point
            return (
              <li key={line.id} className="flex flex-wrap items-start justify-between gap-2 py-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{bt.truck.reg_no}</p>
                  <p className="text-xs text-muted-foreground">
                    {from ?? '—'} → {to ?? '—'}
                    {bt.cargo ? ` · ${bt.cargo}` : ''}
                    {bt.eta ? ` · ETA ${bt.eta.slice(0, 10)}` : ''}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium text-foreground">{money(line.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    {line.days != null ? `${line.days} days` : `${Number(line.quantity).toLocaleString()} t`} × {Number(line.rate).toLocaleString()}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </Card>

      <Card className="space-y-2 p-4">
        <h3 className="text-sm font-semibold text-foreground">Not yet on a {invoiceTypeLabel(shown.invoice_type).toLowerCase()} invoice</h3>
        <ModalFormError className="mt-0" message={error} />
        {!invoice && !error ? (
          <ParagraphLoading lines={2} />
        ) : invoice?.uninvoiced_trucks?.length ? (
          <ul className="divide-y divide-outline">
            {invoice.uninvoiced_trucks.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                <span className="text-foreground">{t.reg_no ?? '—'}</span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  {t.offloading_date && <>offloaded {t.offloading_date.slice(0, 10)}</>}
                  <StatusBadge status={t.current_status} />
                </span>
              </li>
            ))}
          </ul>
        ) : (
          invoice && <p className="text-sm text-muted-foreground">Every truck on this booking is invoiced for this type.</p>
        )}
      </Card>
    </>
  )
}
